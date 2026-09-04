import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';
import { Register } from './features/register/register';
import { ForgotPassword } from './features/forgot-password/forgot-password';
import { ResetPassword } from './features/reset-password/reset-password';
import { Profile } from './features/profile/profile';
import { ClassroomRoster } from './features/classrooms/pages/classroom-roster/classroom-roster';
import { ClassroomManagement } from './features/classrooms/pages/classroom-management/classroom-management';
import { Missions } from './features/missions/missions';
import { MissionDetail } from './features/missions/mission-detail/mission-detail';
import { MySubmissions } from './features/missions/my-submissions/my-submissions';
import { Gamification } from './features/gamification/gamification';
import { CourseManagement } from './features/courses/pages/course-management/course-management';
import { CourseList } from './features/courses/pages/course-list/course-list';
import { ClassroomAssignmentsPage } from './features/classroom-assignments/pages/classroom-assignments-page/classroom-assignments-page';
import { ClassroomDetail } from './features/classrooms/pages/classroom-detail/classroom-detail';
import { LessonPlayer } from './features/classrooms/pages/lesson-player/lesson-player';
import { roleGuard } from './core/guards/role-guards';
import { TeacherDashboard } from './features/teacher/dashboard/dashboard';
import { AdminDashboard } from './features/admin/dashboard/dashboard';
import { TeacherSubmissions } from './features/teacher/pages/teacher-submissions/teacher-submissions';
import { SubmissionReview } from './features/teacher/submission-review/submission-review';
import { StudentProgress } from './features/teacher/pages/student-progress/student-progress';
import { StudentDetail } from './features/teacher/pages/student-detail/student-detail';
import { Students } from './features/teacher/pages/students/students';
import { AdminUsers } from './features/admin/users/users';
import { QuizCreator } from './features/quizzes/pages/quiz-creator/quiz-creator';
import { AdminAudit } from './features/admin/audit/audit';
import { AdminGamification } from './features/admin/gamification/gamification';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'reset-password',
    component: ResetPassword,
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard, roleGuard(['STUDENT'])],
  },
  {
    path: 'teacher',
    component: TeacherDashboard,
    canActivate: [authGuard, roleGuard(['TEACHER'])],
  },
  {
    path: 'teacher/students',
    component: Students,
    canActivate: [authGuard, roleGuard(['TEACHER'])],
  },
  {
    path: 'teacher/student-detail/:id',
    component: StudentDetail,
    canActivate: [authGuard, roleGuard(['TEACHER'])],
  },
  {
    path: 'teacher/progress',
    component: StudentProgress,
    canActivate: [authGuard, roleGuard(['TEACHER'])],
  },
  {
    path: 'teacher/submissions',
    component: TeacherSubmissions,
    canActivate: [authGuard, roleGuard(['TEACHER'])],
  },
  {
    path: 'teacher/submissions/:id',
    component: SubmissionReview,
    canActivate: [authGuard, roleGuard(['TEACHER'])],
  },
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [authGuard, roleGuard(['ADMIN'])],
  },
  {
    path: 'admin/users',
    component: AdminUsers,
    canActivate: [authGuard, roleGuard(['ADMIN'])],
  },
  {
  path: 'admin/audit',
  component: AdminAudit,
  canActivate: [authGuard, roleGuard(['ADMIN'])]
},
{
  path: 'admin/gamification',
  component: AdminGamification,
  canActivate: [authGuard, roleGuard(['ADMIN'])]
},
  {
    path: 'classrooms',
    component: ClassroomManagement,
    canActivate: [authGuard],
  },
  {
    path: 'gamification',
    component: Gamification,
    canActivate: [authGuard, roleGuard(['STUDENT'])],
  },
  {
    path: 'missions',
    component: Missions,
    canActivate: [authGuard],
  },
  {
    path: 'missions/submissions',
    component: MySubmissions,
    canActivate: [authGuard],
  },
  {
    path: 'missions/:id',
    component: MissionDetail,
    canActivate: [authGuard],
  },

  {
    path: 'classrooms/:id',
    component: ClassroomDetail,
    canActivate: [authGuard],
  },
  {
    path: 'classrooms/:id/lista',
    component: ClassroomRoster,
    canActivate: [authGuard],
  },
  {
    path: 'courses',
    component: CourseList,
    canActivate: [authGuard],
  },
  {
    path: 'courses/new',
    component: CourseManagement,
    canActivate: [authGuard],
  },
  {
    path: 'courses/edit/:id',
    component: CourseManagement,
    canActivate: [authGuard],
  },
  {
    path: 'quizzes/create',
    component: QuizCreator,
    canActivate: [authGuard],
  },
  {
    path: 'quizzes/edit/:id',
    component: QuizCreator,
    canActivate: [authGuard],
  },
  {
    path: 'classrooms/:id/assignments',
    component: ClassroomAssignmentsPage,
    canActivate: [authGuard],
  },
  {
    path: 'classrooms/:id/player',
    component: LessonPlayer,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
