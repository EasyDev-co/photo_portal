import styles from './StatisticItem.module.css'

const StatisticItem = ({ label, data, isCopy, setIsCopy,timer }) => {
    return (
        <div className={timer ? styles.itemWrapTimer : styles.itemWrap}>
            <div className={styles.itemLabel}>{label}</div>
            <div className={styles.itemData}>{data}</div>
            {isCopy &&
                <div onClick={()=>setIsCopy(data)} className={styles.itemCopy}></div>
            }
        </div>
    );
}

export default StatisticItem;