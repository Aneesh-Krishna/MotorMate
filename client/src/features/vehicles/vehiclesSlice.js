import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// ---- Async actions ----
export const fetchVehicles = createAsyncThunk('vehicles/fetchAll', async () => {
  const res = await api.get('/vehicles');
  return res.data;
});

export const addVehicle = createAsyncThunk('vehicles/add', async (data) => {
  const user = JSON.parse(localStorage.getItem('user'));
  let toSendData = {
    ...data,
    user: user.id || '',
  };
  const res = await api.post('/vehicles', toSendData);
  return res.data;
});

export const updateVehicle = createAsyncThunk('vehicles/update', async (id) => {
  const res = await api.post('/vehicles', id);
  return res.id;
});

export const deleteVehicle = createAsyncThunk('vehicles/delete', async (id) => {
  await api.delete(`/vehicles/${id}`);
  return id;
});

// ---- Slice ----
const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState: { items: [], status: 'idle', error: null }, // 'idle' | 'loading' | 'succeeded' | 'failed'
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.items = state.items.filter(v => v._id !== action.payload);
      });
  }
});

export default vehiclesSlice.reducer;
