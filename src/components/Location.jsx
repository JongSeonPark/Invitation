const Location = () => {
    // Direct links to the venue
    const naverMapUrl = "https://naver.me/x7ndUhZi";
    const kakaoMapUrl = "https://place.map.kakao.com/25447779";

    const openMap = (url) => {
        window.open(url, '_blank');
    };

    return (
        <section className="py-20 px-6 bg-white text-center">
            <h2 className="text-sm text-cta tracking-[0.2em] font-bold mb-8 uppercase">
                Location
            </h2>

            <div className="max-w-4xl mx-auto mb-10 rounded-xl overflow-hidden shadow-soft-md border border-gray-100">
                <iframe
                    src="https://maps.google.com/maps?q=빌라드%20지디%20안산&t=&z=17&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-[400px]"
                    frameBorder="0"
                    title="Google Map"
                    loading="lazy"
                    allowFullScreen
                ></iframe>
            </div>

            <div className="mb-10 space-y-2">
                <strong className="block text-2xl md:text-3xl text-text font-serif mb-2">
                    빌라드 지디 안산 7층 캘리홀
                </strong>
                <p className="text-gray-600 font-body text-lg">경기 안산시 단원구 광덕4로 140</p>
                <p className="text-gray-500 font-body">Tel. 031-487-8100</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                <button
                    className="flex items-center gap-2 px-6 py-3 bg-[#03C75A] text-white rounded-full font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-sm md:text-base"
                    onClick={() => openMap(naverMapUrl)}
                >
                    <NaverIcon /> 네이버 지도
                </button>
                <button
                    className="flex items-center gap-2 px-6 py-3 bg-[#FEE500] text-black rounded-full font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-sm md:text-base"
                    onClick={() => openMap(kakaoMapUrl)}
                >
                    <KakaoIcon /> 카카오 맵
                </button>
            </div>
        </section>
    );
};

// SVG Components for cleaner DOM
const NaverIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M16.4153 3H21V21H16.4153V10.7417L7.69231 21H3V3H7.69231V13.2519L16.4153 3Z" fill="currentColor" />
    </svg>
);

const KakaoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3C6.47715 3 2 6.35786 2 10.5C2 13.1679 3.65685 15.5393 6.1875 16.9079L5.4375 19.6579C5.375 19.8766 5.5625 20.0641 5.78125 20.0016L9.625 19.0641C10.375 19.2829 11.1875 19.4079 12 19.4079C17.5228 19.4079 22 16.05 22 11.9079C22 7.76579 17.5228 4.40786 12 4.40786V3Z" />
    </svg>
);

export default Location;
