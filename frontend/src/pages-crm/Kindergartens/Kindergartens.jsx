import {useState, useEffect} from 'react'
import {Button,Pagination} from 'react-bootstrap'
import './styles/Kindergartens.scss'
import ClientFilter from '../../components-crm/ClientFilter/ClientFilter'
import ClientCard from '../../components-crm/ClientCard/ClientCard'

import {fetchClientCardsWithTokenInterceptor} from '../../http/client-cards/getClientCards'
import {fetchKindergartensWithTokenInterceptor} from '../../http/client-cards/getKindergartens'
import ClientModal from '../../components-crm/ClientCardModal/ClientModal'
import ClientCardForm from '../../components-crm/ClientCardModal/Forms/ClientCardForm'

const Kindergartens = () => {
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const [clientCards, setClientCards] = useState([]);
    const [kindergartens, setKindergartens] = useState([]);
    const [filters, setFilters] = useState({});
    const access = localStorage.getItem('access');
    const [isOpen, setIsOpen] = useState(false)

    const handleShowModal = () => {
        setIsOpen(true)
      }
      const handleCloseModal = () => {
        setIsOpen(false)
      }
      const handleAddClientCard = (item) => {
        setClientCards([item, ...clientCards])
    }

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        console.log("Фильтры обновлены:", newFilters);
    };

    useEffect(() => {
        const fetchClientCards = async () => {
            try {
                const response = await fetchClientCardsWithTokenInterceptor({access, filters});
                if (response.ok) {
                    const data = await response.json();
                    setClientCards(data.reverse());
                } else {
                    console.error('Failed to fetch client cards');
                }
            } catch (error) {
                console.error('Error fetching client cards:', error);
            }
        };

        const fetchKindergartens = async () => {
            try {
                const response = await fetchKindergartensWithTokenInterceptor(access);
                if (response.ok) {
                    const data = await response.json();
                    setKindergartens(data);
                } else {
                    console.error('Failed to fetch kindergartens');
                }
            } catch (error) {
                console.error('Error fetching kindergartens:', error);
            }
        };

        fetchClientCards();
        fetchKindergartens();
    }, [access, filters]);

    const paginate = (array, page_number, page_size) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const currentItems = paginate(clientCards, currentPage, itemsPerPage);
    const totalItems = clientCards.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="page-crm">
            <ClientModal
                title="Добавить карточку клиента"
                show={isOpen}
                handleClose={handleCloseModal}
            >
                <ClientCardForm closeModal={handleCloseModal} handleAddClientCard={handleAddClientCard}/>
            </ClientModal>
            <div className="header-title">
                <h1>Клиенты</h1>
                <Button onClick={handleShowModal} className="create-btn">Создать</Button>
            </div>
            <ClientFilter onFilterChange={handleFilterChange}/>
            <div className="d-flex flex-wrap gap-3">
                {currentItems.map((item) => (
                    <ClientCard key={item.id} data={item}/>
                ))}
            </div>
            <Pagination className="justify-content-center py-3 gap-1">
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        active={index + 1 === currentPage}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)}
                                 disabled={currentPage === totalPages}/>
            </Pagination>
        </div>
    );
};

export default Kindergartens;