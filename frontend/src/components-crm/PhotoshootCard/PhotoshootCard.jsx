import { Card } from "react-bootstrap";

const PhotoshootCard = () => {
    return (
        <Card className="d-flex flex-row align-items-center justify-content-between px-2 py-2">
            <div>
                <Card.Title className="fw-500 fs-18">
                    Название садика
                </Card.Title>
                <Card.Body className="border-0 p-0 text-secondary">
                    ВОРО, ДС 76, Липецк, Осенняя соната, 70 детей, Дарья С.
                </Card.Body>
            </div>
            <Card.Footer className="border-0">
                13:00
            </Card.Footer>
        </Card>
    );
}

export default PhotoshootCard;