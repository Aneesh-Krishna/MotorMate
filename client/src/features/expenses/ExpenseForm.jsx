// ExpenseForm.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, updateExpense, fetchExpenses } from './expensesSlice';
import { fetchVehicles } from '../vehicles/vehiclesSlice';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  DollarSign,
  Fuel,
  Wrench,
  Car,
  Calendar,
  AlertCircle,
  CheckCircle,
  Save,
  ArrowLeft,
  Gauge,
  FileText
} from 'lucide-react';
import '../../css/ExpenseForm.css';
import Topbar from '../../components/Topbar';

const EXPENSE_CATEGORIES = {
  fuel: { label: 'Fuel', icon: Fuel, color: '#3b82f6' },
  maintenance: { label: 'Maintenance', icon: Wrench, color: '#f59e0b' },
  service: { label: 'Service', icon: Car, color: '#8b5cf6' },
  insurance: { label: 'Insurance', icon: AlertCircle, color: '#ef4444' },
  other: { label: 'Other', icon: DollarSign, color: '#6b7280' }
};

export default function ExpenseForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { items: vehicles, status: vehicleStatus } = useSelector(state => state.vehicles);
  const { items: expenses, status: expenseStatus } = useSelector(state => state.expenses);

  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    vehicle: '',
    type: 'fuel',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    odometer: '',
    notes: '',
    description: '',
    // Fuel-specific fields
    fuelPricePerLitre: '',
    fuelLitres: '',
    odometerBefore: '',
    odometerAfter: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    if (vehicleStatus === 'idle') {
      dispatch(fetchVehicles());
    }
  }, [dispatch, vehicleStatus]);

  // Load expense data for editing
  useEffect(() => {
    if (isEditMode && expenseStatus === 'idle') {
      dispatch(fetchExpenses());
    }
  }, [dispatch, isEditMode, expenseStatus]);

  useEffect(() => {
    if (isEditMode && expenses.length > 0) {
      const expense = expenses.find(e => e._id === id);
      if (expense) {
        setFormData({
          vehicle: expense.vehicle?._id || expense.vehicle || '',
          type: expense.type || 'fuel',
          amount: expense.amount || '',
          date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          odometer: expense.odometer || '',
          notes: expense.notes || '',
          description: expense.description || expense.notes || '',
          // Fuel-specific fields
          fuelPricePerLitre: expense.fuelPricePerLitre || '',
          fuelLitres: expense.fuelLitres || '',
          odometerBefore: expense.odometerBefore || '',
          odometerAfter: expense.odometerAfter || ''
        });
      }
    }
  }, [isEditMode, id, expenses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, e.target.value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'vehicle':
        if (!value) {
          newErrors.vehicle = 'Vehicle is required';
        }
        break;
      case 'amount':
        if (!value) {
          newErrors.amount = 'Amount is required';
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          newErrors.amount = 'Please enter a valid amount';
        }
        break;
      case 'date':
        if (!value) {
          newErrors.date = 'Date is required';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          if (selectedDate > today) {
            newErrors.date = 'Date cannot be in the future';
          }
        }
        break;
      case 'odometer':
        if (value && (isNaN(value) || parseInt(value) < 0)) {
          newErrors.odometer = 'Please enter a valid odometer reading';
        }
        break;
      case 'fuelPricePerLitre':
        if (formData.type === 'fuel' && value && (isNaN(value) || parseFloat(value) <= 0)) {
          newErrors.fuelPricePerLitre = 'Please enter a valid price per litre';
        }
        break;
      case 'fuelLitres':
        if (formData.type === 'fuel' && !value) {
          newErrors.fuelLitres = 'Litres filled is required for fuel expenses';
        } else if (formData.type === 'fuel' && (isNaN(value) || parseFloat(value) <= 0)) {
          newErrors.fuelLitres = 'Please enter valid litres';
        }
        break;
      case 'odometerBefore':
        if (formData.type === 'fuel' && !value) {
          newErrors.odometerBefore = 'Odometer reading before fueling is required';
        } else if (formData.type === 'fuel' && (isNaN(value) || parseInt(value) < 0)) {
          newErrors.odometerBefore = 'Please enter a valid odometer reading';
        }
        break;
      case 'odometerAfter':
        if (value && (isNaN(value) || parseInt(value) < 0)) {
          newErrors.odometerAfter = 'Please enter a valid odometer reading';
        } else if (value && formData.odometerBefore && parseInt(value) <= parseInt(formData.odometerBefore)) {
          newErrors.odometerAfter = 'Odometer after must be greater than odometer before';
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const validateForm = () => {
    const requiredFields = ['vehicle', 'amount', 'date'];
    let isValid = true;

    requiredFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
      setTouched(prev => ({
        ...prev,
        [field]: true
      }));
    });

    // Validate fuel-specific fields if type is fuel
    if (formData.type === 'fuel') {
      const fuelFields = ['fuelLitres', 'odometerBefore'];
      fuelFields.forEach(field => {
        if (!validateField(field, formData[field])) {
          isValid = false;
        }
        setTouched(prev => ({
          ...prev,
          [field]: true
        }));
      });
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        odometer: formData.odometer ? parseInt(formData.odometer) : undefined,
        date: new Date(formData.date).toISOString(),
        // Include fuel-specific fields
        fuelPricePerLitre: formData.fuelPricePerLitre ? parseFloat(formData.fuelPricePerLitre) : undefined,
        fuelLitres: formData.fuelLitres ? parseFloat(formData.fuelLitres) : undefined,
        odometerBefore: formData.odometerBefore ? parseInt(formData.odometerBefore) : undefined,
        odometerAfter: formData.odometerAfter ? parseInt(formData.odometerAfter) : undefined
      };

      if (isEditMode) {
        await dispatch(updateExpense({ id, data: submitData })).unwrap();
      } else {
        await dispatch(addExpense(submitData)).unwrap();
      }

      navigate('/expenses');
    } catch (error) {
      console.error('Failed to save expense:', error);
      setErrors({
        submit: 'Failed to save expense. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedVehicle = vehicles.find(v => v._id === formData.vehicle);

  // Auto-calculate amount when fuel price and litres are provided
  useEffect(() => {
    if (formData.type === 'fuel' && formData.fuelPricePerLitre && formData.fuelLitres) {
      const calculatedAmount = parseFloat(formData.fuelPricePerLitre) * parseFloat(formData.fuelLitres);
      setFormData(prev => ({
        ...prev,
        amount: calculatedAmount.toFixed(2)
      }));
    }
  }, [formData.type, formData.fuelPricePerLitre, formData.fuelLitres]);

  if (vehicleStatus === 'loading' || (isEditMode && expenseStatus === 'loading')) {
    return (
      <>
        <Topbar />
        <div className="expense-form-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className="expense-form-container">
        <div className="form-header">
          <div className="form-header-content">
            <Link to="/expenses" className="back-button">
              <ArrowLeft size={20} />
              <span>Back to Expenses</span>
            </Link>
            <div className="form-icon">
              <DollarSign size={28} />
            </div>
            <div>
              <h1 className="form-title">
                {isEditMode ? 'Edit Expense' : 'Add New Expense'}
              </h1>
              <p className="form-subtitle">
                {isEditMode
                  ? 'Update the expense details below'
                  : 'Enter the details for your new expense entry'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="form-content">
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-grid">
              {/* Vehicle Selection */}
              <div className="form-group">
                <label className="form-label">
                  <Car size={16} />
                  Vehicle *
                </label>
                <select
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`form-select ${errors.vehicle && touched.vehicle ? 'error' : ''}`}
                  disabled={isSubmitting}
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.name} ({vehicle.make} {vehicle.model})
                    </option>
                  ))}
                </select>
                {errors.vehicle && touched.vehicle && (
                  <span className="error-message">{errors.vehicle}</span>
                )}
              </div>

              {/* Expense Type */}
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} />
                  Category *
                </label>
                <div className="category-grid">
                  {Object.entries(EXPENSE_CATEGORIES).map(([key, category]) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        name="type"
                        value={key}
                        onClick={() => handleInputChange({ target: { name: 'type', value: key } })}
                        className={`category-button ${formData.type === key ? 'active' : ''}`}
                        style={{
                          '--category-color': category.color,
                          '--category-color-light': `${category.color}20`
                        }}
                        disabled={isSubmitting}
                      >
                        <Icon size={20} />
                        <span>{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount */}
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} />
                  Amount *
                  {formData.type === 'fuel' && formData.fuelPricePerLitre && formData.fuelLitres && (
                    <span className="auto-calc-indicator">Auto-calculated</span>
                  )}
                </label>
                <div className="input-group">
                  <span className="input-prefix">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`form-input ${errors.amount && touched.amount ? 'error' : ''}`}
                    disabled={isSubmitting || (formData.type === 'fuel' && formData.fuelPricePerLitre && formData.fuelLitres)}
                  />
                </div>
                {errors.amount && touched.amount && (
                  <span className="error-message">{errors.amount}</span>
                )}
                {formData.type === 'fuel' && formData.fuelPricePerLitre && formData.fuelLitres && (
                  <span className="form-hint">
                    Calculated: ₹{formData.fuelPricePerLitre} × {formData.fuelLitres}L = ₹{formData.amount}
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  max={new Date().toISOString().split('T')[0]}
                  className={`form-input ${errors.date && touched.date ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.date && touched.date && (
                  <span className="error-message">{errors.date}</span>
                )}
              </div>

              {/* Odometer */}
              <div className="form-group">
                <label className="form-label">
                  <Gauge size={16} />
                  Odometer Reading (km)
                </label>
                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Current odometer reading"
                  min="0"
                  className={`form-input ${errors.odometer && touched.odometer ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.odometer && touched.odometer && (
                  <span className="error-message">{errors.odometer}</span>
                )}
                {selectedVehicle?.odometer && (
                  <span className="form-hint">
                    Last recorded: {parseInt(selectedVehicle.odometer).toLocaleString()} km
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">
                  <FileText size={16} />
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the expense"
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>

              {/* Fuel-Specific Fields */}
              {formData.type === 'fuel' && (
                <>
                  <div className="form-group">
                    <label className="form-label">
                      <DollarSign size={16} />
                      Price per Litre (₹)
                    </label>
                    <input
                      type="number"
                      name="fuelPricePerLitre"
                      value={formData.fuelPricePerLitre}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="e.g., 105.50"
                      step="0.01"
                      min="0"
                      className={`form-input ${errors.fuelPricePerLitre && touched.fuelPricePerLitre ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.fuelPricePerLitre && touched.fuelPricePerLitre && (
                      <span className="error-message">{errors.fuelPricePerLitre}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Fuel size={16} />
                      Total Litres *
                    </label>
                    <input
                      type="number"
                      name="fuelLitres"
                      value={formData.fuelLitres}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="e.g., 25.5"
                      step="0.01"
                      min="0"
                      className={`form-input ${errors.fuelLitres && touched.fuelLitres ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.fuelLitres && touched.fuelLitres && (
                      <span className="error-message">{errors.fuelLitres}</span>
                    )}
                    {selectedVehicle?.tankCapacity && (
                      <span className="form-hint">
                        Tank capacity: {selectedVehicle.tankCapacity} litres
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Gauge size={16} />
                      Odometer Before (km) *
                    </label>
                    <input
                      type="number"
                      name="odometerBefore"
                      value={formData.odometerBefore}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Odometer reading before fueling"
                      min="0"
                      className={`form-input ${errors.odometerBefore && touched.odometerBefore ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.odometerBefore && touched.odometerBefore && (
                      <span className="error-message">{errors.odometerBefore}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Gauge size={16} />
                      Odometer After (km)
                    </label>
                    <input
                      type="number"
                      name="odometerAfter"
                      value={formData.odometerAfter}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Odometer reading after fueling (optional)"
                      min="0"
                      className={`form-input ${errors.odometerAfter && touched.odometerAfter ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.odometerAfter && touched.odometerAfter && (
                      <span className="error-message">{errors.odometerAfter}</span>
                    )}
                    {formData.odometerBefore && formData.odometerAfter && (
                      <span className="form-hint mileage-preview">
                        Distance: {parseInt(formData.odometerAfter) - parseInt(formData.odometerBefore)} km
                        {formData.fuelLitres && (
                          <span className="mileage-calc">
                            • Estimated mileage: {Math.round(((parseInt(formData.odometerAfter) - parseInt(formData.odometerBefore)) / parseFloat(formData.fuelLitres)) * 100) / 100} km/l
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </>
              )}

              {/* Notes */}
              <div className="form-group full-width">
                <label className="form-label">
                  <FileText size={16} />
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional details about this expense..."
                  rows="4"
                  className="form-textarea"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <Link to="/expenses" className="btn-cancel">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="btn-spinner"></div>
                    <span>{isEditMode ? 'Updating...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isEditMode ? 'Update Expense' : 'Save Expense'}</span>
                  </>
                )}
              </button>
            </div>

            {errors.submit && (
              <div className="form-error">
                <AlertCircle size={16} />
                <span>{errors.submit}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}