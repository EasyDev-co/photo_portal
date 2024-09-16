import { useContext } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import { Form } from 'react-bootstrap';
import arrow from '../../../assets/icons/arrow-gray.svg'
import { arrayOfObjects } from '../../../constants/mockData';
import '../styles/Accordions.scss';
import search from '../../../assets/icons/search.svg'

function ContextAwareToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <div className='d-flex justify-content-between w-100'>
      <button
        type="button"
        style={{ color: '#6c757d', width: '100%', textAlign: 'start', fontSize: '12px', fontWeight: '600', paddingBottom: '16px' }}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
      <div style={isCurrentEventKey ? {
        transform: 'rotateZ(180deg)',
        transition: '.3s'
      } : {
        transform: 'rotateZ(0deg)',
        transition: '.3s'
      }}>
        <img src={arrow} alt="" />
      </div>
    </div>
  );
}

function AccordionInput({ title, isClient }) {
  return (
    <Accordion defaultActiveKey="0">
      <Card className='border-0'>
        <Card.Header className='border-0 p-0'>
          <ContextAwareToggle eventKey="0" className='text-secondary'>{title}</ContextAwareToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body className='p-0 d-flex flex-column gap-2'>
            {!isClient &&
              <div className='form-control-wrap'>
                <Form.Control className='shadow-none' placeholder='Поиск...' style={{ height: '38px' }} />
                <div>
                  <img className='control-img' style={{ top: '25%' }} src={search} alt="" />
                </div>
              </div>
            }
            <div className='d-flex flex-column gap-3 accord_checkbox-wrap '>
              {arrayOfObjects.map(elem => {
                return (
                  <div key={elem.id} className=' d-flex gap-2'>
                    <Form.Check
                      type='checkbox'
                      id={elem.id}
                      className='form-check-custom shadow-none'
                    />
                    <div>
                      Label
                    </div>
                  </div>
                )
              })}
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default AccordionInput;