import styles from './MainButton.module.css'

const PaymentButton = ({value, onSubmitHandler,formId}) => {
    return ( 
        <button form={formId} type='submit' onClick={(e)=>onSubmitHandler(e)} className={styles.paymentButton}>{value}</button>
    );
}
 
export default PaymentButton;