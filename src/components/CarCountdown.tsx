import { useState, useEffect } from "react";

const CarCountdown = ({ availableUntil }: { availableUntil: string }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime(); // Current timestamp
    const targetDate = new Date(availableUntil).getTime(); // Convert availableUntil to timestamp

    const difference = targetDate - now;

    if (difference <= 0) {
      return { expired: true }; // The car is no longer available
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [availableUntil]);

  return (
    <div>
      {timeLeft.expired ? (
        <span className="text-red-500">Expired</span>
      ) : (
        <span className="text-slate-300 font-bold">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
          {timeLeft.seconds}s
        </span>
      )}
    </div>
  );
};

export default CarCountdown;
