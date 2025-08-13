import ApiService from './apiService';
import { API_CONFIG } from '../constants';

export const departmentService = {
  // Get all departments
  getAll: () => ApiService.getAll(API_CONFIG.ENDPOINTS.DEPARTMENTS),

  // Get department by ID
  getById: (id) => ApiService.getById(API_CONFIG.ENDPOINTS.DEPARTMENTS, id),

  // Create new department
  create: (departmentData) => ApiService.create(API_CONFIG.ENDPOINTS.DEPARTMENTS, departmentData),

  // Update department
  update: (id, departmentData) => ApiService.update(API_CONFIG.ENDPOINTS.DEPARTMENTS, id, departmentData),

  // Delete department
  delete: (id) => ApiService.delete(API_CONFIG.ENDPOINTS.DEPARTMENTS, id),
};
