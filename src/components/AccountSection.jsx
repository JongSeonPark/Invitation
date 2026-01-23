import { useState } from 'react';

const AccountSection = () => {
    const [copied, setCopied] = useState(null);

    const accounts = [
        {
            type: 'Groom',
            name: '박종선',
            bank: '하나은행',
            account: '495-910449-55107',
            displayAccount: '495-910449-55107'
        },
        {
            type: 'Bride',
            name: '윤지수',
            bank: '신한은행',
            account: '110-297-915880',
            displayAccount: '110-297-915880'
        }
    ];

    const handleCopy = (acc) => {
        navigator.clipboard.writeText(`${acc.bank} ${acc.account}`).then(() => {
            setCopied(acc.type);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    return (
        <section className="py-20 px-6 bg-background text-center relative overflow-hidden font-body">
            <h2 className="text-3xl md:text-4xl text-primary font-classic font-bold mb-10 text-center animate-fade-in-up">
                마음 전하실 곳
            </h2>

            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up delay-100">
                {accounts.map((acc) => (
                    <div
                        key={acc.type}
                        className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-soft-md flex flex-col md:flex-row items-center justify-between gap-4 group hover:shadow-soft-lg transition-all hover:bg-white/80"
                    >
                        <div className="text-left md:flex-1 w-full md:w-auto text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <span className="text-base font-bold text-primary tracking-widest font-classic">
                                    {acc.type === 'Groom' ? '신랑측' : '신부측'}
                                </span>
                                <span className="text-lg font-bold text-text">{acc.name}</span>
                            </div>
                            <div className="text-gray-600 font-mono text-sm md:text-base">
                                {acc.bank} <span className="text-gray-400 mx-1">|</span> {acc.displayAccount}
                            </div>
                        </div>

                        <button
                            onClick={() => handleCopy(acc)}
                            className={`
                                px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 min-w-[100px] font-classic
                                ${copied === acc.type
                                    ? 'bg-[#03C75A] text-white shadow-md'
                                    : 'bg-white border border-primary/20 text-text/80 hover:border-primary hover:text-primary'
                                }
                            `}
                        >
                            {copied === acc.type ? '복사완료' : '계좌복사'}
                        </button>
                    </div>
                ))}
            </div>


        </section>
    );
};

export default AccountSection;
