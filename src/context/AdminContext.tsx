import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminContextType {
  isAdmin: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const MASTER_PIN = "5225"; // Master PIN for Faryad Hassan Goraya

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem("bin_abbas_admin_auth") === "true";
    } catch {
      return false;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const login = (pin: string): boolean => {
    if (pin.trim() === MASTER_PIN || pin.trim() === "5225") {
      setIsAdmin(true);
      try {
        localStorage.setItem("bin_abbas_admin_auth", "true");
      } catch (e) {
        console.warn("Storage error", e);
      }
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem("bin_abbas_admin_auth");
    } catch (e) {
      console.warn("Storage error", e);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        login,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
