import Navbar from "../components/Navbar";

import "../styles/layouts/main-layout.css";

function MainLayout({ children }) {

    return (

        <div className="main-layout">
    
            <Navbar />
    
            <main className="main-content">
    
                {children}
    
            </main>
    
        </div>
    );
}

export default MainLayout;