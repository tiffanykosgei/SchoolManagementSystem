import React, { useEffect, useState } from "react";
import axiosInstance from "../../../API/Axios";

const ManageParents = () => {
  const [parents, setParents] = useState([]);
  const [parent, setParent] = useState({
    regNo: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    userId: ""
  });
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState(null);

  // ✅ fetch all parents
  const fetchParents = async () => {
    try {
      const res = await axiosInstance.get("/Parent");
      setParents(res.data);
    } catch (err) {
      console.error("Failed to fetch parents", err);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  // ✅ handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setParent((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ reset form after save/update
  const resetForm = () => {
    setParent({
      regNo: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      userId: ""
    });
    setSelectedId(null);
    setMessage(null);
  };

  // ✅ find user by regNo (like ManageStudents)
  const handleFindUser = async () => {
    if (!parent.regNo) {
      setMessage({ type: "error", text: "Please enter RegNo first." });
      return;
    }
    try {
      const res = await axiosInstance.get(`/Auth/by-regno/${parent.regNo}`);
      const data = res.data;

      setParent((prev) => ({
        ...prev,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        userId: data.applicationUserId || ""
      }));

      setMessage({ type: "success", text: "User found. Fill in the remaining parent details." });
    } catch (error) {
      setParent((prev) => ({ ...prev, userId: "" }));
      setMessage({ type: "error", text: error?.response?.data || "User not found." });
    }
  };

  // ✅ add new parent
  const handleAdd = async () => {
    try {
      await axiosInstance.post("/Parent", parent);
      setMessage({ type: "success", text: "Parent added successfully." });
      fetchParents();
      resetForm();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "Failed to add parent.";
      setMessage({ type: "error", text: errorMessage });
    }
  };

  // ✅ update existing parent
  const handleUpdate = async () => {
    if (!selectedId) return;

    try {
      const payload = {
        regNo: parent.regNo,
        userId: parent.userId,
        firstName: parent.firstName,
        lastName: parent.lastName,
        phoneNumber: parent.phoneNumber,
        email: parent.email
      };

      await axiosInstance.put(`/Parent/${selectedId}`, payload);

      setMessage({ type: "success", text: "Parent updated successfully." });
      fetchParents();
      resetForm();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update parent.";
      setMessage({ type: "error", text: errorMessage });
    }
  };

  // ✅ edit button (prefill form)
  const handleEdit = (p) => {
    setSelectedId(p.parentId);
    setParent({
      regNo: p.regNo || "",
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      phoneNumber: p.phoneNumber || "",
      email: p.email || "",
      userId: p.userId || ""
    });
  };

  // ✅ delete parent
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/Parent/${id}`);
      setMessage({ type: "success", text: "Parent deleted successfully." });
      fetchParents();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete parent.";
      setMessage({ type: "error", text: errorMessage });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Parents</h2>

      {message && (
        <div style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </div>
      )}

      {/* Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          name="regNo"
          placeholder="Reg No"
          value={parent.regNo}
          onChange={handleChange}
          disabled={selectedId !== null}
        />
        <button type="button" onClick={handleFindUser} disabled={selectedId !== null}>
          Find User by RegNo
        </button>

        <input
          name="firstName"
          placeholder="First Name"
          value={parent.firstName}
          onChange={handleChange}
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={parent.lastName}
          onChange={handleChange}
        />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={parent.phoneNumber}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={parent.email}
          onChange={handleChange}
        />
        <input
          name="userId"
          placeholder="User Id"
          value={parent.userId}
          onChange={handleChange}
          disabled
        />

        {selectedId ? (
          <button onClick={handleUpdate}>Update Parent</button>
        ) : (
          <button onClick={handleAdd}>Add Parent</button>
        )}
        <button onClick={resetForm}>Clear</button>
      </div>

      {/* Scrollable table */}
      <h3>Parent List</h3>
      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc" }}>
        <table width="100%" border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "#f2f2f2" }}>
            <tr>
              <th>Reg No</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>User Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parents.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No parents found
                </td>
              </tr>
            ) : (
              parents.map((p) => (
                <tr key={p.parentId}>
                  <td>{p.regNo}</td>
                  <td>{p.firstName}</td>
                  <td>{p.lastName}</td>
                  <td>{p.phoneNumber}</td>
                  <td>{p.email}</td>
                  <td>{p.userId}</td>
                  <td>
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p.parentId)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageParents;
