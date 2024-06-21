import { Link } from 'react-router-dom'
import PaymentButton from '../../Buttons/PaymentButton';
import PaymentDiagram from '../PaymentDiagram/PaymentDiagram';
import styles from './PaymentTimer.module.css'
import Timer from './Timer';

const PaymentTimer = () => {
    return (
        <div className={styles.paymentTimerWrap}>
            <Timer
                date={'Sat Jun 22 2024 10:31:52 GMT+0300 (Moscow Standard Time)'}
                desc={':'}
            />
            <PaymentDiagram
                count={'3 500'}
            />
            <Link to={'/payment'}>
                <PaymentButton
                    value={'Оплатить'}
                />
            </Link>

        </div>
    );
}

export default PaymentTimer;