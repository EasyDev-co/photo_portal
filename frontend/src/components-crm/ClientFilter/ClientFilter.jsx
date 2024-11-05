/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Form from 'react-bootstrap/Form'
import './styles/ClientFilter.scss'
import DatePicker from '../DatePicker/DatePicker'
import { useEffect, useState } from 'react'
import people from '../../assets/icons/people.svg'
import { Accordion } from 'react-bootstrap'
import calendar from '../../assets/icons/calendar-event.svg'
import { localUrl } from '../../constants/constants'

const ClientFilter = () => {
  const [isActive, setIsActive] = useState(false)
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    getRegions().then(regions => {
      if (Array.isArray(regions) && regions.length > 0) {
        setRegions(regions);
      } else {
        console.warn('Получены пустые данные или данные не массив');
      }
    }).catch(error => {
      console.error('Ошибка при получении регионов:', error);
    });
  }, []);

  const getRegions = async () => {
    try {
      const access = localStorage.getItem('access');
      const response = await fetch(`${localUrl}/api/v1/region/search/`, {
        headers: {
          'accept': 'application/json', 
          'Authorization': `Bearer ${access}`
        }
      });
      const data = await response.json();
      return data.map(item => item.name);
    } catch (error) {
      console.error('Ошибка при получении регионов:', error);
      return [];
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        <Form className="d-flex column-gap-3 flex-wrap mb-3">
          <Form.Group className="" controlId="formBasicEmail">
            <Form.Label className="text-secondary">Детский сад</Form.Label>
            <Form.Select className="shadow-none">
              <option className="select-option" hidden>
                Не указано
              </option>
              <option className="select-option">От А до Я</option>
              <option className="select-option">От Я до А</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="" controlId="formBasicPassword">
            <Form.Label className="text-secondary">Регион</Form.Label>

            <Form.Select className="shadow-none">
              <option hidden>Регион</option>
              {regions.map((region, index) => (
                <option key={index} className="select-option">
                  {region}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <DatePicker
              label={'Дата взаимодействия'}
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
          <Form.Group>
            <div className="form-control-wrap">
              <Form.Label className="text-secondary">Менеджер</Form.Label>
              <Form.Control className="shadow-none" placeholder="Не указано" />
              <div className="control-img">
                <img src={people} alt="" />
              </div>
            </div>
          </Form.Group>
          {/* <div onClick={() => setFilterActive(!filterActive)} className='filter-btn'>
                    {!filterActive ? <img src={filterBtn} alt="" /> : <img src={filterBtnA} alt="" />}
                </div> */}
        </Form>
      </div>
      {/* <div>
                <Accordion>
                    <Accordion.Collapse className={filterActive ? 'show' : ''} eventKey="0">
                        <div>
                            <Form className='d-flex column-gap-3 flex-wrap mb-3'>
                                <Form.Group className="" controlId="formBasicEmail">
                                    <Form.Label className="text-secondary">Тип садика</Form.Label>
                                    <Form.Select className='shadow-none'>
                                        <option className='select-option' hidden>Не указано</option>
                                        <option className='select-option'>От А до Я</option>
                                        <option className='select-option'>От Я до А</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="" controlId="formBasicPassword">
                                    <Form.Label className="text-secondary">Тип клиента</Form.Label>
                                    <Form.Select className='shadow-none'>
                                        <option hidden >Регион</option>
                                        <option className='select-option'>Default select</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group>
                                    <DatePicker
                                        label={'Дата фотосессии'}
                                        placeholder={'Не указано'}
                                        img={calendar}
                                        setIsActive={setIsActive}
                                        isActive={isActive}
                                        navTitles={{
                                            days: 'MMMM <i>yyyy</i>',
                                            months: 'yyyy',
                                        }} />
                                </Form.Group>
                                <Form.Group>
                                    <DatePicker
                                        label={'Дата звонка'}
                                        placeholder={'Не указано'}
                                        setIsActive={setIsActive}
                                        img={calendar}
                                        isActive={isActive}
                                        navTitles={{
                                            days: 'MMMM <i>yyyy</i>',
                                            months: 'yyyy',
                                        }} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="text-secondary">Скидка %</Form.Label>
                                    <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="text-secondary">Колличество детей</Form.Label>
                                    <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                                </Form.Group>
                            </Form>
                        </div>
                    </Accordion.Collapse>
                </Accordion>
            </div> */}
    </div>
  )
}

export default ClientFilter
