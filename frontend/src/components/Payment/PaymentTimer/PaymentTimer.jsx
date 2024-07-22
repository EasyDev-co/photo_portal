import { Link } from 'react-router-dom'
import PaymentButton from '../../Buttons/PaymentButton';
import PaymentDiagram from '../PaymentDiagram/PaymentDiagram';
import styles from './PaymentTimer.module.css'
import Timer from './Timer';
import { useEffect } from 'react';
import { fetchPhotoPriceWithTokenInterceptor } from '../../../http/getPhotoPrice';
import { useDispatch } from 'react-redux';
import { addPhotoPrice } from '../../../store/authSlice';

const PaymentTimer = ({cart, onSubmitHandler}) => {
    const accessStor = localStorage.getItem('access');
    const country = localStorage.getItem('regionName');
    const dispatch = useDispatch()
    useEffect(() => {
        fetchPhotoPriceWithTokenInterceptor(accessStor, country)
            .then(res => res.json())
            .then(res => {
                if (!res.detail) {
                    dispatch(addPhotoPrice(res))
                }
            })
            .catch(res=>{
                console.log(res)
            })
    }, [])
    return (
        <div className={styles.paymentTimerWrap}>
            <Timer
                date={'Sat Jun 30 2024 10:31:52 GMT+0300 (Moscow Standard Time)'}
                desc={':'}
            />
            <PaymentDiagram
                cart={cart}
            />
            {/* <Link to={'/payment'}>
               
            </Link> */}
            <PaymentButton
                onSubmitHandler={onSubmitHandler}
                value={'Оплатить'}
            />
        </div>
    );
}

export default PaymentTimer;