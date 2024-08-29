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
    const [themeName, setPhotoTheme] = useState(localStorage.getItem('theme_name'))
    useEffect(() => {
        let timeInterval = setInterval(() => {
            const deadline = localStorage.getItem('deadline');
            setPhotoTheme(localStorage.getItem('theme_name'));
            const { total, days, hours, minutes } = getTimeRemaining(deadline)
            setTime({ days, hours, minutes });
            if (!deadline) {
                clearInterval(timeInterval);
            }
        }, 1000)
    }, [])

    return (
        <div className={styles.timerWidget}>
            <span className={styles.timerDesc}>
                Осталось времени на фотосессию: {themeName && `"${themeName}"`}
            </span>
            <div className={styles.timerWrap}>
                <div className={styles.timer}>
                    <div className={styles.timerTime}>{isNaN(time.days) ? 0 : time.days}</div>
                    <span>Дней</span>
                </div>
                <div className={styles.timer}>
                    <div className={styles.timerTime}>{isNaN(time.hours) ? 0 : time.hours}</div>
                    <span>Часов</span>
                </div>
                <div className={styles.timer}>
                    <div className={styles.timerTime}>{isNaN(time.minutes) ? 0 : time.minutes}</div>
                    <span>Минут</span>
                </div>
            </div>
        </div>
    );
}

export default Timer;