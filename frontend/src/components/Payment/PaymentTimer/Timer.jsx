import { useEffect, useState } from "react";
import { getTimeRemaining } from "./utils";
import styles from './PaymentTimer.module.css'
const Timer = ({ date, desc }) => {

    const [time, setTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        let timeInterval = setInterval(() => {
            const { total, days, hours, minutes } = getTimeRemaining(date)
            setTime({ days, hours, minutes })
            if (total <= 0) {
                clearInterval(timeInterval);
            }
        }, 1000)
    }, [time])
    
    return (
        <div className={styles.timerWidget}>
            <span className={styles.timerDesc}>
                Осталось времени{desc}
            </span>

            <div className={styles.timerWrap}>
                <div className={styles.timer}>
                    <div className={styles.timerTime}>{time.days}</div>
                    <span>Дней</span>
                </div>
                <div className={styles.timer}>
                    <div className={styles.timerTime}>{time.hours}</div>
                    <span>Часов</span>
                </div>
                <div className={styles.timer}>
                    <div className={styles.timerTime}>{time.minutes}</div>
                    <span>Минут</span>
                </div>
            </div>
        </div>
    );
}

export default Timer;