// VehicleList.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicles, deleteVehicle } from './vehiclesSlice';
import { Link } from 'react-router-dom';
import '../../css/VehicleList.css';
import Topbar from '../../components/Topbar';

export default function VehicleList() {
  const dispatch = useDispatch();
  const { items: vehicles, status } = useSelector(state => state.vehicles);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVehicles());
    }
  }, [status, dispatch]);

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

  if (status === 'loading') {
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
                <Link to="/vehicles/new" className="btn-add-vehicle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span>Add Vehicle</span>
                </Link>
                </div>
            </div>

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
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 17h14v-2H5v2zm0-4h14V9H5v4zM7 4v5h10V4H7z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{vehicles.length}</div>
                        <div className="stat-label">Total Vehicles</div>
                    </div>
                    </div>
                    
                    <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{vehicles.filter(v => v.isActive !== false).length}</div>
                        <div className="stat-label">Active</div>
                    </div>
                    </div>
                    
                    <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                        <line x1="6" y1="1" x2="6" y2="4"/>
                        <line x1="10" y1="1" x2="10" y2="4"/>
                        <line x1="14" y1="1" x2="14" y2="4"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">-</div>
                        <div className="stat-label">Next Service</div>
                    </div>
                    </div>
                </div>

                <div className="vehicle-grid">
                    {vehicles.map(vehicle => (
                    <div key={vehicle._id} className="vehicle-card">
                        <div className="vehicle-card-header">
                        <div className="vehicle-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 17h14v-2H5v2zm0-4h14V9H5v4zM7 4v5h10V4H7z"/>
                            </svg>
                        </div>
                        <div className="vehicle-badge">
                            {vehicle.isActive !== false ? (
                            <span className="badge-active">Active</span>
                            ) : (
                            <span className="badge-inactive">Inactive</span>
                            )}
                        </div>
                        </div>

                        <div className="vehicle-card-content">
                        <h3 className="vehicle-name">{vehicle.name}</h3>
                        <p className="vehicle-details">
                            {vehicle.make} {vehicle.model}
                        </p>
                        
                        <div className="vehicle-info">
                            <div className="info-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <span>Year: {vehicle.year}</span>
                            </div>
                            {vehicle.vin && (
                            <div className="info-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="8.5" cy="7" r="4"/>
                                <polyline points="17 11 19 13 23 9"/>
                                </svg>
                                <span className="vin-text">VIN: {vehicle.vin}</span>
                            </div>
                            )}
                            {vehicle.registrationNo && (
                            <div className="info-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                                </svg>
                                <span>{vehicle.registrationNo}</span>
                            </div>
                            )}
                        </div>
                        </div>

                        <div className="vehicle-card-footer">
                        <Link to={`/vehicles/${vehicle._id}`} className="btn-view">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                            </svg>
                            View
                        </Link>
                        <Link to={`/vehicles/${vehicle._id}/edit`} className="btn-edit">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9"/>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                            </svg>
                            Edit
                        </Link>
                        <button 
                            onClick={() => handleDelete(vehicle._id)} 
                            className="btn-delete"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Delete
                        </button>
                        </div>

                        {/* Delete Confirmation Modal */}
                        {deleteConfirm === vehicle._id && (
                        <div className="delete-modal-overlay">
                            <div className="delete-modal">
                            <div className="delete-modal-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
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
                    ))}
                </div>
                </>
            )}
        </div>
    </>
  );
}