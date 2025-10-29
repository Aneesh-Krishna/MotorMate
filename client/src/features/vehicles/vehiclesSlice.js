import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// ---- Async actions ----
export const fetchVehicles = createAsyncThunk('vehicles/fetchAll', async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const payload = {
    userId: user?.id || user?._id || '',
  };
  const res = await api.post('/vehicles/all', payload);
  return res.data;
});

export const addVehicle = createAsyncThunk('vehicles/add', async (data) => {
  const user = JSON.parse(localStorage.getItem('user'));
  let toSendData = {
    ...data,
    user: user?.id || user?._id || '',
  };
  const res = await api.post('/vehicles', toSendData);
  return res.data;
});

export const updateVehicle = createAsyncThunk('vehicles/update', async (actionPayload) => {
  const user = JSON.parse(localStorage.getItem('user'));
  let toSendData = {
    ...actionPayload,
    userId: user?.id || user?._id || '',
  };

  // const payload = {
  //   userId: user?.id || user?._id || '',
  //   ...formData,
  // };
  const res = await api.post(`/vehicles/edit/${actionPayload?.id}`, toSendData);
  return res.id;
});

export const deleteVehicle = createAsyncThunk('vehicles/delete', async (id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const payload = {
    userId: user?.id || user?._id || '',
  };
  await api.post(`/vehicles/delete/${id}`, payload);
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
