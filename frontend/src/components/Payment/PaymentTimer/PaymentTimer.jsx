import { Link } from 'react-router-dom'
import PaymentButton from '../../Buttons/PaymentButton';
import PaymentDiagram from '../PaymentDiagram/PaymentDiagram';
import styles from './PaymentTimer.module.css'
import Timer from './Timer';

const PaymentTimer = ({count,onSubmitHandler,formId}) => {
    const addDays = 3;
    const date = new Date()
    
    return (
        <div className={styles.paymentTimerWrap}>
            <Timer
                date={date.setDate(date.getDate() + addDays)}
                desc={':'}
            />
            <PaymentDiagram
                count={count}
            />
            {/* <Link to={'/payment'}> */}
                <PaymentButton
                    formId={'orderForm'}
                    onSubmitHandler={onSubmitHandler}
                    value={'Оплатить'}
                />
            {/* </Link> */}

        </div>
    );
}

export default PaymentTimer;