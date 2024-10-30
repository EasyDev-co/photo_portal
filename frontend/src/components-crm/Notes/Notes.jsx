import { Card, Tabs } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import './styles/Notes.scss';


const Notes = ({notes}) => {
    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    };
    
    return (
        <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3 d-flex "
            fill
        >
            <Tab eventKey="home" className="shadow-none border-0 d-flex flex-column gap-2" title="Важные">

                {notes&&notes.map((item, i)=>{
                    const date = formatDate(item.created_at)
                    return <Card className="" key={i}>
                    <Card.Header className="border-0">
                        <div>
                            {date}
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
                           {item.text}
                        </div>
                    </Card.Body>
                </Card>
                })}

            </Tab>
            <Tab eventKey="profile" className="shadow-none" title="Все">
                Tab content for Profile
            </Tab>
        </Tabs>
    );
}

export default Notes;