// VehicleList.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicles, deleteVehicle } from './vehiclesSlice';
import { Link } from 'react-router-dom';
import '../../css/VehicleList.css';
import Topbar from '../../components/Topbar';
import { Fuel, Calendar, MapPin, Activity, TrendingUp, Settings, Eye, Edit, Trash2, AlertCircle, Clock, CheckCircle, Wrench, Gauge } from 'lucide-react';

export default function VehicleList() {
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  const vehicleId = searchParams.get('vehicleId');

  const { items: vehicles, status } = useSelector(state => state.vehicles);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVehicles());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (vehicleId) {
        setShowVehicleModal(true);
    }
  }, [vehicleId]);

  const selectedVehicle = vehicles.find(v => v._id === vehicleId);

  const closeVehicleModal = () => {
    setShowVehicleModal(false);
    // Remove vehicleId from URL
    window.history.pushState({}, '', '/vehicles');
  };

  // Calculate vehicle health status based on mileage and service dates
  const getVehicleHealthStatus = (vehicle) => {
    if (!vehicle.odometer) return { status: 'unknown', text: 'No Data', color: '#9ca3af' };

    const mileage = parseInt(vehicle.odometer);
    const lastService = vehicle.lastServiceDate ? new Date(vehicle.lastServiceDate) : null;
    const now = new Date();
    const daysSinceService = lastService ? Math.floor((now - lastService) / (1000 * 60 * 60 * 24)) : null;

    if (mileage < 50000 && (!daysSinceService || daysSinceService < 180)) {
      return { status: 'excellent', text: 'Excellent', color: '#10b981' };
    } else if (mileage < 100000 && (!daysSinceService || daysSinceService < 365)) {
      return { status: 'good', text: 'Good', color: '#3b82f6' };
    } else if (mileage < 150000 && (!daysSinceService || daysSinceService < 540)) {
      return { status: 'fair', text: 'Fair', color: '#f59e0b' };
    } else {
      return { status: 'attention', text: 'Needs Attention', color: '#ef4444' };
    }
  };

  // Calculate next service estimate
  const getNextService = (vehicle) => {
    if (!vehicle.odometer) return 'N/A';
    const mileage = parseInt(vehicle.odometer);
    const nextServiceMileage = Math.ceil((mileage + 5000) / 10000) * 10000;
    return `${nextServiceMileage.toLocaleString()} km`;
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = (id) => {
    dispatch(deleteVehicle(id));
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="vehicle-list-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <>
        <Topbar />
        <div className="vehicle-list-container">
            <div className="vehicle-list-header">
                <div className="header-content">
                <div className="header-text">
                    <h1>My Vehicles</h1>
                    <p>Manage and track all your vehicles in one place</p>
                </div>
                <div className="header-actions">
                    <button className="btn-analytics">
                        <TrendingUp size={20} />
                        <span>Analytics</span>
                    </button>
                    <Link to="/vehicles/new" className="btn-add-vehicle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span>Add Vehicle</span>
                    </Link>
                </div>
                </div>
            </div>

            {/* Vehicle Details Modal */}
            {showVehicleModal && selectedVehicle && (
                <div className="vehicle-modal-overlay" onClick={closeVehicleModal}>
                    <div className="vehicle-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedVehicle.name}</h2>
                            <button onClick={closeVehicleModal} className="modal-close">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="modal-section">
                                <h3>Basic Information</h3>
                                <div className="modal-grid">
                                    <div className="modal-field">
                                        <label>Make</label>
                                        <span>{selectedVehicle.make}</span>
                                    </div>
                                    <div className="modal-field">
                                        <label>Model</label>
                                        <span>{selectedVehicle.model}</span>
                                    </div>
                                    <div className="modal-field">
                                        <label>Year</label>
                                        <span>{selectedVehicle.year}</span>
                                    </div>
                                    <div className="modal-field">
                                        <label>Color</label>
                                        <span>{selectedVehicle.color}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Vehicle Details</h3>
                                <div className="modal-grid">
                                    <div className="modal-field">
                                        <label>VIN</label>
                                        <span>{selectedVehicle.vin}</span>
                                    </div>
                                    <div className="modal-field">
                                        <label>Registration No</label>
                                        <span>{selectedVehicle.registrationNo}</span>
                                    </div>
                                    <div className="modal-field">
                                        <label>Fuel Type</label>
                                        <span>{selectedVehicle.fuelType}</span>
                                    </div>
                                    <div className="modal-field">
                                        <label>Mileage</label>
                                        <span>{selectedVehicle.mileage || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Dates & Documentation</h3>
                                <div className="modal-grid">
                                    <div className="modal-field">
                                        <label>Purchase Date</label>
                                        <span>{selectedVehicle.purchaseDate ? new Date(selectedVehicle.purchaseDate).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="modal-field">
                                        <label>Insurance Expiry</label>
                                        <span>{selectedVehicle.insuranceExpiry ? new Date(selectedVehicle.insuranceExpiry).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="modal-field">
                                        <label>Odometer</label>
                                        <span>{selectedVehicle.odometer || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <Link to={`/vehicles/edit?vehicleId=${selectedVehicle._id}`} className="btn-edit-modal">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 20h9"/>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                </svg>
                                Edit Vehicle
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {vehicles.length === 0 ? (
                <div className="empty-state">
                <div className="empty-state-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 17h14v-2H5v2zm0-4h14V9H5v4zM7 4v5h10V4H7z"/>
                    </svg>
                </div>
                <h2>No vehicles yet</h2>
                <p>Get started by adding your first vehicle to track expenses and maintenance</p>
                <Link to="/vehicles/new" className="btn-add-first">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span>Add Your First Vehicle</span>
                </Link>
                </div>
            ) : (
                <>
                <div className="vehicle-stats">
                    <div className="stat-card">
                    <div className="stat-icon stat-icon-blue">
                        <Activity size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{vehicles.length}</div>
                        <div className="stat-label">Total Vehicles</div>
                    </div>
                    </div>

                    <div className="stat-card">
                    <div className="stat-icon stat-icon-green">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{vehicles.filter(v => v.isActive !== false).length}</div>
                        <div className="stat-label">Active</div>
                    </div>
                    </div>

                    <div className="stat-card">
                    <div className="stat-icon stat-icon-orange">
                        <Wrench size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {vehicles.length > 0 ? getNextService(vehicles[0]) : 'N/A'}
                        </div>
                        <div className="stat-label">Next Service</div>
                    </div>
                    </div>
                </div>

                <div className="vehicle-grid">
                    {vehicles.map(vehicle => {
                        const healthStatus = getVehicleHealthStatus(vehicle);
                        return (
                        <div key={vehicle._id} className="vehicle-card">
                            <div className="vehicle-card-header">
                                <div className="vehicle-icon">
                                    <Activity size={28} />
                                </div>
                                <div className="vehicle-badges">
                                    <div className="vehicle-badge">
                                        {vehicle.isActive !== false ? (
                                            <span className="badge-active">Active</span>
                                        ) : (
                                            <span className="badge-inactive">Inactive</span>
                                        )}
                                    </div>
                                    <div className="health-badge" style={{ backgroundColor: `${healthStatus.color}20`, color: healthStatus.color }}>
                                        {healthStatus.text}
                                    </div>
                                </div>
                            </div>

                            <div className="vehicle-card-content">
                                <h3 className="vehicle-name">{vehicle.name}</h3>
                                <p className="vehicle-details">
                                    {vehicle.make} {vehicle.model} • {vehicle.year}
                                </p>

                                <div className="vehicle-metrics">
                                    <div className="metric-item">
                                        <Gauge size={16} className="metric-icon" />
                                        <span className="metric-label">Mileage:</span>
                                        <span className="metric-value">{vehicle.odometer ? `${parseInt(vehicle.odometer).toLocaleString()} km` : 'N/A'}</span>
                                    </div>
                                    <div className="metric-item">
                                        <Fuel size={16} className="metric-icon" />
                                        <span className="metric-label">Fuel:</span>
                                        <span className="metric-value">{vehicle.fuelType || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="vehicle-info">
                                    {vehicle.registrationNo && (
                                        <div className="info-item">
                                            <MapPin size={16} />
                                            <span>{vehicle.registrationNo}</span>
                                        </div>
                                    )}
                                    <div className="info-item">
                                        <Wrench size={16} />
                                            <span>Next service: {getNextService(vehicle)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="vehicle-card-footer">
                                <a href={`/vehicles?vehicleId=${vehicle._id}`} className="btn-view">
                                    <Eye size={16} />
                                    <span>View</span>
                                </a>
                                <Link to={`/vehicles/edit?vehicleId=${vehicle._id}`} className="btn-edit">
                                    <Edit size={16} />
                                    <span>Edit</span>
                                </Link>
                                <button
                                    onClick={() => handleDelete(vehicle._id)}
                                    className="btn-delete"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete</span>
                                </button>
                            </div>

                            {/* Delete Confirmation Modal */}
                            {deleteConfirm === vehicle._id && (
                                <div className="delete-modal-overlay">
                                    <div className="delete-modal">
                                        <div className="delete-modal-icon">
                                            <AlertCircle size={32} />
                                        </div>
                                        <h3>Delete Vehicle?</h3>
                                        <p>
                                            Are you sure you want to delete <strong>{vehicle.name}</strong>?
                                            This action cannot be undone.
                                        </p>
                                        <div className="delete-modal-actions">
                                            <button onClick={cancelDelete} className="btn-cancel">
                                                Cancel
                                            </button>
                                            <button onClick={() => confirmDelete(vehicle._id)} className="btn-confirm-delete">
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
                </>
            )}
        </div>
    </>
  );
}