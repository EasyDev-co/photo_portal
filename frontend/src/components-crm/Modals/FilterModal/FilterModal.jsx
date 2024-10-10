/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useState } from 'react';
import DatePicker from '../../DatePicker/DatePicker';
import '../styles/Modals.scss'
import CloseButton from 'react-bootstrap/CloseButton';
import calendarGray from '../../../assets/icons/calendar-gray.svg'
import { Accordion, Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import AccordionInput from '../../Accordions/AccordironInput/AccorderonInput';
import { arrayOfObjects } from '../../../constants/mockData';
import search from '../../../assets/icons/search.svg'
import peopleGray from '../../../assets/icons/people-gray.svg'

const FilterModal = ({ active, setActive, text, height }) => {

    const [isActive, setIsActive] = useState(false);


    return (
        <div className={active ? 'modal__active' : 'modal-custom'}>
            <div style={{ height: height - 70 }} className={'modal__content'}>
                <div className='modal-custom__header d-flex align-items-center justify-content-between p-3'>
                    <div className='fw-600'>
                        Фильтры
                    </div>
                    <CloseButton onClick={() => setActive(false)} className='p-0 shadow-none' style={{
                        width: '9px',
                        height: '9px'
                    }} />
                </div>
                <div className='p-4 d-flex flex-column gap-2'>
                    <div className='border-bottom pb-3'>
                        <DatePicker
                            isModal
                            position={'left top'}
                            placeholder={'Выбрать'}
                            label={'ДАТА'}
                            img={calendarGray}
                            setIsActive={setIsActive}
                        />
                    </div>
                    <div className=''>
                        <AccordionInput
                            title={'РЕГИОН'}
                        />
                    </div>
                    <div className='d-flex flex-column gap-2'>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', paddingBottom: '16px', margin: '0' }}>СТАРШИЙ МЕНЕДЖЕР</Form.Label>
                            <div className='form-control-wrap'>
                                <Form.Control className='shadow-none' style={{ height: '38px' }} type="text" placeholder="Выбрать" />
                                <div>
                                    <img className='control-img' style={{ top: '35%' }} src={peopleGray} alt="" />
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', paddingBottom: '16px', margin: '0' }}>МЕНЕДЖЕР</Form.Label>
                            <div className='form-control-wrap'>
                                <Form.Control className='shadow-none' style={{ height: '38px' }} type="text" placeholder="Выбрать" />
                                <div>
                                    <img className='control-img' style={{ top: '35%' }} src={peopleGray} alt="" />
                                </div>
                            </div>
                        </Form.Group>
                    </div>
                    <div className='border-bottom py-3 '>
                        <AccordionInput
                            isClient
                            title={'ТИП КЛИЕНТА'}
                        />
                    </div>

                    <div className='d-flex flex-column gap-3 py-2'>
                        <div className='d-flex gap-2'>
                            <Form.Check
                                type='checkbox'
                                id='1'
                                className='form-check-custom shadow-none'
                            />
                            <div>
                                Разбивка по регионам
                            </div>
                        </div>
                        <div className='d-flex gap-2'>
                            <Button className='btn-filter-reset'>Сбросить</Button>
                            <Button className='btn-filter-apply'>Применить</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FilterModal;