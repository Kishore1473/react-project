import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [seats, setSeats] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [name, setName] = useState("");

  // Load logged user
  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedUser");
    if (loggedUser) setUser(loggedUser);

    const savedEvents = JSON.parse(localStorage.getItem("events"));
    if (savedEvents) setEvents(savedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Register
  const handleRegister = () => {
    if (!username || !password) {
      alert("Fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration Successful!");
    setIsLogin(true);
  };

  // Login
  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(
      user => user.username === username && user.password === password
    );

    if (validUser) {
      localStorage.setItem("loggedUser", username);
      setUser(username);
    } else {
      alert("Invalid Credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
  };

  // Add Event
  const addEvent = () => {
    if (!title || !date || !location || !seats) {
      alert("Fill all fields");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title,
      date,
      location,
      seats: parseInt(seats),
    };

    setEvents([...events, newEvent]);
    setTitle("");
    setDate("");
    setLocation("");
    setSeats("");
  };

  const bookEvent = () => {
    if (!selectedEvent || !name) {
      alert("Select event and enter name");
      return;
    }

    const updatedEvents = events.map(event => {
      if (event.id === selectedEvent.id && event.seats > 0) {
        return { ...event, seats: event.seats - 1 };
      }
      return event;
    });

    setEvents(updatedEvents);
    alert("Booking Successful!");
    setName("");
  };

  // 🔐 If not logged in show login/register page
  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isLogin ? "Login" : "Register"}</h2>

          <input
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />

          {isLogin ? (
            <button className="primary-btn" onClick={handleLogin}>
              Login
            </button>
          ) : (
            <button className="primary-btn" onClick={handleRegister}>
              Register
            </button>
          )}

          <p onClick={() => setIsLogin(!isLogin)} className="toggle-text">
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  // 🟢 Main App After Login
  return (
    <div className="container">
      <div className="top-bar">
        <h1>🎉 Event Booking System</h1>
        <div>
          <span>Welcome, {user}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="card">
        <h2>Add Event</h2>
        <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
        <input type="date" onChange={e => setDate(e.target.value)} />
        <input placeholder="Location" onChange={e => setLocation(e.target.value)} />
        <input type="number" placeholder="Seats" onChange={e => setSeats(e.target.value)} />
        <button className="primary-btn" onClick={addEvent}>Add Event</button>
      </div>

      <div className="events-section">
        <h2>Available Events</h2>
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
            <p>Seats: {event.seats}</p>

            <button className="select-btn" onClick={() => setSelectedEvent(event)}>
              Select
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Book Event</h2>
        <input
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button className="primary-btn" onClick={bookEvent}>
          Book Now
        </button>
      </div>
    </div>
  );
}

export default App;