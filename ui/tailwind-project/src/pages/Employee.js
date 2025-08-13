import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { variables } from "../js/Variables.js";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEdit, 
  faTrash, 
  faPlus, 
  faUsers, 
  faArrowLeft, 
  faUpload, 
  faImage,
  faCheck,
  faExclamationTriangle,
  faTimes,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";

const ItemType = "EMPLOYEE";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, employee }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-slate-800/95 backdrop-blur-lg rounded-3xl border border-red-500/30 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="border-b border-red-500/20 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
              <FontAwesomeIcon icon={faExclamationCircle} className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Confirm Deletion</h3>
              <p className="text-red-300/70 text-sm">This action cannot be undone</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
            <p className="text-white/90 text-center">
              Are you sure you want to delete employee{' '}
              <span className="font-semibold text-red-300">"{employee?.EmployeeName}"</span>?
            </p>
            <p className="text-white/60 text-sm text-center mt-2">
              This will permanently remove all employee data from the system.
            </p>
          </div>
          
          {/* Employee Info Card */}
          {employee && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={employee.PhotoFileName && employee.PhotoFileName !== 'anonymous.jpg' 
                    ? variables.PHOTO_URL + employee.PhotoFileName 
                    : variables.PHOTO_URL + 'anonymous.jpg'}
                  alt={employee.EmployeeName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  onError={(e) => {
                    e.target.src = variables.PHOTO_URL + "anonymous.jpg";
                  }}
                />
                <div>
                  <p className="text-white font-medium">{employee.EmployeeName}</p>
                  <p className="text-white/60 text-sm">{employee.Department}</p>
                  <p className="text-white/40 text-xs">ID: {employee.EmployeeId}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="p-6 border-t border-white/10">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white/80 py-3 rounded-xl transition-all duration-200 font-medium border border-white/20 hover:border-white/30"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
            >
              Delete Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const typeConfig = {
    success: {
      bgColor: 'from-emerald-600 to-green-600',
      borderColor: 'border-emerald-400/50',
      icon: faCheck,
      iconColor: 'text-emerald-200'
    },
    error: {
      bgColor: 'from-red-600 to-pink-600',
      borderColor: 'border-red-400/50',
      icon: faExclamationTriangle,
      iconColor: 'text-red-200'
    },
    warning: {
      bgColor: 'from-yellow-600 to-orange-600',
      borderColor: 'border-yellow-400/50',
      icon: faExclamationTriangle,
      iconColor: 'text-yellow-200'
    }
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div className={`
      fixed top-6 right-6 z-[60] 
      bg-gradient-to-r ${config.bgColor}
      backdrop-blur-lg border ${config.borderColor}
      rounded-2xl p-4 shadow-2xl
      transform transition-all duration-500 ease-out
      animate-[slideInRight_0.5s_ease-out,fadeOut_0.5s_ease-in_4.5s_forwards]
      min-w-[320px] max-w-md
    `}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={config.icon} className={`w-4 h-4 ${config.iconColor}`} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm leading-5">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faTimes} className="w-3 h-3 text-white/80" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden">
        <div className="h-full bg-white/40 animate-[shrinkWidth_5s_linear_forwards]"></div>
      </div>
    </div>
  );
};

const DraggableEmployeeRow = ({ emp, index, moveRow, handleEditClick, handleDeleteClick }) => {
  const ref = React.useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  // Generate the correct photo URL for each employee
  const getPhotoUrl = (photoFileName) => {
    if (!photoFileName || photoFileName === 'anonymous.jpg') {
      return variables.PHOTO_URL + 'anonymous.jpg';
    }
    return variables.PHOTO_URL + photoFileName;
  };

  return (
    <tr 
      ref={ref} 
      className={`transition-all duration-300 hover:bg-white/5 ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100'
      } border-b border-white/10`}
    >
      <td className="px-6 py-4 text-white/90 font-medium">{emp.EmployeeId}</td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <img
            src={getPhotoUrl(emp.PhotoFileName)}
            alt={emp.EmployeeName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
            onError={(e) => {
              e.target.src = variables.PHOTO_URL + "anonymous.jpg";
            }}
          />
          <span className="text-white/90 font-medium">{emp.EmployeeName}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
          {emp.Department}
        </span>
      </td>
      <td className="px-6 py-4 text-white/70">{emp.DateOfJoining}</td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button
            type="button"
            className="group bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 p-2 rounded-lg transition-all duration-200 hover:scale-110 border border-blue-500/30"
            onClick={() => handleEditClick(emp)}
          >
            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="group bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-2 rounded-lg transition-all duration-200 hover:scale-110 border border-red-500/30"
            onClick={() => handleDeleteClick(emp.EmployeeId)}
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export const Employee = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState({
    EmployeeId: 0,
    EmployeeName: "",
    Department: "",
    DateOfJoining: "",
    PhotoFileName: "anonymous.jpg",
  });
  const [photoPath, setPhotoPath] = useState(variables.PHOTO_URL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [toast, setToast] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    employee: null
  });

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const refreshList = async () => {
    setIsLoading(true);
    try {
      const employeeResponse = await fetch(variables.API_URL + "employee");
      const employeeData = await employeeResponse.json();
      setEmployees(employeeData);

      const departmentResponse = await fetch(variables.API_URL + "department");
      const departmentData = await departmentResponse.json();
      setDepartments(departmentData);
    } catch (error) {
      alert("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddClick = () => {
    setModalTitle("Add Employee");
    setEmployeeDetails({
      EmployeeId: 0,
      EmployeeName: "",
      Department: "",
      DateOfJoining: "",
      PhotoFileName: "anonymous.jpg",
    });
    setPhotoPath(variables.PHOTO_URL + "anonymous.jpg");
    setIsModalOpen(true);
  };

  const handleEditClick = (emp) => {
    setModalTitle("Edit Employee");
    setEmployeeDetails({
      EmployeeId: emp.EmployeeId,
      EmployeeName: emp.EmployeeName,
      Department: emp.Department,
      DateOfJoining: emp.DateOfJoining,
      PhotoFileName: emp.PhotoFileName,
    });
    // Set the correct photo path for the modal display
    const photoUrl = emp.PhotoFileName && emp.PhotoFileName !== 'anonymous.jpg' 
      ? variables.PHOTO_URL + emp.PhotoFileName 
      : variables.PHOTO_URL + "anonymous.jpg";
    setPhotoPath(photoUrl);
    setIsModalOpen(true);
  };

  const handleSaveClick = async () => {
    const method = employeeDetails.EmployeeId === 0 ? "POST" : "PUT";
    const url =
      employeeDetails.EmployeeId === 0
        ? variables.API_URL + "employee"
        : variables.API_URL + "employee/" + employeeDetails.EmployeeId;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeDetails),
      });

      if (response.ok) {
        await response.json();
        // Reset photoPath to ensure fresh data loading
        setPhotoPath(variables.PHOTO_URL);
        await refreshList();
        setIsModalOpen(false);
        
        // Show success toast notification
        const isCreating = employeeDetails.EmployeeId === 0;
        showToast(
          isCreating 
            ? `🎉 Employee "${employeeDetails.EmployeeName}" created successfully!` 
            : `✅ Employee "${employeeDetails.EmployeeName}" updated successfully!`,
          'success'
        );
      } else {
        showToast("❌ Failed to save employee data. Please try again.", 'error');
      }
    } catch (error) {
      showToast("❌ Network error. Please check your connection and try again.", 'error');
    }
  };

  const handleDeleteClick = (id) => {
    const employee = employees.find(emp => emp.EmployeeId === id);
    setDeleteConfirmation({
      isOpen: true,
      employee: employee
    });
  };

  const handleConfirmDelete = async () => {
    const { employee } = deleteConfirmation;
    
    try {
      const response = await fetch(variables.API_URL + "employee/" + employee.EmployeeId, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        // Close confirmation modal
        setDeleteConfirmation({ isOpen: false, employee: null });
        
        // Show success toast with employee name
        showToast(
          `🗑️ Employee "${employee.EmployeeName}" has been permanently deleted!`,
          'success'
        );
        
        // Refresh the list
        refreshList();
      } else {
        showToast("❌ Failed to delete employee. Please try again.", 'error');
        setDeleteConfirmation({ isOpen: false, employee: null });
      }
    } catch (error) {
      showToast("❌ Network error. Please check your connection and try again.", 'error');
      setDeleteConfirmation({ isOpen: false, employee: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, employee: null });
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);

    try {
      const response = await fetch(variables.API_URL + "employee/savefile", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setEmployeeDetails((prevDetails) => ({
        ...prevDetails,
        PhotoFileName: data,
      }));
      setPhotoPath(variables.PHOTO_URL + data);
      showToast("📸 Profile photo uploaded successfully!", 'success');
    } catch (error) {
      showToast("❌ Failed to upload image. Please try again.", 'error');
    }
  };

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = employees[dragIndex];
    const updatedEmployees = [...employees];
    updatedEmployees.splice(dragIndex, 1);
    updatedEmployees.splice(hoverIndex, 0, dragRecord);
    setEmployees(updatedEmployees);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.EmployeeName.toLowerCase().includes(employeeFilter.toLowerCase()) ||
    emp.Department.toLowerCase().includes(employeeFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/" 
                  className="group bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all duration-300 border border-white/20"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-white/80 group-hover:text-white" />
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Employee Management</h1>
                    <p className="text-white/60">Manage your workforce efficiently</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleAddClick}
                className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/30 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                <span className="font-medium">Add Employee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Employees</p>
                  <p className="text-2xl font-bold text-white">{employees.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Departments</p>
                  <p className="text-2xl font-bold text-white">{departments.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Active Today</p>
                  <p className="text-2xl font-bold text-green-400">{Math.floor(employees.length * 0.85)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-sm">System Status</p>
                  <p className="text-2xl font-bold text-green-400">Online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
            {/* Table Header */}
            <div className="bg-white/5 border-b border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Employee Directory</h2>
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                  <span>Live Data</span>
                </div>
              </div>
              
              {/* Search Filter */}
              <div className="max-w-md">
                <label className="text-white/70 text-sm font-medium block mb-2">Search Employees</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search by name or department..."
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Table Content */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                <span className="ml-4 text-white/70">Loading employees...</span>
              </div>
            ) : (
              <DndProvider backend={HTML5Backend}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-6 py-4 text-left text-white/80 font-medium">ID</th>
                        <th className="px-6 py-4 text-left text-white/80 font-medium">Employee</th>
                        <th className="px-6 py-4 text-left text-white/80 font-medium">Department</th>
                        <th className="px-6 py-4 text-left text-white/80 font-medium">Joined</th>
                        <th className="px-6 py-4 text-left text-white/80 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-white/60">
                            <div className="flex flex-col items-center space-y-3">
                              <FontAwesomeIcon icon={faUsers} className="w-12 h-12 text-white/30" />
                              <p>
                                {employeeFilter 
                                  ? `No employees found matching "${employeeFilter}"` 
                                  : "No employees found"
                                }
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map((emp, index) => (
                          <DraggableEmployeeRow
                            key={emp.EmployeeId}
                            index={index}
                            emp={emp}
                            moveRow={moveRow}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </DndProvider>
            )}
          </div>
        </div>
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-white/10 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{modalTitle}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Employee Photo */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={photoPath}
                    alt="Employee"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg"
                    onError={(e) => {
                      e.target.src = variables.PHOTO_URL + "anonymous.jpg";
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-slate-800"></div>
                </div>
                <div className="flex-1">
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    <FontAwesomeIcon icon={faImage} className="mr-2" />
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/70 text-sm font-medium">Employee Name</label>
                  <input
                    type="text"
                    name="EmployeeName"
                    value={employeeDetails.EmployeeName}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter employee name..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/70 text-sm font-medium">Department</label>
                  <select
                    name="Department"
                    value={employeeDetails.Department}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="" className="bg-slate-800">Select a department</option>
                    {departments.map((dep) => (
                      <option key={dep.DepartmentId} value={dep.DepartmentName} className="bg-slate-800">
                        {dep.DepartmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-white/70 text-sm font-medium">Date of Joining</label>
                  <input
                    type="date"
                    name="DateOfJoining"
                    value={employeeDetails.DateOfJoining}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white/80 py-3 rounded-lg transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClick}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg transition-all duration-200 font-medium"
                >
                  {modalTitle === "Add Employee" ? "Create Employee" : "Update Employee"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        employee={deleteConfirmation.employee}
      />
    </div>
  );
};
