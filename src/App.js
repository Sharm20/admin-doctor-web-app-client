import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddDoctorUser from "./pages/Admin/AddDoctorUser";
import CreateAdmin from "./pages/Admin/CreateAdmin";
import Clinics from "./pages/Admin/Clinics";
import Doctors from "./pages/Admin/Doctors";
import Appointments from "./pages/Admin/Appointments";
import Users from "./pages/Admin/Users";
import Specializations from "./pages/Admin/Specializations";
import { AuthContextProvider } from "./context/AuthContext";
import Admin from "./pages/Admin/adminDashboard";
import Inbox from "./pages/Doctor/Inbox";
import AdminUsers from "../src/pages/Admin/AdminUsers";
import DoctorUsers from "./pages/Admin/DoctorUsers";
import AddClinic from "./pages/Admin/AddClinic";
import AddDoctor from "./pages/Admin/AddDoctor";
import AddSpecialization from "./pages/Admin/AddSpecialization";
import UpdateClinic from "./pages/Admin/UpdateClinic";
import UpdateDoctor from "./pages/Admin/UpdateDoctor";
import UpdateSpecialization from "./pages/Admin/UpdateSpecialization";
import UpdateAdminUser from "./pages/Admin/UpdateAdminUser";
import UpdateClinicUser from "./pages/Admin/UpdateClinicUser";
import EditProfile from "./pages/Admin/EditProfile";
import EditDoctorProfile from "./pages/Doctor/EditDoctorProfile";
import DoctorSidebar from "./components/DoctorSidebar";
import EditSched from "./pages/Doctor/EditSched";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import Patients from "./pages/Doctor/Patients";
import CancelAppointment from "./pages/Doctor/CancelAppointment";
import RescheduleAppointment from "./pages/Doctor/RescheduleAppointment";
import AddAppointment from "./pages/Doctor/AddAppointment";

const App = () => {
  return (
    <Router>
      <AuthContextProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Switch>
            <Route path="/" element={<Login />} />
          </Switch>

          <Switch>
            <Route
              path="/home"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />

            <Route
              path="/create-doctor-user"
              element={
                <Layout>
                  <AddDoctorUser />
                </Layout>
              }
            />
            <Route
              path="/create-admin"
              element={
                <Layout>
                  <CreateAdmin />
                </Layout>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <Layout>
                  <Admin />
                </Layout>
              }
            />
            <Route
              path="/doctor-inbox"
              element={
                <Layout>
                  <Inbox />
                </Layout>
              }
            />

            <Route
              path="/clinics"
              element={
                <Layout>
                  <Clinics />
                </Layout>
              }
            />

            <Route
              path="/add-clinic"
              element={
                <Layout>
                  <AddClinic />
                </Layout>
              }
            />

            <Route
              path="/doctors"
              element={
                <Layout>
                  <Doctors />
                </Layout>
              }
            />

            <Route
              path="/add-doctor"
              element={
                <Layout>
                  <AddDoctor />
                </Layout>
              }
            />

            <Route
              path="/appointments"
              element={
                <Layout>
                  <Appointments />
                </Layout>
              }
            />

            <Route
              path="/users"
              element={
                <Layout>
                  <Users />
                </Layout>
              }
            />

            <Route
              path="/specializations"
              element={
                <Layout>
                  <Specializations />
                </Layout>
              }
            />

            <Route
              path="/add-specialization"
              element={
                <Layout>
                  <AddSpecialization />
                </Layout>
              }
            />

            <Route
              path="/admin-users"
              element={
                <Layout>
                  <AdminUsers />
                </Layout>
              }
            />

            <Route
              path="/doctor-users"
              element={
                <Layout>
                  <DoctorUsers />
                </Layout>
              }
            />

            <Route
              path="/update-clinic/:id"
              element={
                <Layout>
                  <UpdateClinic />
                </Layout>
              }
            />

            <Route
              path="/update-doctor/:id"
              element={
                <Layout>
                  <UpdateDoctor />
                </Layout>
              }
            />

            <Route
              path="/update-specialization/:id"
              element={
                <Layout>
                  <UpdateSpecialization />
                </Layout>
              }
            />
            <Route
              path="/update-admin-user/:id"
              element={
                <Layout>
                  <UpdateAdminUser />
                </Layout>
              }
            />
            <Route
              path="/update-clinic-user/:id"
              element={
                <Layout>
                  <UpdateClinicUser />
                </Layout>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <Layout>
                  <EditProfile />
                </Layout>
              }
            />

            <Route
              path="/edit-schedule"
              element={
                <Layout>
                  <EditSched />
                </Layout>
              }
            />

            <Route
              path="/edit-doctor-profile"
              element={
                <Layout>
                  {" "}
                  <EditDoctorProfile />{" "}
                </Layout>
              }
            />

            <Route
              path="/doctor-appointments"
              element={
                <Layout>
                  <DoctorAppointments />

                  {/* <FloatingActionButtonZoom /> */}
                </Layout>
              }
            />

            <Route
              path="/patients"
              element={
                <Layout>
                  {" "}
                  <Patients />
                </Layout>
              }
            />
            <Route
              path="/cancel-appointment/:id"
              element={
                <Layout>
                  <CancelAppointment />
                </Layout>
              }
            />

            <Route
              path="/reschedule-appointment/:id"
              element={
                <Layout>
                  <RescheduleAppointment />
                </Layout>
              }
            />

            <Route
              path="/add-appointment"
              element={
                <Layout>
                  <AddAppointment />
                </Layout>
              }
            />
          </Switch>
        </LocalizationProvider>
      </AuthContextProvider>
    </Router>
  );
};

export default App;
