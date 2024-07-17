import styles from './PaymentDiagram.module.css'

const PaymentDiagram = ({count, label}) => {
    return ( 
        <div className={styles.diagramWrap}>
            <span>{label}</span>
            <div className={styles.diagramCircle}>
                <div className={styles.count}>{count},00</div>
                <span>рублей</span>
            </div>
        </div>
    );
}
 
export default PaymentDiagram;