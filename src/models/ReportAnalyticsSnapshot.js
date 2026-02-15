import mongoose from 'mongoose'

const reportMetricSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    note: { type: String, trim: true, default: '' },
  },
  { _id: false }
)

const reportTrendRowSchema = new mongoose.Schema(
  {
    period: { type: String, required: true, trim: true },
    income: { type: String, required: true, trim: true },
    appointments: { type: Number, default: 0 },
    topDoctor: { type: String, trim: true, default: '-' },
  },
  { _id: false }
)

const reportInsightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false }
)

export const reportAnalyticsSnapshotSchema = new mongoose.Schema(
  {
    range: { type: String, trim: true, default: 'this-month' },
    fromDate: { type: String, trim: true, default: '' },
    toDate: { type: String, trim: true, default: '' },
    doctorName: { type: String, trim: true, default: 'All' },
    reportType: { type: String, trim: true, default: 'Financial + Operational' },
    metrics: { type: [reportMetricSchema], default: [] },
    trendRows: { type: [reportTrendRowSchema], default: [] },
    insights: { type: [reportInsightSchema], default: [] },
  },
  {
    timestamps: true,
    collection: 'report_analytics_data',
  }
)
