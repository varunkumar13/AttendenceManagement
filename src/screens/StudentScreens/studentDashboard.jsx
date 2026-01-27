import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventsPanel from "../AdminScreens/EventsPanel";
import profile from "../../assets/mainprofile.json"
import Lottie from "lottie-react";
import { jwtDecode } from "jwt-decode";


import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import {
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaCheckCircle,
  FaClock,
  FaBook,
  FaCalendarAlt,
  FaGraduationCap
} from "react-icons/fa";
import "./styles.css";

const getAssignmentStats = () => {
  const total = assignments.length;
  const completed = assignments.filter(a => a.status === "completed").length;
  const pending = assignments.filter(a => a.status === "pending").length;
  const overdue = assignments.filter(a => a.status === "pending" && new Date(a.dueDate) < new Date()).length;
  
  const completedPercent = Math.round((completed / total) * 100);
  const pendingPercent = Math.round(((pending - overdue) / total) * 100);
  const overduePercent = Math.round((overdue / total) * 100);
  
  return [
    { name: "Completed", value: completedPercent, color: "#10b981", count: completed },
    { name: "Pending", value: pendingPercent, color: "#f59e0b", count: pending - overdue },
    { name: "Overdue", value: overduePercent, color: "#ef4444", count: overdue }
  ];
};

const assignments = [
  { 
    id: 1, 
    title: "Mathematics Assignment - Calculus", 
    subject: "Mathematics", 
    dueDate: "2026-01-20", 
    status: "pending",
    description: "Complete exercises 1-15 from Chapter 3"
  },
  { 
    id: 2, 
    title: "Physics Lab Report", 
    subject: "Physics", 
    dueDate: "2026-01-18", 
    status: "completed",
    description: "Write lab report on pendulum experiment"
  },
  { 
    id: 3, 
    title: "English Essay - Modern Literature", 
    subject: "English", 
    dueDate: "2026-01-25", 
    status: "pending",
    description: "Write 1000 words on contemporary authors"
  },
  { 
    id: 4, 
    title: "Chemistry Project", 
    subject: "Chemistry", 
    dueDate: "2026-01-15", 
    status: "completed",
    description: "Organic compounds research project"
  },
  { 
    id: 5, 
    title: "History Timeline", 
    subject: "History", 
    dueDate: "2026-01-30", 
    status: "pending",
    description: "Create timeline of World War events"
  }
];


const examTimetable = [
  {
    type: "Internal",
    exams: [
      { subject: "Mathematics", date: "2026-01-22", time: "9:00 AM - 12:00 PM", room: "Room 101" },
      { subject: "Physics", date: "2026-01-24", time: "9:00 AM - 12:00 PM", room: "Room 102" },
      { subject: "Chemistry", date: "2026-01-26", time: "2:00 PM - 5:00 PM", room: "Room 103" },
      { subject: "English", date: "2026-01-28", time: "9:00 AM - 12:00 PM", room: "Room 104" }
    ]
  },
  {
    type: "Semester",
    exams: [
      { subject: "Mathematics", date: "2026-02-15", time: "9:00 AM - 12:00 PM", room: "Hall A" },
      { subject: "Physics", date: "2026-02-17", time: "9:00 AM - 12:00 PM", room: "Hall B" },
      { subject: "Chemistry", date: "2026-02-19", time: "2:00 PM - 5:00 PM", room: "Hall A" },
      { subject: "English", date: "2026-02-21", time: "9:00 AM - 12:00 PM", room: "Hall C" },
      { subject: "History", date: "2026-02-23", time: "2:00 PM - 5:00 PM", room: "Hall B" }
    ]
  }
];

const defaultEvents = [
  { title: "Staff Meeting", date: "2026-01-15" },
  { title: "Annual Day", date: "2026-01-18" },
  { title: "Math Exam", date: "2026-01-20" },
  { title: "Science Fair", date: "2026-01-22" },
  { title: "Parents Meeting", date: "2026-01-25" }
];

export default function StudentDashboard() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : defaultEvents;
  });

 
    const [loggedInUser, setLoggedInUser] = useState(null);
      const [attendanceList, setAttendanceList] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
    
  }, []);

  const [activeTab, setActiveTab] = useState("assignments");
    const fetchAttendanceList = async () => {
    if (!fromDate || !toDate) {
      alert("From and To date required");
      return;
    }

    const token = sessionStorage.getItem("key");
    const url = `https://studentmanagement-production-23b8.up.railway.app/api/v1/attendance/getAttendance?fromDate=${fromDate}&toDate=${toDate}&page=0&&size=500`;

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
  console.log(attendanceList);
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

  console.log(attendanceList[0]?.summary?.present);
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
      if (fromDate && toDate) {
    fetchAttendanceList();
  }
  }, [events,fromDate, toDate]);

  const pendingAssignments = assignments.filter(a => a.status === "pending");
  const completedAssignments = assignments.filter(a => a.status === "completed");
  const assignmentStats = getAssignmentStats();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
// const handleAttendanceSearch = () => {
//   if (!fromDate || !toDate) {
//     alert("Please select From and To date");
//     return;
//   }
//   fetchAttendanceList(); // your API function
// };
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="dashboard-root">

      {/* LEFT PROFILE */}
      <div className="profile-card">
        <div style={{padding:"0px"}}>         <Lottie animationData={profile} loop={true}   />
