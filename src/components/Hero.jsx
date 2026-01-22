import { useEffect, useState } from 'react';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative h-screen flex flex-col justify-center items-center text-center bg-white text-white overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="Wedding Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div
                className={`relative z-20 p-8 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <p className="text-sm md:text-base tracking-[0.2em] mb-4 uppercase text-white/90">
                    We Are Getting Married
                </p>
                <h1 className="text-6xl md:text-7xl lg:text-8xl mb-6 font-heading text-white drop-shadow-lg">
                    JongSeon <br className="md:hidden" />
                    <span className="text-4xl md:text-5xl lg:text-6xl mx-2 text-soft-pink font-serif italic">&</span>
                    <br className="md:hidden" /> Jisu
                </h1>
                <div className="flex items-center justify-center gap-4 text-white/90">
                    <div className="h-px w-12 bg-white/60"></div>
                    <p className="text-lg md:text-xl tracking-widest font-light">2026. 04. 25. SAT</p>
                    <div className="h-px w-12 bg-white/60"></div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 z-20 animate-bounce text-white/80 text-sm tracking-widest">
                SCROLL DOWN
            </div>
        </section>
    );
};

export default Hero;
