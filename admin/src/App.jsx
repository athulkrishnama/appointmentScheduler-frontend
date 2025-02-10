import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'
import { Provider } from 'react-redux';
import store from './store/store';
import Login from './pages/Login'
import Home from './pages/Home'
import Clients from './pages/Clients'
import Request from './pages/Request'
import Category from './pages/Category'
import ServiceProviders from './pages/ServiceProviders';
import { ToastContainer, } from 'react-toastify'
import ProtectedRoute from './components/protectedComponents/ProtectedRoute'
import Layout from './components/layout/Layout';
import Wallet from './pages/Wallet';

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route index element={<><ProtectedRoute><Home /></ProtectedRoute></>} />
                        <Route path="/requests" element={<><ProtectedRoute><Request /></ProtectedRoute></>} />
                        <Route path="/clients" element={<><ProtectedRoute><Clients /></ProtectedRoute></>} />
                        <Route path="/serviceProviders" element={<><ProtectedRoute><ServiceProviders /></ProtectedRoute></>} />
                        <Route path="/category" element={<><ProtectedRoute><Category /></ProtectedRoute></>} />
                        <Route path="/wallet" element={<><ProtectedRoute><Wallet /></ProtectedRoute></>} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer />
        </Provider>
    )
}

export default App
