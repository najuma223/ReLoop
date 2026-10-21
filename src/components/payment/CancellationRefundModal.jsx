import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  ArrowRight, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle,
  Clock
} from 'lucide-react';

export default function CancellationRefundModal({ isOpen, onClose, order, onConfirmCancellation }) {
  const [selectedReason, setSelectedReason] = useState('Change in facility schedule');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !order) return null;

  const totalPaid = order.costBreakdown?.total || 1150.00;
  const deductions = order.cancellationPolicy?.deductionAmount ?? 150.00;
  const refundAmount = Number((totalPaid - deductions).toFixed(2));
  const policyTier = order.cancellationPolicy?.tier || 'Standard redBus-Style Policy (15% Deduction)';

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmCancellation(order.id, selectedReason);
      setIsProcessing(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-2xl transition-all scale-100">
        
        {/* Top Warning Banner (redBus Style) */}
        <div className="bg-gradient-to-r from-amber-500 to-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Review Cancellation & Refund</h3>
              <p className="text-xs text-amber-100">Order #{order.id} • redBus-Style Policy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Order Summary Snapshot */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200/80 dark:border-slate-700/60 text-sm">
            <div>
              <span className="text-xs text-slate-500 font-medium">Water Supply</span>
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {order.supplierName} • {order.volume?.toLocaleString()} L
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Scheduled Arrival</span>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{order.eta}</p>
            </div>
          </div>

          {/* redBus Explicit Refund Calculation Ledger */}
          <div className="rounded-xl border-2 border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              <span>Exact Refund Calculation</span>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 text-[11px] text-emerald-700 dark:text-emerald-300">
                Guaranteed
              </span>
            </div>

            <div className="space-y-2 text-sm divide-y divide-slate-200/70 dark:divide-slate-700/70 pt-1">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Total Amount Paid:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₹{totalPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-rose-600 dark:text-rose-400">
                <div className="flex items-center gap-1.5">
                  <span>Cancellation Deductions:</span>
                  <span className="text-xs text-rose-400" title={policyTier}>(15% tier)</span>
                </div>
                <span className="font-bold">- ₹{deductions.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 text-base">
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                  Total Refund to be Credited:
                </span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{refundAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-start gap-1.5">
              <Clock size={14} className="text-slate-400 mt-0.5 shrink-0" />
              <span>
                Refund will be credited to <strong>{order.paymentMethod}</strong> within <strong>24–48 hours</strong> upon confirmation.
              </span>
            </div>
          </div>

          {/* Reason for Cancellation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
              Reason for Cancellation
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Change in facility schedule">Change in facility schedule / timing</option>
              <option value="Demand fulfilled through rain/alternate source">Demand fulfilled through alternate source</option>
              <option value="Incorrect volume or location selected">Incorrect volume or delivery point selected</option>
              <option value="Emergency maintenance at site">Emergency maintenance at facility site</option>
              <option value="Other">Other / testing cancellation flow</option>
            </select>
          </div>

          {/* Warning Note */}
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 flex gap-2">
            <HelpCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <span>
              Once confirmed, this tanker dispatch will be released from active queue and cannot be undone.
            </span>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Keep Order
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-sm font-bold shadow-lg shadow-rose-600/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Initiating Refund...
                </>
              ) : (
                <>
                  <RotateCcw size={15} />
                  Confirm Cancellation (Refund ₹{refundAmount.toFixed(2)})
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
