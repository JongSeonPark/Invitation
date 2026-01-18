const Location = () => {
    return (
        <section style={styles.section}>
            <h2 style={styles.title}>LOCATION</h2>
            <div style={styles.mapContainer}>
                {/* Placeholder for Map Image */}
                <div style={styles.mapPlaceholder}>
                    <span>Map Image (Kakao/Naver)</span>
                </div>
            </div>

            <div style={styles.info}>
                <strong style={styles.venue}>웨딩홀 이름</strong>
                <p style={styles.address}>서울시 강남구 테헤란로 123</p>
                <p style={styles.tel}>Tel. 02-1234-5678</p>
            </div>

            <div style={styles.buttons}>
                <button style={styles.button}>네이버 자도</button>
                <button style={styles.button}>카카오 맵</button>
                <button style={styles.button}>티맵</button>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '4rem 1.5rem',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    title: {
        fontSize: '0.9rem',
        color: 'var(--color-primary)',
        marginBottom: '2rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
    },
    mapContainer: {
        maxWidth: '800px',
        margin: '0 auto 2rem',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    mapPlaceholder: {
        width: '100%',
        height: '300px',
        backgroundColor: '#eee',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#888',
    },
    info: {
        marginBottom: '2rem',
    },
    venue: {
        display: 'block',
        fontSize: '1.2rem',
        marginBottom: '0.5rem',
    },
    address: {
        color: '#555',
        marginBottom: '0.2rem',
    },
    tel: {
        color: '#888',
        fontSize: '0.9rem',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
    },
    button: {
        padding: '0.6rem 1.2rem',
        border: '1px solid #ddd',
        borderRadius: '20px',
        backgroundColor: '#fff',
        fontSize: '0.9rem',
        color: '#555',
        minWidth: '100px',
    },
};

export default Location;
