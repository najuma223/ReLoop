// Order & Payment state management with LocalStorage persistence

const INITIAL_ORDERS = [
  {
    id: 'ORD-2026-891',
    date: '22 Oct 2026, 11:15 AM',
    status: 'In Transit', // 'In Transit' | 'Scheduled' | 'Delivered' | 'Cancelled'
    supplierName: 'Factory A STP Plant',
    waterType: 'Industrial Recycled',
    volume: 4000,
    destination: 'Green Park Facility Tank #1',
    driver: 'K. Ramesh (+91 98401 22334)',
    tanker: 'EcoFlow Tanker TN-09-AX-4421',
    eta: 'In Transit — 20 mins away',
    qaStatus: 'AquaCert QA-9921 (Passed)',
    paymentMethod: 'UPI (nivi@okaxis)',
    transactionId: 'TXN-902188472',
    costBreakdown: {
      resourceFee: 800.00,      // 4000 L @ ₹0.20/L
      verificationFee: 150.00,  // Lab QA inspection
      transportFee: 250.00,     // Tanker delivery
      greenDiscount: -50.00,    // Sustainable buyer credit
      total: 1150.00
    },
    cancellationPolicy: {
      deductionAmount: 150.00,
      refundAmount: 1000.00,
      tier: 'Standard Cancel (< 2h to arrival)'
    },
    refundDetails: null
  },
  {
    id: 'ORD-2026-874',
    date: '21 Oct 2026, 03:45 PM',
    status: 'Scheduled',
    supplierName: 'IT Park RO Reject Basin',
    waterType: 'RO Reject Water',
    volume: 5000,
    destination: 'Green Park Sports Arena',
    driver: 'P. Vignesh (+91 98412 88712)',
    tanker: 'EcoFlow Tanker TN-02-ZZ-8190',
    eta: 'Tomorrow at 09:00 AM',
    qaStatus: 'AquaCert QA-9860 (Passed)',
    paymentMethod: 'Visa Card ending in 4242',
    transactionId: 'TXN-881729012',
    costBreakdown: {
      resourceFee: 900.00,
      verificationFee: 150.00,
      transportFee: 200.00,
      greenDiscount: -50.00,
      total: 1200.00
    },
    cancellationPolicy: {
      deductionAmount: 100.00,
      refundAmount: 1100.00,
      tier: 'Early Cancellation (> 12h to arrival)'
    },
    refundDetails: null
  },
  {
    id: 'ORD-2026-842',
    date: '19 Oct 2026, 10:20 AM',
    status: 'Delivered',
    supplierName: 'Apartment Complex Greywater',
    waterType: 'Greywater Media',
    volume: 3000,
    destination: 'Green Park Landscape Zone',
    driver: 'M. Senthil (+91 98842 55441)',
    tanker: 'EcoFlow Tanker TN-07-CB-1190',
    eta: 'Delivered on 19 Oct, 11:45 AM',
    qaStatus: 'AquaCert QA-9710 (Passed)',
    paymentMethod: 'Net Banking (HDFC Bank)',
    transactionId: 'TXN-764910283',
    costBreakdown: {
      resourceFee: 540.00,
      verificationFee: 150.00,
      transportFee: 180.00,
      greenDiscount: -30.00,
      total: 840.00
    },
    cancellationPolicy: null,
    refundDetails: null
  }
];

const STORAGE_KEY = 'reloop_orders_data_v1';

export const orderService = {
  getOrders: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
    }
    return INITIAL_ORDERS;
  },

  saveOrders: (orders) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  },

  createOrder: (orderPayload) => {
    const orders = orderService.getOrders();
    const newId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const resourceFee = Number((orderPayload.volume * 0.20).toFixed(2));
    const verificationFee = orderPayload.needQualityCheck !== false ? 150.00 : 0.00;
    const transportFee = 200.00;
    const greenDiscount = -50.00;
    const total = Number((resourceFee + verificationFee + transportFee + greenDiscount).toFixed(2));

    const newOrder = {
      id: newId,
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'In Transit',
      supplierName: orderPayload.supplierName || 'Factory A STP Plant',
      waterType: orderPayload.waterType || 'Industrial Recycled',
      volume: orderPayload.volume || 4000,
      destination: orderPayload.destination || 'Green Park Facility Tank #1',
      driver: 'K. Ramesh (+91 98401 22334)',
      tanker: 'EcoFlow Tanker TN-09-AX-4421',
      eta: 'In Transit — 25 mins away',
      qaStatus: orderPayload.needQualityCheck !== false ? 'AquaCert QA-Pending Verification' : 'Self-Declaration (No Lab Check)',
      paymentMethod: orderPayload.paymentMethod || 'UPI (nivi@okaxis)',
      transactionId: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
      costBreakdown: {
        resourceFee,
        verificationFee,
        transportFee,
        greenDiscount,
        total
      },
      cancellationPolicy: {
        deductionAmount: Number((total * 0.15).toFixed(2)),
        refundAmount: Number((total * 0.85).toFixed(2)),
        tier: 'Standard redBus-Style Policy (15% Deduction fee)'
      },
      refundDetails: null
    };

    const updated = [newOrder, ...orders];
    orderService.saveOrders(updated);
    return newOrder;
  },

  cancelOrder: (orderId, reason = 'Customer requested cancellation') => {
    const orders = orderService.getOrders();
    const target = orders.find(o => o.id === orderId);
    if (!target) return null;

    const deductions = target.cancellationPolicy?.deductionAmount ?? 50.00;
    const refund = Number((target.costBreakdown.total - deductions).toFixed(2));

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Cancelled',
          refundDetails: {
            status: 'Refund Initiated',
            refundId: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
            totalPaid: o.costBreakdown.total,
            deductions: deductions,
            refundAmount: refund,
            initiatedAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reason,
            targetAccount: o.paymentMethod
          }
        };
      }
      return o;
    });

    orderService.saveOrders(updatedOrders);
    return updatedOrders.find(o => o.id === orderId);
  }
};
