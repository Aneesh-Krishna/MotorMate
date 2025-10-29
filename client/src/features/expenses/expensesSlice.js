import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// ---- Async actions ----
export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async (vehicleId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const payload = {
    userId: user?.id || user?._id || '',
  };

  const url = vehicleId ? `/expenses/all?vehicle=${vehicleId}` : '/expenses/all';
  const res = await api.post(url, payload);
  return res.data;
});

export const addExpense = createAsyncThunk('expenses/add', async (data) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const payload = {
    ...data,
    userId: user?.id || user?._id || '',
  };
  
  const res = await api.post('/expenses/add', payload);
  return res.data;
});

export const deleteExpense = createAsyncThunk('expenses/delete', async (id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const payload = {
    userId: user?.id || user?._id || '',
  };
  await api.post(`/expenses/delete/${id}`, payload);
  return id;
});

export const updateExpense = createAsyncThunk('expenses/update', async ({ id, data }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const payload = {
    ...data,
    userId: user?.id || user?._id || '',
  };
  
  const res = await api.post(`/expenses/edit/${id}`, payload);
  return res.data;
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
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export default expensesSlice.reducer;
