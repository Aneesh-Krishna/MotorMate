import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addVehicle, updateVehicle, fetchVehicles } from './vehiclesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/VehicleForm.css';
import Topbar from '../../components/Topbar';

export default function VehicleForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { id } = useParams();
  const vehicleId = new URLSearchParams(window.location.search).get('vehicleId');
  const id = vehicleId;

  const { items: vehicles, loading } = useSelector(state => state.vehicles);

  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    year: '',
    vin: '',
    registrationNo: '',
    purchaseDate: '',
    mileage: '',
    fuelType: 'petrol',
    insuranceExpiry: '',
    color: '',
    odometer: '',
    tankCapacity: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (id) {
      const vehicle = vehicles.find(v => v._id === id);
      if (vehicle) {
        setFormData({
          name: vehicle.name || '',
          make: vehicle.make || '',
          model: vehicle.model || '',
          year: vehicle.year || '',
          vin: vehicle.vin || '',
          registrationNo: vehicle.registrationNo || '',
          purchaseDate: vehicle.purchaseDate || '',
          mileage: vehicle.mileage || '',
          fuelType: vehicle.fuelType || 'petrol',
          insuranceExpiry: vehicle.insuranceExpiry || '',
          color: vehicle.color || '',
          odometer: vehicle.odometer || '',
          tankCapacity: vehicle.tankCapacity || '',
        });
      }
    } else {
      dispatch(fetchVehicles());
    }
  }, [id, vehicles, dispatch]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() === '' ? 'Vehicle name is required' : '';
      case 'make':
        return value.trim() === '' ? 'Make is required' : '';
      case 'model':
        return value.trim() === '' ? 'Model is required' : '';
      case 'year':
        const currentYear = new Date().getFullYear();
        const year = parseInt(value);
        if (!value) return 'Year is required';
        if (isNaN(year) || year < 1900 || year > currentYear + 1) {
          return `Year must be between 1900 and ${currentYear + 1}`;
        }
        return '';
      case 'mileage':
        if (value && (isNaN(value) || parseFloat(value) < 0)) {
          return 'Mileage must be a positive number';
        }
        return '';
      case 'odometer':
        if (value && (isNaN(value) || parseFloat(value) < 0)) {
          return 'Odometer reading must be a positive number';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    if (id) {
      let payload = {
        id,
        ...formData,
      };
      
      dispatch(updateVehicle(payload));
    } else {
      dispatch(addVehicle(formData));
    }
    navigate('/vehicles');
  };

  const fuelTypes = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'cng', label: 'CNG' },
    { value: 'lpg', label: 'LPG' }
  ];

  return (
    <>
      <Topbar />
      <div className="vehicle-form-container">
        <div className="form-header">
          <div className="form-header-content">
            <div className="form-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 17h14v2H5v-2zm8-10c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m3.5-3H14V3h-4v1H7.5A2.5 2.5 0 0 0 5 6.5v9A2.5 2.5 0 0 0 7.5 18h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 16.5 4z"/>
              </svg>
            </div>
            <div>
              <h1 className="form-title">{id ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
              <p className="form-subtitle">
                {id ? 'Update your vehicle information' : 'Fill in the details to add your vehicle'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="vehicle-form">
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Vehicle Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.name && touched.name ? 'input-error' : ''}`}
                  placeholder="e.g., My Honda Civic"
                />
                {errors.name && touched.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="make" className="form-label">
                  Make <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.make && touched.make ? 'input-error' : ''}`}
                  placeholder="e.g., Honda"
                />
                {errors.make && touched.make && (
                  <span className="error-message">{errors.make}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="model" className="form-label">
                  Model <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.model && touched.model ? 'input-error' : ''}`}
                  placeholder="e.g., Civic"
                />
                {errors.model && touched.model && (
                  <span className="error-message">{errors.model}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="year" className="form-label">
                  Year <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.year && touched.year ? 'input-error' : ''}`}
                  placeholder="e.g., 2022"
                />
                {errors.year && touched.year && (
                  <span className="error-message">{errors.year}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="color" className="form-label">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Silver"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fuelType" className="form-label">
                  Fuel Type
                </label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="form-input"
                >
                  {fuelTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Vehicle Details</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="vin" className="form-label">
                  VIN (Vehicle Identification Number)
                </label>
                <input
                  type="text"
                  id="vin"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="17-character VIN"
                  maxLength="17"
                />
              </div>

              <div className="form-group">
                <label htmlFor="registrationNo" className="form-label">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="registrationNo"
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., KA01AB1234"
                />
              </div>

              <div className="form-group">
                <label htmlFor="purchaseDate" className="form-label">
                  Purchase Date
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="odometer" className="form-label">
                  Current Odometer Reading (km)
                </label>
                <input
                  type="number"
                  id="odometer"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.odometer && touched.odometer ? 'input-error' : ''}`}
                  placeholder="e.g., 25000"
                  min="0"
                />
                {errors.odometer && touched.odometer && (
                  <span className="error-message">{errors.odometer}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tankCapacity" className="form-label">
                  Tank Capacity (litres)
                </label>
                <input
                  type="number"
                  id="tankCapacity"
                  name="tankCapacity"
                  value={formData.tankCapacity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-input"
                  placeholder="e.g., 45"
                  step="0.1"
                  min="0"
                />
                <span className="form-hint">
                  Enter your vehicle's fuel tank capacity for better calculations
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="insuranceExpiry" className="form-label">
                  Insurance Expiry Date
                </label>
                <input
                  type="date"
                  id="insuranceExpiry"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                  {id ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {id ? 'Update Vehicle' : 'Add Vehicle'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}