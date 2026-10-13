import React, { useState, useEffect, useRef } from 'react';

const ProductCardImageCarousel = ({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const hoverTimer = useRef(null);
    const containerRef = useRef(null);

    // Track hover on the product card container
    // This ensures hovering over Add to Cart / Wishlist does not trigger mouse leave or reset the image
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Find the outer product card (.group) or aspect-square container
        const card = el.closest('.group') || el.closest('.aspect-square') || el;

        const handleMouseEnter = () => {
            setIsHovered(true);
        };

        const handleMouseLeave = (e) => {
            // If the mouse moved to another element inside the same card, ignore
            if (e.relatedTarget && card.contains(e.relatedTarget)) {
                return;
            }
            setIsHovered(false);
            setIsButtonHovered(false);
        };

        const handleMouseMove = (e) => {
            // Check if cursor is over an action button (e.g. Add to Cart or Wishlist)
            const target = e.target;
            const overBtn = !!target.closest('button');
            setIsButtonHovered(overBtn);
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
        card.addEventListener('mousemove', handleMouseMove);

        return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
            card.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        if (!images || images.length <= 1 || !isHovered) return;

        // When mouse is on the Add to Cart or Wishlist button, freeze the carousel:
        // Keep whichever image is currently open, DO NOT change or rotate it!
        if (isButtonHovered) {
            if (hoverTimer.current) clearInterval(hoverTimer.current);
            return;
        }

        // On first hover of the card, advance to next image if at index 0
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
    }, [images, isHovered, isButtonHovered]);

    // Reset to first image only when the mouse completely leaves the product card
    useEffect(() => {
        if (!isHovered && currentIndex !== 0) {
            setPrevIndex(currentIndex);
            setCurrentIndex(0);
        }
    }, [isHovered, currentIndex]);

    const touchStartX = useRef(null);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX.current || !images || images.length <= 1) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;
        if (diff > 25) {
            // Swipe left -> next image
            setCurrentIndex((prev) => {
                setPrevIndex(prev);
                return (prev + 1) % images.length;
            });
        } else if (diff < -25) {
            // Swipe right -> prev image
            setCurrentIndex((prev) => {
                setPrevIndex(prev);
                return (prev - 1 + images.length) % images.length;
            });
        }
        touchStartX.current = null;
    };

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
                className="w-full h-full object-cover object-center transition-transform duration-500"
            />
        );
    }

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-full overflow-hidden flex items-center justify-center select-none touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
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
                        className={`absolute inset-0 w-full h-full object-cover object-center ${positionClass}`}
                    />
                );
            })}

            {/* Subtle mobile dots indicator (No arrows on mobile) */}
            {images.length > 1 && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex gap-1 pointer-events-none md:hidden">
                    {images.map((_, i) => (
                        <span
                            key={i}
                            className={`rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-[#E51A22] w-3 h-1.5' : 'bg-black/25 w-1.5 h-1.5'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductCardImageCarousel;
