import styles from './MainButton.module.css'

const MainButton = ({value}) => {
    return ( 
      <button className={styles.mainButton}>{value}</button>
    );
}
 
export default MainButton;