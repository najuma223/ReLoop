import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Droplet, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  ExternalLink,
  Plus,
  ArrowRight,
  Filter
} from 'lucide-react';
import { orderService } from '../../services/orderService';

export default function OrderHistorySidebar({ 
  isOpen, 
  onClose, 
  orders: propOrders = [],
  onOpenCheckout,
  onInitiateCancel,
  activeOrderIdToExpand = null 
}) {
  const [orders, setOrders] = useState(() => (propOrders && propOrders.length > 0 ? propOrders : orderService.getOrders()));
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filter, setFilter] = useState('All'); // 'All' | 'Active' | 'Delivered' | 'Cancelled'

  useEffect(() => {
    if (propOrders && propOrders.length > 0) {
      setOrders(propOrders);
    } else {
      setOrders(orderService.getOrders());
    }
  }, [propOrders, isOpen]);

  useEffect(() => {
    if (activeOrderIdToExpand) {
      setExpandedOrderId(activeOrderIdToExpand);
    } else if (!expandedOrderId && orders.length > 0) {
      setExpandedOrderId(orders[0].id);
    }
  }, [activeOrderIdToExpand, orders]);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'Active') return o.status === 'In Transit' || o.status === 'Scheduled';
    if (filter === 'Delivered') return o.status === 'Delivered';
    if (filter === 'Cancelled') return o.status === 'Cancelled';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Truck size={12} />
            In Transit
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock size={12} />
            Scheduled
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={12} />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle size={12} />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-[1100] bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fadeIn"
        />
      )}

      {/* Slide-over Sidebar Container */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[1150] w-full sm:w-[480px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
              <Receipt size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Order History</h3>
                <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 px-2 py-0.5 text-xs font-bold">
                  {orders.length}
                </span>
              </div>
              <p className="text-xs text-slate-500">Transactions, live tracking & refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCheckout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={14} />
              <span>New Order</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Active', 'Delivered', 'Cancelled'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Orders List & Granular Detail View */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Receipt className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No {filter !== 'All' ? filter : ''} orders found</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Place a new water order to track transactions and deliveries.
              </p>
              <button
                onClick={onOpenCheckout}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                <Plus size={14} />
                Create First Order
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const isActive = order.status === 'In Transit' || order.status === 'Scheduled';

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-emerald-500/60 bg-emerald-50/15 dark:bg-emerald-950/10 shadow-lg ring-1 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Order Summary Card Header (Click to expand) */}
                  <div
                    onClick={() => toggleExpand(order.id)}
                    className="p-4 cursor-pointer select-none space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                          #{order.id}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        ₹{order.costBreakdown?.total?.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 truncate max-w-[260px]">
                        <Droplet size={13} className="text-emerald-500 shrink-0" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {order.supplierName}
                        </span>
                        <span>• {order.volume?.toLocaleString()} L</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">{order.date}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      <span>{isExpanded ? 'Click to collapse details' : 'Click to view full transaction details'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>

                  {/* GRANULAR DETAIL VIEW */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-200/80 dark:border-slate-700/80 space-y-4 text-xs animate-fadeIn">
                      
                      {/* Destination & Logistics */}
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 space-y-2 border border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex justify-between items-start">
                          <span className="text-slate-500 font-medium">Destination:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100 text-right">{order.destination}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Transporter:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{order.tanker}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Driver Contact:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{order.driver}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Arrival Status:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{order.eta}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-slate-500 font-medium">Quality Testing:</span>
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <ShieldCheck size={13} />
                            {order.qaStatus}
                          </span>
                        </div>
                      </div>

                      {/* Itemized Cost Breakdown */}
                      <div className="space-y-1.5 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/80">
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Itemized Cost Breakdown
                        </span>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Resource Fee ({order.volume?.toLocaleString()} L):</span>
                          <span>₹{order.costBreakdown?.resourceFee?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Verification Fee:</span>
                          <span>₹{order.costBreakdown?.verificationFee?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Transport & Logistics:</span>
                          <span>₹{order.costBreakdown?.transportFee?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>Green Circularity Rebate:</span>
                          <span>{order.costBreakdown?.greenDiscount?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100 text-sm">
                          <span>Net Paid Total:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                            ₹{order.costBreakdown?.total?.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Payment Meta */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                        <span>Paid via {order.paymentMethod}</span>
                        <span className="font-mono">{order.transactionId}</span>
                      </div>

                      {/* REFUND INITIATED BOX (if cancelled) */}
                      {order.status === 'Cancelled' && order.refundDetails && (
                        <div className="rounded-xl border-2 border-rose-400/40 bg-rose-50/50 dark:bg-rose-950/20 p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                              <RotateCcw size={14} className="animate-spin-slow" />
                              Refund Initiated
                            </span>
                            <span className="font-mono text-[11px] text-slate-500 font-bold">
                              #{order.refundDetails.refundId}
                            </span>
                          </div>

                          <div className="space-y-1 text-slate-600 dark:text-slate-300 text-[11.5px]">
                            <div className="flex justify-between">
                              <span>Total Paid:</span>
                              <strong>₹{order.refundDetails.totalPaid?.toFixed(2)}</strong>
                            </div>
                            <div className="flex justify-between text-rose-600">
                              <span>Cancellation Deductions:</span>
                              <strong>- ₹{order.refundDetails.deductions?.toFixed(2)}</strong>
                            </div>
                            <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 pt-1 border-t border-rose-200">
                              <span>Refund Amount:</span>
                              <strong className="text-emerald-600 text-sm">₹{order.refundDetails.refundAmount?.toFixed(2)}</strong>
                            </div>
                          </div>

                          <p className="text-[10.5px] text-slate-500 pt-1">
                            Credited to <strong>{order.refundDetails.targetAccount}</strong> within 24h. Reason: {order.refundDetails.reason}
                          </p>
                        </div>
                      )}

                      {/* CANCELLATION BUTTON FOR ACTIVE ORDERS (Triggers redBus Modal) */}
                      {isActive && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => onInitiateCancel(order)}
                            className="w-full py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/60 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                          >
                            <AlertTriangle size={14} />
                            <span>Cancel Order & View Refund Amount</span>
                          </button>
                          <span className="block text-center text-[10.5px] text-slate-400 mt-1">
                            redBus-style policy: exact refund calculation displayed before final confirmation
                          </span>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-xs text-slate-500 flex items-center justify-between">
          <span>ReLoop 2.0 Water Payment Vault</span>
          <span className="font-semibold text-emerald-600">100% Refund Guarantee</span>
        </div>
      </aside>
    </>
  );
}
