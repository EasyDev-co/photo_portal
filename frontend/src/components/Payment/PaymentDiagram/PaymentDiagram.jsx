import { useEffect, useState } from 'react';
import styles from './PaymentDiagram.module.css'

const PaymentDiagram = ({cart}) => {
    const [count, setCount] = useState(0)
    useEffect(() => {
        const sumTotalPrice = cart.reduce((sum, item) => {
            // console.log(parseFloat(item.total_price))
            return sum + parseFloat(item.total_price);
        }, 0);
        setCount(sumTotalPrice);
    }, [cart]);
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