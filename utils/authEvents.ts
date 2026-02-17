// utils/authEvents.ts
type AuthListener = () => void;

let listeners: AuthListener[] = [];

export const authEvents = {
  addListener: (listener: AuthListener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  emit: () => {
    console.log('Auth event emitted, notifying', listeners.length, 'listeners');
    listeners.forEach(listener => listener());
  },
};