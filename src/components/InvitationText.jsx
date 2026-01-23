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

                <div className="flex flex-col items-center gap-4 font-classic text-xl">
                    <div className="flex items-center gap-3">
                        <span className="text-base text-primary font-bold tracking-widest">신랑</span>
                        <strong className="text-text text-2xl font-bold">박종선</strong>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-base text-primary font-bold tracking-widest">신부</span>
                        <strong className="text-text text-2xl font-bold">윤지수</strong>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InvitationText;
