const Location = () => {
    // Direct links to the venue
    const naverMapUrl = "https://naver.me/x7ndUhZi";
    const kakaoMapUrl = "https://place.map.kakao.com/25447779";

    const openMap = (url) => {
        window.open(url, '_blank');
    };

    return (
        <section className="py-24 px-4 bg-background text-center relative overflow-hidden font-body">
            {/* Header */}
            <div className="mb-12 animate-fade-in-up">
                <h2 className="text-4xl md:text-5xl text-text font-classic font-bold">
                    오시는 길
                </h2>
            </div>

            {/* Map Area */}
            <div className="max-w-5xl mx-auto mb-12 animate-fade-in-up delay-100">
                <div className="w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden shadow-sm border border-black/5 bg-gray-50">
                    <iframe
                        src="https://maps.google.com/maps?q=빌라드%20지디%20안산&t=&z=17&ie=UTF8&iwloc=&output=embed"
                        className="w-full h-full transition-all duration-700"
                        frameBorder="0"
                        title="Google Map"
                        loading="lazy"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            {/* Info Area */}
            <div className="max-w-lg mx-auto mb-12 space-y-2 animate-fade-in-up delay-200 font-classic">
                <h3 className="text-2xl text-text font-bold tracking-wide">
                    빌라드 지디 안산
                    <span className="font-normal text-lg ml-2 text-text/60">7층 캘리홀</span>
                </h3>
                <p className="text-text/70 text-lg">경기 안산시 단원구 광덕4로 140</p>
                <div className="w-8 h-[1px] bg-primary/20 mx-auto my-4"></div>
                <p className="text-text/50 text-sm tracking-wider">Tel. 031-487-8100</p>
            </div>

            {/* Minimal Buttons */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-300">
                <button
                    className="flex items-center gap-3 px-8 py-3 bg-white border border-gray-200 rounded-full hover:border-[#03C75A] hover:bg-[#03C75A]/5 transition-all group font-classic"
                    onClick={() => openMap(naverMapUrl)}
                >
                    <NaverIcon />
                    <span className="text-gray-600 group-hover:text-[#03C75A] font-medium transition-colors">네이버 지도</span>
                </button>
                <button
                    className="flex items-center gap-3 px-8 py-3 bg-white border border-gray-200 rounded-full hover:border-[#FEE500] hover:bg-[#FEE500]/10 transition-all group font-classic"
                    onClick={() => openMap(kakaoMapUrl)}
                >
                    <KakaoIcon />
                    <span className="text-gray-600 group-hover:text-black font-medium transition-colors">카카오 맵</span>
                </button>
            </div>
        </section>
    );
};

// SVG Components
const NaverIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#03C75A]">
        <path fillRule="evenodd" clipRule="evenodd" d="M16.4153 3H21V21H16.4153V10.7417L7.69231 21H3V3H7.69231V13.2519L16.4153 3Z" fill="currentColor" />
    </svg>
);

const KakaoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[#FEE500]">
        <path d="M12 3C6.47715 3 2 6.35786 2 10.5C2 13.1679 3.65685 15.5393 6.1875 16.9079L5.4375 19.6579C5.375 19.8766 5.5625 20.0641 5.78125 20.0016L9.625 19.0641C10.375 19.2829 11.1875 19.4079 12 19.4079C17.5228 19.4079 22 16.05 22 11.9079C22 7.76579 17.5228 4.40786 12 4.40786V3Z" />
    </svg>
);



export default Location;
