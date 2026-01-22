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
        const copyText = `${card.account} ${card.bank}`;
        navigator.clipboard.writeText(copyText).then(() => {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
        setFocusedCard(card.id);
    };

    const handleMouseMove = (e, index, isFocused) => {
        if (isFocused) return;

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
        if (isFocused) return;

        const card = document.getElementById(`card-${index}`);
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

        const glare = card.querySelector('.glare');
        if (glare) {
            glare.style.opacity = '0';
        }
    };

    return (
        <section className="py-24 px-4 bg-gray-50 text-center overflow-hidden">
            <h2 className="text-sm text-primary tracking-[0.2em] font-bold mb-4 uppercase">
                CARD BATTLE? NO, LOVE!
            </h2>
            <p className="text-gray-500 mb-12 animate-pulse text-sm">
                👇 카드를 클릭하면 계좌번호가 복사됩니다 👇
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-8 items-center max-w-5xl mx-auto relative z-10">
                {cards.map((card, index) => {
                    const isFocused = focusedCard === card.id;
                    return (
                        <div key={card.id} className="relative w-full max-w-[320px] group perspective">
                            {/* Card Body */}
                            <div
                                id={`card-${index}`}
                                className={`
                                    w-full aspect-[300/440] bg-[#C57038] p-[1.5%] rounded-xl border-4 border-gray-700 shadow-2xl cursor-pointer relative z-20 transition-all duration-300
                                    ${isFocused ? 'scale-110 -translate-y-4 z-50 brightness-110 shadow-[0_0_30px_rgba(249,115,22,0.6)]' : ''}
                                    ${focusedCard && !isFocused ? 'blur-sm scale-95 brightness-50' : ''}
                                `}
                                onClick={() => handleCardClick(card)}
                                onMouseMove={(e) => handleMouseMove(e, index, isFocused)}
                                onMouseLeave={() => handleMouseLeave(index, isFocused)}
                            >
                                {/* Glare Effect */}
                                <div className="glare absolute inset-0 rounded-lg pointer-events-none z-10 opacity-0 transition-opacity duration-200 mix-blend-overlay"></div>

                                {/* Inner Card */}
                                <div className="bg-[#A85A32] h-full flex flex-col p-1 border border-[#774E36]">
                                    {/* Header */}
                                    <div className="flex justify-between items-center bg-white border border-black px-2 py-1 mb-1 shadow-inner rounded-sm">
                                        <span className="font-bold text-black text-lg">{card.name}</span>
                                        <span className="text-xl">❤️</span>
                                    </div>

                                    {/* Stars */}
                                    <div className="text-right mb-1 text-xs leading-none tracking-tighter text-yellow-300 drop-shadow-md">
                                        {card.stars}
                                    </div>

                                    {/* Image */}
                                    <div className="w-full aspect-square bg-white border-2 border-gray-400 shadow-inner mb-2 overflow-hidden relative">
                                        <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Description Box */}
                                    <div className="flex-1 bg-[#F3EBD8] border-2 border-black p-2 flex flex-col relative overflow-hidden">
                                        <div className="font-bold border-b border-black mb-1 text-xs inline-block w-full pb-0.5">
                                            {card.type}
                                        </div>
                                        <p className="flex-1 italic text-[0.7rem] leading-snug text-gray-900 line-clamp-4">
                                            {card.desc}
                                        </p>
                                        <div className="border-t border-black pt-1 mt-1 text-right font-mono font-bold text-xs">
                                            <span>ATK/{card.atk}</span>
                                            <span className="ml-2">DEF/{card.def}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bank Account Box */}
                            <div
                                className="mt-4 w-full p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-1 items-center z-10 relative"
                                onClick={() => handleCardClick(card)}
                            >
                                <span className="font-bold text-cta text-sm">{card.bank}</span>
                                <span className="font-mono font-bold text-gray-800 text-base">{card.displayAccount}</span>
                                <span className="text-xs text-gray-500">({card.holder})</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Toast Notification */}
            <div
                className={`
                    fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full font-bold shadow-xl z-[100] whitespace-nowrap transition-all duration-300
                    ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                `}
            >
                📋 계좌번호가 복사되었습니다!
            </div>

            {/* Backdrop Overlay */}
            {focusedCard && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setFocusedCard(null)}
                ></div>
            )}
        </section>
    );
};

export default CoupleCards;
