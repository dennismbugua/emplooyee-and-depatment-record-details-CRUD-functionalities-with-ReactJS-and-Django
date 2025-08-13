import ApiService from './apiService';
import { API_CONFIG } from '../constants';

export const employeeService = {
  // Get all employees
  getAll: () => ApiService.getAll(API_CONFIG.ENDPOINTS.EMPLOYEES),

  // Get employee by ID
  getById: (id) => ApiService.getById(API_CONFIG.ENDPOINTS.EMPLOYEES, id),

  // Create new employee
  create: (employeeData) => ApiService.create(API_CONFIG.ENDPOINTS.EMPLOYEES, employeeData),

  // Update employee
  update: (id, employeeData) => ApiService.update(API_CONFIG.ENDPOINTS.EMPLOYEES, id, employeeData),

  // Delete employee
  delete: (id) => ApiService.delete(API_CONFIG.ENDPOINTS.EMPLOYEES, id),

  // Upload employee photo
  uploadPhoto: (file) => ApiService.uploadFile(file),
};
