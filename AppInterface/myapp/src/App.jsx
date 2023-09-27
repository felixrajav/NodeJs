import { useState } from 'react'
import './App.css'
import Navbar from './Navbar'
import {Routes,Route,Navigate} from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import Home from './Home'
// import Home from '/Home'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  }

  return (
  <>
  <Navbar/>
  <Routes>
    <Route path="/" element={<Register/>}></Route>
    <Route path="/login" element={<Login setToken={setToken}></Login>}></Route>
    <Route path="/home" element={token ? <Home/>: <Navigate to='/login'></Navigate>}></Route>
   
  </Routes>
  </>
  )
}

export default App
