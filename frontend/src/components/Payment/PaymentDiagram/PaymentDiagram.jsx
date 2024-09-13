import { useEffect, useState } from 'react';
import styles from './PaymentDiagram.module.css'
import { useSelector } from 'react-redux';


const PaymentDiagram = ({text, amount}) => {
    const [count, setCount] = useState(0)
    const cart = useSelector(state=>state.user.cart);

    useEffect(() => {
        try {
            const sumTotalPrice = cart?.reduce((sum, item) => {
                return sum + parseFloat(item.total_price);
            }, 0);
            setCount(sumTotalPrice);
        } catch (error) {
            console.log(error)
        }
        
    }, [cart]);
    return ( 
        <div className={styles.diagramWrap}>
            <span>{text}</span>
            <div className={styles.diagramCircle}>
                <div className={styles.count}>{count ? `${count},00` : `${amount?.slice(0, amount.length - 3) ? amount?.slice(0, amount.length - 3) : 0 },00`}</div>
                <span>рублей</span>
            </div>
        </div>
    );
}
 
export default PaymentDiagram;