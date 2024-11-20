/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import './styles/Layout.scss'
import logo from '../../assets/logos/PP_Logo.png'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionButton } from 'react-bootstrap/AccordionButton'
import React, { useContext, useState, useEffect } from 'react'
import AccordionContext from 'react-bootstrap/AccordionContext'
import Card from 'react-bootstrap/Card'
import arrow from '../../assets/icons/arrow.svg'
import building from '../../assets/icons/building.svg'
import employees from '../../assets/icons/employees.svg'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import tasks from '../../assets/icons/list-task.svg'
import bell from '../../assets/icons/bell.svg'
import person from '../../assets/icons/person.jpg'

import Notification from '../Notification/Notification'
import { localUrl } from '../../constants/constants'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserDataWithTokenInterceptor } from '../../http/user/getUserData'
import logout_icon from '../../assets/icons/logout.svg'
import { removeUser } from '../../store/authSlice'

const LayoutCrm = () => {
  const BASE = '#25243D'
  const BLUE = '#4F46E5'
  const access = localStorage.getItem('access')
  const refresh = useSelector((state) => state.user.refresh)

  const location = useLocation()
  const navigate = useNavigate()

  const [clientRadioValue, setСlientRadioValue] = useState('1')
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [userName, setUserName] = useState('')
  const [userLastName, setUserLastName] = useState('')
  const [userRole, setUserRole] = useState(null)
  const clientRadios = [
    { name: 'Детские сады', value: '1', path: '/crm/kindergartens' },
    { name: 'Календарь', value: '2', path: '/crm/calendar' },
  ]

  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();

  const employRole = {
    1: 'Руководитель отдела продаж',
    2: 'Менеджер',
    3: 'Исполнительный директор',
    4: 'Старший менеджер',
  }

  const fetchNotifications = async () => {
    try {
      const accessToken = localStorage.getItem('access')

      const response = await fetch(
        `${localUrl}/api/crm/v1/notifications/unread-notifications/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Ошибка при загрузке уведомлений')
      }

      const data = await response.json()

      const notifications = data.map((item) => ({
        id: item.id,
        author: item.sender_full_name,
        message: item.message,
        url: item.url || null,
        is_read: item.is_read,
      }))
      console.log(notifications)
      setNotifications(notifications)

      const unreadCount = notifications.filter(
        (notification) => !notification.read
      ).length
      setUnreadCount(unreadCount)
    } catch (error) {
      console.error('Ошибка при загрузке уведомлений:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('access')) {
      return
    }
    fetchUserDataWithTokenInterceptor(access, refresh).then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          console.log(res.first_name, res.last_name)
          setUserName(res.first_name)
          setUserLastName(res.last_name)
          setUserRole(res.employee.employee_role)
          //   setManagedKindergarten(res.managed_kindergarten); // сохраняем managed_kindergarten
        })
      }
    })
  }, []) //accessStor, cookieData, dispatch, refresh

  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev)
  }

  const updateUnreadCount = (count) => {
    setUnreadCount(count)
  }

  function ContextAwareToggle({ children, eventKey, callback, icon, isArrow }) {
    const { activeEventKey } = useContext(AccordionContext)

    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey)
    )

    const isCurrentEventKey = activeEventKey === eventKey

    return (
      <div className="layout_btn-wrap">
        <button
          type="button"
          style={{
            backgroundColor: isCurrentEventKey ? BLUE : BASE,
            width: '100%',
            padding: '8px 26px',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            gap: '10px',
          }}
          onClick={decoratedOnClick}
        >
          <div>
            <img src={icon} alt="" />
          </div>
          {children}
        </button>
        {isArrow && (
          <div className={isCurrentEventKey ? 'arrow_active' : 'arrow'}>
            <img src={arrow} alt="" />
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <header>
        <div className="position-fixed header bg-white z-3">
          {location.pathname.split('/').length - 1 >= 3 ? (
            <>
              <div
                className="search-container go-back-header d-flex justify-content-center align-items-center gap-4 fw-600"
                style={{
                  fontSize: '20px',
                }}
                onClick={() => navigate(-1)}
              >
                Назад
              </div>
            </>
          ) : (
            <div className="search-container d-flex justify-content-between align-items-center gap-4">
              <div className="search-wrap">{/* <Search /> */}</div>
              <div className="d-flex align-items-center">
                <div className="cursor-pointer">
                  {/* <img src={write} alt="" /> */}
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="px-3 cursor-pointer position-relative"
                    onClick={toggleNotification}
                  >
                    <img src={bell} alt="Уведомления" />
                    {unreadCount > 0 && (
                      <span className="notification-count">{unreadCount}</span>
                    )}
                  </div>

                  {isNotificationOpen && (
                    <Notification
                      notifications={notifications}
                      onClose={toggleNotification}
                      fetchNotifications={fetchNotifications}
                    />
                  )}

                  <div className="d-flex align-items-center ">
                    <div>
                      <div>
                        {userName} {userLastName}
                      </div>
                      <div className="fs-13 text-black-50">
                        {employRole[userRole]}
                      </div>
                    </div>
                  </div>
                  <button
                    className='logout_button'
                    onClick={() => dispatch(removeUser())}
                  >
                    <img 
                      src={logout_icon} 
                      alt='Иконка выхода из аккаунта'
                    >
                    </img>
                </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <nav
          className="navbar position-fixed top-0 start-0 layout-bg text-white d-flex flex-column justify-content-start flex-nowrap"
          style={{ width: '257px', height: '100vh' }}
        >
          <div className="container justify-content-center cursor-pointer border-bottom border-grey py-2 px-3 ">
            <Link to={'/'}>
              <img src={logo} alt="" />
            </Link>
          </div>
          {/* <div className="continer d-flex flex-column py-2 px-3 gap-2 w-100">
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-region" className="w-100 border border-primary-900 layout-bg">
                                Все регионы
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='w-100'>
                                <Dropdown.Item>Action</Dropdown.Item>
                                <Dropdown.Item>Another action</Dropdown.Item>
                                <Dropdown.Item>Something else</Dropdown.Item>
                                <Dropdown.Item>Action</Dropdown.Item>
                                <Dropdown.Item>Another action</Dropdown.Item>
                                <Dropdown.Item>Something else</Dropdown.Item>
                                <Dropdown.Item>Action</Dropdown.Item>
                                <Dropdown.Item>Another action</Dropdown.Item>
                                <Dropdown.Item>Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-cities" className="w-100 border border-primary-900 layout-bg">
                                Все города
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='w-100'>
                                <Dropdown.Item>Action</Dropdown.Item>
                                <Dropdown.Item>Another action</Dropdown.Item>
                                <Dropdown.Item>Something else</Dropdown.Item>
                                <Dropdown.Item>Action</Dropdown.Item>
                                <Dropdown.Item>Another action</Dropdown.Item>
                                <Dropdown.Item>Something else</Dropdown.Item>
                                <Dropdown.Item>Action</Dropdown.Item>
                                <Dropdown.Item>Another action</Dropdown.Item>
                                <Dropdown.Item>Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div> */}
          <div className="container flex-column py-2 px-3 align-items-start gap-2">
            <div className="row py-2 px-4">
              <span className="color-grey text-uppercase fs-13 fw-600">
                Пользователи
              </span>
            </div>
            <div className="w-100">
              <Accordion
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '0',
                  width: '100%',
                }}
              >
                <ContextAwareToggle icon={building} eventKey="0" isArrow={true}>
                  Клиенты
                </ContextAwareToggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <ButtonGroup
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'end',
                        gap: '8px',
                      }}
                    >
                      {clientRadios.map((radio) => (
                        <ToggleButton
                          key={radio.value}
                          id={`radio-${radio.value}`}
                          type="radio"
                          name="radio"
                          onClick={() => navigate(radio.path)}
                          className={
                            clientRadioValue === radio.value
                              ? 'toggle-btn'
                              : 'toggle-btn-checked'
                          }
                          value={radio.value}
                          checked={clientRadioValue === radio.value}
                          onChange={(e) => setСlientRadioValue(e.target.value)}
                        >
                          <svg
                            width="8"
                            height="9"
                            viewBox="0 0 8 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 8.05469C6.20914 8.05469 8 6.26383 8 4.05469C8 1.84555 6.20914 0.0546875 4 0.0546875C1.79086 0.0546875 0 1.84555 0 4.05469C0 6.26383 1.79086 8.05469 4 8.05469Z"
                              fill="white"
                            />
                          </svg>
                          {radio.name}
                        </ToggleButton>
                      ))}
                    </ButtonGroup>
                  </Card.Body>
                </Accordion.Collapse>

                {userRole !== 2 && (
                  <>
                    <ContextAwareToggle
                      icon={employees}
                      eventKey="1"
                      callback={(eventKey) => {
                        if (eventKey === '1') {
                          navigate('/crm/employees') // Navigate only when this section is active
                        }
                      }}
                    >
                      Сотрудники
                    </ContextAwareToggle>
                  </>
                )}
                <ContextAwareToggle
                  icon={tasks}
                  eventKey="2"
                  callback={(eventKey) => {
                    if (eventKey === '2') {
                      navigate('/crm/tasks') // Navigate only when this section is active
                    }
                  }}
                >
                  Задачи
                </ContextAwareToggle>

                {/* <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <ButtonGroup
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'end',
                        gap: '8px',
                      }}
                    >
                      {employeesRadios.map((radio) => (
                        <ToggleButton
                          key={radio.value}
                          id={`radio-${radio.value}`}
                          type="radio"
                          name="radio"
                          className={
                            employeesRadioValue === radio.value
                              ? 'toggle-btn'
                              : 'toggle-btn-checked'
                          }
                          value={radio.value}
                          checked={employeesRadioValue === radio.value}
                          onChange={(e) =>
                            setEmployeesRadioValue(e.target.value)
                          }
                        >
                          <svg
                            width="8"
                            height="9"
                            viewBox="0 0 8 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 8.05469C6.20914 8.05469 8 6.26383 8 4.05469C8 1.84555 6.20914 0.0546875 4 0.0546875C1.79086 0.0546875 0 1.84555 0 4.05469C0 6.26383 1.79086 8.05469 4 8.05469Z"
                              fill="white"
                            />
                          </svg>
                          {radio.name}
                        </ToggleButton>
                      ))}
                    </ButtonGroup>
                  </Card.Body>
                </Accordion.Collapse> */}
              </Accordion>
            </div>
            {/* <div className='d-flex flex-column gap-2'>
                            {usersLinks.map((elem, i) => {
                                return (
                                    <Link key={i} to={elem.to} className={location.pathname === elem.to ? 'layout-link-active' : 'layout-link'}>
                                        <div>
                                            <img src={elem.image} alt="" />
                                        </div>

                                        <div>
                                            {elem.value}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div> */}
            {/* <div className='d-flex flex-column border-top border-grey w-100 gap-2'>
                            <div className="row py-2 px-4 ">
                                <span className='color-grey text-uppercase fs-13 fw-600'>Другое</span>
                            </div>
                            {othersLinks.map((elem, i) => {
                                return (
                                    <Link key={i} to={elem.to} className={location.pathname === elem.to ? 'layout-link-active' : 'layout-link'}>
                                        <div>
                                            <img src={elem.image} alt="" />
                                        </div>
                                        <div>
                                            {elem.value}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div> */}
            {/* <div className='d-flex flex-column gap-2'>
                            <div className="row py-2 px-4">
                                <span className='color-grey text-uppercase fs-13 fw-600'>Настройки</span>
                            </div>
                            {settingsLinks.map((elem, i) => {
                                return (
                                    <Link key={i} to={elem.to} className={location.pathname === elem.to ? 'layout-link-active' : 'layout-link'}>
                                        <div>
                                            <img src={elem.image} alt="" />
                                        </div>
                                        <div>
                                            {elem.value}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div> */}
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  )
}

export default LayoutCrm
