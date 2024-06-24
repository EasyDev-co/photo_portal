import styles from './Prompt.module.css'
import children1 from '../../../assets/images/Auth/kids/children1.png'
import children2 from '../../../assets/images/Auth/kids/children2.png'
import children3 from '../../../assets/images/Auth/kids/children3.png'
import children4 from '../../../assets/images/Auth/kids/children4.png'
import children5 from '../../../assets/images/Auth/kids/children5.png'
import children6 from '../../../assets/images/Auth/kids/children6.png'
import logo from '../../../assets/images/Auth/Frame1000004273.png'
import { useState } from 'react'
const Prompt = ({activeWidget,highlight}) => {
  
    return ( 
        <div className={styles.promptWrap}>
            <div className={styles.promptImgWrap}>
                <div>
                    <img className={styles.promtImg} src={children5} alt="" />
                
                </div>
                <div>
                    <img className={styles.promtImg} src={children4} alt="" />
                
                </div>
                <div>
                    <img className={styles.promtImg} src={children2} alt="" />
                    
                </div>
                <div>
                    <img className={styles.promtImg} src={children1} alt="" />
                    
                </div>
                <div>
                    <img className={styles.promtImg} src={children3} alt="" />
                    
                </div>
                <div>
                    <img className={styles.promtImg} src={children6} alt="" />
                    
                </div>

            </div>
            <div className={!highlight ? styles.promptImgName:styles.promptImgNameFalse}>
                <span>901.jpg</span>
                <span>901.jpg</span>
                <span>901.jpg</span>
                <span>901.jpg</span>
                <span>901.jpg</span>
                <span>901.jpg</span>
            </div>
            <div className={styles.promptBody}>
                <div>
                    <span>Тема: Летний сад</span>
                    <span>Детский сад: <span className={highlight ? styles.borderActive:styles.borderUnActive}>13 Название сада</span></span>
                </div>
                <div className={styles.promptLogo}>
                    <img src={logo} alt="" />
                </div>
            </div>
            <span className={styles.promptInfo}>
                {highlight?'Введите название точно также, как указано в образцах':'Введите номер или номера кадров без jpg. Например, «901» или «901-906»'}
          
            </span>
        </div>
    );
}
 
export default Prompt;