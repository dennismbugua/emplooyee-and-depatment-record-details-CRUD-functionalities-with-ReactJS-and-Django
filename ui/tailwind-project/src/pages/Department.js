import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { variables } from "../js/Variables.js";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faBuilding,
  faArrowLeft,
  faCheck,
  faExclamationTriangle,
  faTimes,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const ItemType = "DEPARTMENT";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, department }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-slate-800/95 backdrop-blur-lg rounded-3xl border border-red-500/30 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="border-b border-red-500/20 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="w-6 h-6 text-red-400"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Confirm Deletion
              </h3>
              <p className="text-red-300/70 text-sm">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
            <p className="text-white/90 text-center">
              Are you sure you want to delete department{" "}
              <span className="font-semibold text-red-300">
                "{department?.DepartmentName}"
              </span>
              ?
            </p>
            <p className="text-white/60 text-sm text-center mt-2">
              This will permanently remove the department and may affect
              associated employees.
            </p>
          </div>

          {/* Department Info Card */}
          {department && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="w-6 h-6 text-blue-400"
                  />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {department.DepartmentName}
                  </p>
                  <p className="text-white/60 text-sm">
                    Department ID: {department.DepartmentId}
                  </p>
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
              Delete Department
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
      bgColor: "from-emerald-600 to-green-600",
      borderColor: "border-emerald-400/50",
      icon: faCheck,
      iconColor: "text-emerald-200",
    },
    error: {
      bgColor: "from-red-600 to-pink-600",
      borderColor: "border-red-400/50",
      icon: faExclamationTriangle,
      iconColor: "text-red-200",
    },
    warning: {
      bgColor: "from-yellow-600 to-orange-600",
      borderColor: "border-yellow-400/50",
      icon: faExclamationTriangle,
      iconColor: "text-yellow-200",
    },
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div
      className={`
      fixed top-6 right-6 z-[60] 
      bg-gradient-to-r ${config.bgColor}
      backdrop-blur-lg border ${config.borderColor}
      rounded-2xl p-4 shadow-2xl
      transform transition-all duration-500 ease-out
      animate-[slideInRight_0.5s_ease-out,fadeOut_0.5s_ease-in_4.5s_forwards]
      min-w-[320px] max-w-md
    `}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={config.icon}
              className={`w-4 h-4 ${config.iconColor}`}
            />
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

