import { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import { APP_CONSTANTS } from '../constants';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError(APP_CONSTANTS.MESSAGES.ERROR.FETCH);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData) => {
    try {
      await employeeService.create(employeeData);
      await fetchEmployees(); // Refresh list
      return { success: true, message: APP_CONSTANTS.MESSAGES.SUCCESS.CREATE };
    } catch (err) {
      return { success: false, message: APP_CONSTANTS.MESSAGES.ERROR.CREATE };
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      await employeeService.update(id, employeeData);
      await fetchEmployees(); // Refresh list
      return { success: true, message: APP_CONSTANTS.MESSAGES.SUCCESS.UPDATE };
    } catch (err) {
      return { success: false, message: APP_CONSTANTS.MESSAGES.ERROR.UPDATE };
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await employeeService.delete(id);
      await fetchEmployees(); // Refresh list
      return { success: true, message: APP_CONSTANTS.MESSAGES.SUCCESS.DELETE };
    } catch (err) {
      return { success: false, message: APP_CONSTANTS.MESSAGES.ERROR.DELETE };
    }
  };

  const uploadPhoto = async (file) => {
    try {
      const result = await employeeService.uploadPhoto(file);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, message: APP_CONSTANTS.MESSAGES.ERROR.UPLOAD };
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    setEmployees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    uploadPhoto,
  };
};
