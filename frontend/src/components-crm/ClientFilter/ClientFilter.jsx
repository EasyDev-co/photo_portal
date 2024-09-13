/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Form from 'react-bootstrap/Form';
import './styles/ClientFilter.scss'
import DatePicker from '../DatePicker/DatePicker';
import { useState } from 'react';
import people from '../../assets/icons/people.svg'
import filterBtn from '../../assets/icons/filter_button.svg'
import filterBtnA from '../../assets/icons/filter-btn-a.svg'
import { Accordion } from 'react-bootstrap';




const ClientFilter = () => {
    const [isActive, setIsActive] = useState(false);
    const [filterActive, setFilterActive] = useState(false);


    return (
        <div>
            <div className='d-flex align-items-center gap-3'>
                <Form className='d-flex column-gap-3 flex-wrap mb-3'>
                    <Form.Group className="" controlId="formBasicEmail">
                        <Form.Label>Детский сад</Form.Label>
                        <Form.Select className='shadow-none'>
                            <option className='select-option' hidden>Не указано</option>
                            <option className='select-option'>От А до Я</option>
                            <option className='select-option'>От Я до А</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="" controlId="formBasicPassword">
                        <Form.Label>Регион</Form.Label>
                        <Form.Select className='shadow-none'>
                            <option hidden >Регион</option>
                            <option className='select-option'>Default select</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <DatePicker
                            label={'Дата взаимодействия'}
                            placeholder={'Не указано'}
                            setIsActive={setIsActive}
                            isActive={isActive}
                            navTitles={{
                                days: 'MMMM <i>yyyy</i>',
                                months: 'yyyy',
                            }} />
                    </Form.Group>
                    <Form.Group>
                        <div className='form-control-wrap'>
                            <Form.Label>Менеджер</Form.Label>
                            <Form.Control className='shadow-none' placeholder='Не указано' />
                            <div className="control-img">
                                <img src={people} alt="" />
                            </div>
                        </div>
                    </Form.Group>
                    <div onClick={() => setFilterActive(!filterActive)} className='filter-btn'>
                    {!filterActive ? <img src={filterBtn} alt="" /> : <img src={filterBtnA} alt="" />}
                </div>
                </Form>
            </div>
            <div>
                <Accordion>
                    <Accordion.Collapse className={filterActive ? 'show' : ''} eventKey="0">
                        <div>
                            <Form className='d-flex column-gap-3 flex-wrap mb-3'>
                                <Form.Group className="" controlId="formBasicEmail">
                                    <Form.Label>Тип садика</Form.Label>
                                    <Form.Select className='shadow-none'>
                                        <option className='select-option' hidden>Не указано</option>
                                        <option className='select-option'>От А до Я</option>
                                        <option className='select-option'>От Я до А</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="" controlId="formBasicPassword">
                                    <Form.Label>Тип клиента</Form.Label>
                                    <Form.Select className='shadow-none'>
                                        <option hidden >Регион</option>
                                        <option className='select-option'>Default select</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group>
                                    <DatePicker
                                        label={'Дата фотосессии'}
                                        placeholder={'Не указано'}
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
                                        isActive={isActive}
                                        navTitles={{
                                            days: 'MMMM <i>yyyy</i>',
                                            months: 'yyyy',
                                        }} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Скидка %</Form.Label>
                                    <Form.Control className='shadow-none' placeholder='Не указано' />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Колличество детей</Form.Label>
                                    <Form.Control className='shadow-none' placeholder='Не указано' />
                                </Form.Group>
                            </Form>
                        </div>
                    </Accordion.Collapse>
                </Accordion>
            </div>
        </div>

    );
}

export default ClientFilter;