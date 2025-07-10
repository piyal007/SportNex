import React, { useState } from 'react';
import { Calendar, DollarSign, Eye, X, CreditCard, Download, Filter, Search } from 'lucide-react';

const PaymentHistory = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');

  // Mock data for payment history
  const [payments] = useState([
    {
      id: 'PAY-001',
      bookingId: 1,
      serviceName: 'Wedding Photography',
      serviceProvider: 'Capture Moments Studio',
      amount: 2500,
      paymentDate: '2023-12-18',
      paymentMethod: 'Credit Card',
      cardLast4: '4532',
      status: 'completed',
      transactionId: 'TXN-WED-2023-001',
      receiptUrl: '#',
      eventDate: '2024-01-20'
    },
    {
      id: 'PAY-002',
      bookingId: 3,
      serviceName: 'Corporate Event DJ',
      serviceProvider: 'Sound Wave Entertainment',
      amount: 1200,
      paymentDate: '2023-11-26',
      paymentMethod: 'PayPal',
      cardLast4: null,
      status: 'completed',
      transactionId: 'TXN-CORP-2023-002',
      receiptUrl: '#',
      eventDate: '2023-12-15'
    },
    {
      id: 'PAY-003',
      bookingId: 4,
      serviceName: 'Birthday Party Catering',
      serviceProvider: 'Gourmet Delights',
      amount: 800,
      paymentDate: '2024-01-11',
      paymentMethod: 'Credit Card',
      cardLast4: '8765',
      status: 'completed',
      transactionId: 'TXN-BIRTH-2024-003',
      receiptUrl: '#',
      eventDate: '2024-02-14'
    },
    {
      id: 'PAY-004',
      bookingId: 5,
      serviceName: 'Anniversary Dinner Setup',
      serviceProvider: 'Elegant Events',
      amount: 450,
      paymentDate: '2024-01-05',
      paymentMethod: 'Bank Transfer',
      cardLast4: null,
      status: 'pending',
      transactionId: 'TXN-ANNI-2024-004',
      receiptUrl: '#',
      eventDate: '2024-02-28'
    },
    {
      id: 'PAY-005',
      bookingId: 6,
      serviceName: 'Graduation Party Photography',
      serviceProvider: 'Lens Masters',
      amount: 600,
      paymentDate: '2023-10-15',
      paymentMethod: 'Credit Card',
      cardLast4: '1234',
      status: 'refunded',
      transactionId: 'TXN-GRAD-2023-005',
      receiptUrl: '#',
      eventDate: '2023-11-20',
      refundDate: '2023-10-20',
      refundReason: 'Event cancelled by customer'
    }
  ]);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleDownloadReceipt = (paymentId) => {
    // Download receipt logic
    console.log('Downloading receipt for payment:', paymentId);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'refunded':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'failed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'credit card':
      case 'debit card':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.serviceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    let matchesDate = true;
    if (filterDateRange !== 'all') {
      const paymentDate = new Date(payment.paymentDate);
      const now = new Date();
      
      switch (filterDateRange) {
        case 'last30':
          matchesDate = (now - paymentDate) <= (30 * 24 * 60 * 60 * 1000);
          break;
        case 'last90':
          matchesDate = (now - paymentDate) <= (90 * 24 * 60 * 60 * 1000);
          break;
        case 'last365':
          matchesDate = (now - paymentDate) <= (365 * 24 * 60 * 60 * 1000);
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalAmount = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
            <p className="text-sm text-gray-500">Track all your payment transactions</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-xl font-bold text-gray-900">${totalAmount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Transactions</p>
                <p className="text-xl font-bold text-gray-900">{filteredPayments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-xl font-bold text-gray-900">
                  ${filteredPayments
                    .filter(p => {
                      const paymentDate = new Date(p.paymentDate);
                      const now = new Date();
                      return paymentDate.getMonth() === now.getMonth() && 
                             paymentDate.getFullYear() === now.getFullYear() &&
                             p.status === 'completed';
                    })
                    .reduce((sum, p) => sum + p.amount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search payments..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Time</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
                <option value="last365">Last Year</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterDateRange('all');
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Found</h3>
          <p className="text-gray-500">No payments match your current filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                        <div className="text-sm text-gray-500">{payment.transactionId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.serviceName}</div>
                        <div className="text-sm text-gray-500">{payment.serviceProvider}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${payment.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <div>
                          <div className="text-sm text-gray-900">{payment.paymentMethod}</div>
                          {payment.cardLast4 && (
                            <div className="text-sm text-gray-500">****{payment.cardLast4}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(payment)}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {payment.status === 'completed' && (
                          <button
                            onClick={() => handleDownloadReceipt(payment.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for payment details */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Transaction Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Transaction Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Payment ID:</span>
                        <p className="text-gray-900">{selectedPayment.id}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Transaction ID:</span>
                        <p className="text-gray-900">{selectedPayment.transactionId}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Payment Date:</span>
                        <p className="text-gray-900">{new Date(selectedPayment.paymentDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedPayment.status)}`}>
                          {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Service:</span>
                      <p className="text-gray-900">{selectedPayment.serviceName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Provider:</span>
                      <p className="text-gray-900">{selectedPayment.serviceProvider}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Event Date:</span>
                      <p className="text-gray-900">{new Date(selectedPayment.eventDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Amount:</span>
                        <p className="text-2xl font-bold text-emerald-600">${selectedPayment.amount}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Payment Method:</span>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                          <div>
                            <p className="text-gray-900">{selectedPayment.paymentMethod}</p>
                            {selectedPayment.cardLast4 && (
                              <p className="text-sm text-gray-500">****{selectedPayment.cardLast4}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refund Information */}
                {selectedPayment.status === 'refunded' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Information</h3>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200 space-y-3">
                      <div>
                        <span className="text-sm font-medium text-red-700">Refund Date:</span>
                        <p className="text-red-800">{new Date(selectedPayment.refundDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-red-700">Reason:</span>
                        <p className="text-red-800">{selectedPayment.refundReason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              {selectedPayment.status === 'completed' && (
                <button
                  onClick={() => handleDownloadReceipt(selectedPayment.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
              )}
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;