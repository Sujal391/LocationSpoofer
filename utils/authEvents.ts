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
    listeners.forEach(listener => listener());
  },
};