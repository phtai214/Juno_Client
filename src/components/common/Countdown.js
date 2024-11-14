import React, { useEffect, useState } from 'react';
import '../../style/components/common/Countdown.scss'
const Countdown = ({ targetDate }) => {
    const [timeRemaining, setTimeRemaining] = useState({});

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(countdownInterval);
                setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeRemaining({ hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(countdownInterval); // Cleanup on unmount
    }, [targetDate]);

    return (
        <div className="countdown">
            <p>
                <span className="countdown-item">{`${timeRemaining.hours}`}</span>
                <span className="countdown-item">{`${timeRemaining.minutes}`}</span>
                <span className="countdown-item">{`${timeRemaining.seconds}`}</span>
            </p>
        </div>
    );
};

export default Countdown;
