import { Link } from 'react-router-dom'
import PaymentButton from '../../Buttons/PaymentButton';
import PaymentDiagram from '../PaymentDiagram/PaymentDiagram';
import styles from './PaymentTimer.module.css'
import Timer from './Timer';
import { useEffect } from 'react';
import { fetchPhotoPriceWithTokenInterceptor } from '../../../http/photo/getPhotoPrice';
import { useDispatch } from 'react-redux';
import { addPhotoPrice } from '../../../store/authSlice';

const PaymentTimer = ({onSubmitHandler, payOrder}) => {
    const accessStor = localStorage.getItem('access');
    const country = localStorage.getItem('regionName');
    const dispatch = useDispatch();
    
    useEffect(() => {
        fetchPhotoPriceWithTokenInterceptor(accessStor, country)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (!res.detail) {
                    dispatch(addPhotoPrice(res))
                }
            })
            .catch(res=>{
                console.log(res)
            })
    }, [])
    const rootClassName = location.pathname === '/orders' 
        ? styles.paymentTimerWrap_orders 
        : styles.paymentTimerWrap;
    return (
        <div 
            className={rootClassName}
        >
            <Timer
                date={'Sat Jun 30 2024 10:31:52 GMT+0300 (Moscow Standard Time)'}
                desc={':'}
            />
            <PaymentDiagram
                bonus={'00,0'}
            />
            <PaymentButton
                payOrder={payOrder}
                onSubmitHandler={onSubmitHandler}
                value={'Перейти к оплате'}
            />
        </div>
    );
}

export default PaymentTimer;