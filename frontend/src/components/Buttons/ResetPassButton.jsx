import styles from './MainButton.module.css'

const ResetPassButton = ({value}) => {
    return ( 
        <button className={styles.resetButton}>{value}</button>
    );
}
 
export default ResetPassButton;