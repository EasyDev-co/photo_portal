import React, {useState, useEffect} from 'react'
import {Form, Button, ModalFooter} from 'react-bootstrap'
import styles from './FireEmployeeForm.module.css'
import { deleteEmployeeWithTokenInterceptor } from '../../../http/employees/deleteEmployee'
import { useNavigate } from 'react-router-dom'


const FireEmployeeForm = ({closeModal, employeeId}) => {
    const access = localStorage.getItem('access') // Get access token
    const navigate = useNavigate();


    const [isActive, setIsActive] = useState(false)

    const [errors, setErrors] = useState({})

    const handleDeleteEmployee = async () => {
        console.log('началось')
        try {
            if (employeeId) {
                await deleteEmployeeWithTokenInterceptor(access, employeeId);
                navigate(`/crm/employees/`);
            }
        } catch (error) {
            console.error('Failed to update login and password:', error);
            alert('Ошибка при обновлении логина и пароля');
        }
    };

    // useEffect(() => {
    //     fetchEmployee();
    // }, [access, employeeId]);

    // const handleChange = (e) => {
    //     const {name, value} = e.target

    //     setFormState((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }))
    // }

    return (
        <Form className={styles.form}>
            {/* <ModalFooter style={{padding: '5px'}}> */}
                <Button className="btn-filter-reset text-center" onClick={closeModal}>
                    Нет
                </Button>
                <Button
                    className="create-btn"
                    style={{padding: '7px 12px'}}
                    onClick={handleDeleteEmployee}
                >
                    Да
                </Button>
            {/* </ModalFooter> */}
        </Form>
    )
}

export default FireEmployeeForm
