import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/reset.css';
import './styles/variables.css';
import './styles/global.css';
import './styles/typography.css';
import './styles/animations.css';

import './styles/components/card.css';
import './styles/components/navbar.css';
import './styles/components/button.css';
import './styles/components/form.css';
import './styles/components/error-toast.css';

import { AuthProvider }
    from './context/AuthContext';

ReactDOM.createRoot(
    document.getElementById('root')
).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);