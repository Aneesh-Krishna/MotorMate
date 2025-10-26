import { useEffect } from 'react';
import Topbar from '../components/Topbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicles } from '../features/vehicles/vehiclesSlice';
import { fetchExpenses } from '../features/expenses/expensesSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: vehicles } = useSelector(state => state.vehicles);
  const { items: expenses } = useSelector(state => state.expenses);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  return (
    <>
      <Topbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.map((v) => {
            const total = expenses.filter(e => e.vehicle === v._id)
              .reduce((sum, e) => sum + e.amount, 0);
            return (
              <div key={v._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-lg">{v.name}</h3>
                <p>{v.make} {v.model}</p>
                <p className="text-gray-600">Total Expense: ₹{total}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