const DraggableRow = ({
  dep,
  index,
  moveRow,
  handleEditClick,
  handleDeleteClick,
}) => {
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
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
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

  return (
    <tr
      ref={ref}
      className={`transition-all duration-300 hover:bg-white/5 ${
        isDragging ? "opacity-50 scale-95" : "opacity-100"
      } border-b border-white/10`}
    >
      <td className="px-6 py-4 text-white/90 font-medium">
        {dep.DepartmentId}
      </td>
      <td className="px-6 py-4 text-white/90">{dep.DepartmentName}</td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button
            type="button"
            className="group bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 p-2 rounded-lg transition-all duration-200 hover:scale-110 border border-blue-500/30"
            onClick={() => handleEditClick(dep)}
          >
            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="group bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-2 rounded-lg transition-all duration-200 hover:scale-110 border border-red-500/30"
            onClick={() => handleDeleteClick(dep.DepartmentId)}
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [departmentId, setDepartmentId] = useState(0);
  const [departmentIdFilter, setDepartmentIdFilter] = useState("");
  const [departmentNameFilter, setDepartmentNameFilter] = useState("");
  const [departmentsWithoutFilter, setDepartmentsWithoutFilter] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    department: null,
  });

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const refreshList = async () => {
    setIsLoading(true);
    try {
      const depResponse = await fetch(variables.API_URL + "department");
      const depData = await depResponse.json();
      setDepartments(depData);
      setDepartmentsWithoutFilter(depData);

      const empResponse = await fetch(variables.API_URL + "employee");
      const empData = await empResponse.json();
      setEmployees(empData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterFn = useCallback(() => {
    let filteredData = [...departmentsWithoutFilter];

    // Filter by ID (numbers only)
    if (departmentIdFilter.trim() !== "") {
      filteredData = filteredData.filter((el) =>
        el.DepartmentId.toString().includes(departmentIdFilter.trim())
      );
    }

    // Filter by Name (alphanumeric)
    if (departmentNameFilter.trim() !== "") {
      filteredData = filteredData.filter((el) =>
        el.DepartmentName.toString()
          .toLowerCase()
          .includes(departmentNameFilter.toLowerCase().trim())
      );
    }

    setDepartments(filteredData);
  }, [departmentsWithoutFilter, departmentIdFilter, departmentNameFilter]);

  useEffect(() => {
    refreshList();
  }, []);

  // Apply filters whenever filter values or data changes
  useEffect(() => {
    filterFn();
  }, [filterFn]);

  const sortResult = (prop, asc) => {
    const sortedData = [...departmentsWithoutFilter].sort((a, b) => {
      if (asc) return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
    });
    setDepartments(sortedData);
  };

  const handleAddClick = () => {
    setModalTitle("Add Department");
    setDepartmentId(0);
    setDepartmentName("");
    setIsModalOpen(true);
  };

  const handleEditClick = (dep) => {
    setModalTitle("Edit Department");
    setDepartmentId(dep.DepartmentId);
    setDepartmentName(dep.DepartmentName);
    setIsModalOpen(true);
  };

  const handleCreateClick = async () => {
    try {
      const response = await fetch(variables.API_URL + "department", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ DepartmentName: departmentName }),
      });

      if (response.ok) {
        const result = await response.json();
        setIsModalOpen(false);
        showToast(
          `🎉 Department "${departmentName}" created successfully!`,
          "success"
        );
        refreshList();
      } else {
        showToast("❌ Failed to create department. Please try again.", "error");
      }
    } catch (error) {
      showToast(
        "❌ Network error. Please check your connection and try again.",
        "error"
      );
    }
  };

  const handleUpdateClick = async () => {
    try {
      const response = await fetch(
        variables.API_URL + "department/" + departmentId,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DepartmentId: departmentId,
            DepartmentName: departmentName,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setIsModalOpen(false);
        showToast(
          `✅ Department "${departmentName}" updated successfully!`,
          "success"
        );
        refreshList();
      } else {
        showToast("❌ Failed to update department. Please try again.", "error");
      }
    } catch (error) {
      showToast(
        "❌ Network error. Please check your connection and try again.",
        "error"
      );
    }
  };

  const handleDeleteClick = (id) => {
    const department = departments.find((dep) => dep.DepartmentId === id);
    setDeleteConfirmation({
      isOpen: true,
      department: department,
    });
  };

  const handleConfirmDelete = async () => {
    const { department } = deleteConfirmation;

    try {
      const response = await fetch(
        variables.API_URL + "department/" + department.DepartmentId,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Close confirmation modal
        setDeleteConfirmation({ isOpen: false, department: null });

        // Show success toast with department name
        showToast(
          `🗑️ Department "${department.DepartmentName}" has been permanently deleted!`,
          "success"
        );

        // Refresh the list
        refreshList();
      } else {
        showToast("❌ Failed to delete department. Please try again.", "error");
        setDeleteConfirmation({ isOpen: false, department: null });
      }
    } catch (error) {
      showToast(
        "❌ Network error. Please check your connection and try again.",
        "error"
      );
      setDeleteConfirmation({ isOpen: false, department: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, department: null });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "departmentIdFilter") {
      // Only allow numbers for ID filter
      const numericValue = value.replace(/[^0-9]/g, "");
      setDepartmentIdFilter(numericValue);
    } else if (name === "departmentNameFilter") {
      // Allow all characters for name filter
      setDepartmentNameFilter(value);
    }
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = departments[dragIndex];
      const updatedDepartments = [...departments];
      updatedDepartments.splice(dragIndex, 1);
      updatedDepartments.splice(hoverIndex, 0, dragRow);
      setDepartments(updatedDepartments);
    },
    [departments]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
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
              animationDuration: `${3 + Math.random() * 2}s`,
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
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="w-5 h-5 text-white/80 group-hover:text-white"
                  />
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="w-6 h-6 text-white"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      Department Management
                    </h1>
                    <p className="text-white/60">
                      Organize and manage your departments
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddClick}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                <span className="font-medium">Add Department</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="w-6 h-6 text-blue-400"
                  />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Departments</p>
                  <p className="text-2xl font-bold text-white">
                    {departments.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Employees</p>
                  <p className="text-2xl font-bold text-white">
                    {employees.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-sm">System Status</p>
                  <p className="text-2xl font-bold text-green-400">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
            {/* Table Header */}
            <div className="bg-white/5 border-b border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Departments List
              </h2>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/70 text-sm font-medium">
                    Filter by ID
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={handleFilterChange}
                    name="departmentIdFilter"
                    placeholder="Enter department ID (numbers only)..."
                    value={departmentIdFilter}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/70 text-sm font-medium">
                    Filter by Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={handleFilterChange}
                    name="departmentNameFilter"
                    placeholder="Enter department name..."
                    value={departmentNameFilter}
                  />
                </div>
              </div>
            </div>

            {/* Table Content */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-white/70">
                  Loading departments...
                </span>
              </div>
            ) : (
              <DndProvider backend={HTML5Backend}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-6 py-4 text-left">
                          <div className="flex items-center space-x-2">
                            <span className="text-white/80 font-medium">
                              Department ID
                            </span>
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={() => sortResult("DepartmentId", true)}
                                className="text-white/60 hover:text-blue-400 transition-colors p-1"
                              >
                                ▲
                              </button>
                              <button
                                onClick={() =>
                                  sortResult("DepartmentId", false)
                                }
                                className="text-white/60 hover:text-blue-400 transition-colors p-1"
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <div className="flex items-center space-x-2">
                            <span className="text-white/80 font-medium">
                              Department Name
                            </span>
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={() =>
                                  sortResult("DepartmentName", true)
                                }
                                className="text-white/60 hover:text-blue-400 transition-colors p-1"
                              >
                                ▲
                              </button>
                              <button
                                onClick={() =>
                                  sortResult("DepartmentName", false)
                                }
                                className="text-white/60 hover:text-blue-400 transition-colors p-1"
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-white/80 font-medium">
                            Actions
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.length === 0 ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-12 text-center text-white/60"
                          >
                            <div className="flex flex-col items-center space-y-3">
                              <FontAwesomeIcon
                                icon={faBuilding}
                                className="w-12 h-12 text-white/30"
                              />
                              <p>No departments found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        departments.map((dep, index) => (
                          <DraggableRow
                            key={dep.DepartmentId}
                            index={index}
                            dep={dep}
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

      {/* Enhanced Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-lg rounded-3xl border border-blue-500/30 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">
            {/* Enhanced Header */}
            <div className="border-b border-blue-500/20 p-6 bg-gradient-to-r from-blue-600/10 to-blue-700/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                    <FontAwesomeIcon
                      icon={departmentId === 0 ? faPlus : faEdit}
                      className="w-6 h-6 text-blue-400"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {modalTitle}
                    </h3>
                    <p className="text-blue-300/70 text-sm">
                      {departmentId === 0
                        ? "Create a new department for your organization"
                        : "Update department information"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200"
                  />
                </button>
              </div>
            </div>

            {/* Enhanced Content */}
            <div className="p-6 space-y-6">
              {/* Department Icon Preview */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 border border-blue-500/30">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="w-10 h-10 text-white"
                  />
                </div>
              </div>

              {/* Form Field with Enhanced Styling */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-white/80 text-sm font-medium">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="w-4 h-4 text-blue-400"
                  />
                  <span>Department Name</span>
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-blue-500/30 rounded-xl px-4 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-200 text-lg"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    placeholder="Enter department name..."
                    maxLength={50}
                  />
                  <div className="absolute bottom-2 right-3 text-xs text-white/40">
                    {departmentName.length}/50
                  </div>
                </div>
                {departmentName.length > 0 && (
                  <div className="text-green-400 text-sm flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                    <span>Department name looks good!</span>
                  </div>
                )}
              </div>

              {/* Preview Card */}
              {departmentName.trim() && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="text-white/60 text-sm">Preview:</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                      <FontAwesomeIcon
                        icon={faBuilding}
                        className="w-5 h-5 text-blue-400"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">{departmentName}</p>
                      <p className="text-white/60 text-sm">
                        {departmentId === 0
                          ? "New Department"
                          : `ID: ${departmentId}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white/80 py-4 rounded-xl transition-all duration-200 font-medium border border-white/20 hover:border-white/30 flex items-center justify-center space-x-2"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                {departmentId === 0 ? (
                  <button
                    onClick={handleCreateClick}
                    disabled={!departmentName.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:shadow-none flex items-center justify-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                    <span>Create Department</span>
                  </button>
                ) : (
                  <button
                    onClick={handleUpdateClick}
                    disabled={!departmentName.trim()}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-green-500/30 hover:shadow-green-500/50 disabled:shadow-none flex items-center justify-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                    <span>Update Department</span>
                  </button>
                )}
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
        department={deleteConfirmation.department}
      />
    </div>
  );
};

export default Department;
