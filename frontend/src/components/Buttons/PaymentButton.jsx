import styles from './MainButton.module.css'

const PaymentButton = ({value}) => {
    return ( 
        <button className={styles.paymentButton}>{value}</button>
    );
}
 
export default PaymentButton;