import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './assets/searchBar.css'
import { useSearch } from '../Search/SearchProvider.jsx'
import Dropdown from 'react-bootstrap/Dropdown';
import { MdClear } from "react-icons/md";


const SearchBar = () => {

  const { searchKeyWord, setSearchKeyWord } = useSearch()
  // console.log(searchKeyWord)

  const handleSearchTopic = (topic) => {
    setSearchKeyWord(topic)
  }

  const clearSearch = () => {
    setSearchKeyWord('')
  }


  const categories = [
    'Workout', 'Fitness', 'Diet', 'General Discussion', 'Treadmill', 'Running', 'Cycling', 'Cardio', 'Gym', 'Nutrition', 'Meditation'
  ]


  return (
    <div className='searchDiv'>
      <MdClear className='clearBtn' onClick={clearSearch} />
      <Form className="d-flex searchBar">
        <Row>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search posts.."
              className="mr-sm-2"
              value={searchKeyWord}
              onChange={(event) => setSearchKeyWord(event.target.value)}
            />
          </Col>
          <Col xs="auto">
          </Col>
        </Row>
      </Form>
      <div>
        <Dropdown>
          <Dropdown.Toggle
            className='dropDownToggleTopic'
            variant="secondary"
          >
            Select a topic
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {categories.map((topic, index) => (
              <Dropdown.Item
                onClick={() => handleSearchTopic(topic)}
                key={index}
              >
                {topic}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default SearchBar;
