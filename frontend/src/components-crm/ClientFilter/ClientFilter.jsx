import Form from 'react-bootstrap/Form';
import './styles/ClientFilter.scss';
import DatePicker from '../DatePicker/DatePicker';
import { useEffect, useState } from 'react';
import calendar from '../../assets/icons/calendar-event.svg';
import { localUrl } from '../../constants/constants';
import ManagerSelectInput from '../ClientCardModal/Forms/InputsField/SearchMultiplyManager';

const ClientFilter = ({ onFilterChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [regions, setRegions] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedKindergarten, setSelectedKindergarten] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});

  const access = localStorage.getItem('access');

  const handleManagerSelect = (selectedManager) => {
    setManagers(selectedManager);
    onFilterChange({ managers: selectedManager, selectedRegion, selectedKindergarten, selectedDate });
  };

  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    onFilterChange({ managers, selectedRegion: regionId, selectedKindergarten, selectedDate });
  };

  const handleKindergartenChange = (e) => {
    setSelectedKindergarten(e.target.value);
    onFilterChange({ managers, selectedRegion, selectedKindergarten: e.target.value, selectedDate });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onFilterChange({ managers, selectedRegion, selectedKindergarten, selectedDate: date });
  };

  useEffect(() => {
    getRegions().then((regions) => {
      if (Array.isArray(regions) && regions.length > 0) {
        setRegions(regions);
      } else {
        console.warn('Получены пустые данные или данные не массив');
      }
    }).catch((error) => {
      console.error('Ошибка при получении регионов:', error);
    });
  }, []);

  const getRegions = async () => {
    try {
      const response = await fetch(`${localUrl}/api/v1/region/search/`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
      });
      const data = await response.json();
      return data.map((item) => ({ id: item.id, name: item.name }));
    } catch (error) {
      console.error('Ошибка при получении регионов:', error);
      return [];
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        <Form className="d-flex column-gap-3 flex-wrap mb-3">
          <Form.Group controlId="formKindergarten">
            <Form.Label className="text-secondary">Детский сад</Form.Label>
            <Form.Select className="shadow-none" onChange={handleKindergartenChange} style={{ cursor: 'pointer' }}>
              <option hidden>Не указано</option>
              <option>От А до Я</option>
              <option>От Я до А</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formRegion">
            <Form.Label className="text-secondary">Регион</Form.Label>
            <Form.Select className="shadow-none" onChange={handleRegionChange} style={{ cursor: 'pointer' }}>
              <option hidden>Регион</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <DatePicker
              label="Дата взаимодействия"
              placeholder="Не указано"
              setIsActive={setIsActive}
              img={calendar}
              isActive={isActive}
              onDateChange={handleDateChange}
              navTitles={{
                days: 'MMMM <i>yyyy</i>',
                months: 'yyyy',
              }}
            />
          </Form.Group>
          <ManagerSelectInput
            access={access}
            multiplyObject
            onSelect={handleManagerSelect}
            errors={errors}
            name="Менеджер"
          />
        </Form>
      </div>
    </div>
  );
};

export default ClientFilter;
