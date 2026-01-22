const VideoPlayer = () => {
    return (
        <section className="py-20 px-6 bg-white text-center">
            <h2 className="text-sm text-primary tracking-[0.2em] font-bold mb-10 uppercase">
                VIDEO
            </h2>
            <div className="max-w-4xl mx-auto w-full aspect-video rounded-xl overflow-hidden shadow-soft-xl bg-black">
                <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/2Vv-BfVoq4g"
                    title="Wedding Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        </section>
    );
};

export default VideoPlayer;
