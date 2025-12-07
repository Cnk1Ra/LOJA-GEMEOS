'use client';

import { useState, useEffect } from 'react';

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 14,
    minutes: 10,
    seconds: 11
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;

        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          days = 0;
          hours = 0;
          minutes = 0;
          seconds = 0;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-[#7fffd4] py-2 px-4">
      <div className="flex items-center justify-center gap-2 text-gray-800">
        <span className="text-xl">⏳</span>
        <div className="flex items-center gap-1 font-bold text-lg">
          <span>{formatNumber(timeLeft.days)}</span>
          <span className="text-gray-600">d</span>
          <span className="mx-1">:</span>
          <span>{formatNumber(timeLeft.hours)}</span>
          <span className="text-gray-600">h</span>
          <span className="mx-1">:</span>
          <span>{formatNumber(timeLeft.minutes)}</span>
          <span className="text-gray-600">m</span>
          <span className="mx-1">:</span>
          <span>{formatNumber(timeLeft.seconds)}</span>
          <span className="text-gray-600">s</span>
        </div>
      </div>
    </div>
  );
}
