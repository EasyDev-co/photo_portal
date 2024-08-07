import styles from './MainButton.module.css'

const ResetPassButton = ({value,resetPassActive, setResetActive, setCodeWindow}) => {
    const onResetActive = () =>{
        setResetActive(true)
    }
    return ( 
        <button onClick={()=>onResetActive()}className={styles.mainButton}>{value}</button>
    );
}
 
export default ResetPassButton;