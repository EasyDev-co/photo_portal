/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from "./ManagerProfile.module.css";
// import PaymentTimer from "../../Payment/PaymentTimer/PaymentTimer";
import StatisticItem from "./StatisticItem";
import {useEffect, useState} from "react";
import PaymentDiagram from "../../Payment/PaymentDiagram/PaymentDiagram";
import Timer from "../../Payment/PaymentTimer/Timer";
import MainButton from "../../Buttons/MainButton";
import Dropdown from "./Dropdown/Dropdown";
import {fetchGetStatsWithTokenInterceptor, getStats} from "../../../http/gallerey/getStats";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {getNearestDate} from "../../Orders/utils/utils";
import {fetchPhotoLineListWithTokenInterceptor} from "../../../http/photo/photoLineList";
import {managerBonus} from "../../../http/gallerey/managerBonus";
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import {EffectFlip, Pagination, Navigation} from 'swiper/modules';
import { getPromocode } from "../../../http/getPromocode";
import ClientModal from "../../../components-crm/ClientCardModal/ClientModal";
import { getOrdersManager } from "../../../http/order/getOrdersManager";

const ManagerProfile = () => {
    const [copy, setIsCopy] = useState('');
    const accessStor = localStorage.getItem('access');
    const navigate = useNavigate()
    const [bonus, setBonus] = useState([])
    const [promocode, setPromocode] = useState('');
    const [isOpen, setIsOpen] = useState(false)
    const refresh = useSelector((state) => state.user.refresh)
    // const kindergartenId = useSelector(state => state.user.kindergarten_id)
    const photoLineId = useSelector(state => state.user.photoLineId)
    const photoThemeId = localStorage.getItem('theme_id')
    const kindergartenId = localStorage.getItem('kindergarten_id')
    const [orderList, setOrderList] = useState([])
    const [hasPhotoTheme, setHasPhotoTheme] = useState(true)
    
    const [stats, setStats] = useState({
            current_stats: {
                total_orders: 0,
                completed_orders: 0,
                average_order_value: "0.00",
                total_amount: "0.00"
            },
            past_stats: [
                {
                    kindergarten: {
                        id: "",
                        region: {
                            id: "",
                            country: "",
                            name: ""
                        },
                        name: ""
                    },
                    photo_theme: {
                        id: "",
                        name: "У детского сада не было фотосессий",
                        date_start: "",
                        date_end: ""
                    },
                    ransom_amount: 0
                }
            ],
            total_ransom_amount: 0,
            average_ransom_amount: 0.0
        }
    );

    const handleShowModal = () => {
        setIsOpen(true)
        // console.log(photoLineId)
      }
      const handleCloseModal = () => {
        setIsOpen(false)
      }

    useEffect(() => {
        try {
            fetchPhotoLineListWithTokenInterceptor(accessStor, '')
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(data => {
                                console.log(data)
                                getNearestDate(data);
                            })
                    }
                })
        } catch (error) {
            console.log(error)
        }

    }, [accessStor])

    useEffect(() => {
        try {
            getStats(accessStor)
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(res => {
                                console.log(res)
                                setStats(res)
                            })
                    }
                })
        } catch (error) {
            console.log(error)
        }

    }, [])

    useEffect(() => {
        try {
            managerBonus(accessStor)
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(res => {
                                setBonus(res)
                            })
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        try {
            getPromocode(accessStor)
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(res => {
                                setPromocode(res)
                            })
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        if (photoThemeId !== 'Нет активной фототемы') {
            const fetchOrders = async () => {
                try {
                    const response = await getOrdersManager(photoThemeId, kindergartenId, accessStor);
                    if (response.ok) {
                        const data = await response.json();
                        setOrderList(data?.orders || []); // Устанавливаем orders или пустой массив, если data.orders отсутствует
                    } else {
                        console.error('Ошибка при получении заказов:', response.statusText);
                    }
                } catch (error) {
                    console.error('Ошибка при выполнении запроса:', error);
                }
            };
    
            fetchOrders(); // Вызываем асинхронную функцию
        } else {
            setHasPhotoTheme(false); // Если фототемы нет, обновляем состояние
        }
    }, [photoThemeId, kindergartenId, accessStor])

    return (
        <div className={styles.profileWrap}>
            <ClientModal
                title="Список оплаченных заказов"
                show={isOpen}
                handleClose={handleCloseModal}
            >
                <div style={{marginBottom: '10px'}}>
                    <div style={{marginBottom: '15px', fontWeight: 'bold'}} className={styles.grid}>
                        <p>Имя Фамилия</p>
                        <p>Сумма</p>
                        <p>ID платежа</p>
                    </div>
                    {orderList.length === 0 ? (
                        <p>Нет оплаченных заказов</p>
                    ) : (
                        <ul className={styles.orders_block}>
                            {orderList.map((item, index) => (
                                <li className={styles.grid} key={index}>
                                    <p>{item.user_last_name} {item.user_first_name}</p>
                                    <p>{item.order_price}</p>
                                    <p>{item.payment_id}</p>
                                </li>
                            ))}
                        </ul>
                )}
            </div>
            </ClientModal>
            <div className={styles.profileWidgetWrap}>
                <h1 className={styles.profileTitle}>Статистика</h1>
                <div className={styles.cuurent}>
                    <h3 className={styles.cuurentTitle}>Текущая фотосессия</h3>
                <div className={styles.profileWidget}>
                    <StatisticItem
                        label="Количество заказов"
                        data={`${stats?.current_stats?.completed_orders ?? 0} из ${stats?.current_stats?.total_orders ?? 0}`}
                        current={true}
                    />

                    {/*<StatisticItem*/}
                    {/*    label={'Количество заказов'}*/}
                    {/*    data={`${stats.current_stats.completed_orders ? stats.current_stats.completed_orders : '0'} из ${stats.current_stats.total_orders}`}*/}
                    {/*/>*/}
                    <StatisticItem
                        setIsCopy={setIsCopy}
                        isCopy
                        label={'Промо-код для сотрудников'}
                        data={promocode.code}
                        current={true}
                    />
                    <StatisticItem
                        label={'Средний чек, руб'}
                        data={stats?.current_stats?.average_order_value ?? 0}
                        current={true}
                    />
                    <StatisticItem
                        label={'Сумма выкупа, руб'}
                        data={stats?.current_stats?.total_amount ?? 0}
                        current={true}
                    />
                </div>
                </div>
                {stats.past_stats && Array.isArray(stats.past_stats) && stats.past_stats.length > 0 && (
                    <div >
                        {stats.past_stats.map((item, index) => (
                            <div className={styles.profileWidget} key={index}>
                                <StatisticItem
                                    key={index}
                                    label={`Тема фотосессии`}
                                    data={item.photo_theme.name}
                                />
                                <StatisticItem
                                    key={index}
                                    label={`Сумма выкупа за ${item.photo_theme.name}`}
                                    data={item.ransom_amount}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div className={styles.profileWidget}>
                    <StatisticItem
                        label={'Итого за все фотосессии руб.'}
                        data={`${stats.total_ransom_amount}`}
                    />
                    <StatisticItem
                        label={'Средняя выручка за все фотосессии'}
                        data={`${stats.average_ransom_amount}`}
                    />
                </div>
                {!hasPhotoTheme && <p style={{marginBottom: '20px'}}>Нет активной фотосессии</p>}
                <div className={styles.checkWrap}>
                    <div onClick={() => navigate('/orders_manager')}>
                        <MainButton
                            value={'Заказ для себя'}
                        />
                    </div>
                    <div onClick={handleShowModal}>
                        <MainButton
                            value={'Оплаченные заказы'}
                        />
                    </div>

                </div>
            </div>

            {bonus.length !== 0 &&
                <div className={styles.paymentTimerWrap}>
                    <Swiper
                        effect={'flip'}
                        grabCursor={true}
                        navigation={true}
                        modules={[EffectFlip, Pagination, Navigation]}
                        className="mySwiper"
                    >
                        {bonus?.map(elem => {
                            return (
                                <SwiperSlide key={elem.id} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '80px'
                                }}>
                                    <PaymentDiagram
                                        count={'3 500'}
                                        label={'Ваш бонус:'}
                                        bonus={elem.total_bonus}
                                    />
                                    <StatisticItem
                                        timer
                                        label={'Итого'}
                                        data={stats.current_stats.total_amount}
                                    />
                                    <Timer
                                        isStats
                                        date={elem.photo_theme.date_end}
                                        desc={elem.photo_theme.name}
                                    />
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            }
        </div>

    );
}

export default ManagerProfile;