</div>

        <h3>{loggedInUser?.name}<span>(1406)</span></h3>
        <p>{loggedInUser?.sub}</p>
        <p>9606763018</p>

        <div className="profile-details">
          <div><b>Gender:</b> Male</div>
          <div><b>Father:</b> Govinda</div>
          <div><b>DOB:</b> 14 June 2001</div>
          <div><b>Class:</b> {loggedInUser?.class}</div>
          <div><b>Section:</b> {loggedInUser?.section}</div>
        </div>

        <div className="socials">
          <FaFacebook />
          <FaTwitter />
          <FaInstagram />
        </div>

        <div className="about">
          <h4>About Student</h4>
          <p>
            Hi there! My name is {loggedInUser?.name} and I am a {loggedInUser?.class}  student.
            I love going to collage and learning new things every day ,You can contact me on {loggedInUser?.sub} .
          </p>
        </div>
      </div>

      {/* CENTER */}
      <div className="center-content">

<div className="attendance-stats">

  {/* ROW 1 → DATES */}
  <div className="attendance-row">
    <div className="stat-card">
      <div className="stat-info" style={{display:"flex",flexDirection:"row",gap:"3rem"}}>
        <p>From Date</p>
        <input
          type="date"
          value={fromDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-info" style={{display:"flex",flexDirection:"row",gap:"3rem"}}>
        <p>To Date</p>
        <input
          type="date"
          value={toDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>
    </div>
  </div>

  {/* ROW 2 → STATS */}
  <div className="attendance-row">
    <div className="stat-card">
      <div className="stat-icon">
        <FaCheckCircle />
      </div>
      <div className="stat-info">
        <p>Days Present</p>
      <h2>{attendanceList[0]?.summary?.present}</h2>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon pending">
        <FaClock />
      </div>
      <div className="stat-info">
        <p>Days Absent</p>
        <h2>{attendanceList[0]?.summary?.absent}</h2>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon">
        <FaGraduationCap />
      </div>
      <div className="stat-info">
        <p>Attendance %</p>
        <h2>{attendanceList[0]?.summary?.percentage}%</h2>
      </div>
    </div>
  </div>

</div>



        {/* TAB NAVIGATION */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === "assignments" ? "active" : ""}`}
            onClick={() => setActiveTab("assignments")}
          >
            <FaBook /> Assignments
          </button>
          <button 
            className={`tab-btn ${activeTab === "exams" ? "active" : ""}`}
            onClick={() => setActiveTab("exams")}
          >
            <FaCalendarAlt /> Exam Timetable
          </button>
        </div>

        {/* ASSIGNMENTS TAB */}
        {activeTab === "assignments" && (
          <div className="assignments-section">
            <div className="assignments-grid">
              
              {/* PENDING ASSIGNMENTS */}
              <div className="assignment-column">
                <div className="column-header pending">
                  <FaClock />
                  <h3>Pending ({pendingAssignments.length})</h3>
                </div>
                <div className="assignment-list">
                  {pendingAssignments.map((assignment) => (
                    <div key={assignment.id} className={`assignment-card ${isOverdue(assignment.dueDate) ? 'overdue' : ''}`}>
                      <div className="assignment-header">
                        <h4>{assignment.title}</h4>
                        <span className="subject-tag">{assignment.subject}</span>
                      </div>
                      <p className="assignment-description">{assignment.description}</p>
                      <div className="assignment-footer">
                        <span className={`due-date ${isOverdue(assignment.dueDate) ? 'overdue' : ''}`}>
                          Due: {formatDate(assignment.dueDate)}
                        </span>
                        {isOverdue(assignment.dueDate) && <span className="overdue-badge">Overdue</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPLETED ASSIGNMENTS */}
              <div className="assignment-column">
                <div className="column-header completed">
                  <FaCheckCircle />
                  <h3>Completed ({completedAssignments.length})</h3>
                </div>
                <div className="assignment-list">
                  {completedAssignments.map((assignment) => (
                    <div key={assignment.id} className="assignment-card completed">
                      <div className="assignment-header">
                        <h4>{assignment.title}</h4>
                        <span className="subject-tag">{assignment.subject}</span>
                      </div>
                      <p className="assignment-description">{assignment.description}</p>
                      <div className="assignment-footer">
                        <span className="due-date">
                          Completed: {formatDate(assignment.dueDate)}
                        </span>
                        <FaCheckCircle className="completed-icon" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXAM TIMETABLE TAB */}
        {activeTab === "exams" && (
          <div className="exam-section">
            {examTimetable.map((examType, index) => (
              <div key={index} className="exam-type-section">
                <div className="exam-type-header">
                  <h3>{examType.type} Exams</h3>
                </div>
                <div className="exam-grid">
                  {examType.exams.map((exam, examIndex) => (
                    <div key={examIndex} className="exam-card">
                      <div className="exam-subject">
                        <FaBook />
                        <h4>{exam.subject}</h4>
                      </div>
                      <div className="exam-details">
                        <div className="exam-info">
                          <FaCalendarAlt />
                          <span>{formatDate(exam.date)}</span>
                        </div>
                        <div className="exam-info">
                          <FaClock />
                          <span>{exam.time}</span>
                        </div>
                        <div className="exam-info">
                          <span className="room-tag">{exam.room}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ASSIGNMENT PROGRESS CHART */}

      </div>

      {/* RIGHT CALENDAR */}
<EventsPanel/>
        
    </div>
  );
}
