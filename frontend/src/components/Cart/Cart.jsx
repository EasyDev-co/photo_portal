/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import styles from './Cart.module.css'
import { convertDate } from './utils';
import PaymentDiagram from '../Payment/PaymentDiagram/PaymentDiagram';
import { useBlocker, useLocation, useNavigate } from 'react-router-dom';
import { fetchGetCartWithTokenInterceptor } from '../../http/cart/getCart';
import { fetchCartDeleteWithTokenInterceptor } from '../../http/cart/cartDelete';
import PaymentModal from '../Modal/PaymentModal';
import { paymentCreate } from '../../http/fetchPayment';
import Modal from '../Modal/Modlal';
import { setCart } from '../../store/authSlice';
import { useDispatch } from 'react-redux';

const Cart = () => {

    const location = useLocation();
    const accessStor = localStorage.getItem('access');
    const { amount, id } = location.state;
    const [value, setValue] = useState(false);
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(false);
    const [order, setOrder] = useState({})
    const [errModal, setErrModal] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const dispatch = useDispatch();
    let blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            !value &&
            currentLocation.pathname !== nextLocation.pathname &&
            nextLocation.pathname !== '/orders/payment'
    );

    function errModalActive(errMessage) {
        setErrModal(true)
        setErrMessage(errMessage)
    }
    useEffect(() => {
        console.log('order in cart', order)
    }, [order])
    const deleteCartItem = () => {
        setActiveModal(false);
        if (!value) {
            try {
                fetchCartDeleteWithTokenInterceptor(accessStor, id)
                    .then(res => {
                        if (res.ok) {
                            setOrder({});
                            dispatch(setCart([]))
                            localStorage.setItem('cart', JSON.stringify([]));
                            console.log('корзина почищена')
                            setValue(true);
                            if (blocker.location) {
                                blocker.proceed();
                            }
                        }
                    })
                    .then(() => {
                        setTimeout(() => {
                            try {
                                if (blocker.location.pathname === '/sign-in') {
                                    navigate('/sign-in');
                                    localStorage.clear();
                                    window.location.reload();
                                    console.log('корзина почищена2')
                                    return;
                                }
                            } catch (error) {
                                console.log(error)
                            }
                            navigate('/orders');
                            localStorage.setItem('cart', JSON.stringify([]));
                            window.location.reload();
                            localStorage.setItem('cart', JSON.stringify([]));
                            dispatch(setCart([]))
                            console.log('корзина почищена3')
                        }, 100)
                    })

            } catch (error) {
                blocker.proceed();
                console.error("Ошибка при удалении элемента корзины:", error);
            }
        }

    };
    const payCartItem = () => {
        try {
            paymentCreate(accessStor, id)
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(res => {
                                window.location.href = res;
                            })
                    } else {
                        res.json()
                            .then(res => {
                                errModalActive(res);
                                console.log(res)
                            })
                    }
                })
        } catch (error) {
            console.log(error)
        }
        setValue(true);
    }

    useEffect(() => {
        if (!value) {
            try {
                fetchGetCartWithTokenInterceptor(accessStor, id)
                    .then(res => {
                        if (res.ok) {
                            res.json()
                                .then(res => setOrder(res))
                                console.log(res)
                        }
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }, [accessStor, id, value]);

    useEffect(() => {
        blocker.location ? setActiveModal(true) : setActiveModal(false);
    }, [blocker]);

    return (
        <div className={styles.ordersWrap}>
            <h1 className={styles.profileTitle}>
                Корзина
            </h1>
            <div className={styles.cartContainer}>

                <Modal
                    active={errModal}
                    setActive={setErrModal}
                    text={errMessage}
                />
                <PaymentModal
                    active={activeModal}
                    setActive={setActiveModal}
                    blocker={blocker}
                    text={<div>
                        <p>Если вы покинете эту страницу, ваш заказ не сохранится!</p>
                        <div className={styles.btnWrap}>
                            <button className={styles.mainButton} onClick={() => blocker.reset()}>
                                Продолжить
                            </button>
                            <button className={styles.resetButton} onClick={() => blocker.location ? deleteCartItem() : blocker.proceed()}>
                                Покинуть
                            </button>
                        </div>
                    </div>}
                />
                <div className={styles.cartWrap}>
                    {order.orders?.map((elem, i) => {
                        return (
                            <div key={i} className={styles.cartBlock}>
                                <div className={styles.orderHeader}>
                                    Заказ от {convertDate(elem.created)} "{elem.photo_theme}"
                                </div>
                                {elem.order_items?.map((el, _i) => {
                                    return (
                                        <div key={_i} className={styles.orderInfo}>
                                            <div className={styles.orderCartInfo}>
                                                <div>
                                                    {el.photo_type} ({el.amount})шт
                                                </div>
                                                {el.photo_number && <div className={styles.photoNumber}>№{el.photo_number}</div>}
                                            </div>

                                            <div>
                                                {el.price} р
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                    {order.id &&
                        <div className={styles.btnWrap}>
                            <button onClick={() => deleteCartItem()} className={styles.deleteButton}>Удалить</button>
                            <button onClick={() => payCartItem()} className={styles.mainButton}>Оплатить</button>
                        </div>
                    }
                    
                </div>
                <div className={styles.diagramContainer}>
                    <PaymentDiagram amount={amount} />
                </div>
            </div>
        </div>
    );
}

export default Cart;