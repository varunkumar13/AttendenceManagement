import { useState, useEffect } from "react";
import "./styless.css";
import { FaUserCircle, FaUserGraduate } from "react-icons/fa";
import EventsPanel from "../AdminScreens/EventsPanel";
import { jwtDecode } from "jwt-decode";

export default function TeacherScreen() {
  const [tab, setTab] = useState("attendance");

  // USER
  const [loggedInUser, setLoggedInUser] = useState(null);

  // STUDENTS
  const [students, setStudents] = useState([]);

  // FILTERS
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // MARK ATTENDANCE
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceMap, setAttendanceMap] = useState({});

  // ATTENDANCE LIST
  const [attendanceList, setAttendanceList] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 1000;
  const [showMarksPopup, setShowMarksPopup] = useState(false);
const [selectedStudent, setSelectedStudent] = useState(null);

const [marksForm, setMarksForm] = useState({
  subject: "",
  examType: "",
  marksObtained: "",
  total_marks: "",
  examDate: "",
  remark: ""
});

  useEffect(() => {
    const token = sessionStorage.getItem("key");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLoggedInUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
  }, []);
  const fetchUsersByRole = async (role) => {
    try {
      const token = sessionStorage.getItem("key");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/getAll/${role}?page=0&&size=500`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (!response.ok) throw new Error(data.message);

      return data.content || [];
    } catch (err) {
      console.error("Fetch users error:", err.message);
      return [];
    }
  };

  useEffect(() => {
    fetchUsersByRole("Student").then((res) => {
      const mapped = res.map((u) => ({
        id: u.userId,
        name: u.name || u.userName,
        email: u.userName,
        branch: u.student?.[0]?.class_name || "",
        section: u.student?.[0]?.section || ""
      }));
      setStudents(mapped);
    });
  }, []);

  const branches = [...new Set(students.map((s) => s.branch).filter(Boolean))];
  const sections = [...new Set(students.map((s) => s.section).filter(Boolean))];

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toString().includes(searchTerm);

    const matchBranch = selectedBranch ? s.branch === selectedBranch : true;
    const matchSection = selectedSection ? s.section === selectedSection : true;

    return matchSearch && matchBranch && matchSection;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

  const markAttendance = async (payload) => {
    const token = sessionStorage.getItem("key");
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/attendance/markAttendance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Failed");
    }
  };

  const submitMarks = async () => {
  const token = sessionStorage.getItem("key");

  const payload = {
    studentDto: {
      class_name: selectedStudent.branch,
      section: selectedStudent.section,
      parent_phone_number: ""
    },
    teacherDto: {
      subject: loggedInUser?.subject,
      department: loggedInUser?.department
    },
    subject: marksForm.subject,
    examType: marksForm.examType,
    marksObtained: Number(marksForm.marksObtained),
    total_marks: Number(marksForm.total_marks),
    examDate: marksForm.examDate,
    remark: marksForm.remark,
    teacherEmail: loggedInUser?.sub,
    studentUserName: selectedStudent.email
  };

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/mark/addMark`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    alert("Failed to add marks");
    return;
  }

  alert("Marks added successfully");
  setShowMarksPopup(false);
  setMarksForm({
    subject: "",
    examType: "",
    marksObtained: "",
    total_marks: "",
    examDate: "",
    remark: ""
  });
};


  const submitAttendance = async () => {
    if (!attendanceDate) {
      alert("Select date");
      return;
    }

    const selected = students.filter((s) => attendanceMap[s.id]);
    if (selected.length === 0) {
      alert("Mark attendance");
      return;
    }

    try {
      for (const s of selected) {
        const payload = {
          student_UserName: s.email,
          attendance_date: attendanceDate + "T00:00:00",
          status: attendanceMap[s.id],
          remark: "good"
        };
        await markAttendance(payload);
      }
      alert("Attendance submitted");
      setAttendanceMap({});
    } catch {
      alert("Error submitting attendance");
    }
  };

  const fetchAttendanceList = async () => {
    if (!fromDate || !toDate) {
      alert("From and To date required");
      return;
    }

    const token = sessionStorage.getItem("key");
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/attendance/getAttendance?fromDate=${fromDate}&toDate=${toDate}&page=0&&size=500`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) throw new Error(data.message);

    const mapped = data.content.flatMap((block) =>
      block.student.map((s) => ({
        studentId: s.studentId,
        studentName: s.studentName,
        summary: s.summary,
        attendance: s.attendance
      }))
    );

    setAttendanceList(mapped);
  };

  useEffect(() => {
    if (tab === "attendanceList") {
      fetchAttendanceList();
    }
  }, [tab]);

  return (
    <>
<div className={`dashboard-root ${showMarksPopup ? "blurred" : ""}`}>
      <div className="left-panel">
        {/* PROFILE */}
        <div className="profile-card">
          <div className="teacher-icon">
            <FaUserCircle size={70} />
          </div>

          <div className="profile-info">
            <h2 className="teacher-name">{loggedInUser?.name || "Teacher"}</h2>
            <div className="teacher-row">
              <span>📧 {loggedInUser?.email || loggedInUser?.sub}</span>
              <span><strong>Department:</strong> {loggedInUser?.department || "-"}</span>
              <span><strong>Subject:</strong> {loggedInUser?.subject || "-"}</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          <button className={`tab-btn ${tab === "attendance" ? "active" : ""}`} onClick={() => setTab("attendance")}>
            Mark Attendance
          </button>
          <button className={`tab-btn ${tab === "attendanceList" ? "active" : ""}`} onClick={() => setTab("attendanceList")}>
            Attendance List
          </button>
          <button className={`tab-btn ${tab === "marks" ? "active" : ""}`} onClick={() => setTab("marks")}>
            Add Marks
          </button>
        </div>

        {/* MARK ATTENDANCE */}
        {tab === "attendance" && (
          <div className="cardss attendance-card">
            <div className="toolbar">
              <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                <option value="">All Branches</option>
                {branches.map((b) => <option key={b}>{b}</option>)}
              </select>

              <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                <option value="">All Sections</option>
                {sections.map((s) => <option key={s}>{s}</option>)}
              </select>

              <div className="date-box">
                <span>📅</span>
                <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} />
              </div>

              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Name</th>
                  <th>Present</th>
                  <th>Absent</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>
                      <input type="radio" name={s.id} checked={attendanceMap[s.id] === "PRESENT"} onChange={() => setAttendanceMap({ ...attendanceMap, [s.id]: "PRESENT" })} />
                    </td>
                    <td>
                      <input type="radio" name={s.id} checked={attendanceMap[s.id] === "ABSENT"} onChange={() => setAttendanceMap({ ...attendanceMap, [s.id]: "ABSENT" })} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="primary-btn submit-btn" onClick={submitAttendance}>
              Submit Attendance
            </button>
          </div>
        )}

        {/* ATTENDANCE LIST (ACCORDION) */}
        {tab === "attendanceList" && (
          <div className="cardss attendance-card">
            <div className="toolbar">
              <div className="date-box">
                <span>From</span>
                <input type="date" value={fromDate} max={new Date().toISOString().split("T")[0]} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="date-box">
                <span>To</span>
                <input type="date" value={toDate} max={new Date().toISOString().split("T")[0]} onChange={(e) => setToDate(e.target.value)} />
              </div>

             

              <button className="primary-btn" style={{width:"8rem",height:"5vh"}} onClick={fetchAttendanceList}>Search</button>
            </div>

            <div className="accordion-container">
              {attendanceList.map((s) => (
                <details key={s.studentId} className="accordion-item">
                  <summary className="accordion-header">
                    <span className="student-name">{s.studentName}</span>
                    <span>Total: {s.summary.totalClasses}</span>
                    <span>Present: {s.summary.present}</span>
                    <span>Absent: {s.summary.absent}</span>
                    <span>{s.summary.percentage}%</span>
                  </summary>

                  <div className="accordion-body">
                    <table className="attendance-table">
                      <thead>
                        <tr>
    <th style={{ textAlign: "center" }}>Date</th>
    <th style={{ textAlign: "center" }}>Subject</th>
    <th style={{ textAlign: "center" }}>Status</th>
  </tr>
                      </thead>
                      <tbody>
                        {s.attendance.map((a, i) => (
                          <tr key={i}>
                            <td>{a.date}</td>
                            <td>{a.subject}</td>
                            <td>{a.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* MARKS */}
      {tab === "marks" && (
          <div className="grid">
            {filteredStudents.map((s) => (
              <div className="student-tile" key={s.id}>
                <FaUserGraduate size={55} />
                <p>{s.name}</p>
                {/* <p>{s.email}</p> */}
                <button onClick={() => {
                  setSelectedStudent(s);
                  setShowMarksPopup(true);
                }}>
                  Add
                </button>
              </div>
            ))}
          </div>
        )}


      




      </div>
      

      <EventsPanel />
    </div>
            {showMarksPopup && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Add Marks - {selectedStudent?.name}</h3>

              <input placeholder="Subject"
                value={marksForm.subject}
                onChange={e => setMarksForm({ ...marksForm, subject: e.target.value })}
              />

              <input placeholder="Exam Type"
                value={marksForm.examType}
                onChange={e => setMarksForm({ ...marksForm, examType: e.target.value })}
              />

              <input type="number" placeholder="Marks Obtained"
                value={marksForm.marksObtained}
                onChange={e => setMarksForm({ ...marksForm, marksObtained: e.target.value })}
              />

              <input type="number" placeholder="Total Marks"
                value={marksForm.total_marks}
                onChange={e => setMarksForm({ ...marksForm, total_marks: e.target.value })}
              />

              <input type="datetime-local"
                value={marksForm.examDate}
                onChange={e => setMarksForm({ ...marksForm, examDate: e.target.value })}
              />

              <input placeholder="Remark"
                value={marksForm.remark}
                onChange={e => setMarksForm({ ...marksForm, remark: e.target.value })}
              />

              <div className="modal-actions">
                 <button className="" onClick={submitMarks}>Submit</button>
                <button onClick={() => setShowMarksPopup(false)}>Cancel</button>
               
              </div>
            </div>
          </div>
        )}
        </>
  );
}
