import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card, Button, Form} from 'react-bootstrap';
import {createEmployee} from "../../http/employees/createEmployee";

const CreateEmployee = () => {
    const navigate = useNavigate();

    // Состояние для личной информации
    const [personalInfo, setPersonalInfo] = useState({
        first_name: '',
        employee_role: 2,
        last_name: '',
        phone_number: null,
    });

    // Состояние для безопасности
    const [securityInfo, setSecurityInfo] = useState({
        email: '',
        password: '',
    });

    // Функция изменения личной информации
    const handlePersonalInfoChange = (e) => {
        const {name, value} = e.target;
        setPersonalInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Функция изменения информации безопасности
    const handleSecurityInfoChange = (e) => {
        const {name, value} = e.target;
        setSecurityInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Функция обработки сохранения
    const handleSubmit = async () => {
        const data = {
            user: {
                ...personalInfo,
                ...securityInfo,
                is_verified: true,
                role: 3,
            }, employee_role: personalInfo.employee_role, status: "active"

        };

        try {
            const accessToken = localStorage.getItem('access');
            const createdEmployee = await createEmployee(data, accessToken);

            navigate(`/crm/employees/edit/${createdEmployee.id}`);
        } catch (error) {
            console.error('Ошибка при создании сотрудника:', error);
            alert('Не удалось создать сотрудника. Попробуйте снова.');
        }
    };

    return (
        <div className="page-crm">
            <div className="header-title">
                <h1>Создать профиль сотрудника</h1>
            </div>
            <div className="d-flex flex-column gap-3">
                {/* Карточка с личной информацией */}
                <Card className="border-0 p-3 ">
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

                            <div className="row mb-3">
                                <div className="col-12 col-md-6">
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
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Карточка с информацией безопасности */}
                <Card className="border-0 p-3 ">
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
                                            name="email"
                                            value={securityInfo.email}
                                            onChange={handleSecurityInfoChange}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-12 col-md-6">
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
                        </Form>
                    </Card.Body>
                </Card>

                {/* Кнопка Сохранить */}
                <div className="justify-content-end d-flex" style={{marginTop: '30px'}}>
                    <Button className="create-btn centered-button" onClick={handleSubmit}>
                        Сохранить
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateEmployee;
