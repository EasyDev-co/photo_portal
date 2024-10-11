/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import style from './Modal.module.css'
import danger from '../../assets/images/Auth/DangerCircle.svg'

const PaymentModal = ({ active, setActive, text }) => {
    return (
        <div className={active ? style.modal__active : style.modal} onClick={() => setActive(false)}>
            <div className={style.modal__content}>
                <div className={style.modal__text}>
                    <img src={danger} alt="" />
                    {text}
                </div>

            </div>
        </div>
    );
}

export default PaymentModal;