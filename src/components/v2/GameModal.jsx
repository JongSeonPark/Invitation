import React from 'react';

const GameModal = ({ title, onClose, children }) => {
    return (
        <div style={styles.overlay}>
            <div style={styles.window}>
                <div style={styles.header}>
                    <span style={styles.title}>{title}</span>
                    <button style={styles.closeBtn} onClick={onClose}>✖</button>
                </div>
                <div style={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    },
    window: {
        width: '100%',
        maxWidth: '500px',
        maxHeight: '80vh',
        backgroundColor: 'rgba(20, 24, 36, 0.95)', // Dark tech blue
        border: '2px solid #00eaff',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0, 234, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease-out',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #00eaff',
        backgroundColor: 'rgba(0, 234, 255, 0.1)',
    },
    title: {
        color: '#00eaff',
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        letterSpacing: '1px',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '1.2rem',
        cursor: 'pointer',
    },
    content: {
        flex: 1,
        overflowY: 'auto',
        padding: '0', // Components have their own padding usually
        color: '#fff',
    }
};

// Add keyframes
const styleSheet = document.createElement("style");
styleSheet.innerText += `
  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

export default GameModal;
