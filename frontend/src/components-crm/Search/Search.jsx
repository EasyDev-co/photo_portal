import Form from 'react-bootstrap/Form';
import search from '../../assets/icons/search.svg';
import './styles/Search.scss';

const Search = () => {
    return (
        <Form>
            <div className='position-relative'>
                <Form.Group className="search-icon" controlId="formBasicEmail">
                    <Form.Control className='input-search' type="text" placeholder="Поиск..." />
                </Form.Group>
                <div className='search-img'>
                    <img src={search} alt="" />
                </div>
            </div>
        </Form>
    );
}

export default Search;