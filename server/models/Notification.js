import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['approval', 'warning', 'alert', 'delivery', 'quality', 'matching', 'system'],
      default: 'system',
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical', 'success'],
      default: 'info',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '',
    },
    targetRole: {
      type: String,
      default: 'admin',
    },
    relatedId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ read: 1, createdAt: -1 });

export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
