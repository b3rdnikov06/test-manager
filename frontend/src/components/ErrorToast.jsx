function ErrorToast({
    message,
    onClose
}) {

    if (!message) {
        return null;
    }

    return (

        <div
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: '#ff4d4f',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow:
                    '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: 9999
            }}
        >

            <div
                style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                }}
            >

                <span>
                    {message}
                </span>

                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    X
                </button>

            </div>

        </div>
    );
}

export default ErrorToast;