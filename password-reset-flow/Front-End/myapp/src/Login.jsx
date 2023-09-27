import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ForgetPassword from './ForgetPassword'; // Import the ForgetPassword component

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // State to toggle between Login and Forget Password views
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/login', formData);
      const { token } = response.data;
      setToken(token); // Store the token in your app.js state
      localStorage.setItem('token', token);
      // history.push('/protected');
      navigate('/home');
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  // Function to toggle between Login and Forget Password views
  const toggleForgetPassword = () => {
    setShowForgetPassword(!showForgetPassword);
  };

  return (
    <div>
      <h2>Login</h2>
      {showForgetPassword ? (
        // If showForgetPassword is true, render the ForgetPassword component
        <ForgetPassword />
      ) : (
        // If showForgetPassword is false, render the Login form
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={handleChange}
              value={formData.username}
              required
            ></input>
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              required
            ></input>
          </div>
          <button type="submit">Login</button>
          <button type="button" onClick={toggleForgetPassword}>
            Forget Password
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
