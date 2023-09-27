import { useState } from 'react'
import React from 'react'
import axios from 'axios'

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleResetRequest = async () => {
      try {
        await axios.post('/api/forgot-password', { email });
        setMessage('Password reset link sent to your email');
      } catch (error) {
        setMessage('User not found');
      }
    };
  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleResetRequest}>Send Reset Link</button>
      <p>{message}</p>
    </div>
  )
}

export default ForgetPassword