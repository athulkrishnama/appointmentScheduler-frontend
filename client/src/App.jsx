import {BrowserRouter, Routes, Route} from 'react-router'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import {ToastContainer,} from 'react-toastify'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </>
  )
}

export default App
