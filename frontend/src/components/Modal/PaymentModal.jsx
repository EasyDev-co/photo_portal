import style from './Modal.module.css'
import danger from '../../assets/images/Auth/DangerCircle.svg'

const PaymentModal = ({active, setActive,blocker, text}) => {
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