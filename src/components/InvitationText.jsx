import { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const InvitationText = () => {
    const ref = useRef(null);
    const isVisible = useIntersectionObserver(ref, { threshold: 0.3 });

    return (
        <section className="py-20 px-4 text-center bg-white" ref={ref}>
            <div
                className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="mb-12">
                    <p className="text-primary text-sm tracking-[0.2em] mb-3 opacity-60 font-classic">소중한 초대</p>
                    <h2 className="text-3xl md:text-4xl text-text font-classic font-bold">
                        초대의 글
                    </h2>
                </div>

                <div className="font-classic text-xl leading-loose text-text/80 mb-12 space-y-2">
                    <p>서로가 마주보며 다져온 사랑을</p>
                    <p>이제 함께 한 곳을 바라보며</p>
                    <p>걸어가려 합니다.</p>
                    <br />
                    <p>저희 두 사람의 새로운 시작을</p>
                    <p>가까이서 축복해 주시면</p>
                    <p>더없는 기쁨으로 간직하겠습니다.</p>
                </div>

                <div className="mx-auto w-fit grid grid-cols-[auto_auto_auto_auto] gap-x-2 gap-y-5 font-classic items-center mt-2">
                    <span className="text-[1.1rem] text-text/80 text-right tracking-[0.1em]">박태만 · 권덕례</span>
                    <span className="text-base text-text/80 font-light">의</span>
                    <span className="text-[1.05rem] text-text/80 text-center w-10">아들</span>
                    <strong className="text-text text-[1.4rem] font-bold ml-1 tracking-[0.15em]">박종선</strong>
                    
                    <span className="text-[1.1rem] text-text/80 text-right tracking-[0.1em]">윤상식 · 강미선</span>
                    <span className="text-base text-text/80 font-light">의</span>
                    <span className="text-[1.05rem] text-text/80 text-center w-10">딸</span>
                    <strong className="text-text text-[1.4rem] font-bold ml-1 tracking-[0.15em]">윤지수</strong>
                </div>
            </div>
        </section>
    );
};

export default InvitationText;
