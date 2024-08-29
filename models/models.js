const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Import Schema from mongoose

mongoose.connect(process.env.MONGO_URI)

const userSchema = new Schema({
  username: { type: String, required: [true, 'Name is Require'], unique: true },
  password: { type: String, required: [true, 'Password is Require'] },
  email: { type: String, required: [true, 'Email is Require'], unique: true },
  created_at: { type: Date, default: Date.now },
  last_login: { type: Date },
  is_active: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  isDoctor: { type: Boolean, default: false },
  notification: { type: Array, default: [] },
  seenNotification: { type: Array, default: [] }
});

const patientSchema = new Schema({
  first_name: String,
  last_name: String,
  date_of_birth: Date,
  gender: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip_code: String,
  },
  contact_number: String,
  email: String,
  blood_group: String,
  medical_history: [{
    condition: String,
    date_diagnosed: Date,
    treatment: String,
  }],
  last_reports: {
    diabetes: String,
    blood_pressure: String,
  },
});

const doctorSchema = new Schema({
  first_name: String,
  last_name: String,
  specialization: String,
  contact_number: String,
  email: String,
  date_of_birth: Date,
  gender: String,
  years_of_experience: Number,
  address: {
    street: String,
    city: String,
    state: String,
    zip_code: String,
  },
  blood_group: String,
  patients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }],
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
});

const appointmentSchema = new Schema({
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient' },
  doctor_id: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  appointment_date: Date,
  reason_for_visit: String,
  prescription: String,
  status: String,
});

const billingSchema = new Schema({
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient' },
  doctor_id: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  appointment_id: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  total_amount: Number,
  date_issued: Date,
  description: String,
  paid: Boolean,
});

const staffSchema = new Schema({
  first_name: String,
  last_name: String,
  role: String,
  contact_number: String,
  email: String,
  shift_timings: String,
});

const roomSchema = new Schema({
  room_number: String,
  room_type: String,
  availability_status: Boolean,
  assigned_patient_id: { type: Schema.Types.ObjectId, ref: 'Patient' },
});

const medicalRecordSchema = new Schema({
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient' },
  record_type: String,
  record_date: Date,
  description: String,
});

const organDonationSchema = new Schema({
  donor_id: { type: Schema.Types.ObjectId, ref: 'Patient' },
  organ_type: String,
  date_of_donation: Date,
  status: { type: String, enum: ['Pending', 'Donated', 'Matched'], default: 'Pending' },
  recipient_id: { type: Schema.Types.ObjectId, ref: 'Patient', default: null },
  notes: String,
});

const financeSchema = new Schema({
  transaction_type: { type: String, enum: ['Income', 'Expense'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const Billing = mongoose.model('Billing', billingSchema);
const Staff = mongoose.model('Staff', staffSchema);
const Room = mongoose.model('Room', roomSchema);
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
const OrganDonation = mongoose.model('OrganDonation', organDonationSchema);
const Finance = mongoose.model('Finance', financeSchema);

module.exports = {
  User,
  Patient,
  Doctor,
  Appointment,
  Billing,
  Staff,
  Room,
  MedicalRecord,
  OrganDonation,
  Finance
};
