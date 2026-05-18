import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TestsPage from '../pages/TestsPage';
import AttemptPage from '../pages/AttemptPage';
import ResultPage from '../pages/ResultPage';
import TeacherTestsPage from '../pages/TeacherTestsPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import CreateTestPage from '../pages/CreateTestPage';
import EditTestPage from '../pages/EditTestPage';
import TestResultsPage from '../pages/TestResultsPage';
import ViewTestPage from '../pages/ViewTestPage';
import StudentsPage from '../pages/StudentsPage';
import StudentResultsPage from '../pages/StudentResultsPage';

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/register"
                    element={
                        <RegisterPage />
                    }
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                path="/tests"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <TestsPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                path="/attempt/:id"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <AttemptPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/results/:id"
                    element={
                        <ProtectedRoute role="teacher">
                            <MainLayout>
                                <ResultPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tests/teacher"
                    element={
                        <ProtectedRoute role="teacher">
                            <MainLayout>
                                <TeacherTestsPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />

                <Route
                    path="/tests/create"
                    element={
                        <ProtectedRoute role="teacher">
                            <MainLayout>
                                <CreateTestPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/results/tests/:id"
                    element={
                        <ProtectedRoute
                            roles={['teacher']}
                        >
                            <TestResultsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tests/:id/edit"
                    element={
                        <ProtectedRoute role="teacher">
                            <MainLayout>
                                <EditTestPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tests/:id/view"
                    element={
                        <ProtectedRoute
                            roles={['teacher']}
                        >
                            <MainLayout>
                                <ViewTestPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/students"
                    element={
                        <ProtectedRoute
                            role="teacher"
                        >
                            <MainLayout>
                                <StudentsPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/students/:id"
                    element={
                        <ProtectedRoute
                            role="teacher"
                        >
                            <MainLayout>
                                <StudentResultsPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;