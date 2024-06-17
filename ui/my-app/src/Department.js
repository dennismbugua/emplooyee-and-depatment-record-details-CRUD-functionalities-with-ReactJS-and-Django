import React, { useState, useEffect, useCallback } from "react";
import { variables } from "./Variables.js";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ItemType = "DEPARTMENT";

const DraggableRow = ({ dep, index, moveRow, handleEditClick, handleDeleteClick }) => {
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

  return (
    <tr ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <td>{dep.DepartmentId}</td>
      <td>{dep.DepartmentName}</td>
      <td>
        <button
          type="button"
          className="btn btn-light mr-1"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => handleEditClick(dep)}
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          type="button"
          className="btn btn-light mr-1"
          onClick={() => handleDeleteClick(dep.DepartmentId)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
};

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]); // New state for employees
  const [modalTitle, setModalTitle] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [departmentId, setDepartmentId] = useState(0);
  const [departmentIdFilter, setDepartmentIdFilter] = useState("");
  const [departmentNameFilter, setDepartmentNameFilter] = useState("");
  const [departmentsWithoutFilter, setDepartmentsWithoutFilter] = useState([]);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = async () => {
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
    }
  };

  const filterFn = () => {
    const filteredData = departmentsWithoutFilter.filter(
      (el) =>
        el.DepartmentId.toString().toLowerCase().includes(departmentIdFilter.toLowerCase().trim()) &&
        el.DepartmentName.toString().toLowerCase().includes(departmentNameFilter.toLowerCase().trim())
    );
    setDepartments(filteredData);
  };

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
  };

  const handleEditClick = (dep) => {
    setModalTitle("Edit Department");
    setDepartmentId(dep.DepartmentId);
    setDepartmentName(dep.DepartmentName);
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
      const result = await response.json();
      alert(result);
      refreshList();
    } catch (error) {
      alert("Failed");
    }
  };

  const handleUpdateClick = async () => {
    try {
      const response = await fetch(variables.API_URL + "department/" + departmentId, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DepartmentId: departmentId,
          DepartmentName: departmentName,
        }),
      });
      const result = await response.json();
      // Close modal
      document.getElementById('modalCloseButton').click();
      refreshList();
    } catch (error) {
      alert("Failed");
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await fetch(variables.API_URL + "department/" + id, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (response.status === 204) {
          alert("Department deleted successfully");
        } else {
          const result = await response.json();
          alert(result);
        }
        refreshList();
      } catch (error) {
        alert("Failed");
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "departmentIdFilter") {
      setDepartmentIdFilter(value);
    } else if (name === "departmentNameFilter") {
      setDepartmentNameFilter(value);
    }
    filterFn();
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
    <div>
      <DndProvider backend={HTML5Backend}>
        <button
          type="button"
          className="btn btn-primary m-2 float-end"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={handleAddClick}
        >
          Add Department
        </button>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>
                  <div className="d-flex flex-row">
                    <input
                      className="form-control m-2"
                      onChange={handleFilterChange}
                      name="departmentIdFilter"
                      placeholder="Filter"
                    />
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => sortResult("DepartmentId", true)}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => sortResult("DepartmentId", false)}
                    >
                      ▼
                    </button>
                  </div>
                  DepartmentId
                </th>
                <th>
                  <div className="d-flex flex-row">
                    <input
                      className="form-control m-2"
                      onChange={handleFilterChange}
                      name="departmentNameFilter"
                      placeholder="Filter"
                    />
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => sortResult("DepartmentName", true)}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => sortResult("DepartmentName", false)}
                    >
                      ▼
                    </button>
                  </div>
                  DepartmentName
                </th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dep, index) => (
                <DraggableRow
                  key={dep.DepartmentId}
                  index={index}
                  dep={dep}
                  moveRow={moveRow}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" id="modalCloseButton" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Department Name</span>
                  <input
                    type="text"
                    className="form-control"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                  />
                </div>
                {departmentId === 0 ? (
                  <button type="button" className="btn btn-primary float-end" onClick={handleCreateClick}>
                    Create
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary float-end" onClick={handleUpdateClick}>
                    Update
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default Department;
