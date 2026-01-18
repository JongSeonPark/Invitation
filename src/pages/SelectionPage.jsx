const SelectionPage = () => {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>INVITATION</h1>
                <p style={styles.subtitle}>박종선 & 윤지수</p>
                <div style={styles.divider}></div>
                <p style={styles.date}>2026. 04. 25. SAT PM 04:50</p>

                <div style={styles.buttonGroup}>
                    <a href="classic.html" style={styles.buttonClassic}>
                        ✉️ 청첩장 보기 (Classic)
                    </a>
                    <a href="game.html" style={styles.buttonGame}>
                        🎮 게임 시작 (Game Mode)
                    </a>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily: 'serif',
    },
    card: {
        backgroundColor: 'white',
        padding: '3rem 2rem',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
    },
    title: {
        fontSize: '2rem',
        letterSpacing: '0.2em',
        marginBottom: '1rem',
        color: '#333',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '2rem',
    },
    divider: {
        width: '50px',
        height: '1px',
        backgroundColor: '#ccc',
        margin: '0 auto 2rem',
    },
    date: {
        fontSize: '1rem',
        color: '#888',
        marginBottom: '3rem',
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    buttonClassic: {
        display: 'block',
        padding: '15px',
        backgroundColor: '#fff',
        border: '1px solid #333',
        color: '#333',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        transition: 'all 0.3s',
    },
    buttonGame: {
        display: 'block',
        padding: '15px',
        backgroundColor: '#333',
        border: '1px solid #333',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        transition: 'all 0.3s',
    }
};

export default SelectionPage;
