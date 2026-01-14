import React, { useState, useEffect } from "react";
import "./style.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventsPanel from "./EventsPanel";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUsers,
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaTimes
} from "react-icons/fa";

export default function AdminDashboard() {
  const dummyStudents = [
    { id: 1, name: "John Doe", class: "10A", email: "john@gmail.com" },
    { id: 2, name: "Emma Watson", class: "9B", email: "emma@gmail.com" },
    { id: 3, name: "Alex Smith", class: "8C", email: "alex@gmail.com" }
  ];

  const dummyTeachers = [
    { id: 1, name: "Mr. Kumar", subject: "Math", email: "kumar@gmail.com" },
    { id: 2, name: "Ms. Priya", subject: "Science", email: "priya@gmail.com" },
    { id: 3, name: "Mr. John", subject: "English", email: "john@gmail.com" }
  ];

const [students, setStudents] = useState([]);
const [teachers, setTeachers] = useState([]);

const [studentsLoading, setStudentsLoading] = useState(false);
const [teachersLoading, setTeachersLoading] = useState(false);

  const [eventLoading, setEventLoading] = useState(false);
const [eventError, setEventError] = useState("");

  const defaultEvents = [
    
  ];

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : defaultEvents;
  });

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", event_date: "" ,description:""});

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);

  const [studentForm, setStudentForm] = useState({
    user_name: "",
    password: "",
    name: "",
    class_name: "",
    section: "",
    parent_phone_number: ""
  });

  const [teacherForm, setTeacherForm] = useState({
    user_name: "",
    password: "",
    name: "",
    subject: "",
    department: ""
  });

  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");

  const [teacherLoading, setTeacherLoading] = useState(false);
  const [teacherError, setTeacherError] = useState("");

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) => password.length >= 6;

