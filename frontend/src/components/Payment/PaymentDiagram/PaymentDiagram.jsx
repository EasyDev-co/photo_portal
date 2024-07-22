import { useEffect, useState } from 'react';
import styles from './PaymentDiagram.module.css'
import { useSelector } from 'react-redux';

const PaymentDiagram = () => {
    const [count, setCount] = useState(0)
    const cart = useSelector(state=>state.user.cart)
    useEffect(() => {
        const sumTotalPrice = cart.reduce((sum, item) => {
            // console.log(parseFloat(item.total_price))
            return sum + parseFloat(item.total_price);
        }, 0);
        setCount(sumTotalPrice);
    }, [cart]);
    return ( 
        <div className={styles.diagramWrap}>
            <span></span>
            <div className={styles.diagramCircle}>
                <div className={styles.count}>{count},00</div>
                <span>рублей</span>
            </div>
        </div>
    );
}
 
export default PaymentDiagram;