import { createContext, useContext } from "react";

export interface User {
  id: string;
  name: string;
}

export interface NotificationApi {
  notify: (message: string) => void;
  notifications: string[];
}

export const UserContext = createContext<User | null>(null);

export const NotificationContext = createContext<NotificationApi | null>(null);

export function useUser(): User | null {
  return useContext(UserContext);
}

export function useNotification(): NotificationApi {
  const api = useContext(NotificationContext);
  if (!api) {
    throw new Error("useNotification requires the shell's ToastProvider");
  }
  return api;
}
