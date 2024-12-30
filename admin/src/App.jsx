import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router'
import { Provider } from 'react-redux';
import store from './store/store';
import Login from './pages/Login'
import Home from './pages/Home'
import {ToastContainer,} from 'react-toastify'
import ProtectedRoute from './components/protectedComponents/ProtectedRoute'

const App = () => {
    console.log(store.getState().user.accessToken)
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<><ProtectedRoute><Home /></ProtectedRoute></>} />
                </Routes>
            </BrowserRouter>
            <ToastContainer/>
        </Provider>
    )
}

export default App
