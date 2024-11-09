import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Card, Form} from 'react-bootstrap';
import {fetchsingleEmployeeWithTokenInterceptor} from '../../http/employees/getSingleEmployee';
import {updateEmployeeData} from "../../http/employees/updateEmployee";
import styles from "./EditEmployee.module.css"

const EditEmployee = () => {
    const navigate = useNavigate();
    const {employeeId} = useParams();
    const access = localStorage.getItem('access');

    const [personalInfo, setPersonalInfo] = useState({
        first_name: '',
        employee_role: '',
        last_name: '',
        email: '',
        phone_number: '',
    });
    const [updatedPersonalInfo, setUpdatedPersonalInfo] = useState({user: {}})
    const [status, setStatus] = useState("Не указано")
    const [securityInfo, setSecurityInfo] = useState({
        login: '',
        password: '',
    });

    const handlePersonalInfoChange = (e) => {
        const {name, value} = e.target;
        setUpdatedPersonalInfo((prevState) => ({
            ...prevState,
            [name]: value,
            user: {
                [name]: value,
            }
        }));
        setPersonalInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSecurityInfoChange = (e) => {
        const {name, value} = e.target;
        setUpdatedPersonalInfo((prevState) => ({
            ...prevState,
            [name]: value,
            user: {
                [name]: value,
            }
        }));
        setSecurityInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const fetchEmployee = async () => {
        try {
            const response = await fetchsingleEmployeeWithTokenInterceptor({
                access,
                employeeId,
            });
            if (response.ok) {
                const data = await response.json();
                setStatus(data.employee_role_display);
                setPersonalInfo(data.user);
                setSecurityInfo({...securityInfo, login: data.user.email});
            } else {
                console.error('Failed to fetch employee');
            }
        } catch (error) {
            console.error('Error fetching single employee:', error);
        }
    };

    const handleSavePersonalInfo = async () => {
        try {
            const data = {
                user: {
                    email: personalInfo.email,
                    first_name: personalInfo.first_name,
                    last_name: personalInfo.last_name,
                    phone_number: personalInfo.phone_number,
                    is_active: personalInfo.is_active,
                },
                employee_role: personalInfo.employee_role,
            };
            await updateEmployeeData(employeeId, updatedPersonalInfo, access);
            await fetchEmployee();
            alert('Персональная информация обновлена успешно');
        } catch (error) {
            console.error('Failed to update personal info:', error);
            alert('Ошибка при обновлении персональной информации');
        }
    };

    const handleUpdateSecurityInfo = async () => {
        try {
            if (securityInfo.password) {
                await updateEmployeeData(employeeId, {
                    login: securityInfo.login,
                    password: securityInfo.password,
                }, access);
                await fetchEmployee();
                alert('Логин и пароль обновлены успешно');
            } else {
                alert('Введите пароль для обновления');
            }
        } catch (error) {
            console.error('Failed to update login and password:', error);
            alert('Ошибка при обновлении логина и пароля');
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [access, employeeId]);

    return (
        <div className="page-crm">
            <div className="header-title">
                <h1>Настройки профиля</h1>
            </div>
            <div className="d-flex flex-column gap-3">
                {/* Персональная информация */}
                <Card className="border-0 p-3">
                    <Card.Header className="border-0 fw-600 p-0" style={{fontSize: '17px'}}>
                        Личная информация
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label className="text-secondary" style={{fontSize: '15px'}}>
                                            Имя
                                        </Form.Label>
                                        <Form.Control
                                            className="shadow-none ps-3"
                                            placeholder="Не указано"
                                            name="first_name"
                                            value={personalInfo.first_name}
                                            onChange={handlePersonalInfoChange}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label className="text-secondary" style={{fontSize: '15px'}}>
                                            Должность
                                        </Form.Label>
                                        <Form.Select
                                            className="shadow-none ps-3"
                                            name="employee_role"
                                            value={personalInfo.employee_role}
                                            onChange={handlePersonalInfoChange}
                                        >
                                            <option value="">Выберите статус</option>
                                            <option value="1">РОП</option>
                                            <option value="2">Менеджер</option>
                                            <option value="4">Старший менеджер</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label className="text-secondary" style={{fontSize: '15px'}}>
                                            Фамилия
                                        </Form.Label>
                                        <Form.Control
                                            className="shadow-none ps-3"
                                            placeholder="Не указано"
                                            name="last_name"
                                            value={personalInfo.last_name}
                                            onChange={handlePersonalInfoChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label className="text-secondary" style={{fontSize: '15px'}}>
                                            Номер телефона
                                        </Form.Label>
                                        <Form.Control
                                            className="shadow-none ps-3"
                                            placeholder="Не указано"
                                            name="phone_number"
                                            value={personalInfo.phone_number}
                                            onChange={handlePersonalInfoChange}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Button className="create-btn" onClick={handleSavePersonalInfo}>
                                        Сохранить
                                    </Button>
                                </div>
                            </div>
                            <div className="row">
                                <Form.Group>
                                    <Form.Label className="text-secondary" style={{fontSize: '15px'}}>
                                        Активный пользователь
                                    </Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        label="Активен"
                                        name="is_active"
                                        checked={personalInfo.is_active}
                                        onChange={(e) =>
                                            setPersonalInfo((prevState) => ({
                                                ...prevState,
                                                is_active: e.target.checked,
                                            }))
                                        }
                                    />
                                </Form.Group>
                            </div>

                        </Form>
                    </Card.Body>
                </Card>

                {/* Обновление логина и пароля */}
                <Card className="border-0 p-3">
                    <Card.Header className="border-0 fw-600 p-0" style={{fontSize: '17px'}}>
                        Пароли и безопасность
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label className="text-secondary" style={{fontSize: '15px'}}>
                                            Email
                                        </Form.Label>
                                        <Form.Control
                                            className="shadow-none ps-3"
                                            placeholder="Не указано"
                                            name="login"
                                            value={securityInfo.login}
                                            onChange={handleSecurityInfoChange}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label className="text-secondary" style={{fontSize: '15px'}}>
                                            Пароль
                                        </Form.Label>
                                        <Form.Control
                                            className="shadow-none ps-3"
                                            placeholder="Не указано"
                                            name="password"
                                            value={securityInfo.password}
                                            onChange={handleSecurityInfoChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <Button className="create-btn" onClick={handleUpdateSecurityInfo}>
                                    Обновить пароль и логин
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default EditEmployee;
