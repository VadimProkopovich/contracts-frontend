import axios from "axios";

// Создаем экземпляр axios с базовым URL и заголовками
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // Базовый URL API
  headers: {
    "Content-Type": "application/json",
  },
});

// Users API
export const fetchUsers = () => apiClient.get("/users");
export const fetchUserById = (id) => apiClient.get(`/users/${id}`);
export const createUser = (data) => apiClient.post("/users", data);
export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);

// Leads API
export const fetchLeads = () => apiClient.get("/leads");
export const fetchLeadById = (id) => apiClient.get(`/leads/${id}`);
export const createLead = (data) => apiClient.post("/leads", data);
export const updateLead = (id, data) => apiClient.put(`/leads/${id}`, data);
export const deleteLead = (id) => apiClient.delete(`/leads/${id}`);

// Contracts API
export const fetchContracts = () => apiClient.get("/contracts");
export const fetchContractById = (id) => apiClient.get(`/contracts/${id}`);
export const createContract = (data) => apiClient.post("/contracts", data);
export const updateContract = (id, data) =>
  apiClient.put(`/contracts/${id}`, data);
export const deleteContract = (id) => apiClient.delete(`/contracts/${id}`);
