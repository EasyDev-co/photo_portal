import style from './Modal.module.css'

const Modal = ({ active, setActive }) => {
    return (
        <div className={active ? style.modal__active : style.modal} onClick={() => setActive(false)}>
            <div className={style.modal__content}>
                Вы достигли лимита, если у вас четверо детей , обратитесь к администратору
            </div>
        </div>
    );
}

export default Modal;