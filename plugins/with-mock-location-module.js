const fs = require('fs');
const path = require('path');
const { withDangerousMod } = require('@expo/config-plugins');

const JAVA_DIR = ['android', 'app', 'src', 'main', 'java', 'com', 'sujal31', 'MockLocationApp'];

const MODULE_SOURCE = `package com.sujal31.MockLocationApp

import android.content.Context
import android.content.Intent
import android.location.Location
import android.location.LocationManager
import android.os.Build
import android.os.SystemClock
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MockLocationModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {
  companion object {
    private const val TAG = "MockLocationModule"
  }

  override fun getName(): String = "MockLocationModule"

  @ReactMethod
  fun setMockLocation(latitude: Double, longitude: Double, promise: Promise) {
    startForegroundLocationServiceSafely(latitude, longitude)

    try {
      Log.d(TAG, "setMockLocation called lat=$latitude lng=$longitude")

      val locationManager =
        reactApplicationContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
      Log.d(TAG, "LocationManager acquired")

      val gpsProvider = LocationManager.GPS_PROVIDER
      var gpsProviderReady = false

      try {
        locationManager.addTestProvider(
          gpsProvider,
          false, false, false, false,
          true, true, true, 0, 5
        )
        gpsProviderReady = true
        Log.d(TAG, "GPS test provider added")
      } catch (e: Exception) {
        Log.d(TAG, "addTestProvider first attempt failed: \${e.message}")
        try {
          locationManager.removeTestProvider(gpsProvider)
          Log.d(TAG, "Existing GPS test provider removed")
        } catch (_: Exception) {
          Log.d(TAG, "removeTestProvider ignored")
        }

        try {
          locationManager.addTestProvider(
            gpsProvider,
            false, false, false, false,
            true, true, true, 0, 5
          )
          gpsProviderReady = true
          Log.d(TAG, "GPS test provider added after reset")
        } catch (e2: Exception) {
          Log.e(TAG, "addTestProvider second attempt failed: \${e2.message}", e2)
        }
      }

      if (!gpsProviderReady) {
        promise.reject(
          "MOCK_LOCATION_ERROR",
          "Mock location not set properly. Ensure MockLocationApp is selected in Developer options.",
          IllegalStateException("GPS provider is not a test provider")
        )
        return
      }

      try {
        locationManager.setTestProviderEnabled(gpsProvider, true)
        Log.d(TAG, "GPS test provider enabled")
      } catch (e: Exception) {
        Log.e(TAG, "setTestProviderEnabled failed: \${e.message}", e)
        promise.reject(
          "MOCK_LOCATION_ERROR",
          "Mock location not set properly. Enable mock location app in Developer options.",
          e
        )
        return
      }

      val location = Location(gpsProvider).apply {
        this.latitude = latitude
        this.longitude = longitude
        this.accuracy = 5f
        this.time = System.currentTimeMillis()
        this.elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos()
      }

      locationManager.setTestProviderLocation(gpsProvider, location)
      Log.d(TAG, "Mock location applied successfully")
      promise.resolve(null)
    } catch (e: Exception) {
      Log.e(TAG, "setMockLocation failed: \${e.message}", e)
      promise.reject("MOCK_LOCATION_ERROR", e.message, e)
    }
  }

  @ReactMethod
  fun startStatusNotification(latitude: Double, longitude: Double, promise: Promise) {
    try {
      startForegroundLocationService(latitude, longitude)
      promise.resolve(null)
    } catch (e: Exception) {
      Log.e(TAG, "startStatusNotification failed: \${e.message}", e)
      promise.reject("NOTIFICATION_ERROR", e.message, e)
    }
  }

  private fun startForegroundLocationServiceSafely(latitude: Double, longitude: Double) {
    try {
      startForegroundLocationService(latitude, longitude)
      Log.d(TAG, "Foreground service start requested")
    } catch (e: Exception) {
      Log.e(TAG, "Foreground service failed to start: \${e.message}", e)
    }
  }

  private fun startForegroundLocationService(latitude: Double, longitude: Double) {
    val serviceIntent = Intent(reactApplicationContext, LocationForegroundService::class.java).apply {
      putExtra("latitude", latitude)
      putExtra("longitude", longitude)
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      reactApplicationContext.startForegroundService(serviceIntent)
      Log.d(TAG, "startForegroundService called")
    } else {
      reactApplicationContext.startService(serviceIntent)
      Log.d(TAG, "startService called")
    }
  }
}
`;

const PACKAGE_SOURCE = `package com.sujal31.MockLocationApp

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class MockLocationPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(MockLocationModule(reactContext))
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return emptyList()
  }
}
`;

