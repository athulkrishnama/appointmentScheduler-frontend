import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router'
import { Provider } from 'react-redux';
import store from './store/store';
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import {ToastContainer,} from 'react-toastify'

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/signup" element={<Signup/>} />
                </Routes>
            </BrowserRouter>
            <ToastContainer/>
        </Provider>
    )
}

export default App
