import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { CheckinData, Language } from '../types';
import { useTranslation } from '../utils/i18n';

interface CalendarWidgetProps {
  checkins: CheckinData[];
  glassEffect: boolean;
  animations: boolean;
  language: Language;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ checkins, glassEffect, animations, language }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const t = useTranslation(language);

  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();

    const days = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayIndex; i++) {
      const prevDate = new Date(currentYear, currentMonth, -firstDayIndex + i + 1);
      days.push(
        <div key={`prev-${i}`} className="calendar-day other-month">
          {prevDate.getDate()}
        </div>
      );
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = 
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();
      
      const isCheckedIn = checkins.some(checkin => {
        const checkinDate = new Date(checkin.date);
        return (
          checkinDate.getDate() === day &&
          checkinDate.getMonth() === currentMonth &&
          checkinDate.getFullYear() === currentYear
        );
      });

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isCheckedIn ? 'checked-in' : ''} ${animations ? 'animated-day' : ''}`}
        >
          {day}
          {isCheckedIn && <div className="checkin-indicator">✓</div>}
        </div>
      );
    }

    return days;
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const getMonthNames = () => {
    if (language === 'en') {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    return [t.january, t.february, t.march, t.april, t.may, t.june, t.july, t.august, t.september, t.october, t.november, t.december];
  };

  const getWeekdayNames = () => {
    if (language === 'en') {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }
    return [t.sunday, t.monday, t.tuesday, t.wednesday, t.thursday, t.friday, t.saturday];
  };

  const monthNames = getMonthNames();
  const weekdayNames = getWeekdayNames();

  return (
    <div className={`calendar-widget ${glassEffect ? 'glass-calendar' : 'solid-calendar'}`}>
      <div className="calendar-header">
        <div className="calendar-title">
          {language === 'en' 
            ? `${monthNames[currentMonth]} ${currentYear}`
            : `${currentYear}年${monthNames[currentMonth]}`
          }
        </div>
        <div className="calendar-nav">
          <button 
            className={`calendar-nav-btn ${animations ? 'animated-btn' : ''}`} 
            onClick={goToPrevMonth}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            className={`calendar-nav-btn ${animations ? 'animated-btn' : ''}`} 
            onClick={goToToday}
          >
            {t.today}
          </button>
          <button 
            className={`calendar-nav-btn ${animations ? 'animated-btn' : ''}`} 
            onClick={goToNextMonth}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {weekdayNames.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      <div className="calendar-days">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default CalendarWidget;