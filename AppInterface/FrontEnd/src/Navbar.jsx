import React,{useState} from 'react'
import './Navbar.css/'
import{Link} from 'react-router-dom'
import { NavLink } from 'react-router-dom'

function Navbar() {
    const[menuOpen, setMenuOpen]=useState(false)
  return (
    <nav>
        <Link to='/home' className='title'>Home</Link>
        <div className='menu' onClick={()=>{
            setMenuOpen(!menuOpen)
        }}>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <ul className={menuOpen ? "open" : ""}>
            <li><NavLink to='/'>register</NavLink></li>
            <li><NavLink to="/login">Login</NavLink></li>
            
        </ul>
    </nav>
  )
}

export default Navbar