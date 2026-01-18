const Location = () => {
    const naverMapUrl = "https://naver.me/x7ndUhZi";
    const kakaoMapUrl = "https://place.map.kakao.com/25447779";

    const openNaverMap = () => {
        window.open(naverMapUrl, '_blank');
    };

    const openKakaoMap = () => {
        window.open(kakaoMapUrl, '_blank');
    };

    return (
        <section style={styles.section}>
            <h2 style={styles.title}>LOCATION</h2>
            <div style={styles.mapContainer}>
                <iframe
                    src="https://map.naver.com/p/entry/place/1203677675?c=15.00,0,0,0,dh"
                    width="100%"
                    height="400"
                    style={styles.iframe}
                    frameBorder="0"
                    title="Naver Map"
                ></iframe>
            </div>

            <div style={styles.info}>
                <strong style={styles.venue}>빌라드 지디 안산</strong>
                <p style={styles.address}>경기 안산시 단원구 광덕4로 140</p>
                <p style={styles.tel}>Tel. 031-487-8100</p>
            </div>

            <div style={styles.buttons}>
                <button style={styles.button} onClick={openNaverMap}>네이버 지도</button>
                <button style={styles.button} onClick={openKakaoMap}>카카오 맵</button>
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
    iframe: {
        border: 'none',
        borderRadius: '4px',
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
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
};

export default Location;
