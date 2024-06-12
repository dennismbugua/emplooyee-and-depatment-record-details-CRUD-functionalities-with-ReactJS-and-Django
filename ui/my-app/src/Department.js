import React, { useState, useEffect, useCallback } from "react";
import { variables } from "./Variables.js";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pencil-square"
            viewBox="0 0 16 16"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-1 1a.5.5 0 0 1-.708 0L9.5 3.207 6.354 6.354a.5.5 0 0 1-.708-.708L8.793 2.5l-1-1a.5.5 0 0 1 .708-.708l1 1 1.707-1.707a.5.5 0 0 1 .707 0l3 3a.5.5 0 0 1 .207.44v.07zM1 13.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .354-.146l10-10a.5.5 0 0 0 0-.708l-1-1a.5.5 0 0 0-.707 0l-10 10A.5.5 0 0 0 1 13.5zm3-3v1a.5.5 0 0 1-1 0v-1h1zm0-1H3v1h1V9zm0-1H3v1h1V8zm0-1H3v1h1V7zm0-1H3v1h1V6zm0-1H3v1h1V5zm0-1H3v1h1V4zm0-1H3v1h1V3zm0-1H3v1h1V2zm0-1H3v1h1V1zm0-1H3v1h1V0zm11 12h1a.5.5 0 0 1 0 1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1V0z" />
          </svg>
        </button>
        <button
          type="button"
          className="btn btn-light mr-1"
          onClick={() => handleDeleteClick(dep.DepartmentId)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-trash-fill"
            viewBox="0 0 16 16"
          >
            <path d="M2.5 1a1 1 0 0 0-1 1V3h-1a.5.5 0 0 0 0 1H1v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4h.5a.5.5 0 0 0 0-1h-1V2a1 1 0 0 0-1-1h-9zm1 3v9a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V4h10v9a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V4H3.5zM3 4v9a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V4h-3zm6 0v9a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V4h-3z" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

const Department = () => {
  const [departments, setDepartments] = useState([]);
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
      const response = await fetch(variables.API_URL + "department");
      const data = await response.json();
      setDepartments(data);
      setDepartmentsWithoutFilter(data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const filterFn = () => {
    const filteredData = departmentsWithoutFilter.filter((el) =>
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
      const response = await fetch(variables.API_URL + "department", {
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
      alert(result);
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
        const result = await response.json();
        alert(result);
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

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
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
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={handleCreateClick}
                  >
                    Create
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={handleUpdateClick}
                  >
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
