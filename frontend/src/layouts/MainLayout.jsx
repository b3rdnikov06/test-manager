import Navbar
    from '../components/Navbar';

function MainLayout({
    children
}) {

    return (
        <div>

            <Navbar />

            <hr />

            {children}

        </div>
    );
}

export default MainLayout;