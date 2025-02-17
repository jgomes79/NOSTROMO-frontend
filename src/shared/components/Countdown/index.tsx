import React, { useEffect, useState } from "react";

/**
 * Props for the Countdown component.
 */
interface CountdownProps {
  /**
   * The target date for the countdown.
   */
  readonly date: Date;
  /**
   * A function that receives the time left and returns a JSX element.
   */
  readonly children: (timeLeft: { days: number; hours: number; minutes: number; seconds: number }) => JSX.Element;
}

/**
 * Countdown component that calculates the time left until a specified date.
 *
 */
export const Countdown: React.FC<CountdownProps> = ({ date, children }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(date) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return <div>{children(timeLeft)}</div>;
};
