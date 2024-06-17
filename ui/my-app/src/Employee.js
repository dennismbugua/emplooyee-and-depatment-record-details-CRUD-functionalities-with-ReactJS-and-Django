import React, { useState, useEffect } from "react";
import { variables } from "./Variables.js";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableRow from "./DraggableRow";
import "./index.css";

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

  const refreshList = async () => {
    try {
      const employeeResponse = await fetch(variables.API_URL + "employee");
      const employeeData = await employeeResponse.json();
      setEmployees(employeeData);

      const departmentResponse = await fetch(variables.API_URL + "department");
      const departmentData = await departmentResponse.json();
      setDepartments(departmentData);
    } catch (error) {
      alert("Failed to fetch data");
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
  };


  // const handleSaveClick = async () => {
  //   const method = employeeDetails.EmployeeId === 0 ? "POST" : "PUT";
  //   const url =
  //     employeeDetails.EmployeeId === 0
  //       ? variables.API_URL + "employee"
  //       : variables.API_URL + "employee/" + employeeDetails.EmployeeId;

  //   try {
  //     const response = await fetch(url, {
  //       method,
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(employeeDetails),
  //     });
  //     const result = await response.json();
  //     alert(result);
  //     refreshList();
  //   } catch (error) {
  //     alert("Failed to save data");
  //   }
  // };




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
        refreshList();
        // Close the modal by triggering the close button's click event
        document.getElementById("modalCloseButton").click();
      } else {
        alert("Failed to save data");
      }
    } catch (error) {
      alert("Failed to save data");
    }
  };
  

  
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await fetch(variables.API_URL + "employee/" + id, {
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
        alert("Failed to delete data");
      }
    }
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
      // Ensure to update the image path after successful upload
      setPhotoPath(variables.PHOTO_URL + data);
    } catch (error) {
      alert("Failed to upload image");
    }
  };

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = employees[dragIndex];
    const updatedEmployees = [...employees];
    updatedEmployees.splice(dragIndex, 1);
    updatedEmployees.splice(hoverIndex, 0, dragRecord);
    setEmployees(updatedEmployees);
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
        Add Employee
      </button>
      <DndProvider backend={HTML5Backend}>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>EmployeeId</th>
                <th>EmployeeName</th>
                <th>Department</th>
                <th>Joined</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <DraggableRow
                  key={emp.EmployeeId}
                  id={emp.EmployeeId}
                  index={index}
                  moveRow={moveRow}
                >
                  <td data-label="EmployeeId">{emp.EmployeeId}</td>
                  <td data-label="EmployeeName">{emp.EmployeeName}</td>
                  <td data-label="Department">{emp.Department}</td>
                  <td data-label="Joined">{emp.DateOfJoining}</td>
                  <td data-label="Options">
                    <button
                      type="button"
                      className="btn btn-light mr-1"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => handleEditClick(emp)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil-square"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn btn-light mr-1"
                      onClick={() => handleDeleteClick(emp.EmployeeId)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5V5zm2-3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1H7v-1zm-4.5.5v-1a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1h-2z" />
                      </svg>
                    </button>
                  </td>
                </DraggableRow>
              ))}
            </tbody>
          </table>
        </div>
      </DndProvider>











      {/* <div
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
              <div className="d-flex flex-row bd-highlight mb-3">
                <div className="p-2 w-50 bd-highlight">
                  <div className="input-group mb-3">
                    <span className="input-group-text">Emp Name</span>
                    <input
                      type="text"
                      className="form-control"
                      name="EmployeeName"
                      value={employeeDetails.EmployeeName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Department</span>
                    <select
                      className="form-select"
                      name="Department"
                      value={employeeDetails.Department}
                      onChange={handleChange}
                    >
                      {departments.map((dep) => (
                        <option
                          key={dep.DepartmentId}
                          value={dep.DepartmentName}
                        >
                          {dep.DepartmentName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Joined</span>
                    <input
                      type="date"
                      className="form-control"
                      name="DateOfJoining"
                      value={employeeDetails.DateOfJoining}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="p-2 w-50 bd-highlight">
                  <img
                    width="250px"
                    height="250px"
                    src={photoPath + employeeDetails.PhotoFileName}
                    alt="Employee"
                    onError={(e) =>
                      (e.target.src = photoPath + "anonymous.jpg")
                    }
                  />
                  <input
                    className="m-2"
                    type="file"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary float-start"
                onClick={handleSaveClick}
              >
                {employeeDetails.EmployeeId === 0 ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div> */}





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
          id="modalCloseButton"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <div className="modal-body">
        <div className="d-flex flex-row bd-highlight mb-3">
          <div className="p-2 w-50 bd-highlight">
            <div className="input-group mb-3">
              <span className="input-group-text">Emp Name</span>
              <input
                type="text"
                className="form-control"
                name="EmployeeName"
                value={employeeDetails.EmployeeName}
                onChange={handleChange}
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">Department</span>
              <select
                className="form-select"
                name="Department"
                value={employeeDetails.Department}
                onChange={handleChange}
              >
                {departments.map((dep) => (
                  <option
                    key={dep.DepartmentId}
                    value={dep.DepartmentName}
                  >
                    {dep.DepartmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">Joined</span>
              <input
                type="date"
                className="form-control"
                name="DateOfJoining"
                value={employeeDetails.DateOfJoining}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="p-2 w-50 bd-highlight">
            <img
              width="250px"
              height="250px"
              src={photoPath + employeeDetails.PhotoFileName}
              alt="Employee"
              onError={(e) =>
                (e.target.src = photoPath + "anonymous.jpg")
              }
            />
            <input
              className="m-2"
              type="file"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary float-end"
          onClick={handleSaveClick}
        >
          {employeeDetails.EmployeeId === 0 ? "Create" : "Update"}
        </button>
      </div>
    </div>
  </div>
</div>






    </div>
  );
};
