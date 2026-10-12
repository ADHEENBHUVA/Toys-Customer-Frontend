import React, { useState, useEffect, useRef } from 'react';

const ProductCardImageCarousel = ({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimer = useRef(null);

    useEffect(() => {
        if (!images || images.length <= 1 || !isHovered) return;

        // Immediate change on hover
        setCurrentIndex((prev) => {
            if (prev === 0) {
                setPrevIndex(prev);
                return 1 % images.length;
            }
            return prev;
        });

        hoverTimer.current = setInterval(() => {
            setCurrentIndex((prev) => {
                setPrevIndex(prev);
                return (prev + 1) % images.length;
            });
        }, 5000); // 5 seconds

        return () => {
            if (hoverTimer.current) clearInterval(hoverTimer.current);
        };
    }, [images, isHovered]);

    // Reset to first image when not hovering
    useEffect(() => {
        if (!isHovered && currentIndex !== 0) {
            setPrevIndex(currentIndex);
            setCurrentIndex(0);
        }
    }, [isHovered, currentIndex]);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
                🧸
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <img
                src={images[0]}
                alt={productName}
                className="max-w-full max-h-full object-contain drop-shadow-md"
            />
        );
    }

    return (
        <div 
            className="relative w-full h-full overflow-hidden flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <style>
                {`
                @keyframes slideInRight {
                    0% { transform: translateX(100%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutLeft {
                    0% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(-100%); opacity: 0; }
                }
                .carousel-slide-in {
                    animation: slideInRight 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
                .carousel-slide-out {
                    animation: slideOutLeft 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
                .carousel-hidden {
                    transform: translateX(100%);
                    opacity: 0;
                }
                .carousel-center {
                    transform: translateX(0);
                    opacity: 1;
                }
                `}
            </style>
            {images.map((img, idx) => {
                let positionClass = 'carousel-hidden z-0'; // Waiting on the right
                
                if (idx === currentIndex) {
                    positionClass = prevIndex !== null ? 'carousel-slide-in z-10' : 'carousel-center z-10'; // Active in center
                } else if (idx === prevIndex) {
                    positionClass = 'carousel-slide-out z-0'; // Exiting to left
                }

                return (
                    <img
                        key={idx}
                        src={img}
                        alt={`${productName} - view ${idx + 1}`}
                        className={`absolute inset-0 max-w-full max-h-full m-auto object-contain drop-shadow-md ${positionClass}`}
                    />
                );
            })}
        </div>
    );
};

export default ProductCardImageCarousel;
