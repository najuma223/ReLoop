import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  Lock, 
  QrCode, 
  Smartphone, 
  Building, 
  Wallet, 
  Droplet, 
  Truck, 
  Info,
  Sparkles
} from 'lucide-react';
import { orderService } from '../../services/orderService';

export default function PaymentCheckoutModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  checkoutData = null 
}) {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
  
  // UPI inputs
  const [upiId, setUpiId] = useState('nivi@okaxis');
  const [showQr, setShowQr] = useState(false);

  // Card inputs
  const [cardNumber, setCardNumber] = useState('4532 8921 4410 4242');
  const [cardHolder, setCardHolder] = useState('Nivi world (Green Park)');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('389');
  const [saveCard, setSaveCard] = useState(true);

  // Net banking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Defaults or passed checkout items
  const supplierName = checkoutData?.source?.name || checkoutData?.supplierName || 'Factory A STP Plant';
  const waterType = checkoutData?.source?.type || checkoutData?.waterType || 'Industrial Recycled Water';
  const volume = Number(checkoutData?.volume || checkoutData?.quantity || 4000);
  const needQualityCheck = checkoutData?.needQualityCheck !== false;
  const destination = checkoutData?.destination || 'Green Park Facility Tank #1';

  // Itemized fee calculations
  const resourceFee = Number((volume * 0.20).toFixed(2));
  const verificationFee = needQualityCheck ? 150.00 : 0.00;
  const transportFee = 200.00;
  const greenDiscount = -50.00;
  const totalAmount = Number((resourceFee + verificationFee + transportFee + greenDiscount).toFixed(2));

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      let methodText = 'UPI (' + upiId + ')';
      if (paymentMethod === 'card') {
        methodText = `Visa ending in ${cardNumber.slice(-4) || '4242'}`;
      } else if (paymentMethod === 'netbanking') {
        methodText = `Net Banking (${selectedBank})`;
      } else if (paymentMethod === 'wallet') {
        methodText = 'ReLoop ESG Water Wallet';
      }

      const createdOrder = orderService.createOrder({
        supplierName,
        waterType,
        volume,
        destination,
        needQualityCheck,
        paymentMethod: methodText
      });

      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onSuccess(createdOrder);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/50 dark:border-slate-800 shadow-2xl transition-all">
        
        {/* Header with glassmorphic badge */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 px-7 py-5 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner">
              <Droplet className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold tracking-tight">Water Allocation Checkout</h3>
                <span className="rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[10.5px] font-bold px-2 py-0.5">
                  SSL Encrypted
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">Confirm delivery logistics and process secure transaction</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-xl p-2 text-white/80 hover:bg-white/20 transition-all active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Screen Overlay */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-4 animate-scaleUp">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50">
              <CheckCircle2 size={46} className="animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">Payment Successful!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Your water allocation of <strong>{volume.toLocaleString()} L</strong> from <strong>{supplierName}</strong> has been secured and dispatched.
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Transaction Logged to Order History
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitPayment} className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
            
            {/* Left Column: Clean Itemized Cost Breakdown */}
            <div className="md:col-span-5 p-6 space-y-5 bg-slate-50/60 dark:bg-slate-900/50">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Order Summary</span>
                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{supplierName}</h4>
                <p className="text-xs text-slate-500">{waterType}</p>
              </div>

              <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Allocated Volume:</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{volume.toLocaleString()} Litres</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Destination:</span>
                  <span className="truncate max-w-[140px] text-slate-700 dark:text-slate-200">{destination}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Quality Testing:</span>
                  <span className={needQualityCheck ? "text-emerald-600 font-bold" : "text-slate-400"}>
                    {needQualityCheck ? "Lab QA Verified" : "Self-Declared"}
                  </span>
                </div>
              </div>

              {/* Explicit Fee Breakdown */}
              <div className="space-y-2.5 text-xs border-t border-slate-200 dark:border-slate-700 pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Itemized Fee Breakdown</span>
                
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Droplet size={13} className="text-emerald-500" />
                    <span>Resource Fee ({volume.toLocaleString()} L @ ₹0.20/L):</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{resourceFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-teal-500" />
                    <span>Lab QA Verification Fee:</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{verificationFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Truck size={13} className="text-cyan-500" />
                    <span>Tanker Logistics & Transport:</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{transportFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-emerald-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>Green Buyer Circularity Subsidy:</span>
                  </div>
                  <span className="font-bold">-₹50.00</span>
                </div>

                {/* Total Line */}
                <div className="border-t border-dashed border-slate-300 dark:border-slate-700 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Total Payable Amount</span>
                    <span className="block text-[10.5px] text-slate-400">All fees included</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Savings callout */}
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>You save <strong>₹1,850.00</strong> compared to fresh tanker rates.</span>
              </div>
            </div>

            {/* Right Column: Explicit Payment Details Inputs */}
            <div className="md:col-span-7 p-6 space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone size={18} className="mb-1" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard size={18} className="mb-1" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building size={18} className="mb-1" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'wallet'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Wallet size={18} className="mb-1" />
                    <span>ESG Wallet</span>
                  </button>
                </div>
              </div>

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Enter UPI ID / VPA
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowQr(!showQr)}
                      className="text-xs font-semibold text-emerald-600 flex items-center gap-1 hover:underline"
                    >
                      <QrCode size={13} />
                      {showQr ? "Hide QR" : "Scan QR Code"}
                    </button>
                  </div>

                  {showQr ? (
                    <div className="p-4 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-2">
                      <div className="mx-auto w-36 h-36 bg-white p-2 rounded-lg shadow-sm border flex items-center justify-center">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=reloop@icici&pn=ReLoopWater&am=${totalAmount}&cu=INR`} 
                          alt="UPI QR Code" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 block">Scan with any UPI App (GPay, PhonePe, Paytm)</span>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. yourname@okaxis"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => {
                              const base = upiId.split('@')[0] || 'nivi';
                              setUpiId(`${base}${h}`);
                            }}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4532 •••• •••• 4242"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <CreditCard size={18} className="absolute right-3.5 top-3 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Name on card"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="rounded accent-emerald-600"
                    />
                    <span>Securely save this card for future water allocations</span>
                  </label>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3 pt-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Choose Bank
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                          selectedBank === b
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ESG Wallet */}
              {paymentMethod === 'wallet' && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-900">ReLoop Circularity Credits Balance:</span>
                    <span className="font-black text-sm text-emerald-700">₹4,500.00</span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed">
                    ₹{totalAmount.toFixed(2)} will be debited directly from your corporate green procurement account.
                  </p>
                </div>
              )}

              {/* Pay Now Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing Secure Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Pay ₹{totalAmount.toFixed(2)} & Dispatch Order</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-2.5 text-[11px] text-slate-400">
                  <Lock size={12} />
                  <span>256-bit Bank Grade Security • 100% Refund Guarantee</span>
                </div>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
