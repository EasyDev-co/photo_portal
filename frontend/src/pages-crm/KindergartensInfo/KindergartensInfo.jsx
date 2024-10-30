import { Card, CardHeader, Form, Button } from 'react-bootstrap'
import './styles/KindergartensInfo.scss'
import { arrayOfObjects } from '../../constants/mockData'
import addButton from '../../assets/icons/icon_button-add.svg'
import DatePicker from '../../components-crm/DatePicker/DatePicker'
import calendar from '../../assets/icons/calendar-event.svg'
import { useState, useEffect } from 'react'
import OrderCard from '../../components-crm/OrderCard/OrderCard'
import Notes from '../../components-crm/Notes/Notes'
import { fetchSingleClientCardsWithTokenInterceptor } from '../../http/client-cards/getClientCard'
import { fetchSingleClientCardTasksWithTokenInterceptor } from '../../http/client-cards/getClientCardTasks'
import { fetchNotesWithTokenInterceptor } from '../../http/client-cards/getNotes'
import { fetchHistoryCallsWithTokenInterceptor } from '../../http/client-cards/getHistoryCalls'
import { useParams } from 'react-router-dom'

const KindergartensInfo = () => {
  const { id } = useParams()
  const [isActive, setIsActive] = useState(false)
  const [clientCardData, setClientCardData] = useState(null) // State to store fetched client card data
  const [tasks, setTasks] = useState(null)
  const [notes, setNotes] = useState(null)
  const [historyCalls, setHistoryCalls] = useState(null)

  const access = localStorage.getItem('access') // Get access token

  useEffect(() => {
    const fetchClientCard = async () => {
      try {
        const response = await fetchSingleClientCardsWithTokenInterceptor(
          access,
          id
        ) // Use the function to fetch data
        if (response.ok) {
          const data = await response.json() // Parse the response JSON
          setClientCardData(data) // Store the data in state
          console.log(data)
        } else {
          console.error('Failed to fetch single client card')
        }
      } catch (error) {
        console.error('Error fetching single client card:', error)
      }
    }

    const fetchClientCardTasks = async () => {
      try {
        const response = await fetchSingleClientCardTasksWithTokenInterceptor(
          access,
          id
        ) // Use the function to fetch data
        if (response.ok) {
          const data = await response.json() // Parse the response JSON

          setTasks(data) // Store the data in state
        } else {
          console.error('Failed to fetch tasks')
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    const fetchNotes = async () => {
      try {
        const response = await fetchNotesWithTokenInterceptor(access, id) // Use the function to fetch data
        if (response.ok) {
          const data = await response.json() // Parse the response JSON

          setNotes(data) // Store the data in state
        } else {
          console.error('Failed to fetch notes')
        }
      } catch (error) {
        console.error('Error fetching notes:', error)
      }
    }

    const fetchhistoryCalls = async () => {
      try {
        const response = await fetchHistoryCallsWithTokenInterceptor(access, id) // Use the function to fetch data
        if (response.ok) {
          const data = await response.json() // Parse the response JSON

          setHistoryCalls(data) // Store the data in state
        } else {
          console.error('Failed to fetch notes')
        }
      } catch (error) {
        console.error('Error fetching notes:', error)
      }
    }

    fetchClientCard()
    fetchClientCardTasks()
    fetchNotes()
    fetchhistoryCalls()
  }, [access])

  console.log(clientCardData);
  

  if (clientCardData) {
    return (
      <div className="page-crm">
        <div className="d-flex gap-3">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex gap-3">
              <Card
                className="border-0 d-flex flex-column gap-2 card-shadow"
                style={{
                  padding: '24px',
                  width: '470px',
                  height: 'auto',
                  fontSize: '15px',
                }}
              >
                <CardHeader
                  style={{
                    fontSize: '17px',
                  }}
                  className="border-0 fw-600 p-0"
                >
                  Детский сад {clientCardData.kindergarten.name}
                </CardHeader>
                <Card.Body className="fw-400 text-secondary p-0">
                  {clientCardData.children_count} детей, VIP
                </Card.Body>
              </Card>
              <Card
                className="border-0 d-flex flex-column gap-2 card-shadow"
                style={{
                  padding: '24px',
                  width: '470px',
                  height: 'auto',
                }}
              >
                <CardHeader
                  style={{
                    fontSize: '17px',
                  }}
                  className="border-0 fw-600 p-0"
                >
                  Процент заведующих:
                </CardHeader>
                <CardHeader
                  style={{
                    fontSize: '17px',
                  }}
                  className="border-0 fw-600 p-0"
                >
                  Скидка:
                </CardHeader>
              </Card>
            </div>
            <div className="card-shadow">
              <Card
                className="border-0"
                style={{
                  padding: '24px',
                  gap: '24px',
                }}
              >
                <CardHeader
                  style={{
                    fontSize: '17px',
                  }}
                  className="border-0 fw-600 p-0"
                >
                  Текущие задачи
                  <div className="cursor-pointer">
                  <button>
                    {' '}
                    <img src={addButton} alt="" />
                  </button>
                </div>
                </CardHeader>

                <Card.Body
                  className="p-0 gap-2 d-flex flex-column scroll-body"
                  style={{
                    height: '240px',
                  }}
                >
                  {tasks? tasks.map((elem) => {
                    return (
                      <Card
                        key={elem.id}
                        className="d-flex flex-row align-items-center justify-content-between p-3 "
                      >
                        <div>
                          <CardHeader
                            style={{
                              fontSize: '15px',
                            }}
                            className="border-0 fw-500 p-0"
                          >
                            Название задачи
                          </CardHeader>
                          <Card.Body
                            className="p-0"
                            style={{
                              color: '#0a58ca',
                              fontSize: '15px',
                            }}
                          >
                            До 08.08.2024
                          </Card.Body>
                        </div>
                        <div>
                          <Form.Check
                            type="checkbox"
                            id="1"
                            className="form-check-custom-task shadow-none"
                          />
                        </div>
                      </Card>
                    )
                  }):""}
                </Card.Body>
              </Card>
            </div>
            <div className="card-shadow">
              <Card
                className="border-0"
                style={{
                  padding: '24px',
                  gap: '24px',
                }}
              >
                <Card.Header
                  style={{
                    fontSize: '17px',
                  }}
                  className="border-0 fw-600 p-0"
                >
                  Текущая фотосессия
                </Card.Header>
                <Card.Body className="p-0">
                  <Form className="d-flex gap-3">
                    <Form.Group className="w-50">
                      <DatePicker
                        label={'Дата начала'}
                        placeholder={'Не указано'}
                        setIsActive={setIsActive}
                        img={calendar}
                        isActive={isActive}
                        navTitles={{
                          days: 'MMMM <i>yyyy</i>',
                          months: 'yyyy',
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="w-50">
                      <Form.Label className="text-secondary">
                        Дедлайн
                      </Form.Label>
                      <Form.Control
                        className="shadow-none ps-3"
                        placeholder="Не указано"
                      />
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </div>
            <div className="card-shadow">
              <OrderCard
                previous_managers={clientCardData.previous_managers}
                historyCalls={historyCalls}
                region={clientCardData.kindergarten.region.country}
                city={clientCardData.kindergarten.region.name}
                id={clientCardData.id}
                itemName={clientCardData.name}
              />
            </div>
          </div>
          <div className="flex-grow-1 d-flex flex-column gap-3">
            <Card
              className="border-0 d-flex flex-column gap-2 card-shadow "
              style={{
                padding: '24px',
                height: 'auto',
              }}
            >
              <div
                className="border"
                style={{
                  borderRadius: '8px',
                }}
              >
                <Card className="border-0 p-2 text-center ">
                  <Card.Header
                    className="border-0 fw-600 p-0 justify-content-center"
                    style={{ fontSize: '17px' }}
                  >
                    Марк Ифанасьев
                  </Card.Header>
                  <Card.Title className="fs-6 text-secondary">
                    Директор
                  </Card.Title>
                </Card>
              </div>
              {clientCardData.previous_managers.map((item, i) => {
                return (
                  <Card.Body className="p-0" key={i}>
                    <div className="d-flex gap-1">
                      <div className="fw-400 text-secondary">
                        Прошлый менеджер:{' '}
                      </div>
                      <div className="fw-400"> asdasda</div>
                    </div>
                  </Card.Body>
                )
              })}
            </Card>
            <Card
              className="border-0 d-flex flex-column gap-2 card-shadow "
              style={{
                padding: '24px',
                height: 'auto',
              }}
            >
              <Card.Header
                style={{
                  fontSize: '17px',
                }}
                className="border-0 fw-600 p-0"
              >
                Заметки
              </Card.Header>
              <Notes notes={notes} />
              <Button className="btn-filter-reset text-center">Сбросить</Button>
            </Card>
            <Card
              className="border-0 d-flex flex-column gap-2 card-shadow "
              style={{
                padding: '24px',
                height: 'auto',
              }}
            >
              <Card.Header
                style={{
                  fontSize: '17px',
                }}
                className="border-0 fw-600 p-0"
              >
                История заказов
              </Card.Header>
              {clientCardData.orders_history.map((item, i) => {
                return (
                  <Card className="" key={i}>
                    <Card.Header className="border-0">
                      <div>08.08.2024</div>
                      <div
                        style={{
                          color: '#0a58ca',
                        }}
                      >
                        Имя Фамилия
                      </div>
                    </Card.Header>
                    <Card.Body
                      className="py-2"
                      style={{
                        maxWidth: '545px',
                        fontSize: '15px',
                      }}
                    >
                      <div className="truncate text-secondary">
                        Lorem ipsum dolor sit amet consectetur. Vel commodo
                        nullam eu gravida porttitor ut. Faucibus sodales viverra
                        arcu quis dignissim at tellus at posuere.
                      </div>
                    </Card.Body>
                  </Card>
                )
              })}

              <Button className="btn-filter-reset text-center">Сбросить</Button>
            </Card>
            <Card
              className="border-0 d-flex flex-column gap-2 card-shadow "
              style={{
                padding: '24px',
                height: 'auto',
              }}
            >
              <Card.Header
                style={{
                  fontSize: '17px',
                }}
                className="border-0 fw-600 p-0"
              >
                История изменений
              </Card.Header>
              {clientCardData.change_history.map((item, i) => {
                return (
                  <Card className="" key={i}>
                    <Card.Header className="border-0">
                      <div>08.08.2024</div>
                      <div
                        style={{
                          color: '#0a58ca',
                        }}
                      >
                        Имя Фамилия
                      </div>
                    </Card.Header>
                    <Card.Body
                      className="py-2"
                      style={{
                        maxWidth: '545px',
                        fontSize: '15px',
                      }}
                    >
                      <div className="truncate text-secondary">
                        Lorem ipsum dolor sit amet consectetur. Vel commodo
                        nullam eu gravida porttitor ut. Faucibus sodales viverra
                        arcu quis dignissim at tellus at posuere.
                      </div>
                    </Card.Body>
                  </Card>
                )
              })}

              <Button className="btn-filter-reset text-center">Сбросить</Button>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

export default KindergartensInfo
