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
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3167.319503923361!2d126.8378553151658!3d37.31155397984408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b6f2f2b2b2b2b%3A0x2b2b2b2b2b2b2b2b!2z67mM652865TnIOyngOuSpCDyHZU!5e0!3m2!1sko!2skr!4v1620000000000!5m2!1sko!2skr"
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
