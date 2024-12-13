/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from './StatisticItem.module.css'

const StatisticItem = ({ label, data, isCopy, setIsCopy,timer }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(data) // Копируем текст в буфер обмена
    };

    return (
        <div className={timer ? styles.itemWrapTimer : styles.itemWrap}>
            <div className={styles.itemLabel}>{label}</div>
            <div className={styles.itemData}>{data}</div>
            {isCopy &&
                <div onClick={handleCopy} className={styles.itemCopy}></div>
            }
        </div>
    );
}

export default StatisticItem;