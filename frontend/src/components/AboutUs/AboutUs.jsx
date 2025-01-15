import styles from './AboutUs.module.css'
import { Title } from '../Title/Title'
import { AboutUsItem } from './AboutUsItem/AboutUsItem'
import { aboutUsItems } from '../../constants/constants'
import detailsPdf from '../../assets/details.pdf'

export const AboutUs = () => {
  return (
    <div className={styles.aboutUs}>
      <Title text="О нас" />
      <ul className={styles.list}>
        {aboutUsItems.map((item, index) => {
          return <AboutUsItem info={item} key={index} />
        })}
      </ul>
      <span
        className={styles.details}
        role="button"
        tabIndex={0}
        onClick={() => {
          const link = document.createElement('a')
          link.href = detailsPdf // Путь к вашему файлу
          link.download = 'details.pdf' // Имя файла при загрузке
          link.click()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            const link = document.createElement('a')
            link.href = detailsPdf
            link.download = 'details.pdf'
            link.click()
          }
        }}
      >
        Наши реквизиты
      </span>
    </div>
  )
}
