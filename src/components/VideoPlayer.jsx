const VideoPlayer = () => {
    return (
        <section style={styles.section}>
            <h2 style={styles.title}>VIDEO</h2>
            <div style={styles.videoWrapper}>
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/2Vv-BfVoq4g"
                    title="Wedding Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                ></iframe>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '4rem 1.5rem',
        backgroundColor: '#FAFAFA',
        textAlign: 'center',
    },
    title: {
        fontSize: '0.9rem',
        color: 'var(--color-primary)',
        marginBottom: '2rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
    },
    videoWrapper: {
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        paddingBottom: '56.25%', // 16:9 Aspect Ratio
        height: 0,
        overflow: 'hidden',
        borderRadius: '4px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
};

export default VideoPlayer;
