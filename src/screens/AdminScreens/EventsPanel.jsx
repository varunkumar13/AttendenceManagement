import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaTimes } from "react-icons/fa";
import "./style.css";

export default function EventsPanel() {
  const [events, setEvents] = useState([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState("");
  const [showEventModal, setShowEventModal] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: "",
    event_date: "",
    description: ""
  });

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      const token = sessionStorage.getItem("key");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/event/getAllEvent?page=0&size=10000`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
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
        throw new Error(data.message || "Failed to fetch events");
      }
      
      const mappedEvents = (data.content || []).map((e) => ({
        id: e.id,
        title: e.title,
        event_date: e.eventDate,
        description: e.description,
        createdAt: e.createdAt
      }));

      setEvents(mappedEvents);
    } catch (err) {
      console.error("Fetch events error:", err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ================= ADD EVENT =================
  const addEvent = async () => {
    if (!eventForm.title || !eventForm.event_date) {
      setEventError("All fields are required");
      return;
    }

    try {
      setEventLoading(true);
      setEventError("");

      const token = sessionStorage.getItem("key");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/event/addEvent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(eventForm)
        }
      );

      let data = {};
      const text = await response.text();

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to add event");
      }

      await fetchEvents();
      setEventForm({ title: "", event_date: "", description: "" });
      setShowEventModal(false);
    } catch (err) {
      setEventError(err.message);
    } finally {
      setEventLoading(false);
    }
  };

  return (
    <div className="right-panel sticky">
      <div className="calendar-box">
        <Calendar
          tileClassName={({ date }) => {
            const formatted = date.toLocaleDateString("en-CA");
            const hasEvent = events.some((e) => e.event_date === formatted);
            return hasEvent ? "event-day" : null;
          }}
        />
      </div>

      <div className="events">
        <div className="events-header">
          <h3>Events</h3>
          <button onClick={() => setShowEventModal(true)}>+ Add Event</button>
        </div>

        <div className="event-list">
          {events.map((e, i) => (
            <div key={i} className="event-card">
              <div className="event-date">
                {new Date(e.event_date).toDateString().slice(4, 10)}
              </div>
              <div className="event-info">
                <h4>{e.title}</h4>
                <p>{e.event_date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EVENT MODAL */}
      {showEventModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Event</h3>

            <input
              type="text"
              placeholder="Event Name"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({ ...eventForm, title: e.target.value })
              }
            />

            <input
              type="date"
              value={eventForm.event_date}
              onChange={(e) =>
                setEventForm({ ...eventForm, event_date: e.target.value })
              }
            />

            {eventError && <p style={{ color: "red" }}>{eventError}</p>}

            <div className="modal-actions">
              <button onClick={addEvent} disabled={eventLoading}>
                {eventLoading ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowEventModal(false)}>
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
