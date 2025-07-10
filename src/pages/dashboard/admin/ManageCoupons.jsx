import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, Tag, Search, X, Save, Percent, Calendar } from 'lucide-react';

const ManageCoupons = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock coupons data
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: 'WELCOME20',
      name: 'Welcome Discount',
      description: '20% off for new members',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 50,
      maxDiscountAmount: 100,
      usageLimit: 100,
      usedCount: 25,
      validFrom: '2024-01-01',
      validUntil: '2024-12-31',
      isActive: true,
      applicableCourts: ['all'],
      membershipRequired: true,
      createdDate: '2023-12-15'
    },
    {
      id: 2,
      code: 'TENNIS50',
      name: 'Tennis Special',
      description: '$50 off tennis court bookings',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 100,
      maxDiscountAmount: 50,
      usageLimit: 50,
      usedCount: 12,
      validFrom: '2024-01-15',
      validUntil: '2024-03-15',
      isActive: true,
      applicableCourts: ['Tennis Court A', 'Tennis Court B'],
      membershipRequired: false,
      createdDate: '2024-01-10'
    },
    {
      id: 3,
      code: 'SUMMER15',
      name: 'Summer Promotion',
      description: '15% off all court bookings',
      discountType: 'percentage',
      discountValue: 15,
      minOrderAmount: 30,
      maxDiscountAmount: 75,
      usageLimit: 200,
      usedCount: 89,
      validFrom: '2024-06-01',
      validUntil: '2024-08-31',
      isActive: false,
      applicableCourts: ['all'],
      membershipRequired: false,
      createdDate: '2024-05-20'
    },
    {
      id: 4,
      code: 'BADMINTON25',
      name: 'Badminton Boost',
      description: '25% off badminton courts',
      discountType: 'percentage',
      discountValue: 25,
      minOrderAmount: 40,
      maxDiscountAmount: 60,
      usageLimit: 75,
      usedCount: 45,
      validFrom: '2024-02-01',
      validUntil: '2024-04-30',
      isActive: true,
      applicableCourts: ['Badminton Court A', 'Badminton Court B'],
      membershipRequired: true,
      createdDate: '2024-01-25'
    },
    {
      id: 5,
      code: 'WEEKEND10',
      name: 'Weekend Special',
      description: '10% off weekend bookings',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 25,
      maxDiscountAmount: 40,
      usageLimit: 150,
      usedCount: 150,
      validFrom: '2024-01-01',
      validUntil: '2024-06-30',
      isActive: false,
      applicableCourts: ['all'],
      membershipRequired: false,
      createdDate: '2023-12-20'
    }
  ]);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
    isActive: true,
    applicableCourts: ['all'],
    membershipRequired: false
  });

  const courtOptions = [
    'all',
    'Tennis Court A',
    'Tennis Court B',
    'Badminton Court A',
    'Badminton Court B',
    'Squash Court A'
  ];

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      validFrom: '',
      validUntil: '',
      isActive: true,
      applicableCourts: ['all'],
      membershipRequired: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCourtChange = (court) => {
    if (court === 'all') {
      setFormData(prev => ({
        ...prev,
        applicableCourts: ['all']
      }));
    } else {
      setFormData(prev => {
        const newCourts = prev.applicableCourts.includes('all') 
          ? [court]
          : prev.applicableCourts.includes(court)
            ? prev.applicableCourts.filter(c => c !== court)
            : [...prev.applicableCourts, court];
        return {
          ...prev,
          applicableCourts: newCourts.length === 0 ? ['all'] : newCourts
        };
      });
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newCoupon = {
        ...formData,
        id: coupons.length + 1,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: parseFloat(formData.minOrderAmount),
        maxDiscountAmount: parseFloat(formData.maxDiscountAmount),
        usageLimit: parseInt(formData.usageLimit),
        usedCount: 0,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setCoupons(prev => [...prev, newCoupon]);
      console.log('Coupon added:', newCoupon);
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding coupon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCoupon = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedCoupon = {
        ...formData,
        id: selectedCoupon.id,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: parseFloat(formData.minOrderAmount),
        maxDiscountAmount: parseFloat(formData.maxDiscountAmount),
        usageLimit: parseInt(formData.usageLimit),
        usedCount: selectedCoupon.usedCount,
        createdDate: selectedCoupon.createdDate
      };
      setCoupons(prev => prev.map(coupon => 
        coupon.id === selectedCoupon.id ? updatedCoupon : coupon
      ));
      console.log('Coupon updated:', updatedCoupon);
      setIsEditModalOpen(false);
      setSelectedCoupon(null);
      resetForm();
    } catch (error) {
      console.error('Error updating coupon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCoupon = async () => {
    setIsLoading(true);
    try {
      setCoupons(prev => prev.filter(coupon => coupon.id !== couponToDelete.id));
      console.log('Coupon deleted:', couponToDelete.id);
      setIsDeleteModalOpen(false);
      setCouponToDelete(null);
    } catch (error) {
      console.error('Error deleting coupon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openViewModal = (coupon) => {
    setSelectedCoupon(coupon);
    setIsViewModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderAmount: coupon.minOrderAmount.toString(),
      maxDiscountAmount: coupon.maxDiscountAmount.toString(),
      usageLimit: coupon.usageLimit.toString(),
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      isActive: coupon.isActive,
      applicableCourts: [...coupon.applicableCourts],
      membershipRequired: coupon.membershipRequired
    });
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setSelectedCoupon(null);
    setCouponToDelete(null);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    resetForm();
  };

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (isActive, validUntil, usedCount, usageLimit) => {
    const isExpired = new Date(validUntil) < new Date();
    const isExhausted = usedCount >= usageLimit;
    
    if (!isActive) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200">Inactive</span>;
    }
    if (isExpired) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full border bg-red-100 text-red-800 border-red-200">Expired</span>;
    }
    if (isExhausted) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">Exhausted</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200">Active</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const CouponForm = ({ onSubmit, submitText }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
            placeholder="e.g., WELCOME20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Value {formData.discountType === 'percentage' ? '(%)' : '($)'}
          </label>
          <input
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleInputChange}
            required
            min="0"
            max={formData.discountType === 'percentage' ? "100" : undefined}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount ($)</label>
          <input
            type="number"
            name="minOrderAmount"
            value={formData.minOrderAmount}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount ($)</label>
          <input
            type="number"
            name="maxDiscountAmount"
            value={formData.maxDiscountAmount}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
          <input
            type="date"
            name="validFrom"
            value={formData.validFrom}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
          <input
            type="date"
            name="validUntil"
            value={formData.validUntil}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Courts</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {courtOptions.map(court => (
            <label key={court} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.applicableCourts.includes(court)}
                onChange={() => handleCourtChange(court)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{court === 'all' ? 'All Courts' : court}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="membershipRequired"
            checked={formData.membershipRequired}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm text-gray-700">Membership Required</span>
        </label>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Saving...' : submitText}</span>
        </button>
        <button
          type="button"
          onClick={closeModals}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Coupons</h1>
          <p className="text-gray-600">Create and manage discount coupons</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Coupon</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Coupons</p>
              <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
            </div>
            <Tag className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Coupons</p>
              <p className="text-2xl font-bold text-gray-900">
                {coupons.filter(c => c.isActive && new Date(c.validUntil) >= new Date() && c.usedCount < c.usageLimit).length}
              </p>
            </div>
            <Tag className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</p>
            </div>
            <Percent className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Discount</p>
              <p className="text-2xl font-bold text-gray-900">
                {(coupons.reduce((sum, c) => sum + (c.discountType === 'percentage' ? c.discountValue : 0), 0) / coupons.filter(c => c.discountType === 'percentage').length || 0).toFixed(0)}%
              </p>
            </div>
            <Percent className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search coupons by code, name, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coupon Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                      <div className="text-sm text-gray-500">{coupon.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{coupon.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                      </div>
                      <div className="text-sm text-gray-500">Min: ${coupon.minOrderAmount}</div>
                      <div className="text-sm text-gray-500">Max: ${coupon.maxDiscountAmount}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{coupon.usedCount} / {coupon.usageLimit}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {formatDate(coupon.validFrom)}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {formatDate(coupon.validUntil)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(coupon.isActive, coupon.validUntil, coupon.usedCount, coupon.usageLimit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openViewModal(coupon)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="text-green-600 hover:text-green-900 cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(coupon)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCoupons.length === 0 && (
        <div className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No coupons found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'No coupons have been created yet.'}
          </p>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedCoupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Coupon Details</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Code</label>
                    <p className="text-gray-900 font-mono">{selectedCoupon.code}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedCoupon.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Discount Type</label>
                    <p className="text-gray-900">{selectedCoupon.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Discount Value</label>
                    <p className="text-gray-900">
                      {selectedCoupon.discountType === 'percentage' ? `${selectedCoupon.discountValue}%` : `$${selectedCoupon.discountValue}`}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Min Order Amount</label>
                    <p className="text-gray-900">${selectedCoupon.minOrderAmount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Max Discount Amount</label>
                    <p className="text-gray-900">${selectedCoupon.maxDiscountAmount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Usage</label>
                    <p className="text-gray-900">{selectedCoupon.usedCount} / {selectedCoupon.usageLimit}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Valid Period</label>
                    <p className="text-gray-900">{formatDate(selectedCoupon.validFrom)} - {formatDate(selectedCoupon.validUntil)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <div>{getStatusBadge(selectedCoupon.isActive, selectedCoupon.validUntil, selectedCoupon.usedCount, selectedCoupon.usageLimit)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Membership Required</label>
                    <p className="text-gray-900">{selectedCoupon.membershipRequired ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created Date</label>
                    <p className="text-gray-900">{formatDate(selectedCoupon.createdDate)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                  <p className="text-gray-900">{selectedCoupon.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Applicable Courts</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCoupon.applicableCourts.map((court, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {court === 'all' ? 'All Courts' : court}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Coupon</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <CouponForm onSubmit={handleAddCoupon} submitText="Add Coupon" />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Coupon</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <CouponForm onSubmit={handleEditCoupon} submitText="Update Coupon" />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && couponToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Coupon
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete coupon <strong>{couponToDelete.code}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCoupon}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200 cursor-pointer"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;