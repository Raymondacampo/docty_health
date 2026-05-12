'use client';
import { useEffect } from "react";
import { apiClient } from "../utils/api";

export const CheckAuth = async () => {
  try {
    await apiClient.get("/users/me/");
      return true;
  } catch (err: any) {
    if (err.response?.status === 401) {
        return false;
    }
  }
};