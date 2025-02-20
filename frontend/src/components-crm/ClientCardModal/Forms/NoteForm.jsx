import React, { useState } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'
import { postNoteWithToken } from '../../../http/client-cards/postNotes'

const NoteForm = ({ cardId, closeModal, addNote }) => {
  const access = localStorage.getItem('access') // Get access token
  const [noteText, setNoteText] = useState('')
  const maxCharacters = 100

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { value } = e.target
    // Limit the input to a maximum of 100 characters
    if (value.length <= maxCharacters) {
      setNoteText(value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const postNote = async () => {
          const response = await postNoteWithToken(
            {access,
            data:{client_card:cardId, text:noteText,}}
          ) 
          if (response.ok) {
            const data = await response.json() 
            console.log(data);
            
            addNote(data)
            setNoteText('')
            closeModal()
          } else {
            const err = await response.json()
            setErrors(err)
            console.error('Failed to post note')
          }

      }

      if(noteText.length>0){
        postNote()
      }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="noteText">
        <Form.Control
          as="textarea"
          rows={6}
          style={{ padding: '15px', resize: 'none', height: '120px' }}
          value={noteText}
          onChange={handleChange}
          placeholder="Write a message"
        />
        <Form.Text className="text-muted">
          {noteText.length} / {maxCharacters}
        </Form.Text>
        {errors.text && <div className="text-danger">{errors.text[0]}</div>}
      </Form.Group>
      <ModalFooter style={{ padding: '5px' }}>
        <Button className="btn-filter-reset text-center" onClick={closeModal}>Отмена</Button>
        <Button className="create-btn" style={{ padding: '7px 12px' }} onClick={handleSubmit}>
          Добавить
        </Button>
      </ModalFooter>
    </Form>
  )
}

export default NoteForm
