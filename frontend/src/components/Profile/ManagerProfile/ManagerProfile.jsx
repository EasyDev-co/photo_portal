/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from "./ManagerProfile.module.css";
// import PaymentTimer from "../../Payment/PaymentTimer/PaymentTimer";
import StatisticItem from "./StatisticItem";
import { useEffect, useState } from "react";
import PaymentDiagram from "../../Payment/PaymentDiagram/PaymentDiagram";
import Timer from "../../Payment/PaymentTimer/Timer";
import MainButton from "../../Buttons/MainButton";
import Dropdown from "./Dropdown/Dropdown";
import { fetchGetStatsWithTokenInterceptor, getStats } from "../../../http/gallerey/getStats";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getNearestDate } from "../../Orders/utils/utils";
import { fetchPhotoLineListWithTokenInterceptor } from "../../../http/photo/photoLineList";
import { managerBonus } from "../../../http/gallerey/managerBonus";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/pagination';
import 'swiper/css/navigation';



// import required modules
import { EffectFlip, Pagination, Navigation } from 'swiper/modules';

const ManagerProfile = () => {
    const [copy, setIsCopy] = useState('');
    const accessStor = localStorage.getItem('access');
    const navigate = useNavigate()
    const [bonus, setBonus] = useState([])
    const [stats, setStats] = useState({
        current_stats: {
            total_orders: 0,
            completed_orders: 0,
            average_order_value: "0.00",
            total_amount: "0.00"
        }
    }
    );

    useEffect(() => {
        try {
            fetchPhotoLineListWithTokenInterceptor(accessStor, '')
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(data => {
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
                                console.log(res)
                            })
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }, [])
    return (
        <div className={styles.profileWrap}>
            <div className={styles.profileWidgetWrap}>
                <h1 className={styles.profileTitle}>Статистика</h1>
                <div className={styles.profileWidget}>
                    <StatisticItem
                        label={'Количество заказов'}
                        data={`${stats.current_stats.completed_orders} из ${stats.current_stats.total_orders}`}
                    />
                    <StatisticItem
                        setIsCopy={setIsCopy}
                        isCopy
                        label={'Промо-код для сотрудников'}
                        data={'code20'}
                    />
                    <StatisticItem
                        label={'Средний чек, руб'}
                        data={stats.current_stats.average_order_value}
                    />
                </div>
                <div className={styles.profileWidget}>
                    <StatisticItem
                        label={'Итого руб.'}
                        data={`${stats.current_stats.completed_orders} из ${stats.current_stats.total_orders}`}
                    />
                    <StatisticItem
                        label={'Средний чек руб.'}
                        data={'0.0'}
                    />
                </div>
                <div className={styles.checkWrap}>
                    <div onClick={() => navigate('/orders_manager')}>
                        <MainButton
                            value={'Заказ для себя'}
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
