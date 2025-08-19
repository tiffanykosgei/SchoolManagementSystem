import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';
import Layout from './Layout';
import Home from './Pages/Home';
import Login from './Pages/Login';
import NotFound from './Pages/NotFound';
import { Navigate } from 'react-router-dom';

// ✅ Layouts
import AdminLayout from './Pages/Admin/AdminLayout';
import StudentLayout from './Pages/StudentRole/StudentLayout';
import TeacherLayout from './Pages/TeacherRole/TeacherLayout';
import ParentLayout from './Pages/ParentRole/ParentLayout';

// ✅ Dashboards
import AdminDashboard from './Pages/Admin/AdminDashboard';
import TeacherDashboard from './Pages/TeacherRole/TeacherDashboard';
import StudentDashboard from './Pages/StudentRole/StudentDashboard';
import ParentDashboard from './Pages/ParentRole/ParentDashboard';

// ✅ Admin Pages
import RegisterUser from './Pages/Admin/Users/RegisterUser';
import ManageTeachers from './Pages/Admin/Users/ManageTeachers';
import ManageStudents from './Pages/Admin/Users/ManageStudents';
import ManageParents from './Pages/Admin/Users/ManageParents';
import ManageCourses from './Pages/Admin/Courses/ManageCourses';
import ViewGrades from './Pages/Admin/Grades/ViewGrades';
import AuditAttendance from './Pages/Admin/Attendance/AuditAttendance';
import ResetPassword from './Pages/ResetPassword';

// ✅ Student Pages
import StudentProfile from './Pages/StudentRole/StudentProfile';
import EnrolledCourses from './Pages/StudentRole/EnrolledCourses';
import AvailableCourses from './Pages/StudentRole/AvailableCourses';
import StudentGrades from './Pages/StudentRole/StudentGrades';
import StudentAttendance from './Pages/StudentRole/StudentAttendance';

// ✅ Teacher Pages
import TeacherProfile from './Pages/TeacherRole/TeacherProfile';
import TeacherCourses from './Pages/TeacherRole/TeacherCourses';
import EnrolledStudents from './Pages/TeacherRole/EnrolledStudents';
import TeacherAttendance from './Pages/TeacherRole/TeacherAttendance';
import CourseGradeSelector from './Pages/TeacherRole/CourseGradeSelector';
import ManageGrades from './Pages/TeacherRole/ManageGrades';

// ✅ Parent Pages
import ChildProfile from './Pages/ParentRole/ChildProfile';
import ChildGrades from './Pages/ParentRole/ChildGrades';
import ChildAttendance from './Pages/ParentRole/ChildAttendance';
import ChildCourses from './Pages/ParentRole/ChildCourses';
import MessageStaff from './Pages/ParentRole/MessageStaff';

import Reports from './Pages/Reports/Reports';

// ✅ Auth Utility
import PrivateRoute from './Components/PrivateRoute';
import ChangePassword from './Pages/ChangePassword'; 
 // ✅ New
// (optional: if not yet created) import ResetPassword from './Pages/Auth/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="change-password" element={<ChangePassword />} />

          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <PrivateRoute allowedRoles={['Admin']}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="teachers" element={<ManageTeachers />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="parents" element={<ManageParents />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="grades" element={<ViewGrades />} />
            <Route path="attendance-audit" element={<AuditAttendance />} />
            <Route path="register-user" element={<RegisterUser />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>

          {/* Student Routes */}
          <Route
            path="student"
            element={
              <PrivateRoute allowedRoles={['Student']}>
                <StudentLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="ecourses" element={<EnrolledCourses />} />
            <Route path="acourses" element={<AvailableCourses />} />
            <Route path="grades" element={<StudentGrades />} />
            <Route path="attendance" element={<StudentAttendance />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="teacher"
            element={
              <PrivateRoute allowedRoles={['Teacher']}>
                <TeacherLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<TeacherDashboard />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route path="students" element={<EnrolledStudents />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="grades" element={<ManageGrades />} />
            <Route path="course-grade-selector" element={<CourseGradeSelector />} />
          </Route>

          {/* Parent Routes */}
          <Route
            path="parent"
            element={
              <PrivateRoute allowedRoles={['Parent']}>
                <ParentLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<ParentDashboard />} />
            <Route path="profile" element={<ChildProfile />} />
            <Route path="grades" element={<ChildGrades />} />
            <Route path="attendance" element={<ChildAttendance />} />
            <Route path="courses" element={<ChildCourses />} />
            <Route path="message" element={<MessageStaff />} />
          </Route>

          {/* Reports Route */}
          <Route path="reports" element={<PrivateRoute allowedRoles={['Admin', 'Teacher']}><Reports /></PrivateRoute>} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
