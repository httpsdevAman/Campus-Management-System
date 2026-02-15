import { Routes, Route } from "react-router-dom";
import { ROLES } from "../config/roles";

import Login from "../pages/Login";
import Register from "../pages/Register";
import RoleRedirect from "./RoleRedirect";
import ProtectedRoute from "./ProtectedRoute";
import AppShell from "../layouts/AppShell";

import StudentDashboard from "../pages/student/StudentDashboard";
import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import AuthorityDashboard from "../pages/authority/AuthorityDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

import StudentGrievances from "../pages/student/StudentGrievances";
import NewGrievance from "../pages/student/NewGrievance";
import StudentGrievanceDetail from "../pages/student/StudentGrievanceDetail";

import FacultyGrievances from "../pages/faculty/FacultyGrievances";
import NewFacultyGrievance from "../pages/faculty/NewFacultyGrievance";
import FacultyGrievanceDetail from "../pages/faculty/FacultyGrievanceDetail";

import AuthorityGrievances from "../pages/authority/AuthorityGrievances";
import AuthorityGrievanceDetail from "../pages/authority/AuthorityGrievanceDetail";

import AdminGrievances from "../pages/admin/AdminGrievances";
import AdminGrievanceDetail from "../pages/admin/AdminGrievanceDetail";

import StudentOpportunities from "../pages/student/StudentOpportunities";
import StudentOpportunityDetail from "../pages/student/StudentOpportunityDetail";

import FacultyOpportunities from "../pages/faculty/FacultyOpportunities";
import NewOpportunity from "../pages/faculty/NewOpportunity";
import FacultyOpportunityDetail from "../pages/faculty/FacultyOpportunityDetail";

import StudentCourses from "../pages/student/StudentCourses";
import StudentCourseDetail from "../pages/student/StudentCourseDetail";

import FacultyCourses from "../pages/faculty/FacultyCourses";
import NewCourse from "../pages/faculty/NewCourse";
import FacultyCourseDetail from "../pages/faculty/FacultyCourseDetail";

import AdminCourses from "../pages/admin/AdminCourses";
import AdminCourseDetail from "../pages/admin/AdminCourseDetail";

import AdminUsers from "../pages/admin/AdminUsers";
import AdminUserDetail from "../pages/admin/AdminUserDetail";

import Profile from "../pages/Profile";

import Unauthorized from "../pages/common/Unauthorized";
import NotFound from "../pages/common/NotFound";

const wrap = (allowedRoles, element) => (
  <ProtectedRoute allowedRoles={allowedRoles}>
    <AppShell>{element}</AppShell>
  </ProtectedRoute>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="/" element={<RoleRedirect />} />

    {/* Profile (all roles) */}
    <Route path="/profile" element={wrap([ROLES.STUDENT, ROLES.FACULTY, ROLES.AUTHORITY, ROLES.ADMIN], <Profile />)} />

    {/* Student */}
    <Route path="/student/dashboard" element={wrap([ROLES.STUDENT], <StudentDashboard />)} />
    <Route path="/student/grievances" element={wrap([ROLES.STUDENT], <StudentGrievances />)} />
    <Route path="/student/grievances/new" element={wrap([ROLES.STUDENT], <NewGrievance />)} />
    <Route path="/student/grievances/:id" element={wrap([ROLES.STUDENT], <StudentGrievanceDetail />)} />
    <Route path="/student/opportunities" element={wrap([ROLES.STUDENT], <StudentOpportunities />)} />
    <Route path="/student/opportunities/:id" element={wrap([ROLES.STUDENT], <StudentOpportunityDetail />)} />
    <Route path="/student/courses" element={wrap([ROLES.STUDENT], <StudentCourses />)} />
    <Route path="/student/courses/:id" element={wrap([ROLES.STUDENT], <StudentCourseDetail />)} />

    {/* Faculty */}
    <Route path="/faculty/dashboard" element={wrap([ROLES.FACULTY], <FacultyDashboard />)} />
    <Route path="/faculty/grievances" element={wrap([ROLES.FACULTY], <FacultyGrievances />)} />
    <Route path="/faculty/grievances/new" element={wrap([ROLES.FACULTY], <NewFacultyGrievance />)} />
    <Route path="/faculty/grievances/:id" element={wrap([ROLES.FACULTY], <FacultyGrievanceDetail />)} />
    <Route path="/faculty/opportunities" element={wrap([ROLES.FACULTY], <FacultyOpportunities />)} />
    <Route path="/faculty/opportunities/new" element={wrap([ROLES.FACULTY], <NewOpportunity />)} />
    <Route path="/faculty/opportunities/:id" element={wrap([ROLES.FACULTY], <FacultyOpportunityDetail />)} />
    <Route path="/faculty/courses" element={wrap([ROLES.FACULTY], <FacultyCourses />)} />
    <Route path="/faculty/courses/new" element={wrap([ROLES.FACULTY], <NewCourse />)} />
    <Route path="/faculty/courses/:id" element={wrap([ROLES.FACULTY], <FacultyCourseDetail />)} />

    {/* Authority */}
    <Route path="/authority/dashboard" element={wrap([ROLES.AUTHORITY], <AuthorityDashboard />)} />
    <Route path="/authority/grievances" element={wrap([ROLES.AUTHORITY], <AuthorityGrievances />)} />
    <Route path="/authority/grievances/:id" element={wrap([ROLES.AUTHORITY], <AuthorityGrievanceDetail />)} />

    {/* Admin */}
    <Route path="/admin/dashboard" element={wrap([ROLES.ADMIN], <AdminDashboard />)} />
    <Route path="/admin/grievances" element={wrap([ROLES.ADMIN], <AdminGrievances />)} />
    <Route path="/admin/grievances/:id" element={wrap([ROLES.ADMIN], <AdminGrievanceDetail />)} />
    <Route path="/admin/users" element={wrap([ROLES.ADMIN], <AdminUsers />)} />
    <Route path="/admin/users/:id" element={wrap([ROLES.ADMIN], <AdminUserDetail />)} />
    <Route path="/admin/courses" element={wrap([ROLES.ADMIN], <AdminCourses />)} />
    <Route path="/admin/courses/:id" element={wrap([ROLES.ADMIN], <AdminCourseDetail />)} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
