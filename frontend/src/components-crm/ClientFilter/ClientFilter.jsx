/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Form from 'react-bootstrap/Form'
import './styles/ClientFilter.scss'
import DatePicker from '../DatePicker/DatePicker'
import { useEffect, useState } from 'react'
import calendar from '../../assets/icons/calendar-event.svg'
import { localUrl } from '../../constants/constants'
import ManagerSelectInput from '../ClientCardModal/Forms/InputsField/SearchManagerField'

const ClientFilter = () => {
  const [isActive, setIsActive] = useState(false)
  const [regions, setRegions] = useState([]);
  const [managers, setManagers] = useState([]);
  const [errors, setErrors] = useState({})

  const access = localStorage.getItem('access')

  const handleManagerSelect = (selectedManager) => {
    setManagers(selectedManager);
};

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
          <ManagerSelectInput
                access={access}
                multiplyObject={true}
                onSelect={handleManagerSelect}
                errors={errors}
                name='Менеджер'
              />
        </Form>
      </div>
    </div>
  )
}

export default ClientFilter
