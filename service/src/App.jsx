import { BrowserRouter as Router, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
            <Route path="/coupons" element={<h1>This is coupons page</h1>} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer/>
    </Provider>
  );
}

export default App;
