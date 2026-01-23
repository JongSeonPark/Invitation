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



    return (
        <section className="py-24 px-4 bg-background text-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-60 h-60 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>

            <h2 className="text-3xl md:text-4xl text-primary font-heading font-medium mb-4 animate-fade-in-up relative z-10">
                Groom & Bride
            </h2>
            <p className="text-text/60 mb-12 animate-fade-in-up delay-100 font-body relative z-10">
                서로의 든든한 배우자가 되겠습니다
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-8 items-stretch max-w-5xl mx-auto relative z-10">
                {cards.map((card, index) => {
                    return (
                        <div key={card.id} className="relative w-full max-w-md group">
                            {/* Profile Card */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-soft-lg border border-white/60 hover:shadow-soft-xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col items-center">

                                {/* Image Ring */}
                                <div className="relative w-48 h-48 mb-6">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 animate-spin-slow blur-md"></div>
                                    <div className="absolute inset-1 rounded-full bg-white p-1 shadow-inner">
                                        <img
                                            src={card.img}
                                            alt={card.name}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Names & Info */}
                                <h3 className="text-2xl font-bold text-text mb-2 font-heading">{card.name}</h3>
                                <p className="text-primary font-body text-lg mb-6">{card.type.replace('[', '').replace(']', '')}</p>

                                <div className="w-full bg-background/50 rounded-2xl p-6 mb-6 flex-1 border border-primary/5">
                                    <p className="font-body text-text/80 italic leading-relaxed text-lg">
                                        {card.desc.replace(/"/g, '')}
                                    </p>
                                </div>

                                {/* Account Button */}
                                <button
                                    onClick={() => handleCardClick(card)}
                                    className="w-full py-4 bg-white border border-primary/20 rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-1 group/btn"
                                >
                                    <div className="flex items-center gap-2 text-text/60 text-sm group-hover/btn:text-primary transition-colors">
                                        <span>{card.bank}</span>
                                        <span className="w-1 h-3 bg-gray-300 rounded-full"></span>
                                        <span>{card.holder}</span>
                                    </div>
                                    <span className="font-body font-bold text-lg text-text tracking-wide group-hover/btn:text-primary transition-colors">
                                        {card.displayAccount}
                                    </span>
                                    <span className="text-xs text-primary/60 font-medium opacity-0 group-hover/btn:opacity-100 transition-opacity -mb-4 absolute bottom-2">
                                        Click to Copy
                                    </span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Toast Notification */}
            <div
                className={`
                    fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-text px-8 py-4 rounded-full shadow-soft-xl z-[100] whitespace-nowrap transition-all duration-500 border border-white/50
                    ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
                `}
            >
                <div className="flex items-center gap-3">
                    <span className="text-primary text-xl">✨</span>
                    <span className="font-body font-medium text-lg">계좌번호가 복사되었습니다</span>
                </div>
            </div>
        </section>
    );
};

export default CoupleCards;
