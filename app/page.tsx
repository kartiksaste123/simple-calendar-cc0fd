'use client'

import { useState, useEffect } from 'react'

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday: boolean
  hasEvent?: boolean
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const generateCalendarDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()
    
    const today = new Date()
    const isCurrentMonth = (dayDate: Date) => 
      dayDate.getMonth() === month && dayDate.getFullYear() === year
    
    const days: CalendarDay[] = []
    
    // Previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({
        date: prevDate.getDate(),
        isCurrentMonth: false,
        isToday: false
      })
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day)
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday: dayDate.toDateString() === today.toDateString(),
        hasEvent: Math.random() > 0.8 // Random events for demo
      })
    }
    
    // Next month's leading days
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false
      })
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDayClick = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date)
      setSelectedDate(clickedDate)
    }
  }

  const calendarDays = generateCalendarDays(currentDate)
  const currentMonth = MONTHS[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Simple Calendar
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Beautiful and responsive calendar interface
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
          >
            {darkMode ? (
              <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Calendar Container */}
        <div className="animate-fade-in rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:bg-gray-800/80 sm:p-8">
          {/* Calendar Header */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentMonth} {currentYear}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="mb-4 grid grid-cols-7 gap-1">
            {DAYS.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isSelected = selectedDate && 
                selectedDate.getDate() === day.date &&
                selectedDate.getMonth() === currentDate.getMonth() &&
                selectedDate.getFullYear() === currentDate.getFullYear() &&
                day.isCurrentMonth

              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`relative aspect-square rounded-lg p-2 text-center text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    day.isCurrentMonth
                      ? 'text-gray-900 hover:bg-blue-50 dark:text-white dark:hover:bg-gray-700'
                      : 'text-gray-400 dark:text-gray-600'
                  } ${
                    day.isToday
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : ''
                  } ${
                    isSelected && !day.isToday
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                      : ''
                  }`}
                >
                  <span className="relative z-10">{day.date}</span>
                  {day.hasEvent && (
                    <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-orange-400" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Selected Date Info */}
          {selectedDate && (
            <div className="mt-6 animate-slide-up rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-900/20 dark:to-purple-900/20">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Selected Date
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}