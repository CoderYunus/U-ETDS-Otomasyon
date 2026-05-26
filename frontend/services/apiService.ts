import { ParseResponse, Passenger, SubmitResponse } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export const login = async (username: string, password: string):Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Sunucu bağlantı hatası." };
  }
};

export const getUsers = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, { headers: getAuthHeaders() });
    return await response.json();
  } catch (error) {
    return { success: false, data: [] };
  }
};

export const addUser = async (data: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: "Sunucu bağlantı hatası" };
  }
};

export const deleteUser = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: "Sunucu bağlantı hatası" };
  }
};

export const editUser = async (id: number, data: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: "Sunucu bağlantı hatası" };
  }
};

export const getLogs = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/logs`, { headers: getAuthHeaders() });
    return await response.json();
  } catch (error) {
    return { success: false, data: [] };
  }
};

export const parseText = async (rawText: string): Promise<ParseResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/passenger/parse`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ rawText }),
    });
    return await response.json();
  } catch (error) {
    console.error("Parse error:", error);
    return { success: false, message: "Sunucu bağlantı hatası." };
  }
};

export const submitToUetds = async (passengers: Passenger[]): Promise<SubmitResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/uetds/submit`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(passengers),
    });
    return await response.json();
  } catch (error) {
    console.error("Submit error:", error);
    return { success: false, message: "Sunucu bağlantı hatası." };
  }
};
