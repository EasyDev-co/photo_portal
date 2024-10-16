import { Card, Tabs } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import './styles/Notes.scss';


const Notes = () => {
    return (
        <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3 d-flex "
            fill
        >
            <Tab eventKey="home" className="shadow-none border-0 d-flex flex-column gap-2" title="Важные">

                <Card className="">
                    <Card.Header className="border-0">
                        <div>
                            08.08.2024
                        </div>
                        <div style={{
                            color: '#0a58ca'
                        }}>
                            Имя Фамилия
                        </div>
                    </Card.Header>
                    <Card.Body className="py-2" style={{
                        maxWidth: '545px',
                        fontSize: '15px'
                    }}>
                        <div className="truncate text-secondary">
                            Lorem ipsum dolor sit amet consectetur. Vel commodo nullam eu gravida porttitor ut. Faucibus sodales viverra arcu quis dignissim at tellus at posuere.
                        </div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header className="border-0">
                        <div>
                            08.08.2024
                        </div>
                        <div style={{
                            color: '#0a58ca'
                        }}>
                            Имя Фамилия
                        </div>
                    </Card.Header>
                    <Card.Body className="py-2" style={{
                        maxWidth: '545px',
                        fontSize: '15px'
                    }}>
                        <div className="truncate text-secondary">
                            Lorem ipsum dolor sit amet consectetur. Vel commodo nullam eu gravida porttitor ut. Faucibus sodales viverra arcu quis dignissim at tellus at posuere.
                        </div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header className="border-0">
                        <div>
                            08.08.2024
                        </div>
                        <div style={{
                            color: '#0a58ca'
                        }}>
                            Имя Фамилия
                        </div>
                    </Card.Header>
                    <Card.Body className="py-2" style={{
                        maxWidth: '545px',
                        fontSize: '15px'
                    }}>
                        <div className="truncate text-secondary">
                            Lorem ipsum dolor sit amet consectetur. Vel commodo nullam eu gravida porttitor ut. Faucibus sodales viverra arcu quis dignissim at tellus at posuere.
                        </div>
                    </Card.Body>
                </Card>     
            </Tab>
            <Tab eventKey="profile" className="shadow-none" title="Все">
                Tab content for Profile
            </Tab>
        </Tabs>
    );
}

export default Notes;