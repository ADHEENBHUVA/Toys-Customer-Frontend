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
    '/sounds/bunny.ogg',    // 1: Bunny (Real Cartoon Boing Spring Bounce)
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

// Procedural Web Audio API sound synthesizers (100% reliable instant fallback)
const playSynthToySound = (index, ctx, duration = 4.0) => {
    if (!ctx) return;
    try {
        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.85, now);
        masterGain.connect(ctx.destination);

        if (index === 3) {
            // CAR: Clean Purring Motor Rev + Crisp Dual-Tone Horn (Zero static/noise, velvety clean)
            // Low-pass filtered warm engine purr
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(260, now);
            filter.frequency.exponentialRampToValueAtTime(420, now + 1.2);
            filter.frequency.exponentialRampToValueAtTime(220, now + duration);

            // Engine fundamental warm sine oscillator
            const oscEng = ctx.createOscillator();
            const gainEng = ctx.createGain();
            oscEng.type = 'triangle';
            oscEng.frequency.setValueAtTime(75, now);
            oscEng.frequency.exponentialRampToValueAtTime(160, now + 1.2);
            oscEng.frequency.exponentialRampToValueAtTime(90, now + duration);

            gainEng.gain.setValueAtTime(0.01, now);
            gainEng.gain.linearRampToValueAtTime(0.32, now + 0.1);
            gainEng.gain.linearRampToValueAtTime(0.38, now + 1.2);
            gainEng.gain.exponentialRampToValueAtTime(0.01, now + duration);

            // Sub-bass warm purr
            const oscSub = ctx.createOscillator();
            const gainSub = ctx.createGain();
            oscSub.type = 'sine';
            oscSub.frequency.setValueAtTime(37.5, now);
            oscSub.frequency.exponentialRampToValueAtTime(80, now + 1.2);
            gainSub.gain.setValueAtTime(0.22, now);
            gainSub.gain.exponentialRampToValueAtTime(0.01, now + duration);

            oscEng.connect(filter);
            oscSub.connect(filter);
            filter.connect(gainEng);
            gainEng.connect(masterGain);

            oscEng.start(now);
            oscSub.start(now);
            oscEng.stop(now + duration);
            oscSub.stop(now + duration);

            // Melodic Crisp Dual-Tone Horn (Beep-Beep at C5 523Hz + E5 659Hz)
            [1.8, 2.3].forEach((delay) => {
                const horn1 = ctx.createOscillator();
                const horn2 = ctx.createOscillator();
                const hornGain = ctx.createGain();
                horn1.type = 'sine';
                horn2.type = 'sine';
                horn1.frequency.setValueAtTime(523.25, now + delay);
                horn2.frequency.setValueAtTime(659.25, now + delay);

                hornGain.gain.setValueAtTime(0.01, now + delay);
                hornGain.gain.linearRampToValueAtTime(0.35, now + delay + 0.03);
                hornGain.gain.setValueAtTime(0.35, now + delay + 0.22);
                hornGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.28);

                horn1.connect(hornGain);
                horn2.connect(hornGain);
                hornGain.connect(masterGain);

                horn1.start(now + delay);
                horn2.start(now + delay);
                horn1.stop(now + delay + 0.32);
                horn2.stop(now + delay + 0.32);
            });
        } else if (index === 5) {
            // DHOL: Indian Dhol Beats (Bass Dha + Treble Ta)
            const dholBeats = [0.0, 0.4, 0.7, 1.1, 1.4, 1.8, 2.1, 2.5, 2.9, 3.3];
            dholBeats.forEach((tOffset, i) => {
                const bTime = now + tOffset;
                // Bass Dha Punch (65Hz sub-bass punch)
                const bassOsc = ctx.createOscillator();
                const bassGain = ctx.createGain();
                bassOsc.type = 'sine';
                bassOsc.frequency.setValueAtTime(120, bTime);
                bassOsc.frequency.exponentialRampToValueAtTime(55, bTime + 0.22);
                bassGain.gain.setValueAtTime(0.8, bTime);
                bassGain.gain.exponentialRampToValueAtTime(0.01, bTime + 0.3);
                bassOsc.connect(bassGain);
                bassGain.connect(masterGain);
                bassOsc.start(bTime);
                bassOsc.stop(bTime + 0.32);

                // Treble Ta Stick Strike
                const stickOsc = ctx.createOscillator();
                const stickGain = ctx.createGain();
                stickOsc.type = 'triangle';
                stickOsc.frequency.setValueAtTime(1250, bTime + (i % 2 === 0 ? 0.02 : 0.18));
                stickGain.gain.setValueAtTime(0.5, bTime + (i % 2 === 0 ? 0.02 : 0.18));
                stickGain.gain.exponentialRampToValueAtTime(0.01, bTime + (i % 2 === 0 ? 0.02 : 0.18) + 0.12);
                stickOsc.connect(stickGain);
                stickGain.connect(masterGain);
                stickOsc.start(bTime + (i % 2 === 0 ? 0.02 : 0.18));
                stickOsc.stop(bTime + (i % 2 === 0 ? 0.02 : 0.18) + 0.14);
            });
        } else if (index === 4) {
            // PEACOCK (MOR): Majestic Indian Peacock Cry (Pee-Hoo! / ટહૂકો)
            // Starts with gentle smooth attack, rich vocal resonance, zero harsh scratch/buzz
            const cries = [0.12, 1.5, 2.9];
            cries.forEach((cOffset, i) => {
                const cTime = now + cOffset;
                const osc = ctx.createOscillator();
                const harm = ctx.createOscillator();
                const gain = ctx.createGain();
                const vibrato = ctx.createOscillator();
                const vibratoGain = ctx.createGain();

                // Gentle sine + warm triangle overtone for authentic natural bird syrinx
                osc.type = 'sine';
                harm.type = 'triangle';

                // Natural subtle vocal throat trill (7.5 Hz, soft 16Hz depth)
                vibrato.frequency.setValueAtTime(7.5, cTime);
                vibratoGain.gain.setValueAtTime(16, cTime);
                vibrato.connect(vibratoGain);
                vibratoGain.connect(osc.frequency);
                vibratoGain.connect(harm.frequency);

                // Characteristic Indian Peacock "Pee-Hoo" frequency arc:
                // Gentle rise (640Hz -> 1220Hz) then graceful falling slide down to 580Hz
                const fBase = i === 1 ? 660 : 640;
                const fPeak = i === 1 ? 1280 : 1200;
                const fEnd = 580;

                osc.frequency.setValueAtTime(fBase, cTime);
                osc.frequency.linearRampToValueAtTime(fPeak, cTime + 0.38);
                osc.frequency.exponentialRampToValueAtTime(fEnd, cTime + 0.95);

                harm.frequency.setValueAtTime(fBase * 2, cTime);
                harm.frequency.linearRampToValueAtTime(fPeak * 2, cTime + 0.38);
                harm.frequency.exponentialRampToValueAtTime(fEnd * 2, cTime + 0.95);

                // Smooth natural envelope: soft 70ms attack -> NO click, NO harsh electronic burst!
                gain.gain.setValueAtTime(0.001, cTime);
                gain.gain.linearRampToValueAtTime(0.65, cTime + 0.08);
                gain.gain.setValueAtTime(0.65, cTime + 0.42);
                gain.gain.exponentialRampToValueAtTime(0.001, cTime + 1.05);

                const harmGain = ctx.createGain();
                harmGain.gain.setValueAtTime(0.25, cTime);

                osc.connect(gain);
                harm.connect(harmGain);
                harmGain.connect(gain);
                gain.connect(masterGain);

                vibrato.start(cTime);
                osc.start(cTime);
                harm.start(cTime);
                vibrato.stop(cTime + 1.1);
                osc.stop(cTime + 1.1);
                harm.stop(cTime + 1.1);
            });
        } else if (index === 6) {
            // HORSE: Galloping Hooves (clip-clop) + Neigh
            const gallops = [0.0, 0.18, 0.5, 0.68, 1.0, 1.18, 1.5, 1.68, 2.0, 2.18, 2.6, 2.78, 3.2, 3.38];
            gallops.forEach((gOffset, i) => {
                const gTime = now + gOffset;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(i % 2 === 0 ? 280 : 210, gTime);
                gain.gain.setValueAtTime(0.65, gTime);
                gain.gain.exponentialRampToValueAtTime(0.01, gTime + 0.1);
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(gTime);
                osc.stop(gTime + 0.11);
            });
            // Neigh sweep
            const neighOsc = ctx.createOscillator();
            const neighGain = ctx.createGain();
            neighOsc.type = 'triangle';
            neighOsc.frequency.setValueAtTime(600, now + 0.2);
            neighOsc.frequency.linearRampToValueAtTime(1100, now + 0.7);
            neighOsc.frequency.linearRampToValueAtTime(550, now + 1.4);
            neighGain.gain.setValueAtTime(0.01, now + 0.2);
            neighGain.gain.linearRampToValueAtTime(0.4, now + 0.6);
            neighGain.gain.linearRampToValueAtTime(0.01, now + 1.4);
            neighOsc.connect(neighGain);
            neighGain.connect(masterGain);
            neighOsc.start(now + 0.2);
            neighOsc.stop(now + 1.45);
        } else if (index === 2) {
            // ROBOT: Sci-Fi Mechanical Servo & Beep Sequence
            const beepFreqs = [520, 659, 783, 1046, 783, 1318, 1046];
            beepFreqs.forEach((freq, idx) => {
                const bTime = now + idx * 0.22;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, bTime);
                gain.gain.setValueAtTime(0.2, bTime);
                gain.gain.exponentialRampToValueAtTime(0.01, bTime + 0.18);
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(bTime);
                osc.stop(bTime + 0.2);
            });
        } else if (index === 1) {
            // BUNNY: Cartoon Spring Boing
            [0.1, 0.9, 1.8, 2.7].forEach((bOffset) => {
                const bTime = now + bOffset;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(180, bTime);
                osc.frequency.exponentialRampToValueAtTime(800, bTime + 0.35);
                gain.gain.setValueAtTime(0.65, bTime);
                gain.gain.exponentialRampToValueAtTime(0.01, bTime + 0.4);
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(bTime);
                osc.stop(bTime + 0.45);
            });
        } else if (index === 0) {
            // TEDDY: Cute Squeaker + Giggle
            [0.1, 0.6, 1.4, 1.9, 2.6].forEach((sOffset) => {
                const sTime = now + sOffset;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(700, sTime);
                osc.frequency.linearRampToValueAtTime(1350, sTime + 0.15);
                osc.frequency.linearRampToValueAtTime(900, sTime + 0.25);
                gain.gain.setValueAtTime(0.5, sTime);
                gain.gain.exponentialRampToValueAtTime(0.01, sTime + 0.3);
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(sTime);
                osc.stop(sTime + 0.32);
            });
        }

        return masterGain;
    } catch (e) {
        console.warn('Synth sound fallback error:', e);
        return null;
    }
};

