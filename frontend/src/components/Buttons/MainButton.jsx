import styles from './MainButton.module.css'

const MainButton = ({value,isReset, setResetActive}) => {
    return ( 
      <button onClick={()=> isReset && setResetActive(true)} className={styles.mainButton}>{value}</button>
    );
}
 
export default MainButton;