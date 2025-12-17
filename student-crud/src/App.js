import React, { useState, useEffect } from "react";

function App() {
  const [students, setStudents] = useState([]);

 
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAge, setEditAge] = useState("");

  
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAge, setNewAge] = useState("");

  const [searchId, setSearchId] = useState("");
  const [searchedStudent, setSearchedStudent] = useState(null);

  const apiUrl = "http://localhost:5182/api/students";

 
  const refreshList = () => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStudents(data);
        else setStudents([]);
      })
      .catch(() => setStudents([]));
  };

  useEffect(() => {
    refreshList();
  }, []);

  
  const searchById = () => {
    if (!searchId) {
      alert("Enter Student ID!");
      return;
    }

    fetch(`${apiUrl}/${searchId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.studentId) {
          setSearchedStudent(data);
        } else {
          setSearchedStudent(null);
          alert("Student Not Found");
        }
      })
      .catch(() => alert("Error Searching Student"));
  };

 
  const startEdit = (student) => {
    setEditingId(student.studentId);
    setEditName(student.name);
    setEditEmail(student.email);
    setEditAge(student.age);
  };

  
  const saveEdit = (id) => {
    if (!editName || !editEmail || !editAge) {
      alert("Fill all fields!");
      return;
    }

    fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: editName,
        Email: editEmail,
        Age: Number(editAge),
      }),
    })
      .then((res) => res.json())
      .then((msg) => {
        alert(msg);
        setEditingId(null);
        refreshList();
      });
  };

  
  const deleteStudent = (id) => {
    if (window.confirm("Are you sure?")) {
      fetch(`${apiUrl}/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((msg) => {
          alert(msg);
          refreshList();
        });
    }
  };

 
  const addStudent = () => {
    if (!newName || !newEmail || !newAge) {
      alert("Fill all fields!");
      return;
    }

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: newName,
        Email: newEmail,
        Age: Number(newAge),
      }),
    })
      .then((res) => res.json())
      .then((msg) => {
        alert(msg);
        setNewName("");
        setNewEmail("");
        setNewAge("");
        refreshList();
      });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-center">Student Management</h3>

      
      <div className="d-flex justify-content-end mb-3">
        <input
          type="number"
          placeholder="Search by ID"
          className="form-control w-25 me-2"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button className="btn btn-primary" onClick={searchById}>
          Search
        </button>
      </div>

      
      {searchedStudent && (
        <div className="mb-4">
          <h5>Searched Student Result</h5>
          <table className="table table-bordered table-sm">
            <thead>
              <tr className="table-info">
                <th>StudentId</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{searchedStudent.studentId}</td>
                <td>{searchedStudent.name}</td>
                <td>{searchedStudent.email}</td>
                <td>{searchedStudent.age}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <table className="table table-striped table-hover table-bordered table-sm">
        <thead>
          <tr>
            <th>StudentId</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
         
          <tr className="table-primary">
            <td>New</td>
            <td>
              <input
                type="text"
                className="form-control p-1"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name"
              />
            </td>
            <td>
              <input
                type="email"
                className="form-control p-1"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email"
              />
            </td>
            <td>
              <input
                type="number"
                className="form-control p-1"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                placeholder="Age"
              />
            </td>
            <td>
              <button className="btn btn-success btn-sm w-100" onClick={addStudent}>
                Add
              </button>
            </td>
          </tr>

          
          {students.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No Students Found
              </td>
            </tr>
          ) : (
            students.map((stu) => (
              <tr key={stu.studentId}>
                <td>{stu.studentId}</td>
                <td>
                  {editingId === stu.studentId ? (
                    <input
                      className="form-control p-1"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    stu.name
                  )}
                </td>
                <td>
                  {editingId === stu.studentId ? (
                    <input
                      className="form-control p-1"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  ) : (
                    stu.email
                  )}
                </td>

                <td>
                  {editingId === stu.studentId ? (
                    <input
                      type="number"
                      className="form-control p-1"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                    />
                  ) : (
                    stu.age
                  )}
                </td>

                
                <td>
                  {editingId === stu.studentId ? (
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => saveEdit(stu.studentId)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => startEdit(stu)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteStudent(stu.studentId)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
