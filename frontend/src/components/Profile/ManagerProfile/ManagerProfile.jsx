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

const ManagerProfile = () => {
    const [copy, setIsCopy] = useState('');
    const accessStor = localStorage.getItem('access');
    const kindergarten_id = useSelector(state => state.user.kindergarten_id);
    const navigate = useNavigate()
    const [stats, setStats] = useState(
        {
            total_orders: 0,
            completed_orders: 0,
            average_order_value: "0.00",
            total_amount: "0.00"
        }
    );
    useEffect(() => {
        getStats(accessStor, kindergarten_id)
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(res => {
                            console.log(res)
                            setStats(res)
                        })
                }
            })
    }, [accessStor, kindergarten_id])

    return (
        <div className={styles.profileWrap}>
            <div className={styles.profileWidgetWrap}>
                <h1 className={styles.profileTitle}>Статистика</h1>
                <div className={styles.profileWidget}>
                    <StatisticItem
                        label={'Количество заказов'}
                        data={`${stats.completed_orders} из ${stats.total_orders}`}
                    />
                    <StatisticItem
                        setIsCopy={setIsCopy}
                        isCopy
                        label={'Промо-код для сотрудников'}
                        data={'code20'}
                    />
                    <StatisticItem
                        label={'Средний чек, руб'}
                        data={stats.average_order_value}
                    />
                </div>
                <div className={styles.checkWrap}>
                    <form className={styles.checkForm}>
                        <Dropdown />
                        <div>
                            <MainButton
                                value={'Скачать все чеки'}
                            />
                        </div>

                    </form>
                    <div onClick={()=>navigate('/orders_manager')}>
                        <MainButton
                            value={'Заказ для себя'}
                        />
                    </div>

                </div>

            </div>
            <div className={styles.paymentTimerWrap}>

                <PaymentDiagram
                    count={'3 500'}
                    label={'Ваш бонус:'}
                />
                <StatisticItem
                    timer
                    label={'Итого'}
                    data={stats.total_amount}
                />
                <Timer
                    date={'Sat Jun 30 2024 10:31:52 GMT+0300 (Moscow Standard Time)'}
                    desc={' на фотосессию “Зимняя сказка”'}
                />
            </div>

        </div>
    );
}

export default ManagerProfile;