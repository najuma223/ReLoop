import mongoose from 'mongoose';

const QualityParameterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  minLimit: { type: Number },
  maxLimit: { type: Number },
  passed: { type: Boolean, required: true },
});

const QualityReportSchema = new mongoose.Schema(
  {
    reportCode: {
      type: String,
      required: true,
      unique: true,
    },
    sourceId: {
      type: String,
      required: true,
    },
    sourceName: {
      type: String,
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SupplierListing',
    },
    verifierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifierName: {
      type: String,
      default: 'AquaCert Labs Quality Assurance',
    },
    sampleCollectionDate: {
      type: Date,
      default: Date.now,
    },
    testDate: {
      type: Date,
      default: Date.now,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    waterCategory: {
      type: String,
      default: 'Treated Wastewater',
    },
    intendedReuseCategory: {
      type: String,
      default: 'Industrial & Irrigation',
    },
    parameters: [QualityParameterSchema],
    overallResult: {
      type: String,
      enum: ['Passed', 'Failed', 'Conditional'],
      default: 'Passed',
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Approved', 'Rejected', 'Needs Re-test'],
      default: 'Pending',
    },
    labName: {
      type: String,
      default: 'AquaCert Environmental Testing Services',
    },
    certificateNumber: {
      type: String,
      default: '',
    },
    reviewerNotes: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedByName: {
      type: String,
      default: '',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

QualityReportSchema.index({ status: 1 });
QualityReportSchema.index({ sourceId: 1 });

export const QualityReport = mongoose.models.QualityReport || mongoose.model('QualityReport', QualityReportSchema);
