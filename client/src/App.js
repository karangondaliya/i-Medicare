import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import Profile from './pages/Profile';
import NotificationPage from './pages/NotificationPage';
import Doctors from './pages/admin/Doctors';
import Users from './pages/admin/Users';
import DocProfile from './pages/doctor/DocProfile';
import OrganDonation from './pages/OrganDonation';
import BookingPage from './pages/BookingPage';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import MedicalHistory from './pages/MedicalHistory';
import AddRecords from './pages/doctor/AddRecords';
import AllMedicalHistory from './pages/admin/AllMedicalHistory';
import OrganDonationDetails from './pages/admin/OrganDonationDetails';


function App() {
  const { loading } = useSelector((state) => state.alert);
  return (
    <>
      <BrowserRouter>
        {loading ? (<Spinner />) : (
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/apply-doctor" element={
              <ProtectedRoute>
                <ApplyDoctor />
              </ProtectedRoute>
            } />
            <Route path="/admin/Users" element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/doctor/book-appointment/:doctorId" element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/Doctors" element={
              <ProtectedRoute>
                <Doctors />
              </ProtectedRoute>
            } />
              <Route path="/admin/AllMedicalHistory" element={
              <ProtectedRoute>
                <AllMedicalHistory />
              </ProtectedRoute>
            } />
              <Route path="/admin/OrganDonationsDetails" element={
              <ProtectedRoute>
                <OrganDonationDetails />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/doctor/DocProfile/:id" element={
              <ProtectedRoute>
                <DocProfile />
              </ProtectedRoute>
            } />
             <Route path="/doctor/AddRecords" element={
              <ProtectedRoute>
                <AddRecords />
              </ProtectedRoute>
            } />
            <Route path="/notification" element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            } />
            <Route path="/organ-donate" element={
              <ProtectedRoute>
                <OrganDonation />
              </ProtectedRoute>
            } />
             <Route path="/medical-history" element={
              <ProtectedRoute>
                <MedicalHistory />
              </ProtectedRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/doctor-appointments" element={
              <ProtectedRoute>
                <DoctorAppointments />
              </ProtectedRoute>
            } />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
