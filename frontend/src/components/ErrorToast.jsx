import '../styles/components/error-toast.css';

function ErrorToast({
    message,
    onClose,
    type = 'error'
}) {

    if (!message) {
        return null;
    }

    return (

        <div
            className={`
                error-toast
                ${
                    type === 'success'
                        ? 'success-toast'
                        : ''
                }
            `}
        >
    
            <div className="error-toast-content">
    
                <span className="error-toast-message">
                    {message}
                </span>
    
            </div>
    
            <button
                className="error-toast-close"
                onClick={onClose}
            >
                ✕
            </button>
    
        </div>
    );
}

export default ErrorToast;