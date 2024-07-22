import { useEffect } from 'react';
import styles from './PaymentDiagram.module.css'

const PaymentDiagram = ({cart, count}) => {
    useEffect()
    return ( 
        <div className={styles.diagramWrap}>
            <span>Итого:</span>
            <div className={styles.diagramCircle}>
                <div className={styles.count}>{count},00</div>
                <span>рублей</span>
            </div>
        </div>
    );
}
 
export default PaymentDiagram;