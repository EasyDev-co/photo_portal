import style from './Modal.module.css'
import danger from '../../assets/images/Auth/DangerCircle.svg'
const Modal = ({ active, setActive }) => {
    return (
        <div className={active ? style.modal__active : style.modal} onClick={() => setActive(false)}>
            <div className={style.modal__content}>
                <div className={style.modal__text}>
                    <img src={danger} alt="" />
                    <p>
                        Вы превысили лимит добавления детей. Если у вас четверо детей, то напишите нам на
                        <span> fotodetstvo1@yandex.ru </span>
                        и мы проверим информацию
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Modal;