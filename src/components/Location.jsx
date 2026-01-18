const Location = () => {
    // Direct links to the venue
    const naverMapUrl = "https://naver.me/x7ndUhZi";
    const kakaoMapUrl = "https://place.map.kakao.com/25447779";

    const openMap = (url) => {
        window.open(url, '_blank');
    };

    return (
        <section style={styles.section}>
            <h2 style={styles.title}>LOCATION</h2>

            <div style={styles.mapContainer}>
                <iframe
                    src="https://maps.google.com/maps?q=빌라드%20지디%20안산&t=&z=17&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="400"
                    style={styles.iframe}
                    frameBorder="0"
                    title="Google Map"
                    loading="lazy"
                    allowFullScreen
                ></iframe>
            </div>

            <div style={styles.info}>
                <strong style={styles.venue}>빌라드 지디 안산 7층 캘리홀</strong>
                <p style={styles.address}>경기 안산시 단원구 광덕4로 140</p>
                <p style={styles.tel}>Tel. 031-487-8100</p>
            </div>

            <div style={styles.buttons}>
                <button
                    style={{ ...styles.button, ...styles.naverButton }}
                    onClick={() => openMap(naverMapUrl)}
                >
                    <NaverIcon /> 네이버 지도
                </button>
                <button
                    style={{ ...styles.button, ...styles.kakaoButton }}
                    onClick={() => openMap(kakaoMapUrl)}
                >
                    <KakaoIcon /> 카카오 맵
                </button>
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
        color: '#C57038', // Muted Gold/Orange to match theme
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
        fontSize: '1.4rem',
        marginBottom: '0.5rem',
        color: '#333',
    },
    address: {
        color: '#666',
        marginBottom: '0.2rem',
    },
    tel: {
        color: '#888',
        fontSize: '0.9rem',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '0.8rem 1.5rem', // Revert to previous padding
        border: 'none',
        borderRadius: '30px', // Revert to pill shape
        fontSize: '0.95rem', // Revert to previous font size
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        minWidth: '120px', // Restore min-width
    },
    naverButton: {
        backgroundColor: '#03C75A', // Naver Green
        color: '#fff',
    },
    kakaoButton: {
        backgroundColor: '#FEE500', // Kakao Yellow
        color: '#000000', // Kakao Black text
    },
};

// SVG Components for cleaner DOM
const NaverIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M16.4153 3H21V21H16.4153V10.7417L7.69231 21H3V3H7.69231V13.2519L16.4153 3Z" fill="currentColor" />
    </svg>
);

const KakaoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3C6.47715 3 2 6.35786 2 10.5C2 13.1679 3.65685 15.5393 6.1875 16.9079L5.4375 19.6579C5.375 19.8766 5.5625 20.0641 5.78125 20.0016L9.625 19.0641C10.375 19.2829 11.1875 19.4079 12 19.4079C17.5228 19.4079 22 16.05 22 11.9079C22 7.76579 17.5228 4.40786 12 4.40786V3Z" />
    </svg>
);

export default Location;
