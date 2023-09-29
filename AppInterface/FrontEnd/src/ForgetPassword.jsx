import React from 'react'
import { useState } from 'react'
import { Container } from "react-bootstrap";
import { Form, Button } from "react-bootstrap";
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post(
            "http://localhost:8080/api/forgot-password",
            { email }
          );
    
          setMessage(response.data.message);
        } catch (error) {
          console.error(error.response.data.message);
        }
      };
  return (
    <Container className="bg-light text-black">
      <h1>Forget Password</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label onChange={handleChange} value={email} required>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <p>{message}</p>
    </Container>
  )
}

export default ForgetPassword