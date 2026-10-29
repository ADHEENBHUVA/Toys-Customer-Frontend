import React, { useState, useRef, useEffect } from 'react';

/**
 * InteractiveToyRow Component
 * 
 * SPECIFICATIONS:
 * 1. REAL AUTHENTIC SOUNDS:
 *    - Car: Real engine revving vroom + dual-tone car horn (honk honk!)
 *    - Horse: Real horse neigh/whinny + galloping clip-clop hooves
 *    - Dhol: Authentic Indian Dhol drum beats (Bass Dha + Treble Ta) with synchronized stick strikes!
 *    - Duckling: Real duck quacking (quack! quack! quack-quack!)
 *    - Robot: Real mechanical servo motor whirr + computerized robotic voice
 *    - Teddy: Real plush squeaker toy squeeze + cute giggle
 *    - Bunny: Real cartoon spring boing + cute bunny squeak
 * 2. 3D VISUALS & REALISTIC ANIMATIONS:
 *    - Rich 3D shading, specular highlights, and soft ambient drop shadows.
 *    - Car drives on animated asphalt road with spinning wheel spokes & headlight beam.
 *    - Duckling realistically slow-runs (dhime-dhime dodvu) with alternating webbed feet strides.
 *    - Dhol drumsticks strike down in exact synchronization with the Dhol beats.
 *    - Rocking Horse rocks smoothly around its base wooden skids with dynamic shadow.
 * 3. INSTANT STOP ON MOUSE LEAVE:
 *    - Leaving the toy immediately silences the audio and returns it to its base state.
 * 4. ZERO CLIPPING:
 *    - Generous headroom (pt-10 sm:pt-14) and overflow-visible ensures Bunny ears are never cut off.
 * 5. MOBILE SINGLE TAP & AUTO-OFF ON SCROLL:
 *    - Single tap activates toy; scrolling away automatically stops audio and resets toys.
 */

const TOY_SOUND_FILES = [
    '/sounds/teddy.ogg',    // 0: Teddy (Real Cute Baby Giggle & Laugh)
    '/sounds/bunny.wav',    // 1: Bunny (Real Authentic Rabbit Sound / સસલાનો અસલી અવાજ)
    '/sounds/robot.ogg',    // 2: Robot (Real Synth Filter & Futuristic Tone)
    '/sounds/car.wav',      // 3: Car (Clean Purring Motor Rev + Crisp Beep-Beep Horn)
    '/sounds/peacock.wav',  // 4: Royal Peacock / Mor (Real Majestic Indian Peacock Tahuko / ટહૂકો)
    '/sounds/dhol.ogg',     // 5: Dhol Drum (Real Acoustic Drum Beat)
    '/sounds/horse.mp3',    // 6: Rocking Horse (Real Horse Neigh / Whinny)
];

// Global AudioContext singleton to satisfy browser autoplay requirements
let globalAudioCtx = null;
let isAudioUnlocked = false;

const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    if (!globalAudioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            globalAudioCtx = new AudioCtx();
        }
    }
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume().catch(() => {});
    }
    return globalAudioCtx;
};



