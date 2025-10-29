import { useEffect, useMemo } from 'react';
import Topbar from '../components/Topbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicles } from '../features/vehicles/vehiclesSlice';
import { fetchExpenses } from '../features/expenses/expensesSlice';
import '../css/Dashboard.css';
import {
  Car,
  DollarSign,
  TrendingUp,
  Fuel,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Wrench,
  MapPin,
  Activity,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: vehicles, status: vehicleStatus } = useSelector(state => state.vehicles);
  const { items: expenses, status: expenseStatus } = useSelector(state => state.expenses);

  useEffect(() => {
    if (vehicleStatus === 'idle') dispatch(fetchVehicles());
    if (expenseStatus === 'idle') dispatch(fetchExpenses());
  }, [dispatch, vehicleStatus, expenseStatus]);

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const activeVehicles = vehicles.filter(v => v.isActive !== false);
    const vehiclesNeedingService = vehicles.filter(v => {
      if (!v.odometer) return false;
      const mileage = parseInt(v.odometer);
      return mileage > 80000; // Service needed after 80k km
    });

    return {
      totalVehicles: vehicles.length,
      activeVehicles: activeVehicles.length,
      totalExpenses,
      vehiclesNeedingService: vehiclesNeedingService.length,
      averageExpensesPerVehicle: vehicles.length > 0 ? totalExpenses / vehicles.length : 0
    };
  }, [vehicles, expenses]);

  // Recent expenses
  const recentExpenses = useMemo(() => {
    return expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [expenses]);

  // Vehicle expense breakdown
  const vehicleExpenses = useMemo(() => {
    return vehicles.map(vehicle => {
      const vehicleExpenses = expenses.filter(e => e.vehicle === vehicle._id);
      const total = vehicleExpenses.reduce((sum, e) => sum + e.amount, 0);
      const lastExpense = vehicleExpenses.length > 0
        ? new Date(Math.max(...vehicleExpenses.map(e => new Date(e.date))))
        : null;

      return {
        ...vehicle,
        totalExpenses: total,
        expenseCount: vehicleExpenses.length,
        lastExpenseDate: lastExpense
      };
    });
  }, [vehicles, expenses]);

  const isLoading = vehicleStatus === 'loading' || expenseStatus === 'loading';

  if (isLoading) {
    return (
      <>
        <Topbar />
        <div className="dashboard-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div>
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-subtitle">
                Welcome back! Here's an overview of your vehicle fleet and expenses.
              </p>
            </div>
            <div className="header-actions">
              <button className="btn-analytics">
                <TrendingUp size={20} />
                <span>View Analytics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">
              <Car size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalVehicles}</div>
              <div className="stat-label">Total Vehicles</div>
              <div className="stat-trend">
                <span className="trend-positive">{stats.activeVehicles} active</span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">₹{stats.totalExpenses.toLocaleString()}</div>
              <div className="stat-label">Total Expenses</div>
              <div className="stat-trend">
                <span className="trend-neutral">₹{Math.round(stats.averageExpensesPerVehicle).toLocaleString()} avg/vehicle</span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">
              <Wrench size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.vehiclesNeedingService}</div>
              <div className="stat-label">Need Service</div>
              <div className="stat-trend">
                <span className="trend-warning">Requires attention</span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon">
              <Fuel size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{expenses.filter(e => e.category === 'fuel').length}</div>
              <div className="stat-label">Fuel Entries</div>
              <div className="stat-trend">
                <span className="trend-positive">Track efficiency</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Vehicle Overview */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Vehicle Overview</h2>
              <button className="btn-link">View All</button>
            </div>
            <div className="vehicle-overview-grid">
              {vehicleExpenses.map(vehicle => (
                <div key={vehicle._id} className="vehicle-overview-card">
                  <div className="vehicle-header">
                    <div className="vehicle-info">
                      <h3 className="vehicle-name">{vehicle.name}</h3>
                      <p className="vehicle-details">{vehicle.make} {vehicle.model}</p>
                    </div>
                    <div className={`vehicle-status ${vehicle.isActive !== false ? 'active' : 'inactive'}`}>
                      {vehicle.isActive !== false ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="vehicle-stats">
                    <div className="vehicle-stat">
                      <span className="stat-label">Total Expenses</span>
                      <span className="stat-value">₹{vehicle.totalExpenses.toLocaleString()}</span>
                    </div>
                    <div className="vehicle-stat">
                      <span className="stat-label">Entries</span>
                      <span className="stat-value">{vehicle.expenseCount}</span>
                    </div>
                    <div className="vehicle-stat">
                      <span className="stat-label">Mileage</span>
                      <span className="stat-value">{vehicle.odometer ? `${parseInt(vehicle.odometer).toLocaleString()} km` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Recent Expenses</h2>
              <button className="btn-link">View All</button>
            </div>
            <div className="expense-list">
              {recentExpenses.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={48} />
                  <h3>No expenses yet</h3>
                  <p>Start tracking your vehicle expenses</p>
                </div>
              ) : (
                recentExpenses.map(expense => {
                  const vehicle = vehicles.find(v => v._id === expense.vehicle);
                  return (
                    <div key={expense._id} className="expense-item">
                      <div className="expense-icon">
                        {expense.category === 'fuel' && <Fuel size={20} />}
                        {expense.category === 'maintenance' && <Wrench size={20} />}
                        {expense.category === 'insurance' && <AlertTriangle size={20} />}
                        {!['fuel', 'maintenance', 'insurance'].includes(expense.category) && <DollarSign size={20} />}
                      </div>
                      <div className="expense-details">
                        <h4 className="expense-title">{expense.description || expense.category}</h4>
                        <p className="expense-meta">
                          {vehicle?.name || 'Unknown Vehicle'} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="expense-amount">₹{expense.amount.toLocaleString()}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
