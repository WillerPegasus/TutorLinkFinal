import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import AdminProtectedRoute from './AdminProtectedRoute';
import TutorLayout from '../layouts/TutorLayout';
import TutorProtectedRoute from './TutorProtectedRoute';

import StudentLayout from '../layouts/StudentLayout';
import StudentProtectedRoute from './StudentProtectedRoute';

const HomePage       = lazy(() => import('@/pages/public/HomePage'));
const LoginPage      = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage   = lazy(() => import('@/pages/auth/RegisterPage'));
const SearchPage     = lazy(() => import('@/pages/search/SearchPage'));
const NotFoundPage   = lazy(() => import('@/pages/NotFoundPage'));
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboardPage =lazy(()=> import('../pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));
const AdminTutorsPage = lazy(() => import('../pages/admin/AdminTutorsPage'));
const AdminReservationsPage = lazy(() => import('../pages/admin/AdminReservationsPage'));
const AdminReportsPage = lazy(() => import('../pages/admin/AdminReportsPage'));
const GroupsPage = lazy(() => import('../pages/groups/GroupsPage'));
const GroupDetailPage = lazy(() => import('../pages/groups/GroupDetailPage'));
const AdminGroupsPage = lazy(() => import('../pages/admin/AdminGroupsPage'));
const TutorDashboardPage = lazy(() => import('../pages/tutor/TutorDashboardPage'));
const TutorAvailabilityPage = lazy(() => import('../pages/tutor/TutorAvailabilityPage'));
const TutorRequestsPage = lazy(() => import('../pages/tutor/TutorRequestsPage'));
const TutorGroupsPage = lazy(()=> import('../pages/tutor/TutorGroupsPage'));
const StudentDashboardPage = lazy(() => import('../pages/student/StudentDashboardPage'));
const BookingPage = lazy(() => import('../pages/booking/BookingPage'));
const MessagingPage = lazy(() => import('../pages/messaging/MessagingPage'));
const TutorMessagingPage = lazy(() => import('../pages/tutor/TutorMessagingPage'));
const TutorReviewsPage = lazy(() => import('../pages/tutor/TutorReviewsPage'));
const TutorRevenuePage = lazy(() => import('../pages/tutor/TutorRevenuePage'));
const TutorSettingsPage = lazy(()=> import('../pages/tutor/TutorSettingsPage'));
const SearchTutorPage = lazy(() => import('../pages/student/SearchTutorPage'));
const StudentGroupsPage = lazy(() => import('../pages/student/StudentGroupsPage'));
const StudentReviewsPage = lazy(() => import('../pages/student/StudentReviewsPage'));
const StudentReservationsPage = lazy(
  () => import("../pages/student/StudentReservationsPage")
);
const StudentPaymentsPage = lazy(() => import('../pages/student/StudentPaymentsPage'));
const StudentSettingsPage = lazy(() => import('../pages/student/StudentSettingsPage'));
const TutorProfilePage = lazy(() => import('../pages/public/TutorProfilePage'));
const UserLoginPage = lazy(() => import("../pages/public/UserLoginPage"));
const UserRegisterPage = lazy(() => import('../pages/public/UserRegisterPage'));
const SearchsPage = lazy(() => import("../pages/public/SearchsPage"));
const BookingConfirmPage = lazy(
  () => import("../pages/booking/BookingConfirmPage")
);
const TutorSubscriptionPage = lazy(() => import('../pages/tutor/TutorSubscriptionPage'));
const AdminSubscriptionsPage = lazy(
  () => import('../pages/admin/AdminSubscriptionsPage')
);
const TutorGroupSubscriptionPage = lazy(
  () => import('../pages/tutor/TutorGroupSubscriptionPage')
);
const PricingPage = lazy(() => import("../pages/public/PricingPage"));



export const AppRouter = () => (
  <Suspense fallback={<div>Chargement...</div>}>
    <Routes>
      {/* Routes publiques */}
      <Route path="/"         element={<HomePage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/search"   element={<SearchPage />} />
       <Route path="/groupes"       element={<GroupsPage />} />
      <Route path="/groupes/:id"   element={<GroupDetailPage />} />
      <Route path="/repetiteurs/:tutorId" element={<TutorProfilePage />} />
      <Route path="/connexion" element={<UserLoginPage />} />
      <Route path="/inscription" element={<UserRegisterPage />} />
      <Route path="/repetiteurs" element={<SearchsPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/reserver/:tutorId"        element={<BookingPage />} />
      <Route
  path="/booking/confirm/:bookingId"
  element={<BookingConfirmPage />}
/>
<Route path="/tarifs" element={<PricingPage />} />

      {/* Routes admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminProtectedRoute />}/>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<div><AdminDashboardPage/></div>} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/tutors" element={<AdminTutorsPage />} />
          <Route path="/admin/reservations" element={<AdminReservationsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/groups"       element={<AdminGroupsPage />} /> 
            <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
            </Route>
            <Route element = {<TutorProtectedRoute />} />
            {/* tutor */}
  <Route element={<TutorLayout />}>
    <Route path="/repetiteur/dashboard" element={<TutorDashboardPage />} />
    <Route path="/repetiteur/disponibilites" element={<TutorAvailabilityPage />} />
    <Route path="/repetiteur/demandes" element={<TutorRequestsPage />} />
    <Route path="/repetiteur/mes-groupes" element={<TutorGroupsPage />} />
    <Route path="/repetiteur/messagerie" element={<TutorMessagingPage />} />
    <Route path="/repetiteur/avis" element={<TutorReviewsPage />} />
    <Route path="/repetiteur/revenus" element={<TutorRevenuePage />} />
    <Route path="repetiteur/parametres" element={<TutorSettingsPage />} />
    <Route path="/repetiteur/abonnement" element={<TutorSubscriptionPage />} />
    <Route
  path="/repetiteur/groupes/:groupId/abonnement"
  element={<TutorGroupSubscriptionPage />}
/>
      </Route>
      {/* student */}
      <Route element={<StudentProtectedRoute />}>
  <Route element={<StudentLayout />}>
    <Route path="/eleve/dashboard" element={<StudentDashboardPage />} />
    <Route path="/eleve/repetiteurs" element={<SearchTutorPage />} />
    <Route path="/mes-groupes" element={<StudentGroupsPage />} />
    <Route path="mes-reservations" element={<StudentReservationsPage />} />
    <Route path="/mes-avis" element={<StudentReviewsPage />} />
    <Route path="/paiements" element={<StudentPaymentsPage />} />
    <Route path="/parametres" element={<StudentSettingsPage />} />
  </Route>
  <Route path='/messagerie' element= {<MessagingPage />} />
  <Route path="/reservation" element={<BookingPage />} />
  </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);