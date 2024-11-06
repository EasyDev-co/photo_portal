import { useState, useEffect } from 'react'
import { Card, CardHeader, Form } from 'react-bootstrap'
import addButton from '../../assets/icons/icon_button-add.svg'
import TaskForm from '../../components-crm/ClientCardModal/Forms/TaskForm'
import ClientModal from '../../components-crm/ClientCardModal/ClientModal'
import EditTaskForm from '../../components-crm/ClientCardModal/Forms/EditTaskForm'

import { useParams } from 'react-router-dom'

const CurrentTasks = ({ tasks, formatDate, addTask, editTask, deleteTask  }) => {

    const { id } = useParams()

  const [showModalAdd, setShowModalAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editId, setEditId] = useState("")

  

  const handleShowAdd = () => {
    setShowModalAdd(true)
  }
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
    <div className="card-shadow">
      <ClientModal
        title="Добавить задачу"
        show={showModalAdd}
        handleClose={handleCloseAdd}
      >
        <TaskForm closeModal={handleCloseAdd} cardId={id} addTask={addTask} />
      </ClientModal>

      <ClientModal
       title="Редактировать задачу"
       show={showEdit}
       handleClose={handleCloseEdit}>
        <EditTaskForm closeModal={handleCloseEdit} deleteItem={deleteTask} editTask={editTask} taskId={editId} formatDate={formatDate}/>
      </ClientModal>
      <Card
        className="border-0"
        style={{
          padding: '24px',
          gap: '24px',
        }}
      >
        <CardHeader
          style={{
            fontSize: '17px',
          }}
          className="border-0 fw-600 p-0"
        >
          Текущие задачи
          <div className="cursor-pointer">
            <button onClick={handleShowAdd}>
              {' '}
              <img src={addButton} alt="" />
            </button>
          </div>
        </CardHeader>

        <Card.Body
          className="p-0 gap-2 d-flex flex-column scroll-body"
          style={{
            height: '240px',
          }}
        >
          {tasks
            ? tasks.map((elem) => {
                return (
                  <Card
                    key={elem.id}
                    className="d-flex flex-row align-items-center justify-content-between p-3 "
                    onClick={()=>handleShowEdit(elem.id)}
                  >
                    <div>
                      <CardHeader
                        style={{
                          fontSize: '15px',
                        }}
                        className="border-0 fw-500 p-0"
                      >
                        {elem.text}
                      </CardHeader>
                      <Card.Body
                        className="p-0"
                        style={{
                          color: '#0a58ca',
                          fontSize: '15px',
                        }}
                      >
                        До {formatDate(elem.date_end)}
                      </Card.Body>
                    </div>
                    <div>
                      <Form.Check
                        type="checkbox"
                        id="1"
                        className="form-check-custom-task shadow-none"
                      />
                    </div>
                  </Card>
                )
              })
            : ''}
        </Card.Body>
      </Card>
    </div>
  )
}

export default CurrentTasks
