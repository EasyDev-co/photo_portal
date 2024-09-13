import styles from "./Payment.module.css";

const PaymentItem = ({ src, label, id, selectedOption, handleOptionClick}) => {
    return (
        <div className={styles.paymentItemLinkWrap}>
            <div>
                <img className={styles.paymentImg} src={src} alt="" />
            </div>
        </div>
    );
}

export default PaymentItem;