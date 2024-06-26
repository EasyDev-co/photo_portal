import { Link } from 'react-router-dom'
import PaymentButton from '../../Buttons/PaymentButton';
import PaymentDiagram from '../PaymentDiagram/PaymentDiagram';
import styles from './PaymentTimer.module.css'
import Timer from './Timer';

const PaymentTimer = ({count,onSubmitHandler,formId}) => {
    return (
        <div className={styles.paymentTimerWrap}>
            <Timer
                date={'Sat Jun 22 2024 10:31:52 GMT+0300 (Moscow Standard Time)'}
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