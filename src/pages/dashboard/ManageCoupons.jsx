import { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { couponsAPI } from '@/utils/api';
import Swal from 'sweetalert2';

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', discount: '', expiry: '' });
  const [editingId, setEditingId] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await couponsAPI.getAllCoupons();
      setCoupons(res.data.coupons || []);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form fields
    if (!form.code.trim() || !form.discount || !form.expiry) {
      toast.error('All fields are required');
      return;
    }
    if (isNaN(Number(form.discount)) || Number(form.discount) < 1 || Number(form.discount) > 100) {
      toast.error('Discount must be a number between 1 and 100');
      return;
    }
    setProcessing(true);
    try {
      let res;
      if (editingId) {
        res = await couponsAPI.updateCoupon(editingId, form);
        toast.success('Coupon updated');
      } else {
        res = await couponsAPI.createCoupon(form);
        toast.success('Coupon added');
      }
      setForm({ code: '', discount: '', expiry: '' });
      setEditingId(null);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setProcessing(false);
    }
  };

  const handleEdit = (coupon) => {
    // Ensure expiry is formatted as yyyy-MM-dd for the date input
    let formattedExpiry = '';
    if (coupon.expiry) {
      // Try to parse and format date robustly
      const date = new Date(coupon.expiry);
      if (!isNaN(date.getTime())) {
        formattedExpiry = date.toISOString().slice(0, 10);
      } else if (typeof coupon.expiry === 'string' && coupon.expiry.length >= 10) {
        formattedExpiry = coupon.expiry.slice(0, 10);
      }
    }
    setForm({ code: coupon.code, discount: String(coupon.discount), expiry: formattedExpiry });
    setEditingId(coupon._id);
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Invalid coupon ID');
      return;
    }
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This coupon will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });
    if (!result.isConfirmed) return;
    setProcessing(true);
    try {
      await couponsAPI.deleteCoupon(id);
      toast.success('Coupon deleted');
      fetchCoupons();
      if (editingId === id) {
        setForm({ code: '', discount: '', expiry: '' });
        setEditingId(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete coupon');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-extrabold flex items-center gap-2 text-emerald-700">
          <span className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center mr-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#059669" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span> Manage Coupons
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col gap-6 border border-emerald-100">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            name="code"
            value={form.code}
            onChange={handleInput}
            placeholder="Coupon Code"
            className="border border-emerald-200 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition text-base placeholder:text-emerald-300"
            required
          />
          <input
            name="discount"
            value={form.discount}
            onChange={handleInput}
            placeholder="Discount (%)"
            type="number"
            min="1"
            max="100"
            className="border border-emerald-200 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition text-base placeholder:text-emerald-300"
            required
          />
          <input
            name="expiry"
            value={form.expiry}
            onChange={handleInput}
            placeholder="Expiry Date (YYYY-MM-DD)"
            type="date"
            className="border border-emerald-200 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition text-base placeholder:text-emerald-300"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2 rounded-lg font-semibold shadow transition cursor-pointer disabled:opacity-60 border border-emerald-700"
          disabled={processing}
        >
          {editingId ? 'Update Coupon' : 'Add Coupon'}
        </button>
      </form>
      <div className="overflow-x-auto rounded-xl shadow border border-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-emerald-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Code</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Discount (%)</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4}><div className="flex justify-center items-center h-32"><ScaleLoader color="#10b981" /></div></td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">No coupons found</td></tr>
            ) : (
              coupons.map((coupon, idx) => (
                <tr key={coupon._id} className={`transition ${idx % 2 === 0 ? 'bg-emerald-50' : 'bg-white'} hover:bg-emerald-100`}>
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{coupon.code}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{coupon.discount}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{coupon.expiry?.slice(0,10)}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="p-2 rounded hover:bg-emerald-200 text-emerald-700 cursor-pointer font-bold"
                      onClick={() => handleEdit(coupon)}
                      title="Edit"
                      disabled={processing}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 113.021 2.922L7.5 19.793 3 21l1.207-4.5 12.655-12.013z" /></svg>
                    </button>
                    <button
                      className="p-2 rounded hover:bg-red-200 text-red-600 cursor-pointer font-bold"
                      onClick={() => handleDelete(coupon._id)}
                      title="Delete"
                      disabled={processing}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCoupons;