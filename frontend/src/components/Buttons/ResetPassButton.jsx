import styles from './MainButton.module.css'

const ResetPassButton = ({value,resetPassActive, setResetActive}) => {
    return ( 
        <button onClick={()=>setResetActive(true)}className={styles.resetButton}>{value}</button>
    );
}
 
export default ResetPassButton;