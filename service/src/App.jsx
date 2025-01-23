import { BrowserRouter as Router, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ServiceManagement from "./pages/ServiceManagement";
import Quotations from "./pages/Quotations";
import ScheduledServices from "./pages/ScheduledServices";
import ServiceHistory from './pages/ServiceHistory';
import Reviews from './pages/Reviews'
import Coupons from './pages/Coupons'
import Profile from './pages/Profile'
import store from "./store/store";
import Layout from "./components/layout/Layout";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from './components/protectedComponents/ProtectedRoute'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<ProtectedRoute><Home /></ProtectedRoute> } />
            <Route path="/serviceManagement" element={<ProtectedRoute><ServiceManagement /></ProtectedRoute>} />
            <Route path="/coupons" element={<h1>This is coupons page</h1>} />
            <Route path="/quotations" element={<ProtectedRoute><Quotations /></ProtectedRoute>} />
            <Route path="/schedule-services" element={<ProtectedRoute><ScheduledServices /></ProtectedRoute>} />
            <Route path="/service-history" element={<ProtectedRoute><ServiceHistory /></ProtectedRoute>}/>
            <Route path='/reviews' element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
            <Route path='/coupons' element={<ProtectedRoute><Coupons /></ProtectedRoute>} />
            <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer/>
    </Provider>
  );
}

export default App;
