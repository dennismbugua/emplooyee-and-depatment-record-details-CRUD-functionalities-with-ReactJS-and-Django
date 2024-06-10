import React, { useState, useEffect } from "react";
import { variables } from "./Variables.js";

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

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary m-2 float-end"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={handleAddClick}
      >
        Add Department
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <div className="d-flex flex-row">
                <input
                  className="form-control m-2"
                  onChange={(e) => {
                    setDepartmentIdFilter(e.target.value);
                    filterFn();
                  }}
                  placeholder="Filter"
                />
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => sortResult("DepartmentId", true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-down-square-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => sortResult("DepartmentId", false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-up-square-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                  </svg>
                </button>
              </div>
              DepartmentId
            </th>
            <th>
              <div className="d-flex flex-row">
                <input
                  className="form-control m-2"
                  onChange={(e) => {
                    setDepartmentNameFilter(e.target.value);
                    filterFn();
                  }}
                  placeholder="Filter"
                />
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => sortResult("DepartmentName", true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-down-square-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => sortResult("DepartmentName", false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-up-square-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                  </svg>
                </button>
              </div>
              DepartmentName
            </th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep) => (
            <tr key={dep.DepartmentId}>
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
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-1 1a.5.5 0 0 1-.708 0L9.5 3.207 6.354 6.354a.5.5 0 0 1-.708-.708L8.793 2.5l-1-1a.5.5 0 0 1 .708-.708l1 1 1.707-1.707a.5.5 0 0 1 .707 0l3 3a.5.5 0 0 1 .207.44v.07zM1 13.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .354-.146l10-10a.5.5 0 0 0 0-.708l-1-1a.5.5 0 0 0-.707 0l-10 10A.5.5 0 0 0 1 13.5zm3-3v1a.5.5 0 0 1-1 0v-1h1zm0-1H3v1h1V9zm0-1H3v1h1V8zm0-1H3v1h1V7zm0-1H3v1h1V6zm0-1H3v1h1V5zm0-1H3v1h1V4zm0-1H3v1h1V3zm0-1H3v1h1V2zm0-1H3v1h1V1zm0-1H3v1h1V0zm11 12h1a.5.5 0 0 1 0 1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1V0z" />
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
          ))}
        </tbody>
      </table>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {modalTitle}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <span className="input-group-text">DepartmentName</span>
                <input
                  type="text"
                  className="form-control"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary float-start"
                onClick={departmentId === 0 ? handleCreateClick : handleUpdateClick}
              >
                {departmentId === 0 ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
