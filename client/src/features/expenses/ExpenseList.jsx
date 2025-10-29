// ExpenseList.jsx
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, deleteExpense } from './expensesSlice';
import { fetchVehicles } from '../vehicles/vehiclesSlice';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Fuel,
  Wrench,
  Car,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Plus,
  ChevronDown,
  Download
} from 'lucide-react';
import '../../css/ExpenseList.css';
import Topbar from '../../components/Topbar';

const EXPENSE_CATEGORIES = {
  fuel: { icon: Fuel, label: 'Fuel', color: '#3b82f6' },
  maintenance: { icon: Wrench, label: 'Maintenance', color: '#f59e0b' },
  insurance: { icon: AlertCircle, label: 'Insurance', color: '#ef4444' },
  service: { icon: Car, label: 'Service', color: '#8b5cf6' },
  other: { icon: DollarSign, label: 'Other', color: '#6b7280' }
};

export default function ExpenseList() {
  const dispatch = useDispatch();
  const { items: expenses, loading } = useSelector(state => state.expenses);
  const { items: vehicles } = useSelector(state => state.vehicles);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (expenses.length === 0) {
      dispatch(fetchExpenses());
    }
    dispatch(fetchVehicles());
  }, [dispatch]);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let filtered = expenses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    // Vehicle filter
    if (selectedVehicle !== 'all') {
      filtered = filtered.filter(expense => expense.vehicle === selectedVehicle);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(expense => new Date(expense.date) >= filterDate);
    }

    // Sort - create a copy first to avoid mutating the original array
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return sorted;
  }, [expenses, searchTerm, selectedCategory, selectedVehicle, dateRange, sortBy]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = Object.keys(EXPENSE_CATEGORIES).map(category => ({
      category,
      total: filteredExpenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0),
      count: filteredExpenses.filter(e => e.category === category).length
    }));

    const thisMonth = filteredExpenses.filter(e => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    }).reduce((sum, e) => sum + e.amount, 0);

    return {
      total,
      thisMonth,
      byCategory,
      averageExpense: filteredExpenses.length > 0 ? total / filteredExpenses.length : 0
    };
  }, [filteredExpenses]);

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = (id) => {
    dispatch(deleteExpense(id));
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    return vehicle?.name || 'Unknown Vehicle';
  };

  const getCategoryInfo = (category) => {
    return EXPENSE_CATEGORIES[category] || EXPENSE_CATEGORIES.other;
  };

  if (loading) {
    return (
      <div className="expense-list-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Topbar />
      <div className="expense-list-container">
        {/* Header */}
        <div className="expense-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Expense Tracking</h1>
              <p>Monitor and analyze your vehicle expenses</p>
            </div>
            <div className="header-actions">
              <button className="btn-export">
                <Download size={20} />
                <span>Export</span>
              </button>
              <Link to="/expenses/new" className="btn-add-expense">
                <Plus size={20} />
                <span>Add Expense</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">�{statistics.total.toLocaleString()}</div>
              <div className="stat-label">Total Expenses</div>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">�{statistics.thisMonth.toLocaleString()}</div>
              <div className="stat-label">This Month</div>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">�{Math.round(statistics.averageExpense).toLocaleString()}</div>
              <div className="stat-label">Average Expense</div>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon">
              <Car size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{filteredExpenses.length}</div>
              <div className="stat-label">Total Entries</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="filters-header">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              <span>Filters</span>
              <ChevronDown size={16} className={`chevron ${showFilters ? 'open' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="filters-content">
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(EXPENSE_CATEGORIES).map(([key, info]) => (
                    <option key={key} value={key}>{info.label}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Vehicle</label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Vehicles</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle._id} value={vehicle._id}>{vehicle.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="date-desc">Date (Newest)</option>
                  <option value="date-asc">Date (Oldest)</option>
                  <option value="amount-desc">Amount (High to Low)</option>
                  <option value="amount-asc">Amount (Low to High)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Expense List */}
        <div className="expense-list-section">
          {filteredExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <DollarSign size={48} />
              </div>
              <h2>No expenses found</h2>
              <p>
                {searchTerm || selectedCategory !== 'all' || selectedVehicle !== 'all' || dateRange !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Start tracking your vehicle expenses by adding your first entry'
                }
              </p>
              {(!searchTerm && selectedCategory === 'all' && selectedVehicle === 'all' && dateRange === 'all') && (
                <Link to="/expenses/new" className="btn-add-first">
                  <Plus size={20} />
                  <span>Add Your First Expense</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="expense-list">
              {filteredExpenses.map(expense => {
                const categoryInfo = getCategoryInfo(expense.category);
                const Icon = categoryInfo.icon;
                return (
                  <div key={expense._id} className="expense-item">
                    <div className="expense-category" style={{ backgroundColor: `${categoryInfo.color}20` }}>
                      <Icon size={20} style={{ color: categoryInfo.color }} />
                    </div>

                    <div className="expense-details">
                      <div className="expense-header">
                        <h3 className="expense-title">
                          {expense.description || `${categoryInfo.label} Expense`}
                        </h3>
                        <span className="expense-date">
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="expense-meta">
                        <span className="expense-vehicle">
                          <Car size={14} />
                          {getVehicleName(expense.vehicle)}
                        </span>
                        <span className="expense-category-label" style={{ color: categoryInfo.color }}>
                          {categoryInfo.label}
                        </span>
                      </div>
                    </div>

                    <div className="expense-amount-section">
                      <div className="expense-amount">₹{expense.amount.toLocaleString()}</div>
                      <div className="expense-actions">
                        <Link to={`/expenses/${expense._id}`} className="btn-edit">
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="btn-delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Delete Confirmation */}
                    {deleteConfirm === expense._id && (
                      <div className="delete-modal-overlay">
                        <div className="delete-modal">
                          <div className="delete-modal-icon">
                            <AlertCircle size={32} />
                          </div>
                          <h3>Delete Expense?</h3>
                          <p>
                            Are you sure you want to delete this expense of <strong>�{expense.amount.toLocaleString()}</strong>?
                            This action cannot be undone.
                          </p>
                          <div className="delete-modal-actions">
                            <button onClick={cancelDelete} className="btn-cancel">
                              Cancel
                            </button>
                            <button onClick={() => confirmDelete(expense._id)} className="btn-confirm-delete">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}