import bcrypt from 'bcryptjs';
import {
  User,
  SupplierListing,
  BuyerRequest,
  Match,
  QualityReport,
  Delivery,
  Notification,
  AuditLog,
} from './models/index.js';
import { isDbConnected } from './db.js';

export async function seedInitialData() {
  if (!isDbConnected()) {
    console.log('[Seed] Database not connected yet, skipping MongoDB direct seed.');
    return;
  }

  try {
    const passwordHash = bcrypt.hashSync('Password123!', 10);

    // Upsert standard demo accounts
    const ensureUser = async (userData) => {
      let u = await User.findOne({ email: userData.email });
      if (!u) {
        u = await User.create({ ...userData, password: passwordHash });
      }
      return u;
    };

    const admin = await ensureUser({
      role: 'admin',
      fullName: 'System Administrator',
      email: 'admin@reloop.org',
      phone: '9900011223',
      organization: 'ReLoop Water Authority',
      accountStatus: 'active',
      verified: true,
      location: { address: 'Anna Salai, Chennai', coordinates: [13.0827, 80.2707] },
    });

    const supplier1 = await ensureUser({
      role: 'supplier',
      fullName: 'Apex Tech Park STP',
      email: 'supplier@reloop.org',
      phone: '9811122334',
      organization: 'Apex Commercial Facilities Ltd.',
      accountStatus: 'active',
      verified: true,
      location: { address: 'OMR IT Corridor, Chennai', coordinates: [12.9800, 80.2200] },
    });

    const supplier2 = await ensureUser({
      role: 'supplier',
      fullName: 'Ambattur Industrial Effluent Plant',
      email: 'ambattur.stp@reloop.org',
      phone: '9822233445',
      organization: 'Ambattur Industrial Estate Association',
      accountStatus: 'active',
      verified: true,
      location: { address: 'Ambattur Industrial Estate, Chennai', coordinates: [13.0878, 80.2785] },
    });

    const buyer1 = await ensureUser({
      role: 'buyer',
      fullName: 'Green Park Housing Society',
      email: 'buyer@reloop.org',
      phone: '9876543210',
      organization: 'Green Park Residential Society',
      accountStatus: 'active',
      verified: true,
      location: { address: 'T. Nagar, Chennai', coordinates: [13.0418, 80.2341] },
    });

    const buyer2 = await ensureUser({
      role: 'buyer',
      fullName: 'Metro Rail Construction Corp',
      email: 'cmrl.procure@reloop.org',
      phone: '9833344556',
      organization: 'Chennai Metro Rail Ltd.',
      accountStatus: 'active',
      verified: true,
      location: { address: 'Koyambedu Works, Chennai', coordinates: [13.0694, 80.1948] },
    });

    const transporter = await ensureUser({
      role: 'transporter',
      fullName: 'EcoFlow Logistics Fleet',
      email: 'transporter@reloop.org',
      phone: '9877766554',
      organization: 'EcoFlow Water Tanker Services',
      accountStatus: 'active',
      verified: true,
      location: { address: 'Guindy Depot, Chennai', coordinates: [13.0067, 80.2025] },
    });

    const verifier = await ensureUser({
      role: 'verifier',
      fullName: 'AquaCert Labs Quality Assurance',
      email: 'verifier@reloop.org',
      phone: '9844433221',
      organization: 'AquaCert Environmental Testing Services',
      accountStatus: 'active',
      verified: true,
      location: { address: 'IIT Madras Research Park, Chennai', coordinates: [12.9915, 80.2425] },
    });

    const listingsCount = await SupplierListing.countDocuments();
    if (listingsCount > 0) {
      console.log(`[Seed] Database already populated (${listingsCount} listings present). Skipping recreation.`);
      return;
    }

    console.log('[Seed] Seeding ReLoop listings, demands, quality reports, matches & deliveries...');

    // 2. Supplier Listings
    const listings = await SupplierListing.create([
      {
        listingCode: 'LST-2026-001',
        supplierId: supplier2._id,
        supplierName: 'Ambattur Industrial Effluent Plant',
        waterCategory: 'Industrial',
        title: 'Treated Industrial Cooling Blowdown',
        description: 'Treated cooling tower blowdown, suitable for industrial reuse and construction.',
        totalQuantity: 8000,
        availableQuantity: 4000,
        pricePerLitre: 0.15,
        indicativePrice: '₹0.15/L',
        intendedUses: ['Construction', 'Dust Suppression', 'Industrial Cooling'],
        location: { address: 'Ambattur, Chennai', coordinates: [13.0878, 80.2785] },
        qualityVerificationStatus: 'Verified',
        status: 'active',
      },
      {
        listingCode: 'LST-2026-002',
        supplierId: supplier1._id,
        supplierName: 'Apex Tech Park STP',
        waterCategory: 'Treated Wastewater',
        title: 'Tertiary Treated STP Water',
        description: 'Tertiary treated effluent with ultrafiltration and chlorination. Safe for landscaping and toilet flushing.',
        totalQuantity: 12000,
        availableQuantity: 7000,
        pricePerLitre: 0.08,
        indicativePrice: '₹0.08/L',
        intendedUses: ['Irrigation', 'Landscaping', 'Toilet Flushing'],
        location: { address: 'OMR Sholinganallur, Chennai', coordinates: [12.9800, 80.2200] },
        qualityVerificationStatus: 'Verified',
        status: 'active',
      },
      {
        listingCode: 'LST-2026-003',
        supplierId: supplier1._id,
        supplierName: 'Apex Tech Park STP',
        waterCategory: 'RO Reject Water',
        title: 'High-Volume RO Reject Stream',
        description: 'High TDS reverse osmosis reject water, ideal for road wetting, dust suppression & cement curing.',
        totalQuantity: 6000,
        availableQuantity: 6000,
        pricePerLitre: 0.06,
        indicativePrice: '₹0.06/L',
        intendedUses: ['Dust Suppression', 'Construction'],
        location: { address: 'OMR Perungudi, Chennai', coordinates: [12.9647, 80.2425] },
        qualityVerificationStatus: 'Pending',
        status: 'active',
      },
      {
        listingCode: 'LST-2026-004',
        supplierId: supplier2._id,
        supplierName: 'Ambattur Industrial Effluent Plant',
        waterCategory: 'Greywater',
        title: 'Filtered Residential Greywater',
        description: 'Sedimentation and sand-filtered shower & wash basin greywater.',
        totalQuantity: 5000,
        availableQuantity: 3000,
        pricePerLitre: 0.10,
        indicativePrice: '₹0.10/L',
        intendedUses: ['Gardening', 'Landscaping'],
        location: { address: 'Anna Nagar West, Chennai', coordinates: [13.0850, 80.2100] },
        qualityVerificationStatus: 'Verified',
        status: 'active',
      },
    ]);

    // 3. Buyer Requests
    const requests = await BuyerRequest.create([
      {
        requestCode: 'REQ-2026-001',
        buyerId: buyer1._id,
        buyerName: 'Green Park Housing Society',
        title: 'Gardening & Landscape Irrigation Water',
        waterCategory: 'Treated Wastewater',
        requiredQuantity: 4000,
        fulfilledQuantity: 4000,
        purpose: 'Irrigation',
        intendedUse: 'Irrigation',
        indicativeBudget: '₹0.12/L',
        deliveryLocation: { address: 'T. Nagar, Chennai', coordinates: [13.0418, 80.2341] },
        priority: 'Standard',
        requiredQuality: 'Verified',
        status: 'Fulfilled',
        matchingStatus: 'Dispatched',
      },
      {
        requestCode: 'REQ-2026-002',
        buyerId: buyer2._id,
        buyerName: 'Metro Rail Construction Corp',
        title: 'Piling & Concrete Curing Water Supply',
        waterCategory: 'Industrial',
        requiredQuantity: 6000,
        fulfilledQuantity: 4000,
        purpose: 'Construction',
        intendedUse: 'Construction',
        indicativeBudget: '₹0.15/L',
        deliveryLocation: { address: 'Koyambedu Metro Site, Chennai', coordinates: [13.0694, 80.1948] },
        priority: 'High',
        requiredQuality: 'Standard',
        status: 'Partially Matched',
        matchingStatus: 'In Review',
      },
      {
        requestCode: 'REQ-2026-003',
        buyerId: buyer1._id,
        buyerName: 'Green Park Housing Society',
        title: 'Society Dual-Plumbing Flushing Water',
        waterCategory: 'Greywater',
        requiredQuantity: 3500,
        fulfilledQuantity: 0,
        purpose: 'Flushing',
        intendedUse: 'Toilet Flushing',
        indicativeBudget: '₹0.10/L',
        deliveryLocation: { address: 'T. Nagar, Chennai', coordinates: [13.0418, 80.2341] },
        priority: 'Urgent',
        requiredQuality: 'Verified',
        status: 'Active',
        matchingStatus: 'Unmatched',
      },
    ]);

    // 4. Quality Reports
    const qReports = await QualityReport.create([
      {
        reportCode: 'QLT-2026-081',
        sourceId: 'src-1',
        sourceName: 'Ambattur Industrial Effluent Plant',
        listingId: listings[0]._id,
        verifierId: verifier._id,
        verifierName: 'AquaCert Labs Quality Assurance',
        sampleCollectionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        testDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        submissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        waterCategory: 'Industrial',
        intendedReuseCategory: 'Construction & Dust Suppression',
        parameters: [
          { name: 'pH', value: 7.2, unit: 'pH', minLimit: 6.5, maxLimit: 8.5, passed: true },
          { name: 'Turbidity', value: 1.2, unit: 'NTU', minLimit: 0, maxLimit: 5.0, passed: true },
          { name: 'TDS (Total Dissolved Solids)', value: 410, unit: 'ppm', minLimit: 0, maxLimit: 1000, passed: true },
          { name: 'BOD (Biochemical Oxygen Demand)', value: 6.5, unit: 'mg/L', minLimit: 0, maxLimit: 30, passed: true },
          { name: 'COD (Chemical Oxygen Demand)', value: 28, unit: 'mg/L', minLimit: 0, maxLimit: 100, passed: true },
          { name: 'E. Coli', value: 0, unit: 'CFU/100mL', minLimit: 0, maxLimit: 0, passed: true },
        ],
        overallResult: 'Passed',
        status: 'Approved',
        certificateNumber: 'TN-PCB-2026-A4821',
        reviewerNotes: 'Sample satisfies CPCB non-potable reuse standards (Class IV). Approved for construction & landscaping.',
        reviewedByName: 'System Administrator',
        reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        reportCode: 'QLT-2026-099',
        sourceId: 'src-2',
        sourceName: 'Apex Tech Park STP',
        listingId: listings[1]._id,
        verifierId: verifier._id,
        verifierName: 'AquaCert Labs Quality Assurance',
        sampleCollectionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        testDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        submissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        waterCategory: 'Treated Wastewater',
        intendedReuseCategory: 'Irrigation & Landscaping',
        parameters: [
          { name: 'pH', value: 6.9, unit: 'pH', minLimit: 6.5, maxLimit: 8.5, passed: true },
          { name: 'Turbidity', value: 3.4, unit: 'NTU', minLimit: 0, maxLimit: 5.0, passed: true },
          { name: 'TDS (Total Dissolved Solids)', value: 620, unit: 'ppm', minLimit: 0, maxLimit: 1000, passed: true },
          { name: 'BOD (Biochemical Oxygen Demand)', value: 12.0, unit: 'mg/L', minLimit: 0, maxLimit: 30, passed: true },
          { name: 'COD (Chemical Oxygen Demand)', value: 45, unit: 'mg/L', minLimit: 0, maxLimit: 100, passed: true },
          { name: 'E. Coli', value: 0, unit: 'CFU/100mL', minLimit: 0, maxLimit: 0, passed: true },
        ],
        overallResult: 'Passed',
        status: 'Pending',
        certificateNumber: 'TN-PCB-2026-B1092',
        reviewerNotes: 'Awaiting secondary administrative review. Parameter thresholds within acceptable limits.',
      },
    ]);

    // 5. Matches
    const matches = await Match.create([
      {
        matchCode: 'MCH-2026-001',
        sourceId: 'src-1',
        sourceName: 'Ambattur Industrial Effluent Plant',
        demandId: 'dem-1',
        destinationName: 'Green Park Housing Society',
        supplierId: supplier2._id,
        buyerId: buyer1._id,
        listingId: listings[0]._id,
        requestId: requests[0]._id,
        quantity: 4000,
        distanceKm: 3.4,
        waterCategory: 'Industrial',
        matchScore: 92,
        scoreFactors: {
          proximityScore: 95,
          quantityScore: 100,
          qualityScore: 90,
          urgencyScore: 80,
          reasons: [
            'Optimal proximity (3.4 km) ensures minimal transport carbon footprint',
            'Full fulfillment: 4,000 L satisfies 100% of demand',
            'Lab analysis verified (Certificate TN-PCB-2026-A4821)',
          ],
        },
        status: 'Completed',
        approvedByName: 'System Administrator',
        approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        matchCode: 'MCH-2026-002',
        sourceId: 'src-2',
        sourceName: 'Apex Tech Park STP',
        demandId: 'dem-2',
        destinationName: 'Metro Rail Construction Corp',
        supplierId: supplier1._id,
        buyerId: buyer2._id,
        listingId: listings[1]._id,
        requestId: requests[1]._id,
        quantity: 4000,
        distanceKm: 6.8,
        waterCategory: 'Treated Wastewater',
        matchScore: 88,
        scoreFactors: {
          proximityScore: 85,
          quantityScore: 90,
          qualityScore: 88,
          urgencyScore: 90,
          reasons: [
            'Proximity within 6.8 km along dedicated commercial corridor',
            'High priority demand fulfillment (4,000 of 6,000 L allocated)',
            'Water quality pre-certified for construction reuse',
          ],
        },
        status: 'Admin Approved',
        approvedByName: 'System Administrator',
        approvedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        matchCode: 'MCH-2026-003',
        sourceId: 'src-4',
        sourceName: 'Filtered Residential Greywater',
        demandId: 'dem-3',
        destinationName: 'Green Park Housing Society',
        supplierId: supplier2._id,
        buyerId: buyer1._id,
        listingId: listings[3]._id,
        requestId: requests[2]._id,
        quantity: 3000,
        distanceKm: 4.2,
        waterCategory: 'Greywater',
        matchScore: 86,
        scoreFactors: {
          proximityScore: 90,
          quantityScore: 85,
          qualityScore: 85,
          urgencyScore: 95,
          reasons: [
            'Proximity 4.2 km in Central Chennai',
            'Urgent priority request',
            'Supplies 86% of requested dual-plumbing volume',
          ],
        },
        status: 'Proposed',
      },
    ]);

    // 6. Deliveries
    await Delivery.create([
      {
        deliveryCode: 'DLV-2026-001',
        matchId: matches[0]._id,
        sourceName: 'Ambattur Industrial Effluent Plant',
        destinationName: 'Green Park Housing Society',
        transporterName: 'EcoFlow Logistics Fleet',
        transporterId: transporter._id,
        driverName: 'K. Rajesh',
        driverPhone: '+91 98777 66554',
        vehicleNumber: 'TN-09-CW-8492',
        waterCategory: 'Industrial',
        quantity: 4000,
        status: 'Completed',
        pickupLocation: {
          name: 'Ambattur Effluent Station 2',
          address: 'Ambattur Industrial Estate, Chennai',
          coordinates: [13.0878, 80.2785],
        },
        deliveryLocation: {
          name: 'Green Park Tank A',
          address: 'T. Nagar, Chennai',
          coordinates: [13.0418, 80.2341],
        },
        currentLocation: {
          coordinates: [13.0418, 80.2341],
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        estimatedDistanceKm: 3.4,
        scheduledPickupTime: new Date(Date.now() - 28 * 60 * 60 * 1000),
        dispatchedAt: new Date(Date.now() - 27 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        statusHistory: [
          { status: 'Requested', timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000), updatedBy: 'System' },
          { status: 'Matched', timestamp: new Date(Date.now() - 29 * 60 * 60 * 1000), updatedBy: 'Admin' },
          { status: 'Quality Cleared', timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000), updatedBy: 'Verifier' },
          { status: 'Transporter Assigned', timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000), updatedBy: 'EcoFlow Dispatch' },
          { status: 'In Transit', timestamp: new Date(Date.now() - 27 * 60 * 60 * 1000), updatedBy: 'K. Rajesh (Driver)' },
          { status: 'Delivered', timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000), updatedBy: 'K. Rajesh (Driver)' },
          { status: 'Completed', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), updatedBy: 'Buyer Confirmation' },
        ],
      },
      {
        deliveryCode: 'DLV-2026-002',
        matchId: matches[1]._id,
        sourceName: 'Apex Tech Park STP',
        destinationName: 'Metro Rail Construction Corp',
        transporterName: 'EcoFlow Logistics Fleet',
        transporterId: transporter._id,
        driverName: 'M. Senthil',
        driverPhone: '+91 98777 66555',
        vehicleNumber: 'TN-14-BQ-3108',
        waterCategory: 'Treated Wastewater',
        quantity: 4000,
        status: 'In Transit',
        pickupLocation: {
          name: 'Apex STP Outflow Bay',
          address: 'OMR Sholinganallur, Chennai',
          coordinates: [12.9800, 80.2200],
        },
        deliveryLocation: {
          name: 'Koyambedu Metro Works',
          address: 'Koyambedu, Chennai',
          coordinates: [13.0694, 80.1948],
        },
        currentLocation: {
          coordinates: [13.0250, 80.2070], // Between OMR and Koyambedu
          updatedAt: new Date(Date.now() - 15 * 60 * 1000),
        },
        estimatedDistanceKm: 6.8,
        scheduledPickupTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        dispatchedAt: new Date(Date.now() - 45 * 60 * 1000),
        statusHistory: [
          { status: 'Transporter Assigned', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), updatedBy: 'EcoFlow Dispatch' },
          { status: 'In Transit', timestamp: new Date(Date.now() - 45 * 60 * 1000), updatedBy: 'M. Senthil' },
        ],
      },
    ]);

    // 7. Notifications
    await Notification.create([
      {
        title: 'Water Quality Report Pending Review',
        message: 'AquaCert Labs submitted quality report QLT-2026-099 for Apex Tech Park STP.',
        type: 'quality',
        severity: 'info',
        read: false,
        link: '/admin/quality',
        targetRole: 'admin',
      },
      {
        title: 'New High Priority Match Generated',
        message: 'Smart Matching Hub generated match MCH-2026-003 with 86% compatibility score.',
        type: 'matching',
        severity: 'success',
        read: false,
        link: '/admin/matching',
        targetRole: 'admin',
      },
      {
        title: 'Active Tanker In Transit',
        message: 'Delivery DLV-2026-002 dispatched by EcoFlow Fleet towards Koyambedu Metro Works.',
        type: 'delivery',
        severity: 'info',
        read: true,
        link: '/admin/deliveries',
        targetRole: 'admin',
      },
      {
        title: 'Unmatched Urgent Request',
        message: 'Request REQ-2026-003 (Green Park Housing Society, 3,500 L) is currently unmatched.',
        type: 'alert',
        severity: 'warning',
        read: false,
        link: '/admin/supply-requests',
        targetRole: 'admin',
      },
    ]);

    // 8. Audit Logs
    await AuditLog.create([
      {
        actor: { id: admin._id.toString(), name: 'System Administrator', role: 'admin', email: 'admin@reloop.org' },
        action: 'MATCH_APPROVED',
        targetEntity: 'Match',
        targetId: 'MCH-2026-002',
        details: 'Approved allocation of 4,000 L Treated Wastewater from Apex STP to Metro Rail Construction Corp',
        reason: 'Pre-certified water quality & critical municipal infrastructure priority',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        actor: { id: admin._id.toString(), name: 'System Administrator', role: 'admin', email: 'admin@reloop.org' },
        action: 'QUALITY_APPROVED',
        targetEntity: 'QualityReport',
        targetId: 'QLT-2026-081',
        details: 'Approved lab verification report for Ambattur Industrial Effluent Plant',
        reason: 'All tested parameters meet CPCB non-potable Class IV reuse limits',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        actor: { id: admin._id.toString(), name: 'System Administrator', role: 'admin', email: 'admin@reloop.org' },
        action: 'USER_VERIFIED',
        targetEntity: 'User',
        targetId: supplier1._id.toString(),
        details: 'Verified commercial credentials for Apex Tech Park STP',
        reason: 'Trade license and pollution control board consent order inspected',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('[Seed] Demo data successfully initialized in MongoDB!');
  } catch (error) {
    console.error('[Seed] Error initializing demo data:', error);
  }
}