const FOREGROUND_SERVICE_SOURCE = `package com.sujal31.MockLocationApp

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat

class LocationForegroundService : Service() {

  companion object {
    private const val TAG = "LocationFgService"
    private const val CHANNEL_ID = "mock_location_channel"
    private const val CHANNEL_NAME = "Mock Location Service"
    private const val NOTIFICATION_ID = 1001
  }

  override fun onCreate() {
    super.onCreate()
    Log.d(TAG, "onCreate")
    createNotificationChannel()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    try {
      val latitude = intent?.getDoubleExtra("latitude", 0.0) ?: 0.0
      val longitude = intent?.getDoubleExtra("longitude", 0.0) ?: 0.0
      Log.d(TAG, "onStartCommand lat=$latitude lng=$longitude")

      val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
        .setSmallIcon(android.R.drawable.ic_menu_mylocation)
        .setContentTitle("MockLocationApp Running")
        .setContentText("Coordinates: $latitude, $longitude")
        .setCategory(NotificationCompat.CATEGORY_SERVICE)
        .setOngoing(true)
        .setOnlyAlertOnce(true)
        .setAutoCancel(false)
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        .build()

      startForeground(NOTIFICATION_ID, notification)
      Log.d(TAG, "startForeground success")
      return START_STICKY
    } catch (e: Exception) {
      Log.e(TAG, "onStartCommand failed: \${e.message}", e)
      stopSelf()
      return START_NOT_STICKY
    }
  }

  override fun onBind(intent: Intent?): IBinder? = null

  private fun createNotificationChannel() {
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val channel = NotificationChannel(
          CHANNEL_ID,
          CHANNEL_NAME,
          NotificationManager.IMPORTANCE_DEFAULT
        )
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)
        Log.d(TAG, "Notification channel ready")
      }
    } catch (e: Exception) {
      Log.e(TAG, "createNotificationChannel failed: \${e.message}", e)
    }
  }
}
`;

function writeIfChanged(filePath, content) {
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === content) {
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function patchMainApplication(mainApplicationPath) {
  if (!fs.existsSync(mainApplicationPath)) return;
  let src = fs.readFileSync(mainApplicationPath, 'utf8');

  if (!src.includes('packages.add(MockLocationPackage())')) {
    src = src.replace(
      /override fun getPackages\(\): List<ReactPackage> =[\s\S]*?override fun getJSMainModuleName\(\): String =/m,
      `override fun getPackages(): List<ReactPackage> {
          val packages = PackageList(this).packages
          packages.add(MockLocationPackage())
          return packages
        }

          override fun getJSMainModuleName(): String =`
    );
  }

  fs.writeFileSync(mainApplicationPath, src, 'utf8');
}

function patchAndroidManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) return;
  let src = fs.readFileSync(manifestPath, 'utf8');

  if (!src.includes('android.permission.FOREGROUND_SERVICE')) {
    src = src.replace(
      '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>',
      '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>\n  <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>'
    );
  }

  if (!src.includes('android.permission.FOREGROUND_SERVICE_LOCATION')) {
    src = src.replace(
      '<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>',
      '<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>\n  <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION"/>'
    );
  }

  if (!src.includes('android.permission.POST_NOTIFICATIONS')) {
    src = src.replace(
      '<uses-permission android:name="android.permission.INTERNET"/>',
      '<uses-permission android:name="android.permission.INTERNET"/>\n  <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>'
    );
  }

  if (!src.includes('android:name=".LocationForegroundService"')) {
    src = src.replace(
      '<activity android:name=".MainActivity"',
      '<service android:name=".LocationForegroundService" android:exported="false" android:foregroundServiceType="location"/>\n    <activity android:name=".MainActivity"'
    );
  }

  fs.writeFileSync(manifestPath, src, 'utf8');
}

module.exports = function withMockLocationModule(config) {
  return withDangerousMod(config, [
    'android',
    async (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const javaRoot = path.join(projectRoot, ...JAVA_DIR);
      const manifestPath = path.join(projectRoot, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

      writeIfChanged(path.join(javaRoot, 'MockLocationModule.kt'), MODULE_SOURCE);
      writeIfChanged(path.join(javaRoot, 'MockLocationPackage.kt'), PACKAGE_SOURCE);
      writeIfChanged(path.join(javaRoot, 'LocationForegroundService.kt'), FOREGROUND_SERVICE_SOURCE);

      patchMainApplication(path.join(javaRoot, 'MainApplication.kt'));
      patchAndroidManifest(manifestPath);

      return cfg;
    },
  ]);
};
