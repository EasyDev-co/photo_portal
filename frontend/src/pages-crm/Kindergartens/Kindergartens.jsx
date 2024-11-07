import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import './styles/Kindergartens.scss'
import ClientFilter from '../../components-crm/ClientFilter/ClientFilter'
import ClientCard from '../../components-crm/ClientCard/ClientCard'
import { Pagination } from 'react-bootstrap'
import { fetchClientCardsWithTokenInterceptor } from '../../http/client-cards/getClientCards'
import { fetchKindergartensWithTokenInterceptor } from '../../http/client-cards/getKindergartens'
import ClientModal from '../../components-crm/ClientCardModal/ClientModal'
import ClientCardForm from '../../components-crm/ClientCardModal/Forms/ClientCardForm'

const Kindergartens = () => {
  const itemsPerPage = 12 // Number of cards per page
  const [currentPage, setCurrentPage] = useState(1)
  const [clientCards, setClientCards] = useState([]) // State for storing client cards
  const [kindergartens, setKindergartens] = useState([])
  const access = localStorage.getItem('access') // Get the access token from local storage

  const [isOpen, setIsOpen] = useState(false)

  const handleShowModal = () => {
    setIsOpen(true)
  }
  const handleCloseModal = () => {
    setIsOpen(false)
  }

  const handleAddClientCard = (card)=>{
    setClientCards([card,...clientCards])
  }

  useEffect(() => {
    const fetchClientCards = async () => {
      try {
        const response = await fetchClientCardsWithTokenInterceptor(access)
        if (response.ok) {
          const data = await response.json() // Parse the JSON response
          setClientCards(data.reverse()) // Update state with fetched data
        } else {
          console.error('Failed to fetch client cards')
        }
      } catch (error) {
        console.error('Error fetching client cards:', error)
      }
    }

    const fetchKindergartens = async () => {
      try {
        const response = await fetchKindergartensWithTokenInterceptor(access)
        if (response.ok) {
          const data = await response.json() // Parse the JSON response
          setKindergartens(data) // Update state with fetched data
        } else {
          console.error('Failed to fetch kindergartens')
        }
      } catch (error) {
        console.error('Error fetching client cards:', error)
      }
    }

    const postClientCard = async () => {}

    fetchClientCards()
    fetchKindergartens()
  }, [access]) // Fetch when the component mounts or when the access token changes

  // Function for pagination
  const paginate = (array, page_number, page_size) => {
    return array.slice((page_number - 1) * page_size, page_number * page_size)
  }

  const currentItems = paginate(clientCards, currentPage, itemsPerPage)
  const totalItems = clientCards.length // Update total items from fetched data
  const totalPages = Math.ceil(totalItems / itemsPerPage) // Calculate total pages

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="page-crm">
      <ClientModal
        title="Добавить карточку клиента"
        show={isOpen}
        handleClose={handleCloseModal}
      >
        <ClientCardForm closeModal={handleCloseModal} handleAddClientCard={handleAddClientCard}/>
      </ClientModal>
      <div></div>
      <div className="header-title">
        <h1 className="">Клиенты</h1>
        <div>
          <Button className="create-btn" onClick={handleShowModal}>
            Создать
          </Button>
        </div>
      </div>
      <div className="">
        <ClientFilter />
        <div
          className="d-flex flex-wrap gap-3"
          style={{
            height: 'calc(100vh - 80px)',
          }}
        >
          {currentItems.map((item) => (
            <ClientCard key={item.id} data={item} /> // Используйте ключ для оптимизации
          ))}
        </div>
        <Pagination className="justify-content-center py-3 gap-1">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              active={index + 1 === currentPage}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  )
}

export default Kindergartens