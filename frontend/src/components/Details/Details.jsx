import styles from './Details.module.css'
import { Title } from '../Title/Title'
// import { AboutUsItem } from './AboutUsItem/AboutUsItem'
// import { aboutUsItems } from '../../constants/constants'

export const Details = () => {
  const requisites = [
    { name: 'Название организации', value: "ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ГАСАНОВ РУСЛАН АБИДИПОВИЧ" },
    { name: 'Юридический адрес организации', value: '123317, РОССИЯ, Г МОСКВА, Г МОСКВА, УЛ 3-ЯКРАСНОГВАРДЕЙСКАЯ, Д 3, КВ 137' },
    { name: 'ИНН', value: '616105167804' },
    { name: 'Расчетный счет', value: '40802810400004268001' },
    { name: 'ОГРН/ОГРНИП', value: '323619600026549' },
    { name: 'Банк', value: 'АО «ТБанк»' },
    { name: 'БИК банка', value: '044525974' },
    { name: 'ИНН банка', value: '7710140679' },
    { name: 'Корреспондентский счет банка', value: '30101810145250000974' },
    { name: 'Юридический адрес банка', value: '127287, г. Москва, ул. Хуторская 2-я, д. 38А, стр. 26' },
  ]
  return (
    <div className={styles.aboutUs}>
      <Title text="Реквизиты" />
      <div className={styles.table}>
        {requisites.map((item, index) => (
          <div className={styles.requisite_row} key={index}>
            <div className={styles.requisite_name}>{item.name}</div>
            <div className={styles.requisite_value}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
