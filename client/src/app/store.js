import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import vehiclesReducer from '../features/vehicles/vehiclesSlice';
import expensesReducer from '../features/expenses/expensesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    expenses: expensesReducer
  },
});
