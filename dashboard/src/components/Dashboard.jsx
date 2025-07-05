import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import '../App.css';

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const Dashboard = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [counts, setCounts] = useState({
    courts: 0,
    judges: 0,
    subjectMatters: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/summary/counts');
      setCounts(res.data);
    } catch (error) {
      console.error('Error fetching summary counts:', error);
    }
  };

  const cardData = [
    { label: "Total Cases", value: 120, color: "blue" },
    { label: "Pending", value: 35, color: "yellow" },
    { label: "Closed", value: 70, color: "green" },
    { label: "In Progress", value: 15, color: "purple" },
    { label: "Upcoming Cases", value: 1, color: "blue" },
    { label: "Critical Cases", value: 0, color: "purple" },
    { label: "Upcoming Tasks", value: 0, color: "yellow" },
    { label: "Total No Of Courts", value: counts.courts, color: "green", link: "/courts" },
    { label: "Total No of Judges", value: counts.judges, color: "blue", link: "/judges" },
    { label: "Total No of Subject Matter", value: counts.subjectMatters, color: "purple", link: "/subject-matter" },
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4721/4721081.png"
                    alt="icon"
                    style={{ width: '28px', height: '28px' }}
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
                style={{ textDecoration: 'none', color: 'inherit' }}
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
            <span>{monthNames[currentMonth]} {currentYear}</span>
            <button onClick={handleNext}>→</button>
          </div>
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <div key={idx} className="calendar-day-label">{day}</div>
            ))}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} className="calendar-day empty"></div>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => (
              <div key={i} className="calendar-day">{i + 1}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
