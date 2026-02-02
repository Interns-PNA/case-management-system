import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NA_Logo from "../assets/na.png";
import "../App.css";
import {
  FaFolderOpen,
  FaHourglassHalf,
  FaCheckCircle,
  FaSpinner,
  FaCalendarAlt,
  FaLandmark,
  FaUserTag,
  FaBalanceScale,
  FaGavel,
  FaBook,
} from "react-icons/fa";
import { AlignCenter } from "lucide-react";

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const Dashboard = () => {
  const navigate = useNavigate();
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

  const [hearingDates, setHearingDates] = useState([]);

  useEffect(() => {
    fetchCounts();
    fetchHearingDates();
  }, [currentMonth, currentYear]);

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

  const fetchHearingDates = async () => {
    try {
      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 1, 0);

      const res = await axios.get(
        `http://localhost:5000/api/cases?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      // Extract unique hearing dates for the current month
      const dates = res.data
        .filter((case_) => case_.nextHearingDate)
        .map((case_) => {
          const hearingDate = new Date(case_.nextHearingDate);
          // Check if the hearing date is actually in the current month and year
          if (
            hearingDate.getMonth() === currentMonth &&
            hearingDate.getFullYear() === currentYear
          ) {
            return hearingDate.getDate(); // Get day of month
          }
          return null; // Return null for dates not in current month
        })
        .filter((day) => day !== null); // Remove null values

      // Remove duplicates
      setHearingDates([...new Set(dates)]);
    } catch (error) {
      console.error("Error fetching hearing dates:", error);
      setHearingDates([]);
    }
  };

  const hasHearing = (day) => {
    return hearingDates.includes(day);
  };

  const handleDateClick = (day) => {
    if (hasHearing(day)) {
      // Format the date as YYYY-MM-DD for the filter without timezone conversion
      const year = currentYear;
      const month = String(currentMonth + 1).padStart(2, "0"); // currentMonth is 0-based
      const dayStr = String(day).padStart(2, "0");
      const dateString = `${year}-${month}-${dayStr}`;
      // Navigate to cases list with date filter using React Router
      navigate(`/cases?hearingDate=${dateString}`);
    }
  };

  const cardData = [
    {
      label: "Total Cases",
      value: counts.totalCases,
      color: "blue-1",
      link: "/cases",
      icon: <FaFolderOpen size={28} />,
    },
    {
      label: "Pending",
      value: counts.pending,
      color: "blue-2",
      link: "/cases",
      status: "Pending",
      icon: <FaHourglassHalf size={28} />,
    },
    {
      label: "Closed",
      value: counts.closed,
      color: "blue-3",
      link: "/cases",
      status: "Closed",
      icon: <FaCheckCircle size={28} />,
    },
    {
      label: "Report in Progress",
      value: counts.inProgress,
      color: "blue-4",
      link: "/cases",
      status: "In Progress",
      icon: <FaSpinner size={28} />,
    },
    {
      label: "Upcoming Cases",
      value: counts.upcoming,
      color: "blue-5",
      link: "/cases",
      filter: "upcoming",
      icon: <FaCalendarAlt size={28} />,
    },
    {
      label: "Departments",
      value: counts.departments,
      color: "blue-6",
      link: "/departments",
      icon: <FaLandmark size={28} />,
    },
    {
      label: "Designations",
      value: counts.designations,
      color: "blue-7",
      link: "/designations",
      icon: <FaUserTag size={28} />,
    },
    {
      label: "Courts",
      value: counts.courts,
      color: "blue-8",
      link: "/courts",
      icon: <FaBalanceScale size={28} />,
    },
    {
      label: "Judges",
      value: counts.judges,
      color: "blue-9",
      link: "/judges",
      icon: <FaGavel size={28} />,
    },
    {
      label: "Subject Matters",
      value: counts.subjectMatters,
      color: "blue-10",
      link: "/subject-matter",
      icon: <FaBook size={28} />,
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
      style={{ backgroundImage: `url(${NA_Logo})` }}
    >
      {/* Dashboard Title */}
      <h1 className="section-title">Dashboard</h1>
      <div className="dashboard-wrapper">
        {/* Card Grid */}
        <div className="dashboard">
          {cardData.map((card, index) => {
            const content = (
              <div className={`card ${card.color}`}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "left" }}>
                    <h3
                      style={{
                        marginLeft: 35,
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {card.value}
                    </h3>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "6px",
                    }}
                  >
                    {card.icon}
                    <p
                      style={{ margin: 0, fontWeight: "500", fontSize: "15px" }}
                    >
                      {card.label}
                    </p>
                  </div>
                </div>
              </div>
            );

            if (card.link) {
              let linkUrl = card.link;
              // Always use ?status= for filtering by status, robust for future
              if (card.status) {
                linkUrl += `?status=${encodeURIComponent(card.status)}`;
              } else if (card.filter === "upcoming") {
                // Get today's date in YYYY-MM-DD format
                const today = new Date();
                const todayStr = `${today.getFullYear()}-${String(
                  today.getMonth() + 1
                ).padStart(2, "0")}-${String(today.getDate()).padStart(
                  2,
                  "0"
                )}`;
                linkUrl += `?upcomingFrom=${todayStr}`;
              }

              return (
                <Link
                  key={index}
                  to={linkUrl}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {content}
                </Link>
              );
            } else {
              return <div key={index}>{content}</div>;
            }
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
              <div
                key={i}
                className={`calendar-day ${
                  hasHearing(i + 1) ? "hearing-date" : ""
                }`}
                onClick={() => handleDateClick(i + 1)}
                style={{
                  cursor: hasHearing(i + 1) ? "pointer" : "default",
                }}
              >
                <span>{i + 1}</span>
                {hasHearing(i + 1) && <div className="hearing-indicator"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
