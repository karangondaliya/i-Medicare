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
  userId: { type: String},
  date_of_birth: Date,
  gender: String,
  address: String,
  contact_number: String,
  blood_group: String,
  last_reports: {
    diabetes: String,
    blood_pressure: String,
  },
});

const doctorSchema = new Schema({
  userId: { type: String},
  first_name: { type: String, required: [true, 'First Name is Require'] },
  last_name: { type: String, required: [true, 'Last Name is Require'] },
  specialization: { type: String, required: [true, 'Specialization is required'] },
  contact_number: { type: Number, required: [true, 'Contact No. is Require'] },
  email: { type: String, required: [true, 'Email is Require'] },
  date_of_birth: { type: Date, required: false },
  gender: { type: String, required: false},
  years_of_experience: { type: Number, required: [true, 'Experiance is Require'] },
  address: { type: String, required: [true, 'Address is Require'] },
  status:{ type: String, default: 'pending' },
  timings: {type:Object, required: [true, 'Work Timing is Required'] },
  patients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }],
  website: { type: String, required: false },
  fees: {type: Number, required: [true, 'Fees is Required']},
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
}, { timestamps: true });

const appointmentSchema = new Schema({
  user_id: { type: String, required: true },
  doctor_id: { type: String, required: true },
  doctorInfo: { type: String, required: true},
  userInfo: { type: String, required: true},
  date: { type: String, required: true, default: 'pending'},
  status: { type: String, required: true},
  time: { type: String, required: true }
},{timestamps: true});

const User = mongoose.model('User', userSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

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
