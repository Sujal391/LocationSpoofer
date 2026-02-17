// types/location.types.ts
export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface LocationResponse {
  success: boolean;
  message?: string;
}