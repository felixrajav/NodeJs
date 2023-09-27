import React, { useState } from 'react'
import{Link} from 'react-router-dom'
import "./Navbar.css"
import { NavLink } from 'react-router-dom'
function Navbar() {
    const[menuOpen, setMenuOpen]=useState(false)
  return (
    <nav>
        <Link to='/' className='title'>Home</Link>
        <div className='menu' onClick={()=>{
            setMenuOpen(!menuOpen)
        }}>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <ul className={menuOpen ? "open" : ""}>
            <li><NavLink to='/'>register</NavLink></li>
            <li><NavLink to="/login">login</NavLink></li>
            <li><NavLink to="/home">home</NavLink></li>
        </ul>
    </nav>
  )
}

export default Navbar