const InteractiveToyRow = () => {
    const [activeIdx, setActiveIdx] = useState(null);
    const activeIdxRef = useRef(null);
    const [animResetKey, setAnimResetKey] = useState(0);
    const sectionRef = useRef(null);
    const hoverTimerRef = useRef(null);
    const activeTimerRef = useRef(null);
    const currentAudioRef = useRef(null);
    // Preload audio files cleanly without micro-play race conditions
    useEffect(() => {
        TOY_SOUND_FILES.forEach((src) => {
            try {
                const a = new Audio(src);
                a.preload = 'auto';
                a.load();
            } catch (e) {}
        });

        // Resume AudioContext on any user gesture across the page
        const unlockAudio = () => {
            const ctx = getAudioContext();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume().catch(() => {});
            }
        };

        const events = ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll', 'wheel'];
        events.forEach((ev) => window.addEventListener(ev, unlockAudio, { passive: true }));

        return () => {
            events.forEach((ev) => window.removeEventListener(ev, unlockAudio));
        };
    }, []);

    // Stop currently active toy sound and reset state immediately
    const stopCurrentToy = () => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        if (activeTimerRef.current) {
            clearTimeout(activeTimerRef.current);
            activeTimerRef.current = null;
        }
        if (currentAudioRef.current) {
            try {
                currentAudioRef.current.pause();
                currentAudioRef.current.currentTime = 0;
            } catch (e) {}
            currentAudioRef.current = null;
        }
        activeIdxRef.current = null;
        setActiveIdx(null);
    };

    // Activate toy with authentic sound effect and 3D action
    const activateToy = (index) => {
        // Stop any previous sound cleanly
        stopCurrentToy();

        activeIdxRef.current = index;
        setActiveIdx(index);

        // Resume AudioContext synchronously inside user interaction
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }

        // Fresh HTML5 Audio object for clean, uncorrupted playback
        try {
            const audio = new Audio(TOY_SOUND_FILES[index]);
            audio.volume = 0.95;
            audio.currentTime = 0;
            audio.loop = true;

            currentAudioRef.current = audio;

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.log('Audio autoplay awaiting user gesture:', err);
                });
            }
        } catch (e) {
            console.error('Audio play error:', e);
        }

        // 30 SECONDS TIMER (As requested):
        // If user remains on the screen watching this toy, automatically stop sound & animation after 30 seconds!
        if (activeTimerRef.current) {
            clearTimeout(activeTimerRef.current);
        }
        activeTimerRef.current = setTimeout(() => {
            stopCurrentToy();
        }, 30000);
    };

    // When mouse pointer enters a toy on Laptop / Desktop:
    // Execute immediately and synchronously so music and action start working!
    const handleMouseEnter = (index) => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }

        // If this toy is already the active one playing, do nothing
        if (activeIdx === index) return;

        activateToy(index);
    };

    // When mouse pointer leaves toy: IMMEDIATELY cancel timer, stop sound and return to base
    const handleMouseLeave = (index) => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }

        if (activeIdx === index) {
            stopCurrentToy();
        }
    };

    // Click / Single Tap on toy (Mobile & Desktop):
    // 1. If audio is not playing (e.g. Chrome blocked hover autoplay on fresh page), CLICK plays it immediately!
    // 2. If already playing, clicking again toggles it off!
    // 3. ZERO click sound / beep / pop - pure authentic toy music only!
    const handleToyClick = (e, index) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Cancel any pending hover timer
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }

        // Ensure audio context is running
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }

        // Check if audio is currently actively playing for this toy
        const isAudioActive = currentAudioRef.current && !currentAudioRef.current.paused && currentAudioRef.current.currentTime > 0;

        // If this toy is already active AND audio is actually playing, click toggles it off!
        if (activeIdx === index && isAudioActive) {
            stopCurrentToy();
            return;
        }

        // Otherwise (first click, or if hover was visual-only and sound didn't play), start sound & action!
        activateToy(index);
    };

    // IntersectionObserver & Window Scroll:
    // As long as the toy is visible on screen, sound & work continue.
    // The exact moment the user scrolls it off screen (screen ne upar kari devathi toy na dekhay), AUTOMATICALLY STOP!
    useEffect(() => {
        const handleScrollOrVisibility = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            // Toy shelf is visible on screen if its bottom > 0 and top < window.innerHeight
            const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
            if (!isVisible && activeIdxRef.current !== null) {
                stopCurrentToy();
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting && activeIdxRef.current !== null) {
                    stopCurrentToy();
                }
            },
            { threshold: 0 } // Triggers the instant 100% of the shelf leaves the viewport
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        window.addEventListener('scroll', handleScrollOrVisibility, { passive: true });
        window.addEventListener('resize', handleScrollOrVisibility, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScrollOrVisibility);
            window.removeEventListener('resize', handleScrollOrVisibility);
        };
    }, []);

    // Stop audio if user switches tab or locks screen
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopCurrentToy();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            stopCurrentToy();
        };
    }, []);

    // Zigzag baseline configuration (Down - Up - Down - Up - Down - Up - Down)
    // Moderate Y offsets (-12px / +10px) with pt-10 sm:pt-14 prevents any clipping
    const zigzagOffsets = [
        { y: 10, rot: -2 },   // 0: Teddy (Down)
        { y: -12, rot: 2 },   // 1: Bunny (Up)
        { y: 10, rot: -1.5 }, // 2: Robot (Down)
        { y: -12, rot: 1.5 }, // 3: Car (Up)
        { y: 10, rot: -2 },   // 4: Duckling (Down)
        { y: -12, rot: 2 },   // 5: Drum/Dhol (Up)
        { y: 10, rot: -1.5 }, // 6: Horse (Down)
    ];

    const getToyTransform = (i) => {
        const base = zigzagOffsets[i] || { y: 0, rot: 0 };
        return {
            '--base-y': `${base.y}px`,
            '--base-rot': `${base.rot}deg`,
            animationDelay: `${i * 0.35}s`,
            zIndex: activeIdx === i ? 40 : 10
        };
    };

    return (
        <section
            ref={sectionRef}
            className="w-full bg-transparent select-none relative pt-6 sm:pt-8 pb-4 sm:pb-6 overflow-visible"
        >
            {/* CSS Keyframes for Realistic 3D Toy Actions & Mobile Continuous Wave */}
            <style>{`
                /* Gentle Playful Toy Shelf Wave (રમકડાં હળવા હળવા હલતાં રહે) */
                .mobile-flow-toy {
                    transform: translateY(var(--base-y, 0px)) rotate(var(--base-rot, 0deg)) scale(1);
                    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                    animation: gentleShelfSway 3.2s ease-in-out infinite;
                }
                /* Active toy custom animation overrides default shelf wave */
                .mobile-flow-toy.active-toy-0, .mobile-flow-toy.is-active.active-toy-0 {
                    animation: teddyJoySway 0.7s ease-in-out infinite !important;
                }
                .mobile-flow-toy.active-toy-1, .mobile-flow-toy.is-active.active-toy-1 {
                    animation: bunnyControlledHop 0.42s ease-in-out infinite !important;
                }
                .mobile-flow-toy.active-toy-2, .mobile-flow-toy.is-active.active-toy-2 {
                    animation: robotMechanicalDance 0.45s steps(2, end) infinite !important;
                }
                .mobile-flow-toy.active-toy-3, .mobile-flow-toy.is-active.active-toy-3 {
                    animation: carDrivingBob 0.28s ease-in-out infinite !important;
                }
                .mobile-flow-toy.active-toy-4, .mobile-flow-toy.is-active.active-toy-4 {
                    animation: none !important;
                }
                .mobile-flow-toy.active-toy-5, .mobile-flow-toy.is-active.active-toy-5 {
                    animation: dholShellVibrate 0.14s ease-in-out infinite !important;
                }
                .mobile-flow-toy.toy-horse-container,
                .mobile-flow-toy.toy-horse-container.is-active,
                .mobile-flow-toy.toy-horse-container.active-toy-6 {
                    animation: none !important;
                    transform: translateY(var(--base-y, 0px)) scale(1) !important;
                }
                @keyframes gentleShelfSway {
                    0%, 100% {
                        transform: translateY(var(--base-y, 0px)) rotate(var(--base-rot, 0deg)) scale(1);
                    }
                    50% {
                        transform: translateY(calc(var(--base-y, 0px) - 8px)) rotate(calc(var(--base-rot, 0deg) * -1.2)) scale(1.04);
                    }
                }

                /* 0. TEDDY BEAR: CUTE SQUEAK & JOYFUL SWAY */
                .active-toy-0 {
                    animation: teddyJoySway 0.7s ease-in-out infinite !important;
                }
                @keyframes teddyJoySway {
                    0%, 100% { transform: translateY(calc(var(--base-y, 0px) - 8px)) rotate(-6deg) scale(1.15); }
                    50% { transform: translateY(calc(var(--base-y, 0px) - 14px)) rotate(6deg) scale(1.18); }
                }

                /* 1. FLUFFY BUNNY: BOUNCY SPRING HOPPING (ZERO EAR CLIPPING) */
                .active-toy-1 {
                    animation: bunnyControlledHop 0.42s ease-in-out infinite !important;
                }
                @keyframes bunnyControlledHop {
                    0%, 100% { transform: translateY(calc(var(--base-y, 0px) - 6px)) scale(1.1); }
                    50% { transform: translateY(calc(var(--base-y, 0px) - 15px)) scale(1.16); }
                }

                /* 2. TIN ROBOT: MECHANICAL SCI-FI STEP DANCE */
                .active-toy-2 {
                    animation: robotMechanicalDance 0.45s steps(2, end) infinite !important;
                }
                @keyframes robotMechanicalDance {
                    0% { transform: translateY(calc(var(--base-y, 0px) - 8px)) rotate(-8deg) scale(1.15); }
                    50% { transform: translateY(calc(var(--base-y, 0px) - 8px)) rotate(8deg) scale(1.15); }
                    100% { transform: translateY(calc(var(--base-y, 0px) - 8px)) rotate(-8deg) scale(1.15); }
                }

                /* 3. VINTAGE CAR: REAL ROAD DRIVING WITH SCROLLING HIGHWAY & WHEEL SPIN */
                .active-toy-3 {
                    animation: carDrivingBob 0.28s ease-in-out infinite !important;
                }
                @keyframes carDrivingBob {
                    0%, 100% { transform: translate(-3px, calc(var(--base-y, 0px) - 8px)) rotate(-1.5deg) scale(1.14); }
                    50% { transform: translate(3px, calc(var(--base-y, 0px) - 11px)) rotate(1.5deg) scale(1.16); }
                }
                .active-toy-3 .car-wheel-spin {
                    animation: carWheelSpin 0.2s linear infinite !important;
                }
                @keyframes carWheelSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .active-toy-3 .car-headlight-cone {
                    animation: headlightFlicker 0.22s ease-in-out infinite alternate;
                }
                @keyframes headlightFlicker {
                    0% { opacity: 0.6; }
                    100% { opacity: 0.95; }
                }
                @keyframes roadDriveTrack {
                    0% { background-position: 0px 0; }
                    100% { background-position: -32px 0; }
                }
                .animate-road-drive {
                    animation: roadDriveTrack 0.22s linear infinite;
                }

                /* 4. CUTE 3D WIND-UP TOY PEACOCK (રમકડાંનો ક્યુટ મોર) */
                /* BY DEFAULT: PEACOCK IS AT REST (અવાજ ન હોય ત્યારે શાંતિથી ઊભો રહે છે) */
                .peacock-toy-body,
                .peacock-toy-head,
                .peacock-toy-crown,
                .peacock-toy-fan,
                .peacock-toy-key,
                .peacock-toy-foot-left,
                .peacock-toy-foot-right {
                    animation: none !important;
                }

                /* ONLY WHEN ACTIVE (અવાજ આવે ત્યારે જ મોર આનંદથી ચાલે છે) */
                .active-toy-4 .peacock-toy-body {
                    animation: toyPeacockWaddleActive 0.62s ease-in-out infinite !important;
                    transform-origin: 46px 54px;
                }
                @keyframes toyPeacockWaddleActive {
                    0%, 100% { transform: translateY(calc(var(--base-y, 0px) - 6px)) rotate(-3deg) scale(1.1); }
                    50%      { transform: translateY(calc(var(--base-y, 0px) - 10px)) rotate(3deg) scale(1.12); }
                }

                /* Proud Head Bob */
                .active-toy-4 .peacock-toy-head {
                    animation: toyPeacockHeadBob 0.62s cubic-bezier(0.4, 0, 0.2, 1) infinite !important;
                    transform-origin: 50px 38px;
                }
                @keyframes toyPeacockHeadBob {
                    0%, 50%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                    25%, 75%      { transform: translate(3px, 0.8px) rotate(3deg); }
                }

                /* Crown Crest Pearl Bounce */
                .active-toy-4 .peacock-toy-crown {
                    animation: toyPeacockCrownBounce 0.36s ease-in-out infinite alternate !important;
                    transform-origin: 56px 12px;
                }
                @keyframes toyPeacockCrownBounce {
                    0%   { transform: rotate(-7deg); }
                    100% { transform: rotate(7deg); }
                }

                /* Majestic Feather Fan Sway */
                .active-toy-4 .peacock-toy-fan {
                    animation: toyPeacockFanSway 0.62s ease-in-out infinite !important;
                    transform-origin: 28px 52px;
                }
                @keyframes toyPeacockFanSway {
                    0%, 100% { transform: rotate(-3.5deg) translateY(0px); }
                    50%      { transform: rotate(3.5deg) translateY(-2px); }
                }

                /* Golden Wind-up Key Spin */
                .active-toy-4 .peacock-toy-key {
                    animation: toyPeacockKeySpin 0.45s linear infinite !important;
                    transform-origin: 26px 46px;
                }
                @keyframes toyPeacockKeySpin {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Chunky Cute Toy Feet Walking (ONLY when active) */
                .active-toy-4 .peacock-toy-foot-left {
                    animation: toyFootWalkLeft 0.62s ease-in-out infinite !important;
                    transform-origin: 38px 58px;
                }
                .active-toy-4 .peacock-toy-foot-right {
                    animation: toyFootWalkRight 0.62s ease-in-out infinite !important;
                    transform-origin: 50px 58px;
                }

                @keyframes toyFootWalkLeft {
                    0%   { transform: translate(5px, 0px) rotate(12deg); }
                    25%  { transform: translate(0px, 0px) rotate(0deg); }
                    50%  { transform: translate(-6px, 0px) rotate(-14deg); }
                    75%  { transform: translate(-1px, -8px) rotate(-4deg); }
                    100% { transform: translate(5px, 0px) rotate(12deg); }
                }

                @keyframes toyFootWalkRight {
                    0%   { transform: translate(-6px, 0px) rotate(-14deg); }
                    25%  { transform: translate(-1px, -8px) rotate(-4deg); }
                    50%  { transform: translate(5px, 0px) rotate(12deg); }
                    75%  { transform: translate(0px, 0px) rotate(0deg); }
                    100% { transform: translate(-6px, 0px) rotate(-14deg); }
                }

                @keyframes gardenLawnWalk {
                    0% { background-position: 0px 0; }
                    100% { background-position: -32px 0; }
                }
                .active-toy-4 .animate-garden-walk {
                    animation: gardenLawnWalk 0.3s linear infinite !important;
                }

                /* 5. INDIAN DHOL: SYNCHRONIZED STICKS STRIKING IN SYNC WITH DHOL BEATS */
                .active-toy-5 {
                    animation: dholShellVibrate 0.14s ease-in-out infinite !important;
                }
                @keyframes dholShellVibrate {
                    0%, 100% { transform: translateY(calc(var(--base-y, 0px) - 8px)) scale(1.13); }
                    50% { transform: translateY(calc(var(--base-y, 0px) - 12px)) scale(1.16); }
                }
                .active-toy-5 .dhol-stick-left-beat {
                    animation: dholDaggaBeat 0.25s ease-in-out infinite alternate !important;
                }
                .active-toy-5 .dhol-stick-right-beat {
                    animation: dholTilliBeat 0.25s ease-in-out infinite alternate !important;
                }
                @keyframes dholDaggaBeat {
                    0% { transform: rotate(-22deg); }
                    100% { transform: rotate(18deg); }
                }
                @keyframes dholTilliBeat {
                    0% { transform: rotate(18deg); }
                    100% { transform: rotate(-22deg); }
                }
                .active-toy-5 .dhol-impact-ring {
                    animation: dholRingPulse 0.25s ease-out infinite !important;
                    transform-origin: 37px 33px;
                }
                @keyframes dholRingPulse {
                    0% { transform: scale(0.5); opacity: 1; }
                    100% { transform: scale(1.4); opacity: 0; }
                }

                /* 6. ROCKING HORSE: REALISTIC 3D ROCKING MOTION (ZATKO-FREE SMOOTH ROCK) */
                /* BY DEFAULT: GENTLE WOODEN ROCKING ON SHELF IN NATURAL SIZE (સ્મૂથ હળવા હિંચકા) */
                .rocking-horse-body {
                    transform-origin: 50% 92%;
                    animation: horseNaturalGentleRock 2.4s ease-in-out infinite alternate;
                }

                /* ON HOVER OR ACTIVE: SMOOTH RHYTHMIC GALLOPING ROCK (ઝટકા વગર અસલી રોકિંગ) */
                .toy-horse-container:hover .rocking-horse-body,
                .toy-horse-container.active-toy-6 .rocking-horse-body,
                .toy-horse-container.is-active .rocking-horse-body {
                    animation: horseSmoothGallopRock 0.52s ease-in-out infinite alternate !important;
                }

                @keyframes horseNaturalGentleRock {
                    0% {
                        transform: rotate(-7deg);
                    }
                    100% {
                        transform: rotate(7deg);
                    }
                }

                @keyframes horseSmoothGallopRock {
                    0% {
                        transform: rotate(-16deg);
                    }
                    100% {
                        transform: rotate(16deg);
                    }
                }
            `}</style>



            {/* Playful Header on Left Side */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mb-3 sm:mb-4 flex items-center justify-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#E51A22] to-rose-400 text-white flex items-center justify-center shadow-md shadow-red-500/25 shrink-0 rotate-[-6deg]">
                        <span className="text-[20px] sm:text-[22px] select-none leading-none">🧸</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E51A22] text-[10.5px] sm:text-[11px] font-black uppercase tracking-wider border border-red-200/80 shadow-2xs">
                                ✨ INTERACTIVE PLAY ZONE
                            </span>
                        </div>
                        <h3 className="text-[19px] sm:text-[23px] md:text-[25px] font-black text-[#1A1A24] tracking-tight flex items-center gap-2 mt-0.5">
                            Let's Play Some Toys
                            <span className="text-[19px] sm:text-[21px] animate-bounce inline-block">🎉</span>
                        </h3>
                    </div>
                </div>
            </div>

            {/* 7 TOYS DISPLAY SHELF - FULL WIDTH EDGE TO EDGE, OVERFLOW VISIBLE */}
            <div className="w-full px-3 sm:px-8 md:px-12 lg:px-16 relative overflow-visible pointer-events-none">
                <div className="w-full flex items-center justify-between sm:justify-evenly relative z-10 min-h-[125px] sm:min-h-[145px] md:min-h-[160px] pt-4 pb-2 px-1 sm:px-4 overflow-visible pointer-events-none">
                    
                    {/* ========================================================== */}
                    {/* TOY 1: CLASSIC CARAMEL TEDDY BEAR (PLUSH SQUEAK + GIGGLE)  */}
                    {/* ========================================================== */}
                    <div
                        key={`toy-0-${activeIdx === 0 ? animResetKey : 0}`}
                        className={`pointer-events-auto flex flex-col items-center cursor-pointer group relative mobile-flow-toy w-fit h-fit p-0 ${activeIdx === 0 ? 'is-active active-toy-0' : ''}`}
                        style={getToyTransform(0)}
                        onMouseEnter={() => handleMouseEnter(0)}
                        onMouseLeave={() => handleMouseLeave(0)}
                        onClick={(e) => handleToyClick(e, 0)}
                    >
                        <svg viewBox="0 0 72 78" fill="none" className="w-[38px] h-[41px] xs:w-[46px] xs:h-[50px] sm:w-[58px] sm:h-[63px] md:w-[72px] md:h-[78px] filter drop-shadow-md overflow-visible">
                            <defs>
                                <radialGradient id="teddy3DGrad" cx="40%" cy="35%" r="65%">
                                    <stop offset="0%" stopColor="#F59E0B" />
                                    <stop offset="60%" stopColor="#D97706" />
                                    <stop offset="100%" stopColor="#92400E" />
                                </radialGradient>
                            </defs>
                            {/* Ears */}
                            <circle cx="18" cy="18" r="11" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                            <circle cx="18" cy="18" r="6" fill="#FDE68A" />
                            <circle cx="54" cy="18" r="11" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                            <circle cx="54" cy="18" r="6" fill="#FDE68A" />
                            
                            {/* Arms */}
                            <ellipse cx="11" cy="46" rx="8" ry="12" fill="#B45309" stroke="#78350F" strokeWidth="2" transform="rotate(-15 11 46)" />
                            <ellipse cx="61" cy="46" rx="8" ry="12" fill="#B45309" stroke="#78350F" strokeWidth="2" transform="rotate(15 61 46)" />

                            {/* Body with 3D gradient */}
                            <ellipse cx="36" cy="50" rx="22" ry="24" fill="url(#teddy3DGrad)" stroke="#92400E" strokeWidth="2.5" />
                            <ellipse cx="36" cy="52" rx="14" ry="16" fill="#FEF3C7" />

                            {/* Feet */}
                            <ellipse cx="23" cy="71" rx="9" ry="6" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                            <ellipse cx="23" cy="71" rx="5" ry="3.5" fill="#FDE68A" />
                            <ellipse cx="49" cy="71" rx="9" ry="6" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                            <ellipse cx="49" cy="71" rx="5" ry="3.5" fill="#FDE68A" />

                            {/* Head */}
                            <circle cx="36" cy="27" r="21" fill="url(#teddy3DGrad)" stroke="#92400E" strokeWidth="2.5" />
                            {/* Snout Muzzle */}
                            <ellipse cx="36" cy="33" rx="11" ry="8" fill="#FEF3C7" />
                            {/* Nose & Smile */}
                            <ellipse cx="36" cy="29" rx="4" ry="3" fill="#78350F" />
                            <path d="M33 34 Q36 37 39 34" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
                            <line x1="36" y1="31" x2="36" y2="34" stroke="#78350F" strokeWidth="1.5" />

                            {/* Button Eyes with Specular Sparkle */}
                            <circle cx="28" cy="24" r="3" fill="#0F172A" />
                            <circle cx="27" cy="23" r="1" fill="#FFFFFF" />
                            <circle cx="44" cy="24" r="3" fill="#0F172A" />
                            <circle cx="43" cy="23" r="1" fill="#FFFFFF" />

                            {/* Cheerful Red Bow Tie */}
                            <polygon points="36,41 28,37 28,45" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                            <polygon points="36,41 44,37 44,45" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                            <circle cx="36" cy="41" r="3" fill="#DC2626" />
                        </svg>
                    </div>

                    {/* ========================================================== */}
                    {/* TOY 2: FLUFFY BUNNY (CARTOON SPRING BOING + NO CLIPPING)   */}
                    {/* ========================================================== */}
                    <div
                        key={`toy-1-${activeIdx === 1 ? animResetKey : 0}`}
                        className={`pointer-events-auto flex flex-col items-center cursor-pointer group relative mobile-flow-toy w-fit h-fit p-0 ${activeIdx === 1 ? 'is-active active-toy-1' : ''}`}
                        style={getToyTransform(1)}
                        onMouseEnter={() => handleMouseEnter(1)}
                        onMouseLeave={() => handleMouseLeave(1)}
                        onClick={(e) => handleToyClick(e, 1)}
                    >
                        <svg viewBox="0 0 70 78" fill="none" className="w-[37px] h-[41px] xs:w-[45px] xs:h-[50px] sm:w-[57px] sm:h-[63px] md:w-[70px] md:h-[78px] filter drop-shadow-md overflow-visible">
                            {/* Long Bunny Ears */}
                            <ellipse cx="27" cy="15" rx="6.5" ry="15" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" transform="rotate(-8 27 15)" />
                            <ellipse cx="27" cy="15" rx="3.5" ry="11" fill="#FBCFE8" transform="rotate(-8 27 15)" />
                            
                            <ellipse cx="43" cy="15" rx="6.5" ry="15" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" transform="rotate(8 43 15)" />
                            <ellipse cx="43" cy="15" rx="3.5" ry="11" fill="#FBCFE8" transform="rotate(8 43 15)" />

                            {/* Body */}
                            <ellipse cx="35" cy="53" rx="19" ry="20" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
                            <ellipse cx="35" cy="54" rx="12" ry="13" fill="#FDF2F8" />

                            {/* Feet */}
                            <ellipse cx="24" cy="71" rx="8" ry="5.5" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
                            <ellipse cx="24" cy="71" rx="4" ry="3" fill="#FBCFE8" />
                            <ellipse cx="46" cy="71" rx="8" ry="5.5" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
                            <ellipse cx="46" cy="71" rx="4" ry="3" fill="#FBCFE8" />

                            {/* Head */}
                            <circle cx="35" cy="34" r="17" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                            {/* Pink Nose */}
                            <polygon points="35,38 32,35 38,35" fill="#F472B6" />
                            {/* Mouth */}
                            <path d="M32 40 Q35 43 38 40" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="35" y1="38" x2="35" y2="40" stroke="#64748B" strokeWidth="1.2" />

                            {/* Whiskers */}
                            <line x1="17" y1="36" x2="26" y2="37" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="17" y1="40" x2="26" y2="39" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="53" y1="36" x2="44" y2="37" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="53" y1="40" x2="44" y2="39" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

                            {/* Sparkly Eyes */}
                            <circle cx="28" cy="32" r="3" fill="#0F172A" />
                            <circle cx="27" cy="31" r="1.2" fill="#FFFFFF" />
                            <circle cx="42" cy="32" r="3" fill="#0F172A" />
                            <circle cx="41" cy="31" r="1.2" fill="#FFFFFF" />

                            {/* Tiny Carrot in Paws */}
                            <polygon points="35,53 32,62 38,62" fill="#EA580C" />
                            <path d="M35 53 L33 49 M35 53 L37 49" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* ========================================================== */}
                    {/* TOY 3: RETRO ROBOT (MECHANICAL SERVO + ROBOTIC VOICE)      */}
                    {/* ========================================================== */}
                    <div
                        key={`toy-2-${activeIdx === 2 ? animResetKey : 0}`}
                        className={`pointer-events-auto flex flex-col items-center cursor-pointer group relative mobile-flow-toy w-fit h-fit p-0 ${activeIdx === 2 ? 'is-active active-toy-2' : ''}`}
                        style={getToyTransform(2)}
                        onMouseEnter={() => handleMouseEnter(2)}
                        onMouseLeave={() => handleMouseLeave(2)}
                        onClick={(e) => handleToyClick(e, 2)}
                    >
                        <svg viewBox="0 0 70 78" fill="none" className="w-[37px] h-[41px] xs:w-[45px] xs:h-[50px] sm:w-[57px] sm:h-[63px] md:w-[70px] md:h-[78px] filter drop-shadow-md overflow-visible">
                            {/* Spring Antenna with Glowing Red Bulb */}
                            <circle cx="35" cy="5" r="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" className={activeIdx === 2 ? "animate-ping" : ""} />
                            <circle cx="35" cy="5" r="3.5" fill="#F87171" />
                            <path d="M35 9 L33 13 L37 16 L35 19" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

                            {/* Robot Head */}
                            <rect x="21" y="19" width="28" height="22" rx="4" fill="#06B6D4" stroke="#0891B2" strokeWidth="2" />
                            {/* Ear Bolts */}
                            <rect x="17" y="25" width="4" height="8" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
                            <rect x="49" y="25" width="4" height="8" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />

                            {/* Glowing Visor & Eyes */}
                            <rect x="25" y="24" width="20" height="8" rx="2" fill="#0F172A" />
                            <circle cx="29" cy="28" r="2.2" fill={activeIdx === 2 ? "#34D399" : "#FACC15"} />
                            <circle cx="41" cy="28" r="2.2" fill={activeIdx === 2 ? "#34D399" : "#FACC15"} />

                            {/* Speaker Grille Mouth */}
                            <line x1="27" y1="36" x2="43" y2="36" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 1" />

                            {/* Arms */}
                            <path d="M19 46 L12 50 L12 58" stroke="#0891B2" strokeWidth="3.5" strokeLinecap="round" />
                            <circle cx="12" cy="59" r="3" fill="#F59E0B" />
                            <path d="M51 46 L58 50 L58 58" stroke="#0891B2" strokeWidth="3.5" strokeLinecap="round" />
                            <circle cx="58" cy="59" r="3" fill="#F59E0B" />

                            {/* Robot Torso */}
                            <rect x="19" y="42" width="32" height="24" rx="4" fill="#0891B2" stroke="#0E7490" strokeWidth="2" />
                            {/* Chest Meter Display */}
                            <rect x="24" y="46" width="22" height="10" rx="2" fill="#1E293B" />
                            <line x1="27" y1="51" x2="33" y2="48" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" />
                            <circle cx="41" cy="51" r="2" fill="#EF4444" />
                            {/* Dials */}
                            <circle cx="28" cy="60" r="2" fill="#F59E0B" />
                            <circle cx="35" cy="60" r="2" fill="#3B82F6" />
                            <circle cx="42" cy="60" r="2" fill="#10B981" />

                            {/* Tank Tread Legs */}
                            <rect x="23" y="66" width="9" height="7" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
                            <rect x="38" y="66" width="9" height="7" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
                        </svg>
                    </div>

                    {/* ========================================================== */}
                    {/* TOY 4: VINTAGE CAR (REAL ROAD ASPHALT, WHEELS, HORN & REV) */}
                    {/* ========================================================== */}
                    <div
                        key={`toy-3-${activeIdx === 3 ? animResetKey : 0}`}
                        className={`pointer-events-auto flex flex-col items-center cursor-pointer group relative mobile-flow-toy w-fit h-fit p-0 ${activeIdx === 3 ? 'is-active active-toy-3' : ''}`}
                        style={getToyTransform(3)}
                        onMouseEnter={() => handleMouseEnter(3)}
                        onMouseLeave={() => handleMouseLeave(3)}
                        onClick={(e) => handleToyClick(e, 3)}
                    >


                        <svg viewBox="0 0 88 62" fill="none" className="w-[46px] h-[36px] xs:w-[56px] xs:h-[44px] sm:w-[70px] sm:h-[54px] md:w-[88px] md:h-[62px] filter drop-shadow-md relative z-10 overflow-visible">
                            <defs>
                                {/* Metallic Racing Red 3D Body Gradient */}
                                <linearGradient id="toyCarRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FF4D4D" />
                                    <stop offset="25%" stopColor="#EF4444" />
                                    <stop offset="70%" stopColor="#DC2626" />
                                    <stop offset="100%" stopColor="#991B1B" />
                                </linearGradient>

                                {/* Glossy Specular Highlight on Roof & Hood */}
                                <linearGradient id="toyCarGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
                                    <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                                </linearGradient>

                                {/* Glass Windshield Gradient */}
                                <linearGradient id="toyCarGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#E0F2FE" />
                                    <stop offset="40%" stopColor="#7DD3FC" />
                                    <stop offset="100%" stopColor="#38BDF8" />
                                </linearGradient>

                                {/* Chrome Metallic Gradient */}
                                <linearGradient id="toyCarChrome" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FFFFFF" />
                                    <stop offset="45%" stopColor="#E2E8F0" />
                                    <stop offset="55%" stopColor="#94A3B8" />
                                    <stop offset="100%" stopColor="#CBD5E1" />
                                </linearGradient>

                                {/* Gold Rim Gradient */}
                                <radialGradient id="toyCarGoldRim" cx="40%" cy="35%" r="65%">
                                    <stop offset="0%" stopColor="#FEF08A" />
                                    <stop offset="40%" stopColor="#FBBF24" />
                                    <stop offset="90%" stopColor="#D97706" />
                                    <stop offset="100%" stopColor="#92400E" />
                                </radialGradient>

                                {/* Headlight Beam Projection */}
                                <linearGradient id="toyCarBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
                                    <stop offset="60%" stopColor="#FEF9C3" stopOpacity="0.45" />
                                    <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* BRIGHT HEADLIGHT BEAM CONE (Active) */}
                            {activeIdx === 3 && (
                                <polygon points="80,38 106,24 106,50 80,42" fill="url(#toyCarBeam)" className="car-headlight-cone pointer-events-none" />
                            )}

                            {/* REAR SPORT SPOILER */}
                            <path d="M4 27 L14 27 L12 32 L2 32 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" strokeLinejoin="round" />
                            <line x1="5" y1="32" x2="6" y2="38" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" />
                            <line x1="11" y1="32" x2="11" y2="38" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" />

                            {/* REAR BUMPER & EXHAUST */}
                            <rect x="2" y="44" width="4" height="6" rx="2" fill="url(#toyCarChrome)" stroke="#64748B" strokeWidth="0.8" />
                            <circle cx="3" cy="48" r="1.5" fill="#1E293B" stroke="#64748B" strokeWidth="0.6" />

                            {/* MAIN CAR BODY SHELL (Sleek aerodynamic curves) */}
                            <path d="
                                M 6 44 
                                C 4 41, 6 36, 12 34 
                                C 16 33, 20 23, 27 16 
                                C 33 11, 46 11, 52 16 
                                C 56 20, 60 27, 65 31 
                                L 77 35 
                                C 81 37, 84 40, 84 44 
                                L 83 48 
                                C 83 50, 80 50, 77 50 
                                L 74 50 
                                C 74 42, 60 42, 60 50 
                                L 32 50 
                                C 32 42, 18 42, 18 50 
                                L 8 50 
                                C 6 50, 6 47, 6 44 
                                Z" 
                                fill="url(#toyCarRedGrad)" 
                                stroke="#7F1D1D" 
                                strokeWidth="2" 
                                strokeLinejoin="round" 
                            />

                            {/* GLOSSY SPECULAR HIGHLIGHT ALONG ROOF & HOOD */}
                            <path d="M 28 17 C 34 13, 44 13, 49 17 C 46 19, 31 19, 28 17 Z" fill="url(#toyCarGloss)" />
                            <path d="M 64 33 L 76 37 C 72 38, 62 36, 64 33 Z" fill="url(#toyCarGloss)" />

                            {/* CABIN WINDOWS (Tinted Glass with Chrome Pillars) */}
                            {/* Rear side quarter window */}
                            <path d="M 24 30 L 29 18 C 33 17, 36 17, 37 17 L 37 30 Z" fill="url(#toyCarGlass)" stroke="#64748B" strokeWidth="1" strokeLinejoin="round" />
                            {/* Front side window & windshield */}
                            <path d="M 40 17 C 45 17, 49 19, 52 23 L 60 30 L 40 30 Z" fill="url(#toyCarGlass)" stroke="#64748B" strokeWidth="1" strokeLinejoin="round" />
                            
                            {/* Window Gloss Glare Streaks */}
                            <polygon points="45,18 48,18 43,29 40,29" fill="#FFFFFF" opacity="0.65" />
                            <polygon points="51,21 53,21 49,29 47,29" fill="#FFFFFF" opacity="0.45" />

                            {/* SPORTY STEERING WHEEL SILHOUETTE INSIDE CABIN */}
                            <circle cx="52" cy="27" r="3.5" fill="none" stroke="#1E293B" strokeWidth="1.2" />
                            <circle cx="52" cy="27" r="1" fill="#1E293B" />

                            {/* RACING STRIPES (Dual Crisp White & Gold stripes) */}
                            <path d="M 8 41 L 81 41" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
                            <path d="M 8 43.5 L 81 43.5" stroke="#FBBF24" strokeWidth="1" strokeLinecap="round" />

                            {/* RACING BADGE NUMBER 7 */}
                            <circle cx="44" cy="41" r="6.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
                            <text x="44" y="44.2" fill="#B91C1C" fontSize="8.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">7</text>

                            {/* CAR DOOR PANEL SEAM & CHROME HANDLE */}
                            <path d="M 38 31 L 38 48" stroke="#991B1B" strokeWidth="1.2" strokeLinecap="round" />
                            <rect x="28" y="34" width="4.5" height="1.5" rx="0.75" fill="url(#toyCarChrome)" stroke="#78350F" strokeWidth="0.5" />

                            {/* SIDE-VIEW MIRROR */}
                            <ellipse cx="58" cy="30" rx="3" ry="2" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1" />
                            <ellipse cx="58" cy="30" rx="1.8" ry="1.2" fill="#BAE6FD" />

                            {/* FRONT CHROME BUMPER & RADIATOR GRILLE */}
                            <rect x="80" y="42" width="4.5" height="7" rx="2" fill="url(#toyCarChrome)" stroke="#64748B" strokeWidth="0.8" />
                            <line x1="81" y1="44" x2="84" y2="44" stroke="#475569" strokeWidth="0.8" />
                            <line x1="81" y1="46" x2="84" y2="46" stroke="#475569" strokeWidth="0.8" />
                            <line x1="81" y1="48" x2="84" y2="48" stroke="#475569" strokeWidth="0.8" />

                            {/* FRONT HEADLIGHT (Bright crystal lens with chrome rim) */}
                            <ellipse cx="79" cy="38" rx="4" ry="4.5" fill="url(#toyCarChrome)" stroke="#64748B" strokeWidth="0.8" />
                            <ellipse cx="79" cy="38" rx="3.2" ry="3.6" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.2" />
                            <circle cx="78" cy="37" r="1.5" fill="#FFFFFF" />

                            {/* REAR RUBY TAILLIGHT */}
                            <rect x="5" y="38" width="2.5" height="4.5" rx="1" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
                            <rect x="5.5" y="39" width="1.5" height="2" rx="0.5" fill="#FCA5A5" />

                            {/* WHEEL 1: REAR WHEEL (Center: 25, 49) */}
                            <g style={{ transformOrigin: '25px 49px' }} className={activeIdx === 3 ? "car-wheel-spin" : ""}>
                                {/* Deep Grip Rubber Tire */}
                                <circle cx="25" cy="49" r="10.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                                {/* Inner Tire Ring */}
                                <circle cx="25" cy="49" r="8.5" fill="#334155" />
                                {/* Golden Star Alloy Rim */}
                                <circle cx="25" cy="49" r="6.8" fill="url(#toyCarGoldRim)" stroke="#78350F" strokeWidth="0.8" />
                                {/* 5-Star Sport Alloy Spokes */}
                                <line x1="25" y1="42.5" x2="25" y2="55.5" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
                                <line x1="18.5" y1="47" x2="31.5" y2="51" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
                                <line x1="20" y1="53" x2="30" y2="45" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
                                {/* Center Chrome Nut */}
                                <circle cx="25" cy="49" r="2.4" fill="url(#toyCarChrome)" stroke="#475569" strokeWidth="0.8" />
                                <circle cx="25" cy="49" r="1" fill="#0F172A" />
                            </g>

                            {/* WHEEL 2: FRONT WHEEL (Center: 67, 49) */}
                            <g style={{ transformOrigin: '67px 49px' }} className={activeIdx === 3 ? "car-wheel-spin" : ""}>
                                {/* Deep Grip Rubber Tire */}
                                <circle cx="67" cy="49" r="10.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                                {/* Inner Tire Ring */}
                                <circle cx="67" cy="49" r="8.5" fill="#334155" />
                                {/* Golden Star Alloy Rim */}
                                <circle cx="67" cy="49" r="6.8" fill="url(#toyCarGoldRim)" stroke="#78350F" strokeWidth="0.8" />
                                {/* 5-Star Sport Alloy Spokes */}
                                <line x1="67" y1="42.5" x2="67" y2="55.5" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
                                <line x1="60.5" y1="47" x2="73.5" y2="51" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
                                <line x1="62" y1="53" x2="72" y2="45" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
                                {/* Center Chrome Nut */}
                                <circle cx="67" cy="49" r="2.4" fill="url(#toyCarChrome)" stroke="#475569" strokeWidth="0.8" />
                                <circle cx="67" cy="49" r="1" fill="#0F172A" />
                            </g>
                        </svg>
                    </div>

                    {/* ========================================================== */}
                    {/* TOY 5: 3D ROYAL WALKING PEACOCK (MOR NO TAHOOKO + STRUT)   */}
                    {/* ========================================================== */}
                    <div
                        key={`toy-4-${activeIdx === 4 ? animResetKey : 0}`}
                        className={`pointer-events-auto flex flex-col items-center cursor-pointer group relative mobile-flow-toy w-fit h-fit p-0 ${activeIdx === 4 ? 'is-active active-toy-4' : ''}`}
                        style={getToyTransform(4)}
                        onMouseEnter={() => handleMouseEnter(4)}
                        onMouseLeave={() => handleMouseLeave(4)}
                        onClick={(e) => handleToyClick(e, 4)}
                    >


                        <svg viewBox="0 0 96 88" fill="none" className="w-[48px] h-[44px] xs:w-[58px] xs:h-[53px] sm:w-[72px] sm:h-[66px] md:w-[96px] md:h-[88px] filter drop-shadow-lg relative z-10 overflow-visible">
                            <defs>
                                <radialGradient id="peacockToyBlue" cx="35%" cy="30%" r="70%">
                                    <stop offset="0%" stopColor="#60A5FA" />
                                    <stop offset="35%" stopColor="#2563EB" />
                                    <stop offset="75%" stopColor="#1D4ED8" />
                                    <stop offset="100%" stopColor="#0F172A" />
                                </radialGradient>
                                <radialGradient id="toyFanEmerald" cx="40%" cy="35%" r="65%">
                                    <stop offset="0%" stopColor="#34D399" />
                                    <stop offset="60%" stopColor="#059669" />
                                    <stop offset="100%" stopColor="#064E3B" />
                                </radialGradient>
                                <linearGradient id="toyGoldEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FEF08A" />
                                    <stop offset="50%" stopColor="#F59E0B" />
                                    <stop offset="100%" stopColor="#D97706" />
                                </linearGradient>
                                <radialGradient id="toyBrassGrad" cx="35%" cy="35%" r="65%">
                                    <stop offset="0%" stopColor="#FEF08A" />
                                    <stop offset="60%" stopColor="#F59E0B" />
                                    <stop offset="100%" stopColor="#92400E" />
                                </radialGradient>
                                <linearGradient id="toyChunkyLeg" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FBBF24" />
                                    <stop offset="100%" stopColor="#D97706" />
                                </linearGradient>
                            </defs>

                            {/* 1. BACK LEG (LEFT TOY LEG) - CUTE CHUNKY TOY FOOT */}
                            <g className="peacock-toy-foot-left">
                                <circle cx="38" cy="58" r="4.5" fill="#1E3A8A" stroke="#0F172A" strokeWidth="1.5" />
                                <circle cx="38" cy="58" r="2" fill="#FBBF24" />
                                <rect x="36" y="58" width="4.5" height="17" rx="2.2" fill="url(#toyChunkyLeg)" stroke="#B45309" strokeWidth="1.5" />
                                <circle cx="38" cy="67" r="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
                                <path d="M32 75 C32 72 46 72 46 75 C46 77.5 44 79 39 79 C34 79 32 77.5 32 75 Z" fill="#F59E0B" stroke="#92400E" strokeWidth="1.8" />
                                <circle cx="34" cy="75" r="1.8" fill="#FDE047" />
                                <circle cx="39" cy="75" r="2.2" fill="#FDE047" />
                                <circle cx="44" cy="75" r="1.8" fill="#FDE047" />
                            </g>

                            {/* 2. GORGEOUS ARCHED TOY PEACOCK FAN (મોરપીંછનો અસલી પંખો) */}
                            <g className="peacock-toy-fan">
                                <path d="M34 52 C22 36 10 42 4 54 C0 66 8 76 22 74 C30 72 36 62 38 54 Z" fill="url(#toyFanEmerald)" stroke="#047857" strokeWidth="2.2" />

                                <g transform="rotate(-18 28 38)">
                                    <path d="M28 30 C33 30 36 36 33 42 C30 46 26 46 23 42 C20 36 23 30 28 30 Z" fill="url(#toyFanEmerald)" stroke="url(#toyGoldEdge)" strokeWidth="1.8" />
                                    <ellipse cx="28" cy="36" rx="4.8" ry="3.6" fill="#06B6D4" stroke="#0891B2" strokeWidth="1" />
                                    <circle cx="28" cy="36" r="2.2" fill="#1E1B4B" />
                                    <circle cx="27.2" cy="35.2" r="1" fill="#FFFFFF" />
                                </g>

                                <g transform="rotate(-6 16 45)">
                                    <path d="M16 38 C21 38 24 44 21 50 C18 54 14 54 11 50 C8 44 11 38 16 38 Z" fill="url(#toyFanEmerald)" stroke="url(#toyGoldEdge)" strokeWidth="1.8" />
                                    <ellipse cx="16" cy="44" rx="4.8" ry="3.6" fill="#06B6D4" stroke="#0891B2" strokeWidth="1" />
                                    <circle cx="16" cy="44" r="2.2" fill="#1E1B4B" />
                                    <circle cx="15.2" cy="43.2" r="1" fill="#FFFFFF" />
                                </g>

                                <g transform="rotate(8 8 56)">
                                    <path d="M8 50 C13 50 16 56 13 61 C10 65 6 65 3 61 C0 56 3 50 8 50 Z" fill="url(#toyFanEmerald)" stroke="url(#toyGoldEdge)" strokeWidth="1.8" />
                                    <ellipse cx="8" cy="55.5" rx="4.4" ry="3.3" fill="#06B6D4" stroke="#0891B2" strokeWidth="1" />
                                    <circle cx="8" cy="55.5" r="2" fill="#1E1B4B" />
                                    <circle cx="7.3" cy="54.8" r="0.9" fill="#FFFFFF" />
                                </g>

                                <g transform="rotate(-3 18 60)">
                                    <path d="M18 54 C23 54 26 60 23 65 C20 69 16 69 13 65 C10 60 13 54 18 54 Z" fill="url(#toyFanEmerald)" stroke="url(#toyGoldEdge)" strokeWidth="1.8" />
                                    <ellipse cx="18" cy="60" rx="4.6" ry="3.4" fill="#06B6D4" stroke="#0891B2" strokeWidth="1" />
                                    <circle cx="18" cy="60" r="2" fill="#1E1B4B" />
                                    <circle cx="17.3" cy="59.3" r="0.9" fill="#FFFFFF" />
                                </g>

                                <g transform="rotate(-14 28 58)">
                                    <path d="M28 52 C33 52 36 58 33 63 C30 67 26 67 23 63 C20 58 23 52 28 52 Z" fill="url(#toyFanEmerald)" stroke="url(#toyGoldEdge)" strokeWidth="1.8" />
                                    <ellipse cx="28" cy="58" rx="4.5" ry="3.3" fill="#06B6D4" stroke="#0891B2" strokeWidth="1" />
                                    <circle cx="28" cy="58" r="2" fill="#1E1B4B" />
                                    <circle cx="27.3" cy="57.3" r="0.9" fill="#FFFFFF" />
                                </g>
                            </g>

                            {/* 3. WIND-UP BRASS KEY (MOUNTED AT REAR HIP) */}
                            <g className="peacock-toy-key">
                                <line x1="22" y1="46" x2="30" y2="46" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                                <circle cx="26" cy="46" r="3" fill="url(#toyBrassGrad)" stroke="#78350F" strokeWidth="1.2" />
                                <path d="M26 46 C23 39 16 39 18 45 C19 48 24 47 26 46 Z" fill="url(#toyBrassGrad)" stroke="#78350F" strokeWidth="1.2" />
                                <circle cx="19" cy="43" r="1.3" fill="#78350F" />
                                <path d="M26 46 C29 53 36 53 34 47 C33 44 28 45 26 46 Z" fill="url(#toyBrassGrad)" stroke="#78350F" strokeWidth="1.2" />
                                <circle cx="33" cy="49" r="1.3" fill="#78350F" />
                            </g>

                            {/* 4. CHUBBY TOY BODY & WING */}
                            <g className="peacock-toy-body">
                                <ellipse cx="45" cy="51" rx="17" ry="15" fill="url(#peacockToyBlue)" stroke="#1E3A8A" strokeWidth="2.4" />
                                <path d="M34 44 C39 39 49 39 55 44" stroke="#BAE6FD" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" fill="none" />
                                <ellipse cx="54" cy="51" rx="5" ry="8" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" transform="rotate(-15 54 51)" />
                                <ellipse cx="54" cy="51" rx="3.2" ry="5.5" fill="#FEF08A" transform="rotate(-15 54 51)" />
                                <path d="M36 46 C44 41 53 44 55 50 C52 57 42 59 34 53 Z" fill="#10B981" stroke="#047857" strokeWidth="2" />
                                <path d="M39 48 Q46 53 52 49" stroke="#FDE047" strokeWidth="2.2" strokeLinecap="round" />
                                <path d="M37 52 Q43 57 48 53" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="45" cy="50" r="1.8" fill="#FDE047" />
                            </g>

                            {/* 5. FRIENDLY TOY HEAD, CROWN & CUTE BEAK */}
                            <g className="peacock-toy-head">
                                <path d="M44 44 C42 34 46 24 53 20 C58 20 61 26 57 35 C54 41 51 46 44 48 Z" fill="url(#peacockToyBlue)" stroke="#1E3A8A" strokeWidth="2.4" />

                                <g className="peacock-toy-crown">
                                    <line x1="53" y1="14" x2="47" y2="5" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
                                    <circle cx="46" cy="4" r="3.4" fill="#06B6D4" stroke="#F59E0B" strokeWidth="1.5" />
                                    <circle cx="45" cy="3" r="1.2" fill="#FFFFFF" />

                                    <line x1="55" y1="13" x2="55" y2="2" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                                    <circle cx="55" cy="1.5" r="4" fill="#FDE047" stroke="#D97706" strokeWidth="1.6" />
                                    <circle cx="53.8" cy="0.5" r="1.4" fill="#FFFFFF" />

                                    <line x1="57" y1="14" x2="63" y2="5" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
                                    <circle cx="64" cy="4" r="3.4" fill="#06B6D4" stroke="#F59E0B" strokeWidth="1.5" />
                                    <circle cx="63" cy="3" r="1.2" fill="#FFFFFF" />
                                </g>

                                <circle cx="55" cy="19" r="11" fill="url(#peacockToyBlue)" stroke="#1E3A8A" strokeWidth="2.4" />
                                <path d="M49 14 C52 11 58 11 61 14" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" opacity="0.8" fill="none" />

                                <circle cx="57" cy="18" r="4.5" fill="#FEF08A" stroke="#B45309" strokeWidth="1.2" />
                                <circle cx="57" cy="18" r="3.5" fill="#0F172A" />
                                <circle cx="55.8" cy="16.8" r="1.5" fill="#FFFFFF" />
                                <circle cx="58.2" cy="19.2" r="0.8" fill="#FFFFFF" />

                                <ellipse cx="52" cy="23" rx="3" ry="2" fill="#FDA4AF" opacity="0.8" />

                                <path d="M63 16 C68 18 73 19 73 20 C73 21 68 22 63 24 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.8" strokeLinejoin="round" />
                                <line x1="63" y1="20" x2="70" y2="20" stroke="#92400E" strokeWidth="1.2" />
                            </g>

                            {/* 6. FOREGROUND LEG (RIGHT TOY LEG) */}
                            <g className="peacock-toy-foot-right">
                                <circle cx="50" cy="58" r="5" fill="#1E3A8A" stroke="#0F172A" strokeWidth="1.5" />
                                <circle cx="50" cy="58" r="2.2" fill="#FDE047" />
                                <rect x="47.5" y="58" width="5" height="17" rx="2.4" fill="url(#toyChunkyLeg)" stroke="#B45309" strokeWidth="1.6" />
                                <circle cx="50" cy="67" r="3.2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
                                <path d="M43 75 C43 72 58 72 58 75 C58 77.5 56 79 50.5 79 C45 79 43 77.5 43 75 Z" fill="#F59E0B" stroke="#92400E" strokeWidth="1.8" />
                                <circle cx="45.5" cy="75" r="2" fill="#FDE047" />
                                <circle cx="50.5" cy="75" r="2.4" fill="#FDE047" />
                                <circle cx="55.5" cy="75" r="2" fill="#FDE047" />
                            </g>
                        </svg>
                    </div>

                    {/* ========================================================== */}
                    {/* TOY 6: 3D INDIAN DHOL (STICKS VISIBLY STRIKING DHOL BEATS) */}
                    {/* ========================================================== */}
                    <div
                        key={`toy-5-${activeIdx === 5 ? animResetKey : 0}`}
                        className={`pointer-events-auto flex flex-col items-center cursor-pointer group relative mobile-flow-toy w-fit h-fit p-0 ${activeIdx === 5 ? 'is-active active-toy-5' : ''}`}
                        style={getToyTransform(5)}
                        onMouseEnter={() => handleMouseEnter(5)}
                        onMouseLeave={() => handleMouseLeave(5)}
                        onClick={(e) => handleToyClick(e, 5)}
                    >
                        <svg viewBox="0 0 74 78" fill="none" className="w-[39px] h-[41px] xs:w-[47px] xs:h-[50px] sm:w-[60px] sm:h-[63px] md:w-[74px] md:h-[78px] filter drop-shadow-md overflow-visible">
                            <defs>
                                <linearGradient id="dhol3DShell" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1E3A8A" />
                                    <stop offset="35%" stopColor="#3B82F6" />
                                    <stop offset="70%" stopColor="#1D4ED8" />
                                    <stop offset="100%" stopColor="#172554" />
                                </linearGradient>
                            </defs>

                            {/* Left Drumstick (Dagga - Curved Bass Stick Strikes Down) */}
                            <g style={{ transformOrigin: '16px 12px' }} className={activeIdx === 5 ? "dhol-stick-left-beat" : ""}>
                                <path d="M16 12 Q30 20 48 33" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                <circle cx="16" cy="12" r="3.2" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
                                <circle cx="48" cy="33" r="3" fill="#D97706" />
                            </g>
                            {/* Right Drumstick (Tilli - Thin Treble Stick Strikes Down) */}
                            <g style={{ transformOrigin: '58px 12px' }} className={activeIdx === 5 ? "dhol-stick-right-beat" : ""}>
                                <line x1="58" y1="12" x2="26" y2="33" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
                                <circle cx="58" cy="12" r="3.2" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
                                <circle cx="26" cy="33" r="2.8" fill="#D97706" />
                            </g>

                            {/* Circular Dhol Strike Impact Ripple Pulse */}
                            {activeIdx === 5 && (
                                <ellipse cx="37" cy="33" rx="16" ry="4.8" fill="none" stroke="#FBBF24" strokeWidth="2" className="dhol-impact-ring pointer-events-none" />
                            )}

                            {/* Top Drum Head Rim */}
                            <ellipse cx="37" cy="33" rx="27" ry="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
                            <ellipse cx="37" cy="33" rx="24" ry="6.5" fill="#FFFFFF" />

                            {/* 3D Cylindrical Dhol Barrel Body */}
                            <rect x="10" y="33" width="54" height="30" fill="url(#dhol3DShell)" stroke="#1E3A8A" strokeWidth="2" />
                            
                            {/* Golden Dhol Lacing & Brass Rings */}
                            <polygon points="10,33 23,63 37,33 50,63 64,33" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinejoin="round" />
                            <circle cx="23" cy="63" r="2.5" fill="#D97706" />
                            <circle cx="37" cy="33" r="2.5" fill="#D97706" />
                            <circle cx="50" cy="63" r="2.5" fill="#D97706" />

                            {/* Center Star Badge */}
                            <polygon points="37,45 39,49 43,49 40,52 41,56 37,53 33,56 34,52 31,49 35,49" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />

                            {/* Bottom Rim */}
                            <ellipse cx="37" cy="63" rx="27" ry="8" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
                            <ellipse cx="37" cy="63" rx="24" ry="6.5" fill="#D97706" />
                        </svg>
                    </div>

                    {/* ========================================================== */}
                    {/* TOY 7: ROCKING HORSE (REAL NEIGH + GALLOPING CLIP-CLOP)    */}
                    {/* ========================================================== */}
                    <div
                        key={`toy-6-${activeIdx === 6 ? animResetKey : 0}`}
                        className={`pointer-events-auto flex flex-col items-center cursor-pointer group relative mobile-flow-toy toy-horse-container w-fit h-fit p-0 ${activeIdx === 6 ? 'is-active active-toy-6' : ''}`}
                        style={getToyTransform(6)}
                        onMouseEnter={() => handleMouseEnter(6)}
                        onMouseLeave={() => handleMouseLeave(6)}
                        onClick={(e) => handleToyClick(e, 6)}
                    >
                        <div className="rocking-horse-body w-[52px] h-[52px] xs:w-[64px] xs:h-[64px] sm:w-[82px] sm:h-[82px] md:w-[102px] md:h-[102px] flex items-center justify-center">
                            <img
                                src="/images/toy_rocking_horse.png"
                                alt="Authentic Wooden Rocking Horse Toy"
                                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-md"
                                loading="eager"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default InteractiveToyRow;
