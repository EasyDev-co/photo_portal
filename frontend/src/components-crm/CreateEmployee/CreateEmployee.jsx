import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Form } from 'react-bootstrap'

const CreateEmployee = () => {
  const navigate = useNavigate()

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    employee_role: '',
    last_name: '',
    email: '',
    phone_number: '',
  })

  const [securityInfo, setSecurityInfo] = useState({
    login: '',
    password: '',
  })

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setPersonalInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSecurityInfoChange = (e) => {
    const { name, value } = e.target
    setSecurityInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  return (
    <div className="page-crm">
      <div className="header-title">
        <h1>Создать профиль сотрудника</h1>
      </div>
      <div className="d-flex flex-column gap-3">
        {/* First Card */}
        <Card className="border-0 p-3 ">
          <Card.Header
            className="border-0 fw-600 p-0"
            style={{ fontSize: '17px' }}
          >
            Личная информация
          </Card.Header>
          <Card.Body>
            <Form>
              {/* Row of inputs using Bootstrap grid */}
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label
                      className="text-secondary"
                      style={{ fontSize: '15px' }}
                    >
                      Имя
                    </Form.Label>
                    <Form.Control
                      className="shadow-none ps-3"
                      placeholder="Не указано"
                      name="name"
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label
                      className="text-secondary"
                      style={{ fontSize: '15px' }}
                    >
                      Должность
                    </Form.Label>
                    <Form.Control
                      className="shadow-none ps-3"
                      placeholder="Не указано"
                      name="employee_role"
                      value={personalInfo.employee_role}
                      onChange={handlePersonalInfoChange}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label
                      className="text-secondary"
                      style={{ fontSize: '15px' }}
                    >
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
                <div className="col-12 col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label
                      className="text-secondary"
                      style={{ fontSize: '15px' }}
                    >
                      Email
                    </Form.Label>
                    <Form.Control
                      className="shadow-none ps-3"
                      placeholder="Не указано"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12 col-md-6">
                  <Form.Group>
                    <Form.Label
                      className="text-secondary"
                      style={{ fontSize: '15px' }}
                    >
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
                <div
                  style={{ flex: 1, marginTop: '30px' }}
                  className="justify-content-end d-flex"
                >
                  {' '}
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Second Card */}
        <Card className="border-0 p-3 ">
          <Card.Header
            className="border-0 fw-600 p-0"
            style={{ fontSize: '17px' }}
          >
            Пароли и безопасность
          </Card.Header>
          <Card.Body>
            <Form>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label
                      className="text-secondary"
                      style={{ fontSize: '15px' }}
                    >
                      Логин
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
                <div className="col-12 col-md-6">
                  <Form.Group>
                    <Form.Label
                      className="text-secondary"
                      style={{ fontSize: '15px' }}
                    >
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
        <div
          style={{ marginTop: '30px' }}
          className="justify-content-end d-flex"
        >
          {' '}
          <Button className="create-btn centered-button">Сохранить</Button>
        </div>
      </div>
    </div>
  )
}

export default CreateEmployee
