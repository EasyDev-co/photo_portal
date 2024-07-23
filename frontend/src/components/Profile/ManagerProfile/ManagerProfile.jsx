import styles from "./ManagerProfile.module.css";
// import PaymentTimer from "../../Payment/PaymentTimer/PaymentTimer";
import StatisticItem from "./StatisticItem";
import { useState } from "react";
import PaymentDiagram from "../../Payment/PaymentDiagram/PaymentDiagram";
import Timer from "../../Payment/PaymentTimer/Timer";
import MainButton from "../../Buttons/MainButton";
import Dropdown from "./Dropdown/Dropdown";
const ManagerProfile = () => {
    const [copy, setIsCopy] = useState('');

    return (
        <div className={styles.profileWrap}>
            <div className={styles.profileWidgetWrap}>
                <h1 className={styles.profileTitle}>Статистика</h1>
                <div className={styles.profileWidget}>
                    <StatisticItem
                        label={'Количество заказов'}
                        data={'43 из 79'}
                    />
                    <StatisticItem
                        setIsCopy={setIsCopy}
                        isCopy
                        label={'Промо-код для сотрудников'}
                        data={'code20'}
                    />
                    <StatisticItem
                        label={'Средний чек, руб'}
                        data={'12 250'}
                    />
                    <StatisticItem
                        label={'Сбор с заказа “Зимняя сказка”, руб'}
                        data={'48 348'}
                    />
                    <StatisticItem
                        label={'Промо-код для сотрудников'}
                        data={'code20'}
                    />
                    <StatisticItem
                        label={'Промо-код для сотрудников'}
                        data={'code20'}
                    />
                    <StatisticItem
                        label={'Промо-код для сотрудников'}
                        data={'code20'}
                    />
                    <StatisticItem
                        label={'Промо-код для сотрудников'}
                        data={'code20'}
                    />
                    <StatisticItem
                        label={'Промо-код для сотрудников'}
                        data={'code20'}
                    />
                    <StatisticItem
                        label={'Промо-код для сотрудников'}
                        data={'code20'}
                    />
                    <StatisticItem
                        label={'Промо-код для сотрудников'}
                        data={'code20'}
                    />
                </div>
                <div className={styles.checkWrap}>
                    <form className={styles.checkForm}>
                        {/* <label htmlFor="parentName">Выгрузка чеков</label>
                        <input placeholder="ФИО родителя" className={styles.inputField} id={'parentName'} type="text" list="data" />
                        <datalist id="data">
                            <option value="Chrome" label="Google" />
                            <option value="Firefox" label="Mozilla" />
                            <option value="Opera" label="Opera" />
                            {data.map((item, key) =>
                        <option key={key} value={item.displayValue} />
                    )}
                        </datalist> */}
                        <Dropdown/>
                        <div>
                            <MainButton
                                value={'Скачать все чеки'}
                            />
                        </div>

                    </form>
                    <div>
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
                    data={'23 450'}
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