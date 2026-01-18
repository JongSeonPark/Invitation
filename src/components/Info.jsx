const Info = () => {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.item}>
                    <h3 style={styles.label}>DATE</h3>
                    <p style={styles.value}>2026. 04. 25</p>
                    <p style={styles.subValue}>SATURDAY 04:50 PM</p>
                </div>
                <div style={styles.divider}></div>
                <div style={styles.item}>
                    <h3 style={styles.label}>LOCATION</h3>
                    <p style={styles.value}>빌라드 지디 안산</p>
                    <p style={styles.subValue}>경기 안산시 단원구 광덕4로 140</p>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '3rem 1.5rem',
        backgroundColor: '#fff',
    },
    container: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '2px', // Card style
        boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
        maxWidth: '400px',
        margin: '0 auto',
    },
    item: {
        textAlign: 'center',
        marginBottom: '1.5rem',
    },
    divider: {
        width: '1px',
        height: '40px',
        backgroundColor: '#ddd',
        margin: '0 auto 1.5rem',
    },
    label: {
        fontSize: '0.8rem',
        color: '#aaa',
        letterSpacing: '0.1em',
        marginBottom: '0.5rem',
    },
    value: {
        fontSize: '1.3rem',
        fontFamily: 'var(--font-serif)',
        fontWeight: '700',
        marginBottom: '0.2rem',
    },
    subValue: {
        fontSize: '0.95rem',
        color: '#666',
    }
};

export default Info;
