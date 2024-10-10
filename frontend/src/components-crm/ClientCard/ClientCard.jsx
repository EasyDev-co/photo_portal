import { Card } from "react-bootstrap";
import './style/ClientCard.scss'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import burger from '../../assets/icons/card-burger.svg'
import pencilSq from '../../assets/icons/pencil-square.svg'
import trash from '../../assets/icons/trash.svg'
import { useNavigate } from "react-router-dom";

const ClientCard = ({data}) => {
    const navigate = useNavigate();
    return ( 
        <Card onClick={()=>navigate(`/crm/kindergartens/${data.id}`)} className="card-shadow" style={{ width: '381px', borderRadius: '8px', border: 'none', padding: '24px' }}>
            <Card.Header className="card-header" style={{ border: 'none' }}>
                <div className="card-header-title">
                    Название садика {data.id}
                </div>
                <OverlayTrigger
                    trigger="click"
                    key={'bottom'}
                    placement={'bottom'}
                    overlay={
                        <Popover className="py-2 px-3" id={`popover-positioned-${'bottom'}`}>
                            <div className="card-popup-btn">
                                <div className=" fs-14">
                                    Редактировать
                                </div>
                                <div className="card-icon">
                                    <img src={pencilSq} alt="" />
                                </div>
                            </div>
                            <div className="  card-popup-btn">
                                <div className="fs-14">
                                    Удалить
                                </div>
                                <div className="card-icon">
                                    <img src={trash} alt="" />
                                </div>
                            </div>
                        </Popover>
                    }
                >
                    <div className="card-burger">
                        <img src={burger} alt="" />
                    </div>

                </OverlayTrigger>
            </Card.Header>
            <Card.Body >
                <Card.Text className="d-flex flex-column gap-3">
                    <div className="d-flex gap-1">
                        <div className="fw-400 text-secondary">Инфо: </div>
                        <div className="fw-400"> asdasda</div>
                    </div>
                    <div className="d-flex gap-1">
                        <div className="fw-400 text-secondary">Инфо: </div>
                        <div className="fw-400"> asdasda</div>
                    </div>
                    <div className="d-flex gap-1">
                        <div className="fw-400 text-secondary">Инфо: </div>
                        <div className="fw-400"> asdasda</div>
                    </div>
                </Card.Text>
            </Card.Body>
            <Card.Footer className="card-footer" style={{ border: 'none' }}>
                <div className="d-flex gap-1">
                    <div className="fw-400 fs-13 text-secondary">Менеджер:</div>
                    <div className="fw-400 fs-13 text-primary"> asdasda</div>
                </div>
            </Card.Footer>
        </Card>


    );
}

export default ClientCard;