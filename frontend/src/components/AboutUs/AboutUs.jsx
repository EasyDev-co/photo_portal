import styles from './AboutUs.module.css'
import { Title } from '../Title/Title'
import { AboutUsItem } from './AboutUsItem/AboutUsItem'
import { aboutUsItems } from '../../constants/constants'
import { useNavigate } from 'react-router-dom'

export const AboutUs = () => {
    const navigate = useNavigate();
  
  return (
    <div className={styles.aboutUs}>
      <Title text="О нас" />
      <ul className={styles.list}>
        {aboutUsItems.map((item, index) => {
          return <AboutUsItem info={item} key={index} />
        })}
      </ul>
      <button
        className={styles.details}
        onClick={() => navigate("/about-us/details")}
      >
        Наши реквизиты
      </button>
    </div>
  )
}
