import { useState } from 'react'
import './App.css'
import ForgetPassword from './ForgetPassword'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ForgetPassword/>
    </>
  )
}

export default App
