import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Opinions = () => {
    const [currentReview, setCurrentReview] = useState(0);
    const reviews = [
        {
            text: "As a doctor, Doctify has helped me connect with more patients and manage appointments efficiently.",
            author: "- Dr. Juan Ramirez"
        },
        {
            text: "Doctify's platform is intuitive and has significantly improved my clinic's scheduling process.",
            author: "- Dr. Sarah Lee"
        },
        {
            text: "The patient feedback feature on Doctify has been invaluable for improving our services.",
            author: "- Dr. Michael Chen"
        }
    ];

    // Automatic sliding every 7 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % reviews.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [reviews.length]);

    // Navigation handlers
    const handlePrev = () => {
        setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const handleNext = () => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
    };

    // Dot click handler
    const handleDotClick = (index) => {
        setCurrentReview(index);
    };

    // Animation variants
    const variants = {
        enter: {
            x: -100,
            opacity: 0
        },
        center: {
            x: 0,
            opacity: 1
        },
        exit: {
            x: 100,
            opacity: 0
        }
    };

    return (
        <div className="w-full py-12 px-4 bg-[#293241] justify-center items-center gap-[26px] inline-flex">
            <button 
                onClick={handlePrev} 
                data-svg-wrapper 
                className="relative xs:hidden"
            >
                <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M31.6666 3.66699L13.3333 22.0003L31.6666 40.3337" stroke="white" strokeWidth="2"/>
                </svg>
            </button>
            <div className="w-auto py-px flex-col justify-center items-center gap-[55px] flex">
                <div className="text-center text-white text-2xl font-medium font-['Inter']">What Our Users Say</div>
                <div className="w-auto flex-col justify-start items-center gap-[26px] inline-flex">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentReview}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="p-8 bg-white rounded-[15px] border border-black flex-col justify-start items-start gap-8 inline-flex"
                        >
                            <div className="text-center text-black text-base font-medium font-['Inter']">
                                "{reviews[currentReview].text}"
                            </div>
                            <div className="text-center text-black text-base font-extralight font-['Inter']">
                                {reviews[currentReview].author}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex gap-2">
                        {reviews.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`w-3 h-3 rounded-full ${
                                    index === currentReview ? 'bg-white' : 'bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <button 
                onClick={handleNext} 
                data-svg-wrapper 
                className="xs:hidden relative"
            >
                <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3333 3.66699L31.6666 22.0003L13.3333 40.3337" stroke="white" strokeWidth="2"/>
                </svg>
            </button>
        </div>
    );
};

export default Opinions;