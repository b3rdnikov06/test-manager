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

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

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
                    element={<TestsPage />}
                />

                <Route
                    path="/attempt/:id"
                    element={<AttemptPage />}
                />

                <Route
                    path="/results/:id"
                    element={<ResultPage />}
                />

                <Route
                    path="/teacher/tests"
                    element={<TeacherTestsPage />}
                />

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;