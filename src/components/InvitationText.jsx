import { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver'; // We need this hook or just inline it for now

const InvitationText = () => {
    const ref = useRef(null);
    const isVisible = useIntersectionObserver(ref, { threshold: 0.3 });

    return (
        <section style={styles.section} ref={ref}>
            <div className={`text-content ${isVisible ? 'fade-in-up' : ''}`} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease-out' }}>
                <h2 style={styles.title}>CHODAE</h2>
                <div style={styles.korText}>
                    <p>서로가 마주보며 다져온 사랑을</p>
                    <p>이제 함께 한 곳을 바라보며</p>
                    <p>걸어가려 합니다.</p>
                    <br />
                    <p>저희 두 사람의 새로운 시작을</p>
                    <p>가까이서 축복해 주시면</p>
                    <p>더없는 기쁨으로 간직하겠습니다.</p>
                </div>
                <div style={styles.names}>
                    <span style={styles.small}>신랑</span>
                    <strong>박종선</strong>
                    <br />
                    <span style={styles.small}>신부</span>
                    <strong>윤지수</strong>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '4rem 2rem',
        textAlign: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: '0.9rem',
        color: 'var(--color-primary)',
        marginBottom: '2rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
    },
    korText: {
        fontFamily: 'var(--font-serif)',
        fontSize: '1.1rem',
        lineHeight: '2.2',
        color: '#555',
        marginBottom: '3rem',
    },
    names: {
        fontSize: '1.1rem',
        lineHeight: '1.8',
    },
    small: {
        fontSize: '0.9rem',
        color: '#888',
        margin: '0 0.5rem',
    }
};

export default InvitationText;
