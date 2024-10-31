import { Card, Tabs, CardHeader } from 'react-bootstrap'
import addButton from '../../assets/icons/icon_button-add.svg'
import Tab from 'react-bootstrap/Tab'
import './styles/Notes.scss'
import { useState } from 'react'
import ClientModal from '../ClientCardModal/ClientModal'
import NoteForm from '../ClientCardModal/Forms/NoteForm'
import EditNoteForm from '../ClientCardModal/Forms/EditNoteForm'
import { useParams } from 'react-router-dom'

const Notes = ({ notes, addNote, deleteNote , editNote}) => {
  const { id } = useParams()

  const [activeTab, setActiveTab] = useState('profile')

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    return date.toLocaleDateString('ru-RU', options)
  }

  const [showModalAdd, setShowModalAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editId, setEditId] = useState("")

  const handleShowAdd = () => setShowModalAdd(true)
  const handleCloseAdd = () => {
    setShowModalAdd(false)
  }

  const handleShowEdit = (id) => {
    setEditId(id)
    setShowEdit(true)
}
  const handleCloseEdit = () => {
    setShowEdit(false)
  }

  return (
    <>
      <ClientModal
        title="Добавить заметку"
        show={showModalAdd}
        handleClose={handleCloseAdd}
      >
        <NoteForm cardId={id} closeModal={handleCloseAdd} addNote={addNote} />
      </ClientModal>


      <ClientModal
        title="Просмотр заметки"
        show={showEdit}
        handleClose={handleCloseEdit}
      >
        <EditNoteForm closeModal={handleCloseEdit} noteId={editId} formatDate={formatDate} deleteItem={deleteNote} cardId={id} editNote={editNote}/>
      </ClientModal>
      

      <Card.Header
        style={{
          fontSize: '17px',
        }}
        className="border-0 fw-600 p-0"
      >
        Заметки
        <div className="cursor-pointer">
          <button onClick={handleShowAdd}>
            <img src={addButton} alt="" />
          </button>
        </div>
      </Card.Header>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        id="controlled-tab-example"
        className="mb-3 d-flex custom-tabs"
        fill
      >
        <Tab eventKey="home" title="Важные" />
        <Tab eventKey="profile" title="Все" />
      </Tabs>

      {activeTab === 'home' && (
        <div className="shadow-none border-0 d-flex flex-column gap-2">
          {notes &&
            notes
              .filter((note) => note.priority)
              .map((item, i) => {
                const date = formatDate(item.created_at)
                return (
                  <Card className="cursor-pointer" key={i} onClick={()=>handleShowEdit(item.id)}>
                    <Card.Header className="border-0">
                      <div>{date}</div>
                      <div style={{ color: '#0a58ca' }}>Имя Фамилия</div>
                    </Card.Header>
                    <Card.Body
                      className="py-2"
                      style={{ maxWidth: '545px', fontSize: '15px' }}
                    >
                      <div className="truncate text-secondary">{item.text}</div>
                    </Card.Body>
                  </Card>
                )
              })}
          {notes &&
            notes.length > 0 &&
            !notes.some((note) => note.priority) && (
              <div className="text-muted">Важных заметок нет</div>
            )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="shadow-none border-0 d-flex flex-column gap-2">
          {notes &&
            notes.map((item, i) => {
              const date = formatDate(item.created_at)
              return (
                <Card className="cursor-pointer" key={i} onClick={()=>handleShowEdit(item.id)}>
                  <Card.Header className="border-0">
                    <div>{date}</div>
                    <div style={{ color: '#0a58ca' }}>Имя Фамилия</div>
                  </Card.Header>
                  <Card.Body
                    className="py-2"
                    style={{ maxWidth: '545px', fontSize: '15px' }}
                  >
                    <div className="truncate text-secondary">{item.text}</div>
                  </Card.Body>
                </Card>
              )
            })}
        </div>
      )}
    </>
  )
}

export default Notes
