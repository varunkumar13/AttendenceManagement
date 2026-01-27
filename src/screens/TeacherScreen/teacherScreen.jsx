import { useState } from "react";
import "./styless.css";
import { FaUserCircle } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";
import EventsPanel from "../AdminScreens/EventsPanel";




const students = [
  { id: 1, name: "Rahul" },
  { id: 2, name: "Anita" },
  { id: 3, name: "Suresh" },
  { id: 4, name: "Priya" },
  { id: 5, name: "Amit" },
  { id: 6, name: "Kiran" },
  { id: 7, name: "Rohit" }
];

export default function TeacherScreen() {
  const [tab, setTab] = useState("attendance");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // SEARCH
  const [searchTerm, setSearchTerm] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  // FILTERED STUDENTS (by name or roll)
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toString().includes(searchTerm)
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

return (
  <div className="dashboard-root">

    {/* LEFT MAIN PANEL */}
    <div className="left-panel">

      {/* PROFILE */}
      <div className="profile-card">
        <div className="teacher-icon">
          <FaUserCircle size={70} />
        </div>
        <div>
          <h2>Ella Brock</h2>
          <p>Science Teacher</p>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button
          className={`tab-btn ${tab === "attendance" ? "active" : ""}`}
          onClick={() => { setTab("attendance"); setSearchTerm(""); }}
        >
          Mark Attendance
        </button>
        <button
          className={`tab-btn ${tab === "marks" ? "active" : ""}`}
          onClick={() => { setTab("marks"); setSearchTerm(""); }}
        >
          Add Marks
        </button>
      </div>

      {/* ATTENDANCE */}
      {tab === "attendance" && (
        <div className="cardss attendance-card" >

          <div className="toolbar">
            <div className="date-box">
              <span>📅</span>
              <input type="date" />
            </div>

            <input
              type="text"
              className="search-input"
              placeholder="Search by roll or name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Name</th>
                  <th className="center">Present</th>
                  <th className="center">Absent</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td className="student-name">{s.name}</td>
                    <td className="center">
                      <input type="radio" name={s.id} className="radio present" />
                    </td>
                    <td className="center">
                      <input type="radio" name={s.id} className="radio absent" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>

          <button className="primary-btn submit-btn">Submit Attendance</button>
        </div>
      )}

      {/* MARKS */}
      {tab === "marks" && (
        <>
          <input
            type="text"
            className="search-input marks-search"
            placeholder="Search by roll or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="grid">
            {filteredStudents.map((s) => (
              <div className="student-tile" key={s.id}>
                <FaUserGraduate className="student-avatar-icon" size={55} color="rgb(8, 67, 131)" />
                <div className="student-info">
                  <p><strong>Roll No:</strong> {s.id}</p>
                  <p><strong>Name:</strong> {s.name}</p>
                </div>
                <button onClick={() => { setSelectedStudent(s); setShowPopup(true); }}>
                  Add
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODAL */}
      {showPopup && (
        <div className="modal">
          <div className="modal-box">
            <h3>Add Marks - {selectedStudent.name}</h3>
            <input type="number" placeholder="Enter marks" />
            <div className="modal-actions">
              <button className="primary-btn">Save</button>
              <button className="secondary-btn" onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>

    {/* RIGHT EVENTS PANEL */}
    <EventsPanel />

  </div>
);

}
