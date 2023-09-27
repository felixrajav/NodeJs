import React ,{useState}from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import axios from 'axios'

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/signup', formData);
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <div className="mb-3 mt-5">
         <h1 className="text-center bg-dark text-white">Sing Up</h1>
     <Container className="bg-light text-black">
    <Form onSubmit={handleSubmit} > 
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label  onChange={handleChange}  value={formData.username} required>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label  onChange={handleChange}  value={formData.password} required>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
     
    </Form>
    </Container>
    </div>  
  )
}

export default Register