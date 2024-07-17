import { useState } from 'react';
import styles from './Dropdown.module.css'

const Dropdown = () => {
    const [isActive, setIsActive] = useState(false);
    return (
        <div className={styles.dropdown}>
            <input placeholder="ФИО родителя" onClick={() => setIsActive(!isActive)} className={styles.inputField} id={'parentName'} type="text" list="data" />
            {isActive &&
                <div className={styles.dropdownContent}>
                    <div className={styles.dropdownItem}>
                        Иванов Максим Витальевич
                    </div>
                    <div className={styles.dropdownItem}>
                        Иванов Максим Витальевич
                    </div>
                </div>
            }

        </div>
    );
}

export default Dropdown;