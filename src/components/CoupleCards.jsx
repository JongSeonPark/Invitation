import { useState } from 'react';
import groomImg from '../assets/card_images/groom.jpg';
import brideImg from '../assets/card_images/bride.jpg';

const CoupleCards = () => {
    const [focusedCard, setFocusedCard] = useState(null);
    const [showToast, setShowToast] = useState(false);

    const cards = [
        {
            id: 'groom',
            name: '박종선',
            type: '[신랑 / 든든함]',
            stars: '⭐⭐⭐⭐⭐',
            desc: '"이 카드가 소환되었을 때, 신부 윤지수를 평생 지킨다. 공격력은 무한대, 수비력은 절대적이다."',
            atk: '∞',
            def: '∞',
            img: groomImg,
            bank: '하나은행',
            account: '49591044955107',
            displayAccount: '495-910449-55107',
            holder: '박종선'
        },
        {
            id: 'bride',
            name: '윤지수',
            type: '[신부 / 사랑스러움]',
            stars: '⭐⭐⭐⭐⭐',
            desc: '"이 카드는 필드에 존재하는 한, 모든 하객에게 행복 효과를 부여한다. 신랑 박종선과 함께라면 승리한다."',
            atk: '∞',
            def: '∞',
            img: brideImg,
            bank: '신한은행',
            account: '110297915880',
            displayAccount: '110-297-915880',
            holder: '윤지수'
        }
    ];

    const handleCardClick = (card) => {
        // Copy only Account Number + Bank Name (swapped order)
        const copyText = `${card.account} ${card.bank}`;
        navigator.clipboard.writeText(copyText).then(() => {
            // Show custom toast instead of alert
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000); // Hide after 2 seconds
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
        setFocusedCard(card.id);
    };

    const handleMouseMove = (e, index, isFocused) => {
        if (isFocused) return; // Disable tilt when focused to prevent conflict or jumping

        const card = document.getElementById(`card-${index}`);
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

        const glare = card.querySelector('.glare');
        if (glare) {
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`;
            glare.style.opacity = '1';
        }
    };

    const handleMouseLeave = (index, isFocused) => {
        if (isFocused) return; // Do not reset if focused

        const card = document.getElementById(`card-${index}`);
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

        const glare = card.querySelector('.glare');
        if (glare) {
            glare.style.opacity = '0';
        }
    };

    return (
        <section style={styles.section}>
            <h2 style={styles.title}>CARD BATTLE? NO, LOVE!</h2>
            <p style={styles.subtitle}>
                👇 카드를 클릭하면 계좌번호가 복사됩니다 👇
            </p>
            <div style={styles.cardContainer}>
                {cards.map((card, index) => {
                    const isFocused = focusedCard === card.id;
                    return (
                        <div key={card.id} style={styles.cardWrapper}>
                            <div
                                id={`card-${index}`}
                                style={{
                                    ...styles.card,
                                    ...(isFocused ? styles.cardFocused : {}),
                                    ...(focusedCard && !isFocused ? styles.cardBlurred : {})
                                }}
                                onClick={() => handleCardClick(card)}
                                onMouseMove={(e) => handleMouseMove(e, index, isFocused)}
                                onMouseLeave={() => handleMouseLeave(index, isFocused)}
                            >
                                <div className="glare" style={styles.glare}></div>
                                <div style={styles.cardInner}>
                                    <div style={styles.cardHeader}>
                                        <span style={styles.cardName}>{card.name}</span>
                                        <span style={styles.cardAttribute}>❤️</span>
                                    </div>
                                    <div style={styles.cardStars}>{card.stars}</div>
                                    <div style={styles.cardImageWrapper}>
                                        <img src={card.img} alt={card.name} style={styles.cardImage} />
                                    </div>
                                    <div style={styles.cardDescBox}>
                                        <div style={styles.cardType}>{card.type}</div>
                                        <p style={styles.cardDesc}>{card.desc}</p>
                                        <div style={styles.cardStats}>
                                            <span>ATK/{card.atk}</span>
                                            <span>DEF/{card.def}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.accountBox} onClick={() => handleCardClick(card)}>
                                <span style={styles.bankName}>{card.bank}</span>
                                <span style={styles.accountNum}>{card.displayAccount}</span>
                                <span style={styles.accountName}>({card.holder})</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Toast Notification */}
            <div style={{
                ...styles.toast,
                opacity: showToast ? 1 : 0,
                transform: showToast ? 'translate(-50%, 0)' : 'translate(-50%, 20px)',
                pointerEvents: showToast ? 'auto' : 'none'
            }}>
                📋 계좌번호가 복사되었습니다!
            </div>

            {focusedCard && (
                <div style={styles.overlay} onClick={() => setFocusedCard(null)}></div>
            )}
        </section>
    );
};

const styles = {
    section: {
        padding: '4rem 1rem',
        backgroundColor: '#fff',
        color: '#333',
        textAlign: 'center',
        overflow: 'hidden',
    },
    title: {
        fontSize: '1.2rem',
        color: '#C57038',
        marginBottom: '3rem',
        letterSpacing: '0.2em',
        fontFamily: 'serif',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '1.5rem',
        marginTop: '-2rem',
        fontFamily: 'sans-serif',
        animation: 'pulse 2s infinite',
    },
    cardContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px', // Increased gap for better spacing
        flexWrap: 'nowrap',
        position: 'relative',
        // zIndex: 10, // Removed to allow overlay to cover children
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 10px',
    },
    cardWrapper: {
        flex: '1 1 0',
        width: 0, // Force equal width regardless of content
        minWidth: '0',
        maxWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative', // Context for children
    },
    card: {
        width: '100%',
        height: 'auto',
        aspectRatio: '300/440',
        backgroundColor: '#C57038',
        padding: '1.5%',
        borderRadius: '8px',
        border: '2px solid #555',
        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
        cursor: 'pointer',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.27), filter 0.3s',
        position: 'relative',
        userSelect: 'none',
        marginBottom: '10px', // Space between card and account box
        zIndex: 2,
    },
    cardFocused: {
        transform: 'scale(1.1) translateY(-20px)',
        zIndex: 100, // Above overlay
        boxShadow: '0 0 30px rgba(240, 195, 48, 0.8)',
        filter: 'brightness(1.1)',
    },
    cardBlurred: {
        filter: 'blur(2px) brightness(0.5)',
        transform: 'scale(0.9)',
    },
    cardInner: {
        backgroundColor: '#A85A32',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '5px',
        border: '1px solid #774E36',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        border: '1px solid #000',
        padding: '2px 8px',
        marginBottom: '5px',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)',
        borderRadius: '2px',
    },
    cardName: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        fontFamily: 'sans-serif',
    },
    cardAttribute: {
        fontSize: '1.2rem',
    },
    cardStars: {
        textAlign: 'right',
        marginBottom: '5px',
        fontSize: '14px',
        lineHeight: 1,
    },
    cardImageWrapper: {
        width: '100%',
        height: 'auto',
        aspectRatio: '1/1', // Changed from 16/9 to Square for better visibility
        backgroundColor: '#fff',
        border: '2px solid #888',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
        marginBottom: '4px',
        overflow: 'hidden',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    cardDescBox: {
        flex: 1,
        backgroundColor: '#F3EBD8',
        border: '2px solid #000',
        padding: '4px',
        fontSize: '0.7rem',
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
    },
    cardType: {
        fontWeight: 'bold',
        marginBottom: '2px',
        borderBottom: '1px solid #000',
        display: 'inline-block',
        fontSize: '0.7rem',
    },
    cardDesc: {
        flex: 1,
        fontStyle: 'italic',
        lineHeight: '1.3',
        fontSize: '0.65rem',
    },
    cardStats: {
        borderTop: '1px solid #000',
        paddingTop: '4px',
        textAlign: 'right',
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    accountBox: {
        width: '100%',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '0.8rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'background-color 0.2s',
        position: 'relative',
        zIndex: 2, // Below overlay (50)
    },
    bankName: {
        fontWeight: 'bold',
        color: '#C57038',
        fontSize: '0.75rem',
    },
    accountNum: {
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: '0.7rem', // Reduced from 0.85rem
        color: '#333',
    },
    accountName: {
        fontSize: '0.7rem',
        color: '#666',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 50, // Increased to cover non-focused items
    },
    glare: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0,
        transition: 'opacity 0.2s',
        mixBlendMode: 'overlay',
    },
    toast: {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '30px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        zIndex: 1000,
        transition: 'opacity 0.3s, transform 0.3s',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    }
};

export default CoupleCards;
