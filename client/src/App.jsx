import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router'
import { Provider } from 'react-redux';
import store from './store/store';
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Quotes from './pages/Quotes'
import Layout from './components/layout/Layout'
import Services from './pages/Services'
import YourServices from './pages/YourServices'
import History from './pages/History'
import RecurringServices from './pages/RecurringServices'
import Profile from './pages/Profile'
import ServiceDetails from './pages/ServiceDetails'
import ProtectedRoute from './components/protectedComponents/ProtectedRoute'
import {ToastContainer,} from 'react-toastify'

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/signup" element={<Signup/>} />
                    <Route path="/" element={<Layout/>} >
                        <Route index element={<Home/>} />
                        <Route path="/services" element={<Services/>} />
                        <Route path="/quotes" element={<ProtectedRoute><Quotes/></ProtectedRoute>} />
                        <Route path="/yourServices" element={<ProtectedRoute><YourServices/></ProtectedRoute>} />
                        <Route path="/history" element={<ProtectedRoute><History/></ProtectedRoute>} />
                        <Route path="/recurringServices" element={<ProtectedRoute><RecurringServices/></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
                        <Route path="/serviceDetails/:id" element={<ServiceDetails/>} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <ToastContainer/>
        </Provider>
    )
}

export default App