const InteractiveToyRow = () => {
    const [activeIdx, setActiveIdx] = useState(null);
    const sectionRef = useRef(null);
    const activeTimerRef = useRef(null);
    const currentAudioRef = useRef(null);
    const activeSynthRef = useRef(null);
    const preloadedAudiosRef = useRef([]);

    // Preload HTML5 Audio objects for zero-latency response
    useEffect(() => {
        try {
            preloadedAudiosRef.current = TOY_SOUND_FILES.map((src) => {
                const audio = new Audio(src);
                audio.preload = 'auto';
                audio.volume = 0.95;
                return audio;
            });
        } catch (e) {}

        // Global unlocker listener on any user interaction
        const unlockAudioOnGesture = () => {
            if (!isAudioUnlocked) {
                const ctx = getAudioContext();
                if (ctx) {
                    try {
                        const buffer = ctx.createBuffer(1, 1, 22050);
                        const source = ctx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(ctx.destination);
                        source.start(0);
                        isAudioUnlocked = true;
                    } catch (err) {}
                }
            }
        };

        const events = ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll', 'mousemove'];
        events.forEach((ev) => window.addEventListener(ev, unlockAudioOnGesture, { passive: true, once: false }));

        return () => {
            events.forEach((ev) => window.removeEventListener(ev, unlockAudioOnGesture));
        };
    }, []);

    // Stop currently active toy sound and reset state immediately
    const stopCurrentToy = () => {
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
        if (activeSynthRef.current) {
            try {
                activeSynthRef.current.disconnect();
            } catch (e) {}
            activeSynthRef.current = null;
        }
        setActiveIdx(null);
    };

    // Activate toy with authentic sound effect and 3D action
    const activateToy = (index, forceClick = false) => {
        // Stop any previous sound
        stopCurrentToy();

        setActiveIdx(index);

        // Resume AudioContext
        const ctx = getAudioContext();

        let playedSuccessfully = false;

        // Try preloaded HTML5 Audio first
        try {
            const audio = preloadedAudiosRef.current[index] || new Audio(TOY_SOUND_FILES[index]);
            audio.volume = 0.95;
            audio.currentTime = 0;

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        playedSuccessfully = true;
                        currentAudioRef.current = audio;
                    })
                    .catch((err) => {
                        // If browser autoplay policy blocks hover play, use procedural Web Audio synthesizer!
                        console.log('HTML5 Audio notice, activating procedural synth sound:', err);
                        if (ctx) {
                            activeSynthRef.current = playSynthToySound(index, ctx);
                        }
                    });
            } else {
                currentAudioRef.current = audio;
            }

            audio.onended = () => {
                stopCurrentToy();
            };
        } catch (e) {
            console.error('Audio play error, falling back to synth:', e);
            if (ctx) {
                activeSynthRef.current = playSynthToySound(index, ctx);
            }
        }

        // If from click, also ensure Web Audio is triggered if HTML5 didn't play instantly
        if (forceClick && ctx && !playedSuccessfully) {
            activeSynthRef.current = playSynthToySound(index, ctx);
        }

        // Auto-stop after 5 seconds if mouse remains hovered
        activeTimerRef.current = setTimeout(() => {
            stopCurrentToy();
        }, 5000);
    };

    // When mouse pointer leaves toy: IMMEDIATELY stop sound and return to base
    const handleMouseLeave = () => {
        stopCurrentToy();
    };

    // Single-tap / click on toy: Guaranteed audio trigger
    const handleToyClick = (index) => {
        // Ensure audio context is running
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
        // Force play sound on click
        activateToy(index, true);
    };

    // IntersectionObserver: When scrolled out of mobile screen view, AUTOMATICALLY STOP
    useEffect(() => {
        if (!sectionRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    stopCurrentToy();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(sectionRef.current);
        return () => observer.disconnect();
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
            className="w-full bg-white select-none relative pt-10 sm:pt-14 pb-4 sm:pb-6 overflow-visible"
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
                    transform-origin: 38px 72px;
                    transform-box: view-box;
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
                        transform: rotate(-8deg);
                    }
                    100% {
                        transform: rotate(8deg);
                    }
                }

                @keyframes horseSmoothGallopRock {
                    0% {
                        transform: rotate(-18deg);
                    }
                    100% {
                        transform: rotate(18deg);
                    }
                }
            `}</style>

            {/* 7 TOYS DISPLAY SHELF - FULL WIDTH EDGE TO EDGE, OVERFLOW VISIBLE */}
            <div className="w-full px-3 sm:px-8 md:px-12 lg:px-16 relative overflow-visible">
                <div className="w-full flex items-center justify-between sm:justify-evenly relative z-10 min-h-[125px] sm:min-h-[145px] md:min-h-[160px] pt-4 pb-2 px-1 sm:px-4 overflow-visible">
                    
                    {/* ========================================================== */}
                    {/* TOY 1: CLASSIC CARAMEL TEDDY BEAR (PLUSH SQUEAK + GIGGLE)  */}
                    {/* ========================================================== */}
                    <div
                        className={`flex flex-col items-center cursor-pointer group relative mobile-flow-toy ${activeIdx === 0 ? 'is-active active-toy-0' : ''}`}
                        style={getToyTransform(0)}
                        onMouseEnter={() => activateToy(0)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleToyClick(0)}
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
                        className={`flex flex-col items-center cursor-pointer group relative mobile-flow-toy ${activeIdx === 1 ? 'is-active active-toy-1' : ''}`}
                        style={getToyTransform(1)}
                        onMouseEnter={() => activateToy(1)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleToyClick(1)}
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
                        className={`flex flex-col items-center cursor-pointer group relative mobile-flow-toy ${activeIdx === 2 ? 'is-active active-toy-2' : ''}`}
                        style={getToyTransform(2)}
                        onMouseEnter={() => activateToy(2)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleToyClick(2)}
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
                        className={`flex flex-col items-center cursor-pointer group relative mobile-flow-toy ${activeIdx === 3 ? 'is-active active-toy-3' : ''}`}
                        style={getToyTransform(3)}
                        onMouseEnter={() => activateToy(3)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleToyClick(3)}
                    >
                        {/* Realistic 3D Asphalt Road Strip with Moving Highway Dashes */}
                        {activeIdx === 3 && (
                            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-3.5 bg-slate-900 rounded-full overflow-hidden flex items-center justify-center shadow-lg z-0 pointer-events-none border border-slate-700">
                                <div className="w-full h-1 bg-[repeating-linear-gradient(90deg,#FBBF24_0,#FBBF24_8px,transparent_8px,transparent_16px)] animate-road-drive"></div>
                            </div>
                        )}

                        <svg viewBox="0 0 78 78" fill="none" className="w-[41px] h-[41px] xs:w-[50px] xs:h-[50px] sm:w-[63px] sm:h-[63px] md:w-[78px] md:h-[78px] filter drop-shadow-md relative z-10 overflow-visible">
                            <defs>
                                <linearGradient id="car3DGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#EF4444" />
                                    <stop offset="60%" stopColor="#DC2626" />
                                    <stop offset="100%" stopColor="#991B1B" />
                                </linearGradient>
                            </defs>
                            {/* Driver Mascot (Tiny Bear Silhouette) */}
                            <circle cx="40" cy="30" r="8" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
                            <circle cx="38" cy="28" r="1.5" fill="#0F172A" />
                            <circle cx="35" cy="24" r="3" fill="#B45309" />
                            <circle cx="45" cy="24" r="3" fill="#B45309" />

                            {/* Windshield */}
                            <path d="M46 36 L52 44 L44 44 Z" fill="#BAE6FD" opacity="0.8" stroke="#38BDF8" strokeWidth="1.5" />

                            {/* 3D Curvy Car Body */}
                            <path d="M12 56 C12 46 22 44 32 44 L48 44 C58 44 68 48 70 56 Z" fill="url(#car3DGrad)" stroke="#7F1D1D" strokeWidth="2.5" />
                            <rect x="8" y="55" width="64" height="9" rx="3" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5" />

                            {/* White Racing Stripe */}
                            <path d="M14 53 L68 53" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                            
                            {/* Number 7 Decal */}
                            <circle cx="38" cy="53" r="6" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1" />
                            <text x="38" y="56.5" fill="#B91C1C" fontSize="8" fontWeight="900" textAnchor="middle">7</text>

                            {/* Bright Headlight Beam Cone Projected onto Road */}
                            {activeIdx === 3 && (
                                <polygon points="69,54 88,48 88,62 69,56" fill="#FEF08A" opacity="0.85" className="car-headlight-cone pointer-events-none" />
                            )}

                            {/* Front Headlight */}
                            <circle cx="69" cy="55" r="3.5" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" />

                            {/* Front Bumper Grill */}
                            <rect x="69" y="58" width="4" height="4" rx="1" fill="#94A3B8" />

                            {/* Beechwood Wheels (Spokes Visibly Spin Rapidly) */}
                            <g style={{ transformOrigin: '23px 65px' }} className={activeIdx === 3 ? "car-wheel-spin" : ""}>
                                <circle cx="23" cy="65" r="9" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
                                <circle cx="23" cy="65" r="4.5" fill="#1E293B" />
                                <line x1="23" y1="56" x2="23" y2="74" stroke="#B45309" strokeWidth="1.2" />
                                <line x1="14" y1="65" x2="32" y2="65" stroke="#B45309" strokeWidth="1.2" />
                                <circle cx="23" cy="65" r="1.8" fill="#FFFFFF" />
                            </g>
                            <g style={{ transformOrigin: '58px 65px' }} className={activeIdx === 3 ? "car-wheel-spin" : ""}>
                                <circle cx="58" cy="65" r="9" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
                                <circle cx="58" cy="65" r="4.5" fill="#1E293B" />
                                <line x1="58" y1="56" x2="58" y2="74" stroke="#B45309" strokeWidth="1.2" />
                                <line x1="49" y1="65" x2="67" y2="65" stroke="#B45309" strokeWidth="1.2" />
                                <circle cx="58" cy="65" r="1.8" fill="#FFFFFF" />
                            </g>
                        </svg>
                    </div>

                    {/* ========================================================== */}
                    {/* TOY 5: 3D ROYAL WALKING PEACOCK (MOR NO TAHOOKO + STRUT)   */}
                    {/* ========================================================== */}
                    <div
                        className={`flex flex-col items-center cursor-pointer group relative mobile-flow-toy ${activeIdx === 4 ? 'is-active active-toy-4' : ''}`}
                        style={getToyTransform(4)}
                        onMouseEnter={() => activateToy(4)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleToyClick(4)}
                    >
                        {/* Royal Garden Lawn Walking Track with Moving Stepping Stones & Daisies */}
                        {activeIdx === 4 && (
                            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-32 sm:w-36 h-3.5 bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 rounded-full overflow-hidden flex items-center justify-center shadow-lg z-0 pointer-events-none border border-emerald-400">
                                <div className="w-full h-1.5 bg-[repeating-linear-gradient(90deg,#FEF08A_0,#FEF08A_6px,#86EFAC_6px,#86EFAC_14px,transparent_14px,transparent_22px)] animate-garden-walk"></div>
                            </div>
                        )}

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
                        className={`flex flex-col items-center cursor-pointer group relative mobile-flow-toy ${activeIdx === 5 ? 'is-active active-toy-5' : ''}`}
                        style={getToyTransform(5)}
                        onMouseEnter={() => activateToy(5)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleToyClick(5)}
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
                        className={`flex flex-col items-center cursor-pointer group relative mobile-flow-toy toy-horse-container ${activeIdx === 6 ? 'is-active active-toy-6' : ''}`}
                        style={getToyTransform(6)}
                        onMouseEnter={() => activateToy(6)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleToyClick(6)}
                    >
                        <svg viewBox="0 0 78 78" fill="none" className="w-[41px] h-[41px] xs:w-[50px] xs:h-[50px] sm:w-[63px] sm:h-[63px] md:w-[78px] md:h-[78px] filter drop-shadow-md overflow-visible">
                            <g className="rocking-horse-body">
                                {/* Horse Head & Ears */}
                                <polygon points="56,19 60,12 53,16" fill="#10B981" stroke="#059669" strokeWidth="1.5" />
                                
                                {/* Horse Neck and Head Profile */}
                                <path d="M42 36 L52 20 C54 18 64 21 66 26 C68 31 63 33 58 35 L52 42 Z" fill="#34D399" stroke="#059669" strokeWidth="2" />
                                {/* Golden Mane */}
                                <path d="M48 22 C46 25 45 29 47 34" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
                                {/* Gentle Eye */}
                                <circle cx="58" cy="24" r="2.2" fill="#0F172A" />
                                <circle cx="57.5" cy="23.5" r="0.8" fill="#FFFFFF" />
                                {/* Bridle & Reins */}
                                <line x1="58" y1="28" x2="52" y2="35" stroke="#DC2626" strokeWidth="1.5" />
                                <line x1="64" y1="29" x2="58" y2="28" stroke="#DC2626" strokeWidth="1.5" />

                                {/* Horse Torso Body */}
                                <ellipse cx="36" cy="45" rx="18" ry="11" fill="#34D399" stroke="#059669" strokeWidth="2" />
                                
                                {/* Red Leather Saddle with Gold Fringe */}
                                <rect x="30" y="38" width="12" height="12" rx="3" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                                <circle cx="36" cy="44" r="2" fill="#FDE047" />

                                {/* Golden Yarn Tail */}
                                <path d="M18 45 C14 48 12 55 16 58" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />

                                {/* Legs Extending to Rocker */}
                                <line x1="25" y1="52" x2="18" y2="67" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                                <line x1="47" y1="52" x2="58" y2="67" stroke="#059669" strokeWidth="3" strokeLinecap="round" />

                                {/* Curved Wooden Rocking Skids (Natural 3D Rocker) */}
                                <path d="M8 68 Q38 77 68 68" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                                <path d="M12 69 Q38 77 64 69" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            </g>
                        </svg>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default InteractiveToyRow;
