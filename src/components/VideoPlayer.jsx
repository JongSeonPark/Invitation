const VideoPlayer = () => {
    return (
        <section className="py-20 px-4 md:px-6 bg-background text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl text-primary font-classic font-bold mb-12 text-center animate-fade-in-up">
                    식전 영상
                </h2>
                <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-soft-xl border border-white/50 bg-black/5 animate-fade-in-up delay-100">
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube-nocookie.com/embed/2Vv-BfVoq4g"
                        title="Wedding Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default VideoPlayer;
