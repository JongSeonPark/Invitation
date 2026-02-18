import { useState } from 'react';

const AccountSection = () => {
    const [copied, setCopied] = useState(null);

    const accountGroups = [
        {
            id: 'groom',
            label: '신랑측 마음 전하실 곳',
            description: '따뜻한 마음 감사히 받겠습니다.',
            accounts: [
                { relation: '아버지', name: '박태만', bank: '국민은행', account: '383602-04-101-383' },
                { relation: '신랑', name: '박종선', bank: '하나은행', account: '495-910449-55107' },
            ]
        },
        {
            id: 'bride',
            label: '신부측 마음 전하실 곳',
            description: '축하의 마음 감사히 받겠습니다.',
            accounts: [
                { relation: '어머니', name: '강미선', bank: '신한은행', account: '110-106-343360' },
                { relation: '신부', name: '윤지수', bank: '신한은행', account: '110-297-915880' },
            ]
        }
    ];

    const handleCopy = (acc) => {
        const textToCopy = `${acc.bank} ${acc.account}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(acc.account); // Use account number as unique key for copied state
            setTimeout(() => setCopied(null), 2000);
        });
    };

    return (
        <section className="py-20 px-6 bg-background text-center relative overflow-hidden font-body">
            <h2 className="text-3xl md:text-4xl text-primary font-classic font-bold mb-10 text-center animate-fade-in-up">
                마음 전하실 곳
            </h2>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-100">
                {accountGroups.map((group) => (
                    <div key={group.id} className="bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-soft-md border border-white/50 flex flex-col h-full">
                        {/* Header */}
                        <div className="bg-white/80 p-6 border-b border-primary/10">
                            <h3 className="font-classic text-xl text-primary font-bold mb-2">
                                {group.label}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">
                                {group.description}
                            </p>
                        </div>

                        {/* Account List */}
                        <div className="p-6 space-y-4 flex-1">
                            {group.accounts.map((acc, idx) => (
                                <div key={idx} className="flex flex-col items-start gap-2 p-4 rounded-xl bg-white/50 hover:bg-white transition-colors border border-transparent hover:border-primary/20">
                                    <div className="flex flex-col items-start gap-1 w-full">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-500 w-12 text-left">{acc.relation}</span>
                                                <span className="text-base font-bold text-text">{acc.name}</span>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(acc)}
                                                className={`
                                                    px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
                                                    ${copied === acc.account
                                                        ? 'bg-[#03C75A] text-white shadow-sm'
                                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                                    }
                                                `}
                                            >
                                                {copied === acc.account ? '복사완료' : '복사하기'}
                                            </button>
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600 font-mono w-full text-left pl-0 sm:pl-14 transition-all">
                                            {acc.bank} <span className="mx-1 text-gray-300">|</span> {acc.account}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AccountSection;
