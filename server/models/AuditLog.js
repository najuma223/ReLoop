import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    actor: {
      id: { type: String, default: 'admin-1' },
      name: { type: String, default: 'System Administrator' },
      role: { type: String, default: 'admin' },
      email: { type: String, default: 'admin@reloop.org' },
    },
    action: {
      type: String,
      required: true,
    },
    targetEntity: {
      type: String,
      required: true,
      enum: ['User', 'Match', 'SupplierListing', 'BuyerRequest', 'QualityReport', 'Delivery', 'System'],
    },
    targetId: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ targetEntity: 1, targetId: 1 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
