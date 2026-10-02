import React, { useState, useEffect } from 'react';

const ProductCardImageCarousel = ({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!images || images.length <= 1 || !isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [images, isHovered]);

    // Reset to first image when not hovering
    useEffect(() => {
        if (!isHovered) {
            setCurrentIndex(0);
        }
    }, [isHovered]);

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
                className="max-w-full max-h-full object-contain transform transition-transform duration-700 group-hover:scale-110 drop-shadow-md"
            />
        );
    }

    return (
        <div 
            className="relative w-full h-full overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-700"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {images.map((img, idx) => (
                <img
                    key={idx}
                    src={img}
                    alt={`${productName} - view ${idx + 1}`}
                    className={`absolute inset-0 max-w-full max-h-full m-auto object-contain drop-shadow-md transition-all duration-1000 ease-in-out ${
                        idx === currentIndex
                            ? 'opacity-100 translate-x-0'
                            : idx < currentIndex
                            ? 'opacity-0 -translate-x-full'
                            : 'opacity-0 translate-x-full'
                    }`}
                />
            ))}
        </div>
    );
};

export default ProductCardImageCarousel;
