import { useEffect, useState } from 'react';
import styles from './PaymentDiagram.module.css'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PaymentDiagram = ({text}) => {
    const [count, setCount] = useState(0)
    const navigate = useNavigate();
    const cart = useSelector(state=>state.user.cart);
    const total_price = useSelector(state=>state.user.total_price);
    // console.log(total_price)
    // console.log(cart)
    useEffect(() => {
        try {
            const sumTotalPrice = cart?.reduce((sum, item) => {
                // console.log(parseFloat(item.total_price))
                return sum + parseFloat(item.total_price);
            }, 0);
            setCount(sumTotalPrice);
        } catch (error) {
        }
        
    }, [cart]);
    return ( 
        <div className={styles.diagramWrap}>
            <span>{text}</span>
            <div className={styles.diagramCircle}>
                <div className={styles.count}>{count},00</div>
                <span>рублей</span>
            </div>
        </div>
    );
}
 
export default PaymentDiagram;