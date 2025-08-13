import { useState, useEffect } from 'react';
import { departmentService } from '../services/departmentService';
import { APP_CONSTANTS } from '../constants';

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError(APP_CONSTANTS.MESSAGES.ERROR.FETCH);
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (departmentData) => {
    try {
      await departmentService.create(departmentData);
      await fetchDepartments(); // Refresh list
      return { success: true, message: APP_CONSTANTS.MESSAGES.SUCCESS.CREATE };
    } catch (err) {
      return { success: false, message: APP_CONSTANTS.MESSAGES.ERROR.CREATE };
    }
  };

  const updateDepartment = async (id, departmentData) => {
    try {
      await departmentService.update(id, departmentData);
      await fetchDepartments(); // Refresh list
      return { success: true, message: APP_CONSTANTS.MESSAGES.SUCCESS.UPDATE };
    } catch (err) {
      return { success: false, message: APP_CONSTANTS.MESSAGES.ERROR.UPDATE };
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await departmentService.delete(id);
      await fetchDepartments(); // Refresh list
      return { success: true, message: APP_CONSTANTS.MESSAGES.SUCCESS.DELETE };
    } catch (err) {
      return { success: false, message: APP_CONSTANTS.MESSAGES.ERROR.DELETE };
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    setDepartments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};
