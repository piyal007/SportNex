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
    const formattedExpiry = coupon.expiry ? coupon.expiry.slice(0, 10) : '';
    setForm({ code: coupon.code, discount: coupon.discount, expiry: formattedExpiry });
    setEditingId(coupon._id);
  };

  const handleDelete = async (id) => {
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
      // If editing the deleted coupon, reset form
      if (editingId === id) {
        setForm({ code: '', discount: '', expiry: '' });
        setEditingId(null);
      }
    } catch (err) {
      toast.error('Failed to delete coupon');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Coupons</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 mb-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            name="code"
            value={form.code}
            onChange={handleInput}
            placeholder="Coupon Code"
            className="border rounded px-3 py-2 flex-1"
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
            className="border rounded px-3 py-2 flex-1"
            required
          />
          <input
            name="expiry"
            value={form.expiry}
            onChange={handleInput}
            placeholder="Expiry Date (YYYY-MM-DD)"
            type="date"
            className="border rounded px-3 py-2 flex-1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={processing}
        >
          {editingId ? 'Update Coupon' : 'Add Coupon'}
        </button>
      </form>
      <div className="bg-white rounded shadow">
        <h3 className="text-lg font-semibold px-4 pt-4">All Coupons</h3>
        {loading ? (
          <div className="flex justify-center py-8"><ScaleLoader color="#2563eb" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Code</th>
                  <th className="py-2 px-4 text-left">Discount (%)</th>
                  <th className="py-2 px-4 text-left">Expiry</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-6">No coupons found</td></tr>
                ) : (
                  coupons.map(coupon => (
                    <tr key={coupon._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-mono">{coupon.code}</td>
                      <td className="py-2 px-4">{coupon.discount}</td>
                      <td className="py-2 px-4">{coupon.expiry?.slice(0,10)}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                          onClick={() => handleEdit(coupon)}
                          disabled={processing}
                        >Edit</button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(coupon._id)}
                          disabled={processing}
                        >Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCoupons;