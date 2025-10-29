import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './app/store';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import VehicleForm from './features/vehicles/VehicleForm';
import VehicleList from './features/vehicles/VehicleList';
import ExpenseList from './features/expenses/ExpenseList';
import ExpenseForm from './features/expenses/ExpenseForm';
import { setUser } from './features/auth/authSlice';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(setUser(user));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/vehicles" element={<PrivateRoute><VehicleList /></PrivateRoute>} />
        <Route path="/vehicles/new" element={<PrivateRoute><VehicleForm /></PrivateRoute>} />
        <Route path="/vehicles/edit" element={<PrivateRoute><VehicleForm /></PrivateRoute>} />
        <Route path="/expenses" element={<PrivateRoute><ExpenseList /></PrivateRoute>} />
        <Route path="/expenses/new" element={<PrivateRoute><ExpenseForm /></PrivateRoute>} />
        <Route path="/expenses/:id" element={<PrivateRoute><ExpenseForm /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