const fetchUsersByRole = async (role) => {
  try {
    const token = sessionStorage.getItem("key");

    const response = await fetch(
      `https://studentmanagement-production-643d.up.railway.app/api/v1/user/getAll/${role}?page=0&&size=500`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    let data = {};
    const text = await response.text();

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Invalid server response");
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }

    return data.content || [];
  } catch (err) {
    console.error(`Fetch ${role} error:`, err.message);
    return [];
  }
};
useEffect(() => {
  const loadUsers = async () => {
    setStudentsLoading(true);
    setTeachersLoading(true);

    const studentsData = await fetchUsersByRole("Student");
    const teachersData = await fetchUsersByRole("Teacher");

    // Map backend → UI format
const mappedStudents = studentsData.map((u) => ({
  id: u.userId,
  name: u.name,
  email: u.userName,
  class_name: u.student?.[0]?.class_name || "-",
  section: u.student?.[0]?.section || "-",
  parent_phone_number: u.student?.[0]?.parent_phone_number || "-"
}));


    const mappedTeachers = teachersData.map((u) => ({
      id: u.userId,
      name: u.name,
      subject: u.teacher?.[0]?.subject || "-",
      email: u.userName
    }));

    setStudents(mappedStudents);
    setTeachers(mappedTeachers);

    setStudentsLoading(false);
    setTeachersLoading(false);
  };

  loadUsers();
}, []);


  const submitStudent = async () => {
    setStudentError("");

    if (!studentForm.user_name || !studentForm.password || !studentForm.name) {
      setStudentError("All fields are required");
      return;
    }

    if (!isValidEmail(studentForm.user_name)) {
      setStudentError("Invalid email format");
      return;
    }

    if (!isValidPassword(studentForm.password)) {
      setStudentError("Password must be at least 6 characters");
      return;
    }

    const payload = {
      user_name: studentForm.user_name,
      password: studentForm.password,
      role: "student",
      is_admin: false,
      name: studentForm.name,
      Student: {
        class_name: studentForm.class_name,
        section: studentForm.section,
        parent_phone_number: studentForm.parent_phone_number
      }
    };

try {
  setStudentLoading(true);
  const token = sessionStorage.getItem("key");

  const response = await fetch(
    "https://studentmanagement-production-643d.up.railway.app/api/v1/user/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }
  );

  let data = {};
  const text = await response.text();

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text }; // backend returned plain string
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to add student");
  }

  console.log("Student added:", data);
  setShowStudentModal(false);
} catch (err) {
  setStudentError(err.message);
} finally {
  setStudentLoading(false);
}

  };

  const submitTeacher = async () => {
    setTeacherError("");

    if (!teacherForm.user_name || !teacherForm.password || !teacherForm.name) {
      setTeacherError("All fields are required");
      return;
    }

    if (!isValidEmail(teacherForm.user_name)) {
      setTeacherError("Invalid email format");
      return;
    }

    if (!isValidPassword(teacherForm.password)) {
      setTeacherError("Password must be at least 6 characters");
      return;
    }

    const payload = {
      user_name: teacherForm.user_name,
      password: teacherForm.password,
      role: "teacher",
      is_admin: false,
      name: teacherForm.name,
      
      teacher: {
        subject: teacherForm.subject,
        department: teacherForm.department
      }
    };
try {
  setTeacherLoading(true);
  const token = sessionStorage.getItem("key");

  const response = await fetch(
    "https://studentmanagement-production-643d.up.railway.app/api/v1/user/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }
  );

  let data = {};
  const text = await response.text();

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // backend returned plain text, not JSON
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to add teacher");
  }

  console.log("Teacher added:", data);
  setShowTeacherModal(false);
} catch (err) {
  setTeacherError(err.message);
} finally {
  setTeacherLoading(false);
}

  };
  const itemsPerPage = 3;
  const [studentPage, setStudentPage] = useState(1);
  const [teacherPage, setTeacherPage] = useState(1);

  const studentStart = (studentPage - 1) * itemsPerPage;
  const teacherStart = (teacherPage - 1) * itemsPerPage;

  const studentPaginated = students.slice(studentStart, studentStart + itemsPerPage);
  const teacherPaginated = teachers.slice(teacherStart, teacherStart + itemsPerPage);

  return (
    <div className="dashboard">
      {/* Stats */}
      <div className="stats">
        <div className="card"><FaUserGraduate /> Students: {students.length}</div>
        <div className="card"><FaChalkboardTeacher /> Teachers: {teachers.length}</div>
        <div className="card"><FaUsers /> Staff: 25</div>
      </div>

      <div className="main-content">
        <div className="tables-section">
          {/* Students */}
          <div className="table-card">
            <h3>Students</h3>
            <div className="controls">
              <button onClick={() => setShowStudentModal(true)}>
                <FaPlus /> Add
              </button>
              <div className="search-box">
                <FaSearch />
                <input placeholder="Search" />
              </div>
            </div>

            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Class</th><th>Email</th><th>Class</th>
  <th>Section</th>
  <th>Parent Phone</th></tr>
              </thead>
              <tbody>
                {studentPaginated.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.class}</td>
                    <td>{s.email}</td>
                    <td>{s.class_name}</td>
                    <td>{s.section}</td>
                    <td>{s.parent_phone_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button disabled={studentPage === 1} onClick={() => setStudentPage(studentPage - 1)}>
                <FaChevronLeft />
              </button>
              <span>{studentPage}</span>
              <button
                disabled={studentStart + itemsPerPage >= students.length}
                onClick={() => setStudentPage(studentPage + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Teachers */}
          <div className="table-card">
            <h3>Teachers</h3>
            <div className="controls">
              <button onClick={() => setShowTeacherModal(true)}>
                <FaPlus /> Add
              </button>
              <div className="search-box">
                <FaSearch />
                <input placeholder="Search" />
              </div>
            </div>

            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Subject</th><th>Email</th></tr>
              </thead>
              <tbody>
                {teacherPaginated.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>{t.subject}</td>
                    <td>{t.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button disabled={teacherPage === 1} onClick={() => setTeacherPage(teacherPage - 1)}>
                <FaChevronLeft />
              </button>
              <span>{teacherPage}</span>
              <button
                disabled={teacherStart + itemsPerPage >= teachers.length}
                onClick={() => setTeacherPage(teacherPage + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
<EventsPanel />
      </div>
      {showStudentModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Student</h3>

            {studentError && <p className="error-text" style={{color:"red"}}>{studentError}</p>}

            <input placeholder="Email" onChange={(e) => setStudentForm({ ...studentForm, user_name: e.target.value })} />
            <input type="password" placeholder="Password" onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} />
            <input placeholder="Name" onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
            <input placeholder="Class" onChange={(e) => setStudentForm({ ...studentForm, class_name: e.target.value })} />
            <input placeholder="Section" onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })} />
            <input placeholder="Parent Phone" onChange={(e) => setStudentForm({ ...studentForm, parent_phone_number: e.target.value })} />

            <div className="modal-actions">
              <button onClick={submitStudent} disabled={studentLoading}>
                {studentLoading ? "Submitting..." : "Submit"}
              </button>
              <button onClick={() => setShowStudentModal(false)} disabled={studentLoading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showTeacherModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Teacher</h3>

            {teacherError && <p className="error-text" style={{color:"red"}}>{teacherError}</p>}

            <input placeholder="Email" onChange={(e) => setTeacherForm({ ...teacherForm, user_name: e.target.value })} />
            <input type="password" placeholder="Password" onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })} />
            <input placeholder="Name" onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} />
            <input placeholder="Subject" onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })} />
            <input placeholder="Department" onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })} />

            <div className="modal-actions">
              <button onClick={submitTeacher} disabled={teacherLoading}>
                {teacherLoading ? "Submitting..." : "Submit"}
              </button>
              <button onClick={() => setShowTeacherModal(false)} disabled={teacherLoading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
