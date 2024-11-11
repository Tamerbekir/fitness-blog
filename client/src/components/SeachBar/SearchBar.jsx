import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './assets/searchBar.css'
import { useSearch } from '../Search/SearchProvider.jsx'

const SearchBar = () => {

    const { searchKeyWord, setSearchKeyWord } = useSearch()
    console.log(searchKeyWord)
  
  return (
    <div>
      <Form className="d-flex">
        <Row>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              value={searchKeyWord}
              onChange={(event) => setSearchKeyWord(event.target.value)}
            />
          </Col>
          <Col xs="auto">
            {/* <Button type="submit">Submit</Button> */}
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchBar;
