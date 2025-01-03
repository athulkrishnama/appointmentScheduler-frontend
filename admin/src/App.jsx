import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'
import { Provider } from 'react-redux';
import store from './store/store';
import Login from './pages/Login'
import Home from './pages/Home'
import Request from './pages/Request'
import { ToastContainer, } from 'react-toastify'
import ProtectedRoute from './components/protectedComponents/ProtectedRoute'
import Layout from './components/layout/Layout';

const App = () => {
    console.log(store.getState().user.accessToken)
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route index element={<><ProtectedRoute><Home /></ProtectedRoute></>} />
                        <Route path="/requests" element={<><ProtectedRoute><Request /></ProtectedRoute></>} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer />
        </Provider>
    )
}

export default App
