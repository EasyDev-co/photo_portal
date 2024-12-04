import { useEffect, useState } from 'react';
import styles from './PaymentDiagram.module.css'
import { useSelector } from 'react-redux';
import { useCart } from '../../../contexts/CartContext';


const PaymentDiagram = ({ text, amount, label, bonus }) => {
    // const [count, setCount] = useState(0)
    const { totalPrice, updateTotalPrice } = useCart();
    const cart = useSelector(state => state.user.cart);

    useEffect(() => {
        try {
            const sumTotalPrice = cart?.reduce((sum, item) => {
                return sum + parseFloat(item.total_price);
            }, 0);
            updateTotalPrice(sumTotalPrice);
        } catch (error) {
            console.log(error)
        }
    }, [cart, updateTotalPrice]);
    return (
        <div className={styles.diagramWrap}>
            <span>{cart.length ? text : label}</span>
            <div className={styles.diagramCircle}>
                {cart.length ?
                    <>
                        <div className={styles.count}>{totalPrice ? `${totalPrice},00` : `${amount?.slice(0, amount.length - 3) ? amount?.slice(0, amount.length - 3) : 0},00`}</div>
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