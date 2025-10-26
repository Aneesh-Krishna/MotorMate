import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// ---- Async actions ----
export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async (vehicleId) => {
  const res = await api.get(`/expenses?vehicle=${vehicleId}`);
  return res.data;
});

export const addExpense = createAsyncThunk('expenses/add', async (data) => {
  const res = await api.post('/expenses', data);
  return res.data;
});

export const deleteExpense = createAsyncThunk('expenses/delete', async (id) => {
  await api.delete(`/expenses/${id}`);
  return id;
});

// ---- Slice ----
const expensesSlice = createSlice({
  name: 'expenses',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => { state.loading = true; })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(e => e._id !== action.payload);
      });
  }
});

export default expensesSlice.reducer;
