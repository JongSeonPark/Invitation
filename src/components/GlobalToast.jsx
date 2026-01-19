import { useState, useEffect } from 'react';

export const showToast = (message) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message } }));
};

const GlobalToast = () => {
    const [toast, setToast] = useState(null); // { message, id }

    useEffect(() => {
        const handleToast = (e) => {
            const message = e.detail.message;
            const id = Date.now();
            setToast({ message, id });

            setTimeout(() => {
                setToast(prev => prev && prev.id === id ? null : prev);
            }, 3000);
        };

        window.addEventListener('show-toast', handleToast);
        return () => window.removeEventListener('show-toast', handleToast);
    }, []);

    if (!toast) return null;

    return (
        <div style={styles.toast}>
            <span style={styles.icon}>🏆</span>
            {toast.message}
        </div>
    );
};

const styles = {
    toast: {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#ffd700', // Gold for achievements
        padding: '12px 24px',
        borderRadius: '30px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        animation: 'slideDown 0.3s ease-out',
        whiteSpace: 'nowrap',
        border: '1px solid #ffd700',
    },
    icon: {
        fontSize: '1.2rem',
    }
};

// Inject animation styles
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes slideDown {
    from { transform: translate(-50%, -20px); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

export default GlobalToast;
