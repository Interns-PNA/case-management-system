import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import "../App.css";

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const Dashboard = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [counts, setCounts] = useState({
    courts: 0,
    judges: 0,
    subjectMatters: 0,
    totalCases: 0,
    pending: 0,
    closed: 0,
    inProgress: 0,
    upcoming: 0,
    critical: 0,
    tasks: 0,
    departments: 0,
    designations: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Fetch all summary stats from backend
      const res = await axios.get("http://localhost:5000/api/summary/counts");
      // The backend should return all needed fields, otherwise fallback to 0
      setCounts({
        courts: res.data.courts || 0,
        judges: res.data.judges || 0,
        subjectMatters: res.data.subjectMatters || 0,
        totalCases: res.data.totalCases || 0,
        pending: res.data.pending || 0,
        closed: res.data.closed || 0,
        inProgress: res.data.inProgress || 0,
        upcoming: res.data.upcoming || 0,
        critical: res.data.critical || 0,
        tasks: res.data.tasks || 0,
        departments: res.data.departments || 0,
        designations: res.data.designations || 0,
      });
    } catch (error) {
      console.error("Error fetching summary counts:", error);
    }
  };

  const cardData = [
    { label: "Total Cases", value: counts.totalCases, color: "blue" },
    { label: "Pending", value: counts.pending, color: "yellow" },
    { label: "Closed", value: counts.closed, color: "green" },
    { label: "In Progress", value: counts.inProgress, color: "purple" },
    { label: "Upcoming Cases", value: counts.upcoming, color: "blue" },
    {
      label: "Departments",
      value: counts.departments,
      color: "purple",
      link: "/departments",
    },
    {
      label: "Designations",
      value: counts.designations,
      color: "yellow",
      link: "/designations",
    },
    {
      label: "Total No Of Courts",
      value: counts.courts,
      color: "green",
      link: "/courts",
    },
    {
      label: "Total No of Judges",
      value: counts.judges,
      color: "blue",
      link: "/judges",
    },
    {
      label: "Total No of Subject Matter",
      value: counts.subjectMatters,
      color: "purple",
      link: "/subject-matter",
    },
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  return (
    <div
      className="dashboard-background"
      style={{ backgroundImage: `url(${logo})` }}
    >
      <div className="dashboard-wrapper">
        {/* Card Grid */}
        <div className="dashboard">
          {cardData.map((card, index) => {
            const content = (
              <div className={`card ${card.color}`}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4721/4721081.png"
                    alt="icon"
                    style={{ width: "28px", height: "28px" }}
                  />
                  <div>
                    <h3>{card.value}</h3>
                    <p>{card.label}</p>
                  </div>
                </div>
              </div>
            );

            return card.link ? (
              <Link
                key={index}
                to={card.link}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {content}
              </Link>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
        </div>

        {/* Calendar */}
        <div className="calendar-fixed">
          <div className="calendar-nav">
            <button onClick={handlePrev}>←</button>
            <span>
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button onClick={handleNext}>→</button>
          </div>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, idx) => (
                <div key={idx} className="calendar-day-label">
                  {day}
                </div>
              )
            )}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} className="calendar-day empty"></div>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => (
              <div key={i} className="calendar-day">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
