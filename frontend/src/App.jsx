import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Register from './Components/Register'
import Login from './Components/Login'
import Dashboard from './Components/Dashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Components/Navbar'

function App() {

  return (
    <>
      <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App