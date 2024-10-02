import { useEffect, useState } from 'react';
import styles from './PaymentDiagram.module.css'
import { useSelector } from 'react-redux';


const PaymentDiagram = ({ text, amount, label, bonus }) => {
    const [count, setCount] = useState(0)
    const cart = useSelector(state => state.user.cart);
    console.log(cart)
    useEffect(() => {
        try {
            const sumTotalPrice = cart?.reduce((sum, item) => {
                return sum + parseFloat(item.total_price);
            }, 0);
            setCount(sumTotalPrice);
        } catch (error) {
        }
    }, [cart]);
    return (
        <div className={styles.diagramWrap}>
            <span>{cart.length ? text : label}</span>
            <div className={styles.diagramCircle}>
                {cart.length ?
                    <>
                        <div className={styles.count}>{count ? `${count},00` : `${amount?.slice(0, amount.length - 3) ? amount?.slice(0, amount.length - 3) : 0},00`}</div>
                        <span>рублей</span>
                    </> :
                    <>
                    <div className={styles.count}>{bonus}</div>
                    <span>рублей</span>
                </>
                }

            </div>
        </div>
    );
}

export default PaymentDiagram;