import React, { useState, useEffect } from "react";
import axiosInstance from "../../../API/Axios";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [parents, setParents] = useState([]);
  const [student, setStudent] = useState({
    regNo: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    admissionNumber: "",
    doB: "",
    enrollmentDate: "",
    courseId: "",
    parentId: ""
  });
  const [userDetails, setUserDetails] = useState({ applicationUserId: "" });
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchParents();
  }, []);

  const fetchStudents = async () => {
    const res = await axiosInstance.get("/Student");
    setStudents(res.data);
  };

  const fetchCourses = async () => {
    const res = await axiosInstance.get("/Course");
    setCourses(res.data);
  };

  const fetchParents = async () => {
    const res = await axiosInstance.get("/Parent");
    setParents(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const payload = {
        regNo: student.regNo,
        userId: userDetails.applicationUserId,
        firstName: student.firstName,
        lastName: student.lastName,
        username: student.username,
        email: student.email,
        phoneNumber: student.phoneNumber,
        admissionNumber: student.admissionNumber,
        doB: student.doB,
        enrollmentDate: student.enrollmentDate,
        parentId: student.parentId,
        courseIds: student.courseId ? [parseInt(student.courseId)] : []
      };

      await axiosInstance.post("/Student", payload);
      setMessage({ type: "success", text: "Student added successfully." });
      fetchStudents();
    } catch {
      setMessage({ type: "error", text: "Failed to add student." });
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        regNo: student.regNo,
        userId: userDetails.applicationUserId,
        firstName: student.firstName,
        lastName: student.lastName,
        username: student.username,
        email: student.email,
        phoneNumber: student.phoneNumber,
        admissionNumber: student.admissionNumber,
        doB: student.doB,
        enrollmentDate: student.enrollmentDate,
        parentId: student.parentId,
        courseIds: student.courseId ? [parseInt(student.courseId)] : []
      };

      await axiosInstance.put(`/Student/edit/${selectedId}`, payload);
      setMessage({ type: "success", text: "Student updated successfully." });
      fetchStudents();
      setSelectedId(null);
      setStudent({
        regNo: "",
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNumber: "",
        admissionNumber: "",
        doB: "",
        enrollmentDate: "",
        courseId: "",
        parentId: ""
      });
    } catch {
      setMessage({ type: "error", text: "Failed to update student." });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/Student/delete/${id}`);
      setMessage({ type: "success", text: "Student deleted successfully." });
      fetchStudents();
    } catch {
      setMessage({ type: "error", text: "Failed to delete student." });
    }
  };

  const handleEdit = (s) => {
    setStudent({
      regNo: s.regNo || "",
      firstName: s.firstName || "",
      lastName: s.lastName || "",
      username: s.username || "",
      email: s.email || "",
      phoneNumber: s.phoneNumber || "",
      admissionNumber: s.admissionNumber || "",
      doB: s.doB?.substring(0, 10) || "",
      enrollmentDate: s.enrollmentDate?.substring(0, 10) || "",
      courseId: s.courseIds?.[0] || "",
      parentId: s.parentId || ""
    });
    setSelectedId(s.studentId);
    setUserDetails({ applicationUserId: s.userId || "" });
    setMessage({ type: "", text: "" });
  };

  return (
    <div>
      <h2>Manage Students</h2>

      {message.text && (
        <div style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </div>
      )}

      <div>
        {/* Form for Create/Update */}
        <input type="text" name="regNo" placeholder="Reg No" value={student.regNo} onChange={handleChange} />
        <input type="text" name="firstName" placeholder="First Name" value={student.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" value={student.lastName} onChange={handleChange} />
        <input type="text" name="username" placeholder="Username" value={student.username} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={student.email} onChange={handleChange} />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={student.phoneNumber} onChange={handleChange} />
        <input type="text" name="admissionNumber" placeholder="Admission No" value={student.admissionNumber} onChange={handleChange} />
        <input type="date" name="doB" value={student.doB} onChange={handleChange} />
        <input type="date" name="enrollmentDate" value={student.enrollmentDate} onChange={handleChange} />

        <select name="courseId" value={student.courseId} onChange={handleChange}>
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.courseId} value={c.courseId}>
              {c.courseName}
            </option>
          ))}
        </select>

        <select name="parentId" value={student.parentId} onChange={handleChange}>
          <option value="">Select Parent</option>
          {parents.map((p) => (
            <option key={p.parentId} value={p.parentId}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>

        {selectedId ? (
          <button onClick={handleUpdate}>Update Student</button>
        ) : (
          <button onClick={handleCreate}>Add Student</button>
        )}
      </div>

      {/* Student Table */}
      <table border="1">
        <thead>
          <tr>
            <th>RegNo</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Courses</th>
            <th>Parent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.studentId}>
              <td>{s.regNo}</td>
              <td>{s.firstName} {s.lastName}</td>
              <td>{s.username}</td>
              <td>{s.email}</td>
              <td>{s.courseNames?.join(", ")}</td>
              <td>{s.parentName}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.studentId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageStudents;
