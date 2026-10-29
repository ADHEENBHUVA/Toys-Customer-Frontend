import React from 'react';

/**
 * ToyTransitScene Component
 * 
 * SPECIFICATIONS:
 * 1. PURE DAY LIGHT THEME:
 *    - Pure white background, zero green hills/brown ground, no rainbow, no dark mode toggle.
 * 2. PROPER HIGH-VISIBILITY STATION CLOCK:
 *    - 58px vintage clock face with Roman numerals XII, III, VI, IX.
 *    - Super visible, bold hands (Kata / કાંટા):
 *      * Thick solid black antique spade Hour Hand
 *      * Long tapered black steel Minute Hand
 *      * High-visibility bright Red Ticking Second Hand
 * 3. 3 CARGO WAGONS: [A][B][C], [D][E][F], [G][H][I]
 *    - Train ALWAYS arrives fully loaded.
 * 4. STRICT SIGNAL & FLAG CHOREOGRAPHY:
 *    - When the train approaches and while stopped at station:
 *      * Railway Signal is RED!
 *      * Station Master holds a RED FLAG in his hand!
 *    - BEFORE the train starts moving to depart:
 *      * Station Master's flag switches to a GREEN FLAG!
 *      * Railway Signal switches to GREEN!
 *      * Only AFTER the green flag and green signal are active, the train starts rolling and departs!
 * 5. ONLY 2 PORTER BOYS UNLOAD THE BOXES (NO NAMES SHOWN):
 *    - Exactly 2 Porter Boys (no name tags).
 *    - Only these 2 porters actively bend down and unload all boxes off the train within the 5 seconds stop.
 *    - Boxes are unloaded directly onto the platform deck (NO artificial green banner popup).
 * 6. STRICT 5-SECOND STATION STOP:
 *    - Exactly 5.0 seconds (30% to 50.8% of 24.0s loop = 5.00s).
 * 7. MEDIUM-SIZE TRACK (38px):
 *    - Sleek 3D steel rail, wooden sleepers, direct flush wheel contact.
 * 8. BILLOWING BLACK SMOKE:
 *    - Dark charcoal & soot puffs emitting from locomotive smokestack.
 */
const ToyTransitScene = () => {
    return (
        <section className="w-full relative overflow-hidden select-none bg-transparent pt-6 sm:pt-12 pb-2 sm:pb-4">
            <style>{`
                /* Train Journey Cycle (24s Loop with EXACTLY 5.00s Station Stop from 30% to 50.8%) */
                /* 24s * (50.833% - 30%) = 24 * 0.20833 = 5.00 seconds! */
                /* Using 'left' property ensures '50%' refers to the responsive stage width, NOT the train width! */
                @keyframes trainJourneyCycle {
                    0% {
                        left: -880px;
                    }
                    28% {
                        /* Smooth braking into station */
                        left: calc(50% - 455px);
                    }
                    30%, 50.8% {
                        /* Parked FIRMLY and ACCURATELY at station platform for EXACTLY 5.00 SECONDS! */
                        /* Entire train (Caboose, 3 Wagons, Tender, Engine) sits 100% on platform! */
                        left: calc(50% - 425px);
                    }
                    51.8% {
                        /* Smooth roll-off departure after Green Flag & Green Signal clearance */
                        left: calc(50% - 390px);
                    }
                    75%, 100% {
                        /* Exits cleanly to the right */
                        left: calc(100% + 200px);
                    }
                }
                .animate-train-station-stop {
                    position: absolute;
                    bottom: 31px;
                    left: -880px;
                    animation: trainJourneyCycle 24s linear infinite;
                    will-change: left;
                }

                /* Fully Responsive Transit Stage Scaling Across All Screen Sizes (320px, 375px, 425px, 768px, 1024px, 2560px 4K) */
                .toy-transit-responsive-stage {
                    width: 100%;
                    min-width: 760px;
                    transform-origin: bottom center;
                    transition: transform 0.3s ease, margin-bottom 0.3s ease;
                }

                /* 1. Small Mobile (320px - iPhone SE 1st gen / Galaxy Fold) */
                @media (max-width: 340px) {
                    .toy-transit-responsive-stage {
                        transform: scale(0.40);
                        margin-bottom: -134px;
                    }
                }

                /* 2. Standard Mobile (375px - iPhone 12/13/SE) */
                @media (min-width: 341px) and (max-width: 390px) {
                    .toy-transit-responsive-stage {
                        transform: scale(0.47);
                        margin-bottom: -118px;
                    }
                }

                /* 3. Large Mobile (425px - iPhone Pro Max / Galaxy Ultra / Pixel) */
                @media (min-width: 391px) and (max-width: 480px) {
                    .toy-transit-responsive-stage {
                        transform: scale(0.53);
                        margin-bottom: -105px;
                    }
                }

                /* 4. Small Tablet / Large Phablet (481px - 640px) */
                @media (min-width: 481px) and (max-width: 640px) {
                    .toy-transit-responsive-stage {
                        transform: scale(0.64);
                        margin-bottom: -80px;
                    }
                }

                /* 5. Standard Tablet (768px - iPad Portrait) */
                @media (min-width: 641px) and (max-width: 820px) {
                    .toy-transit-responsive-stage {
                        transform: scale(0.80);
                        margin-bottom: -44px;
                    }
                }

                /* 6. Laptop / iPad Pro Landscape (1024px) */
                @media (min-width: 821px) and (max-width: 1180px) {
                    .toy-transit-responsive-stage {
                        transform: scale(0.92);
                        margin-bottom: -18px;
                    }
                }

                /* 7. Standard Desktop (1181px - 1799px) */
                @media (min-width: 1181px) and (max-width: 1799px) {
                    .toy-transit-responsive-stage {
                        min-width: 100%;
                        transform: scale(1);
                        margin-bottom: 0px;
                    }
                }

                /* 8. Ultra-wide & 4K Displays (1800px - 2560px+) */
                @media (min-width: 1800px) {
                    .toy-transit-responsive-stage {
                        min-width: 100%;
                        transform: scale(1.20);
                        margin-bottom: 35px;
                    }
                }

                /* Downward Suspension Compression */
                @keyframes trainChugDownward {
                    0%, 30% { transform: translateY(0px); }
                    1%, 3%, 5%, 7%, 9%, 11%, 13%, 15%, 17%, 19%, 21%, 23%, 25%, 27%, 29% { transform: translateY(0.5px); }
                    2%, 4%, 6%, 8%, 10%, 12%, 14%, 16%, 18%, 20%, 22%, 24%, 26%, 28% { transform: translateY(0px); }
                    30.1%, 50.8% { transform: translateY(0px); } /* Completely still during 5.0s stop */
                    51%, 53%, 55%, 57%, 59%, 61%, 63%, 65%, 67%, 69%, 71%, 73% { transform: translateY(0.5px); }
                    52%, 54%, 56%, 58%, 60%, 62%, 64%, 66%, 68%, 70%, 72%, 74% { transform: translateY(0px); }
                    75%, 100% { transform: translateY(0px); }
                }
                .animate-train-chug {
                    animation: trainChugDownward 24s linear infinite;
                }

                /* Wheel Rotation: Spins fast when traveling, locks completely during 5.0s stop */
                @keyframes wheelSpinCycle {
                    0% { transform: rotate(0deg); }
                    30% { transform: rotate(1800deg); }
                    30.1%, 50.8% { transform: rotate(1800deg); } /* Completely still during 5.0s stop */
                    52% { transform: rotate(1880deg); }
                    75% { transform: rotate(3600deg); }
                    100% { transform: rotate(3600deg); }
                }
                .spin-train-wheel {
                    transform-origin: center;
                    animation: wheelSpinCycle 24s linear infinite;
                }

                /* ============================================================== */
                /* SIGNAL & FLAG TIMING (RED ON ARRIVAL/STOP -> GREEN BEFORE DEPARTURE) */
                /* 0% to 46%: RED Signal & RED Flag (Train approaches & halts)    */
                /* 46% to 75%: GREEN Signal & GREEN Flag (Clearance before train starts!) */
                /* 75% to 100%: Resets to RED Signal & RED Flag for next loop     */
                /* ============================================================== */

                /* Railway Signal Gantry: RED Light */
                @keyframes signalRedGlow {
                    0%, 46% { opacity: 1; filter: drop-shadow(0 0 12px #ef4444); }
                    46.1%, 74.9% { opacity: 0.15; filter: none; }
                    75%, 100% { opacity: 1; filter: drop-shadow(0 0 12px #ef4444); }
                }
                .signal-light-red {
                    animation: signalRedGlow 24s linear infinite;
                }

                /* Railway Signal Gantry: GREEN Light */
                @keyframes signalGreenGlow {
                    0%, 46% { opacity: 0.15; filter: none; }
                    46.1%, 74.9% { opacity: 1; filter: drop-shadow(0 0 12px #22c55e); }
                    75%, 100% { opacity: 0.15; filter: none; }
                }
                .signal-light-green {
                    animation: signalGreenGlow 24s linear infinite;
                }

                /* Station Master Arm & Flag States */
                @keyframes masterArmRedAnim {
                    0%, 45.9% { opacity: 1; }
                    46.0%, 100% { opacity: 0; }
                }
                .master-arm-red { animation: masterArmRedAnim 24s linear infinite; }

                @keyframes masterArmGreenAnim {
                    0%, 45.9% { opacity: 0; }
                    46.0%, 56.0% { opacity: 1; }
                    56.1%, 100% { opacity: 0; }
                }
                .master-arm-green { animation: masterArmGreenAnim 24s linear infinite; }

                @keyframes masterArmEmptyAnim {
                    0%, 45.9% { opacity: 0; }
                    46.0%, 56.0% { opacity: 0; }
                    56.1%, 100% { opacity: 1; }
                }
                .master-arm-empty { animation: masterArmEmptyAnim 24s linear infinite; }

                /* Station Master Active Green Flag Waving (Back & Forth rapidly) */
                @keyframes masterGreenFlagWave {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-24deg); }
                    75% { transform: rotate(20deg); }
                }
                .master-green-wave {
                    animation: masterGreenFlagWave 0.5s ease-in-out infinite;
                    transform-origin: 46px 25px;
                }

                /* Station Master Gentle Red Flag Flutter */
                @keyframes masterRedFlagFlutter {
                    0%, 100% { transform: scaleX(1); }
                    50% { transform: scaleX(0.85); }
                }
                .master-red-flutter {
                    animation: masterRedFlagFlutter 1.2s ease-in-out infinite;
                    transform-origin: 49px 8px;
                }

                /* Station Master Body Animation */
                @keyframes stationMasterAction {
                    0%, 45.9% { transform: translateY(0px) rotate(0deg); }
                    46%, 56% { transform: translateY(-2px) rotate(4deg); }
                    56.1%, 100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-station-master {
                    animation: stationMasterAction 24s linear infinite;
                    transform-origin: bottom center;
                }

                /* ============================================================== */
                /* 2 PORTER BOYS: PHYSICAL UNLOADING ACTION & CARRYING CHOREOGRAPHY */
                /* Porter 1 unloads ABC & DEF, Porter 2 unloads GHI               */
                /* ============================================================== */

                /* Porter Boy 1: Smooth, realistic unloading choreography of Wagon 1 [ABC] then Wagon 2 [DEF] */
                @keyframes porter1Action {
                    0%, 31.0% {
                        /* Standing attentively on platform edge waiting for train */
                        transform: translate(0px, 0px) rotate(0deg);
                    }
                    31.1%, 32.8% {
                        /* Reaches left towards Wagon 1 to grab ABC crate */
                        transform: translate(-55px, 6px) rotate(-14deg);
                    }
                    32.9%, 35.1% {
                        /* Heaves ABC up out of Wagon 1 */
                        transform: translate(-45px, -14px) rotate(0deg);
                    }
                    35.2%, 37.1% {
                        /* Carries ABC rightward towards cargo deck zone */
                        transform: translate(75px, 4px) rotate(8deg);
                    }
                    37.2%, 38.5% {
                        /* Places ABC on platform deck */
                        transform: translate(75px, 0px) rotate(0deg);
                    }
                    38.6%, 39.9% {
                        /* Steps rightward to Wagon 2 to grab DEF crate */
                        transform: translate(65px, 6px) rotate(14deg);
                    }
                    40.0%, 42.3% {
                        /* Heaves DEF up out of Wagon 2 */
                        transform: translate(65px, -14px) rotate(0deg);
                    }
                    42.4%, 43.9% {
                        /* Carries DEF back to cargo deck zone */
                        transform: translate(75px, 4px) rotate(-6deg);
                    }
                    44.0%, 45.9% {
                        /* Places DEF on platform deck and steps back to base */
                        transform: translate(0px, 0px) rotate(0deg);
                    }
                    46.0%, 50.7% {
                        /* Signals All Clear to Station Master */
                        transform: translate(0px, 0px) rotate(0deg);
                    }
                    50.8%, 68.0% {
                        /* Waves goodbye to departing train! */
                        transform: translate(0px, -2px) rotate(-4deg);
                    }
                    68.1%, 100% {
                        transform: translate(0px, 0deg) rotate(0deg);
                    }
                }
                .animate-porter-1 {
                    animation: porter1Action 24s linear infinite;
                    transform-origin: bottom center;
                }

                /* Porter Boy 2: Smooth, realistic unloading choreography of Wagon 3 [GHI] */
                @keyframes porter2Action {
                    0%, 31.0% {
                        /* Standing attentively on platform edge waiting for train */
                        transform: translate(0px, 0px) rotate(0deg);
                    }
                    31.1%, 32.8% {
                        /* Reaches directly forward into Wagon 3 to grab GHI crate */
                        transform: translate(6px, 6px) rotate(-14deg);
                    }
                    32.9%, 35.1% {
                        /* Heaves GHI up out of Wagon 3 */
                        transform: translate(6px, -14px) rotate(0deg);
                    }
                    35.2%, 37.1% {
                        /* Carries GHI leftward towards cargo deck zone */
                        transform: translate(-95px, 4px) rotate(-8deg);
                    }
                    37.2%, 38.5% {
                        /* Places GHI on platform deck */
                        transform: translate(-95px, 0px) rotate(0deg);
                    }
                    38.6%, 45.9% {
                        /* Steps back to base position, stands proudly */
                        transform: translate(0px, 0px) rotate(0deg);
                    }
                    46.0%, 50.7% {
                        /* Signals All Clear to Station Master */
                        transform: translate(0px, 0px) rotate(0deg);
                    }
                    50.8%, 68.0% {
                        /* Waves goodbye to departing train! */
                        transform: translate(0px, -2px) rotate(6deg);
                    }
                    68.1%, 100% {
                        transform: translate(0px, 0px) rotate(0deg);
                    }
                }
                .animate-porter-2 {
                    animation: porter2Action 24s linear infinite;
                    transform-origin: bottom center;
                }

                /* ============================================================== */
                /* PORTER ARMS & CARRIED CRATES STATE MANAGEMENT                   */
                /* ============================================================== */

                /* Porter 1 Arms States */
                @keyframes p1ArmsEmptyAnim {
                    0%, 31.0% { opacity: 1; }
                    31.1%, 37.1% { opacity: 0; }
                    37.2%, 38.5% { opacity: 1; } /* hands resting down at sides */
                    38.6%, 43.9% { opacity: 0; }
                    44.0%, 50.7% { opacity: 1; } /* hands resting down at sides */
                    50.8%, 55.0% { opacity: 0; } /* quick friendly wave */
                    55.1%, 100% { opacity: 1; }  /* hands resting down at sides */
                }
                .p1-arms-empty { animation: p1ArmsEmptyAnim 24s linear infinite; }

                @keyframes p1ArmsReachAnim {
                    0%, 31.0% { opacity: 0; }
                    31.1%, 32.8% { opacity: 1; }
                    32.9%, 38.5% { opacity: 0; }
                    38.6%, 39.9% { opacity: 1; }
                    40.0%, 100% { opacity: 0; }
                }
                .p1-arms-reach { animation: p1ArmsReachAnim 24s linear infinite; }

                @keyframes p1HeldAbcAnim {
                    0%, 32.8% { opacity: 0; transform: scale(0); }
                    32.9%, 37.1% { opacity: 1; transform: scale(1); }
                    37.2%, 100% { opacity: 0; transform: scale(0); }
                }
                .p1-held-abc { animation: p1HeldAbcAnim 24s linear infinite; transform-origin: center; }

                @keyframes p1HeldDefAnim {
                    0%, 39.9% { opacity: 0; transform: scale(0); }
                    40.0%, 43.9% { opacity: 1; transform: scale(1); }
                    44.0%, 100% { opacity: 0; transform: scale(0); }
                }
                .p1-held-def { animation: p1HeldDefAnim 24s linear infinite; transform-origin: center; }

                @keyframes p1ArmsWaveAnim {
                    0%, 50.7% { opacity: 0; }
                    50.8%, 55.0% { opacity: 1; }
                    55.1%, 100% { opacity: 0; }
                }
                .p1-arms-wave { animation: p1ArmsWaveAnim 24s linear infinite; }

                /* Porter 2 Arms States */
                @keyframes p2ArmsEmptyAnim {
                    0%, 31.0% { opacity: 1; }
                    31.1%, 37.1% { opacity: 0; }
                    37.2%, 50.7% { opacity: 1; } /* hands resting down at sides! */
                    50.8%, 55.0% { opacity: 0; } /* quick friendly wave */
                    55.1%, 100% { opacity: 1; }  /* hands resting down at sides! */
                }
                .p2-arms-empty { animation: p2ArmsEmptyAnim 24s linear infinite; }

                @keyframes p2ArmsReachAnim {
                    0%, 31.0% { opacity: 0; }
                    31.1%, 32.8% { opacity: 1; }
                    32.9%, 100% { opacity: 0; }
                }
                .p2-arms-reach { animation: p2ArmsReachAnim 24s linear infinite; }

                @keyframes p2HeldGhiAnim {
                    0%, 32.8% { opacity: 0; transform: scale(0); }
                    32.9%, 37.1% { opacity: 1; transform: scale(1); }
                    37.2%, 100% { opacity: 0; transform: scale(0); }
                }
                .p2-held-ghi { animation: p2HeldGhiAnim 24s linear infinite; transform-origin: center; }

                @keyframes p2ArmsWaveAnim {
                    0%, 50.7% { opacity: 0; }
                    50.8%, 55.0% { opacity: 1; }
                    55.1%, 100% { opacity: 0; }
                }
                .p2-arms-wave { animation: p2ArmsWaveAnim 24s linear infinite; }

                /* ============================================================== */
                /* WAGON CRATES: EMPTY FROM TRAIN AT MOMENT OF PORTER GRAB        */
                /* ============================================================== */

                /* Wagon 1 ABC: Disappears from wagon at 33.0% when Porter 1 lifts it */
                @keyframes wagon1CrateAnim {
                    0%, 32.8% { opacity: 1; transform: translateY(0px) scale(1); }
                    33.0%, 75.0% { opacity: 0; transform: translateY(-16px) scale(0); }
                    78.0%, 100% { opacity: 1; transform: translateY(0px) scale(1); }
                }
                .wagon1-crate { animation: wagon1CrateAnim 24s linear infinite; transform-origin: bottom center; }

                /* Wagon 2 DEF: Disappears from wagon at 40.0% when Porter 1 lifts it */
                @keyframes wagon2CrateAnim {
                    0%, 39.9% { opacity: 1; transform: translateY(0px) scale(1); }
                    40.0%, 75.0% { opacity: 0; transform: translateY(-16px) scale(0); }
                    78.0%, 100% { opacity: 1; transform: translateY(0px) scale(1); }
                }
                .wagon2-crate { animation: wagon2CrateAnim 24s linear infinite; transform-origin: bottom center; }

                /* Wagon 3 GHI: Disappears from wagon at 33.0% when Porter 2 lifts it */
                @keyframes wagon3CrateAnim {
                    0%, 32.8% { opacity: 1; transform: translateY(0px) scale(1); }
                    33.0%, 75.0% { opacity: 0; transform: translateY(-16px) scale(0); }
                    78.0%, 100% { opacity: 1; transform: translateY(0px) scale(1); }
                }
                .wagon3-crate { animation: wagon3CrateAnim 24s linear infinite; transform-origin: bottom center; }

                /* ============================================================== */
                /* ============================================================== */
                /* PLATFORM DECK CRATES: APPEAR ON PLACEMENT, TRANSFER TO LEFT ON DEPARTURE */
                /* ============================================================== */

                /* Platform ABC: stays on Left deck as Row 1 until 0.1s before train arrives (1.8%) */
                @keyframes platformCrateAbcAnim {
                    0%, 1.4% { opacity: 1; transform: translate(-294px, -92px) scale(1); }
                    1.8% { opacity: 0; transform: translate(-294px, -92px) scale(0.6); }
                    1.9%, 37.1% { opacity: 0; transform: translateY(6px) scale(0.8); }
                    37.2%, 50.7% { opacity: 1; transform: translate(0px, 0px) scale(1); }
                    50.8% { transform: translate(0px, 0px) scale(1); }
                    52.8%, 100% { opacity: 1; transform: translate(-294px, -92px) scale(1); }
                }
                @media (max-width: 639px) {
                    @keyframes platformCrateAbcAnim {
                        0%, 1.4% { opacity: 1; transform: translate(-226px, -84px) scale(1); }
                        1.8% { opacity: 0; transform: translate(-226px, -84px) scale(0.6); }
                        1.9%, 37.1% { opacity: 0; transform: translateY(6px) scale(0.8); }
                        37.2%, 50.7% { opacity: 1; transform: translate(0px, 0px) scale(1); }
                        50.8% { transform: translate(0px, 0px) scale(1); }
                        52.8%, 100% { opacity: 1; transform: translate(-226px, -84px) scale(1); }
                    }
                }
                .platform-crate-abc { animation: platformCrateAbcAnim 24s cubic-bezier(0.25, 1, 0.5, 1) infinite; transform-origin: bottom center; will-change: transform; }

                /* Platform DEF: stays on Left deck as Row 2 until 0.1s before train arrives (1.8%) */
                @keyframes platformCrateDefAnim {
                    0%, 1.4% { opacity: 1; transform: translate(-422px, -46px) scale(1); }
                    1.8% { opacity: 0; transform: translate(-422px, -46px) scale(0.6); }
                    1.9%, 43.9% { opacity: 0; transform: translateY(6px) scale(0.8); }
                    44.0%, 50.7% { opacity: 1; transform: translate(0px, 0px) scale(1); }
                    50.8% { transform: translate(0px, 0px) scale(1); }
                    52.8%, 100% { opacity: 1; transform: translate(-422px, -46px) scale(1); }
                }
                @media (max-width: 639px) {
                    @keyframes platformCrateDefAnim {
                        0%, 1.4% { opacity: 1; transform: translate(-338px, -42px) scale(1); }
                        1.8% { opacity: 0; transform: translate(-338px, -42px) scale(0.6); }
                        1.9%, 43.9% { opacity: 0; transform: translateY(6px) scale(0.8); }
                        44.0%, 50.7% { opacity: 1; transform: translate(0px, 0px) scale(1); }
                        50.8% { transform: translate(0px, 0px) scale(1); }
                        52.8%, 100% { opacity: 1; transform: translate(-338px, -42px) scale(1); }
                    }
                }
                .platform-crate-def { animation: platformCrateDefAnim 24s cubic-bezier(0.25, 1, 0.5, 1) infinite; transform-origin: bottom center; will-change: transform; }

                /* Platform GHI: stays on Left deck as Row 3 until 0.1s before train arrives (1.8%) */
                @keyframes platformCrateGhiAnim {
                    0%, 1.4% { opacity: 1; transform: translate(-550px, 0px) scale(1); }
                    1.8% { opacity: 0; transform: translate(-550px, 0px) scale(0.6); }
                    1.9%, 37.1% { opacity: 0; transform: translateY(6px) scale(0.8); }
                    37.2%, 50.7% { opacity: 1; transform: translate(0px, 0px) scale(1); }
                    50.8% { transform: translate(0px, 0px) scale(1); }
                    52.8%, 100% { opacity: 1; transform: translate(-550px, 0px) scale(1); }
                }
                @media (max-width: 639px) {
                    @keyframes platformCrateGhiAnim {
                        0%, 1.4% { opacity: 1; transform: translate(-450px, 0px) scale(1); }
                        1.8% { opacity: 0; transform: translate(-450px, 0px) scale(0.6); }
                        1.9%, 37.1% { opacity: 0; transform: translateY(6px) scale(0.8); }
                        37.2%, 50.7% { opacity: 1; transform: translate(0px, 0px) scale(1); }
                        50.8% { transform: translate(0px, 0px) scale(1); }
                        52.8%, 100% { opacity: 1; transform: translate(-450px, 0px) scale(1); }
                    }
                }
                .platform-crate-ghi { animation: platformCrateGhiAnim 24s cubic-bezier(0.25, 1, 0.5, 1) infinite; transform-origin: bottom center; will-change: transform; }

                /* High-Visibility Station Clock Ticking Red Second Hand */
                @keyframes clockSecondHandTick {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-clock-second-hand {
                    transform-origin: 32px 32px;
                    animation: clockSecondHandTick 60s steps(60, end) infinite;
                }

                /* Billowing Black Locomotive Smoke Puffs */
                @keyframes blackSmokePuff1 {
                    0% { transform: translate(0, 0) scale(0.25); opacity: 0; }
                    12% { opacity: 0.95; }
                    55% { opacity: 0.85; }
                    100% { transform: translate(-38px, -42px) scale(1.3); opacity: 0; }
                }
                @keyframes blackSmokePuff2 {
                    0% { transform: translate(0, 0) scale(0.25); opacity: 0; }
                    12% { opacity: 0.95; }
                    55% { opacity: 0.85; }
                    100% { transform: translate(-65px, -58px) scale(1.6); opacity: 0; }
                }
                @keyframes blackSmokePuff3 {
                    0% { transform: translate(0, 0) scale(0.3); opacity: 0; }
                    12% { opacity: 0.95; }
                    55% { opacity: 0.8; }
                    100% { transform: translate(-94px, -70px) scale(1.9); opacity: 0; }
                }
                @keyframes blackSmokePuff4 {
                    0% { transform: translate(0, 0) scale(0.25); opacity: 0; }
                    12% { opacity: 0.95; }
                    55% { opacity: 0.85; }
                    100% { transform: translate(-124px, -82px) scale(2.2); opacity: 0; }
                }
                .black-puff-1 { animation: blackSmokePuff1 1.7s cubic-bezier(0.2, 0.8, 0.4, 1) infinite; }
                .black-puff-2 { animation: blackSmokePuff2 1.7s cubic-bezier(0.2, 0.8, 0.4, 1) infinite 0.42s; }
                .black-puff-3 { animation: blackSmokePuff3 1.7s cubic-bezier(0.2, 0.8, 0.4, 1) infinite 0.85s; }
                .black-puff-4 { animation: blackSmokePuff4 1.7s cubic-bezier(0.2, 0.8, 0.4, 1) infinite 1.28s; }
            `}</style>

            {/* ============================================================== */}
            {/* FULL RESPONSIVE TRANSIT STAGE WRAPPER                          */}
            {/* ============================================================== */}
            <div className="w-full flex flex-col items-center overflow-hidden">
                <div className="toy-transit-responsive-stage flex flex-col items-center">

                    {/* ============================================================== */}
                    {/* 1. STATION AREA: CLOCK TOWER, BUILDING & PLATFORM WITH 2 PORTERS*/}
                    {/* ============================================================== */}
                    <div className="w-full max-w-7xl mx-auto px-4 flex items-end justify-center pointer-events-auto pb-0 relative z-10">
                <div className="flex flex-col items-center">
                    
                    {/* Upper Station Elements: Whimsical TOY PLAYSET (Lamps, Toy Clock Tower, Toy Building, Toy Signal) */}
                    <div className="flex items-end justify-center gap-2 sm:gap-4 -mb-0.5">
                        
                        {/* Left Colorful Toy Platform Lamp */}
                        <div className="hidden sm:flex flex-col items-center mb-0 filter drop-shadow-sm">
                            <div className="w-4 h-4 rounded-full border-2 border-amber-600 bg-amber-300 shadow-inner flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80"></div>
                            </div>
                            <div className="w-1.5 h-10 bg-blue-600 border-x border-blue-700"></div>
                            <div className="w-5 h-2.5 bg-red-600 border border-red-700 rounded-t-xs shadow-xs"></div>
                        </div>

                        {/* Central TOY STATION PLAYSET Building with TOY CLOCK TOWER */}
                        <div className="flex flex-col items-center filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
                            
                            {/* Colorful Toy Clock Tower (Built of Stacking Toy Blocks) */}
                            <div className="flex flex-col items-center -mb-1 z-10">
                                {/* Golden Toy Star Finial */}
                                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-amber-600 shadow-sm flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                </div>
                                <div className="w-1.5 h-2 bg-amber-700"></div>
                                
                                {/* Cherry Red Toy Pyramid Roof with Toy Studs */}
                                <div className="relative flex flex-col items-center">
                                    <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[24px] border-b-red-600 filter drop-shadow-xs"></div>
                                    <div className="w-14 h-1.5 bg-red-700 rounded-full -mt-0.5 flex justify-around px-1">
                                        <div className="w-1.5 h-1 bg-yellow-400 rounded-full"></div>
                                        <div className="w-1.5 h-1 bg-yellow-400 rounded-full"></div>
                                        <div className="w-1.5 h-1 bg-yellow-400 rounded-full"></div>
                                    </div>
                                </div>
                                
                                {/* TOY STATION CLOCK (Toy Block Housing with Crisp Vintage Dial & High-Visibility Hands) */}
                                <div className="w-[78px] h-[78px] bg-gradient-to-b from-blue-500 to-blue-600 border-3 border-blue-800 rounded-2xl flex items-center justify-center shadow-md relative p-1">
                                    {/* Toy Studs on 4 corners */}
                                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600"></div>
                                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600"></div>
                                    <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600"></div>
                                    <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600"></div>

                                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="filter drop-shadow-sm">
                                        {/* Outer Golden Brass Bezel */}
                                        <circle cx="32" cy="32" r="30" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
                                        <circle cx="32" cy="32" r="28" fill="#FEF08A" opacity="0.6" />
                                        
                                        {/* Dark Accent Bezel Ring */}
                                        <circle cx="32" cy="32" r="26.5" stroke="#1E293B" strokeWidth="1" fill="none" />

                                        {/* Pristine Crisp White Dial Face */}
                                        <circle cx="32" cy="32" r="25.5" fill="#FFFFFF" />

                                        {/* Railroad Track Minute Ring */}
                                        <circle cx="32" cy="32" r="24" stroke="#94A3B8" strokeWidth="0.8" fill="none" strokeDasharray="1 1.51" />
                                        <circle cx="32" cy="32" r="21" stroke="#CBD5E1" strokeWidth="0.5" fill="none" />

                                        {/* 12 Bold Crisp Numerals: Clean, High-Contrast Black */}
                                        <text x="32" y="15.5" fill="#0F172A" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">12</text>
                                        <text x="42.5" y="18.5" fill="#334155" fontSize="5.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">1</text>
                                        <text x="49" y="25" fill="#334155" fontSize="5.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">2</text>
                                        <text x="51.5" y="34" fill="#0F172A" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">3</text>
                                        <text x="49" y="43" fill="#334155" fontSize="5.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">4</text>
                                        <text x="42.5" y="49.5" fill="#334155" fontSize="5.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">5</text>
                                        <text x="32" y="52.5" fill="#0F172A" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">6</text>
                                        <text x="21.5" y="49.5" fill="#334155" fontSize="5.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">7</text>
                                        <text x="15" y="43" fill="#334155" fontSize="5.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">8</text>
                                        <text x="12.5" y="34" fill="#0F172A" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">9</text>
                                        <text x="15" y="25" fill="#334155" fontSize="5.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">10</text>
                                        <text x="21.5" y="18.5" fill="#334155" fontSize="5.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">11</text>

                                        {/* ============================================================== */}
                                        {/* THE CLOCK HANDS (કાંટા / KATA): PROPER, BOLD & HIGH VISIBILITY  */}
                                        {/* ============================================================== */}

                                        {/* 1. BOLD BLACK HOUR HAND (Pointing to ~10 o'clock: 10:10 classic aesthetic) */}
                                        <g filter="drop-shadow(0px 1.5px 2px rgba(0,0,0,0.5))">
                                            <line x1="32" y1="32" x2="20" y2="20" stroke="#0F172A" strokeWidth="3.8" strokeLinecap="round" />
                                            <polygon points="20,20 18,17 17,20 19,23" fill="#0F172A" />
                                            <circle cx="21" cy="21" r="2" fill="#0F172A" />
                                        </g>

                                        {/* 2. LONG TAPERED BLACK MINUTE HAND (Pointing to ~2 o'clock / 10 minutes) */}
                                        <g filter="drop-shadow(0px 1.5px 2.5px rgba(0,0,0,0.4))">
                                            <line x1="32" y1="32" x2="47" y2="17" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
                                            <polygon points="47,17 49,15 46,14 44,17" fill="#1E293B" />
                                        </g>

                                        {/* 3. VIBRANT RED TICKING SECOND HAND (Iconic Railway Target Needle) */}
                                        <g className="animate-clock-second-hand" filter="drop-shadow(0px 1.5px 3px rgba(220,38,38,0.5))">
                                            {/* Red Counterweight Tail (Extended behind center) */}
                                            <line x1="32" y1="41" x2="32" y2="10" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />
                                            {/* Rear Counterweight Disc */}
                                            <circle cx="32" cy="38" r="2" fill="#DC2626" />
                                            {/* Iconic Railway Lollipop Disc near tip */}
                                            <circle cx="32" cy="15" r="3" fill="#EF4444" stroke="#DC2626" strokeWidth="0.8" />
                                            <circle cx="32" cy="15" r="1.2" fill="#FEE2E2" />
                                        </g>

                                        {/* CENTER PIVOT CAP (Golden Brass Hub) */}
                                        <circle cx="32" cy="32" r="4" fill="#F59E0B" stroke="#B45309" strokeWidth="1" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))" />
                                        <circle cx="32" cy="32" r="2" fill="#FEF08A" />
                                    </svg>
                                </div>
                            </div>

                            {/* TOY STATION HOUSE (Bright Colorful Toy Playset Facade) */}
                            <div className="flex flex-col items-center">
                                {/* Red Toy Roof Canopy with Toy Block Studs */}
                                <div className="w-80 sm:w-96 h-6 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 rounded-t-lg border-2 border-red-800 shadow-sm flex items-center justify-between px-3 relative overflow-hidden">
                                    {/* Toy Roof Studs */}
                                    <div className="flex gap-2 opacity-80">
                                        <div className="w-2 h-1.5 bg-yellow-300 rounded-t-sm border border-yellow-500"></div>
                                        <div className="w-2 h-1.5 bg-yellow-300 rounded-t-sm border border-yellow-500"></div>
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] font-black text-white tracking-widest uppercase filter drop-shadow-sm flex items-center gap-1.5">
                                        <span>🧸</span> LITTLE JOYS TOY STATION <span>🚂</span>
                                    </span>
                                    <div className="flex gap-2 opacity-80">
                                        <div className="w-2 h-1.5 bg-yellow-300 rounded-t-sm border border-yellow-500"></div>
                                        <div className="w-2 h-1.5 bg-yellow-300 rounded-t-sm border border-yellow-500"></div>
                                    </div>
                                </div>

                                {/* Sunny Yellow Toy Walls with Blue Block Pillars & Cute Playhouse Windows */}
                                <div className="w-76 sm:w-92 h-13 bg-gradient-to-b from-yellow-200 to-amber-200 border-2 border-amber-400 flex items-center justify-between px-3 relative shadow-inner">
                                    {/* Left Blue Toy Block Pillar */}
                                    <div className="w-3.5 h-full bg-blue-600 border-x border-blue-700 flex flex-col justify-around py-0.5 items-center">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 border border-blue-300"></div>
                                        <div className="w-2 h-2 rounded-full bg-blue-400 border border-blue-300"></div>
                                    </div>

                                    {/* Left Arched Playhouse Window with Toy Flower Box */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-7 border-2 border-amber-700 rounded-t-full bg-sky-200 flex flex-col justify-center items-center shadow-xs overflow-hidden">
                                            <div className="w-full h-0.5 bg-white"></div>
                                            <div className="h-full w-0.5 bg-white"></div>
                                        </div>
                                        <div className="w-9 h-2 bg-emerald-600 rounded-xs flex items-center justify-around px-1 shadow-2xs">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-300"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                        </div>
                                    </div>

                                    {/* Double Green Toy Doors with Yellow Toy Doorknobs */}
                                    <div className="w-11 h-11 bg-emerald-600 rounded-t-md border-2 border-emerald-800 flex items-center justify-around px-1 shadow-xs">
                                        <div className="w-4 h-9 bg-emerald-500 rounded-t-xs border border-emerald-700 flex items-center justify-end pr-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 border border-yellow-500 shadow-xs"></div>
                                        </div>
                                        <div className="w-4 h-9 bg-emerald-500 rounded-t-xs border border-emerald-700 flex items-center justify-start pl-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 border border-yellow-500 shadow-xs"></div>
                                        </div>
                                    </div>

                                    {/* Right Arched Playhouse Window with Toy Flower Box */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-7 border-2 border-amber-700 rounded-t-full bg-sky-200 flex flex-col justify-center items-center shadow-xs overflow-hidden">
                                            <div className="w-full h-0.5 bg-white"></div>
                                            <div className="h-full w-0.5 bg-white"></div>
                                        </div>
                                        <div className="w-9 h-2 bg-emerald-600 rounded-xs flex items-center justify-around px-1 shadow-2xs">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-300"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                        </div>
                                    </div>

                                    {/* Right Blue Toy Block Pillar */}
                                    <div className="w-3.5 h-full bg-blue-600 border-x border-blue-700 flex flex-col justify-around py-0.5 items-center">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 border border-blue-300"></div>
                                        <div className="w-2 h-2 rounded-full bg-blue-400 border border-blue-300"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Toy Railway Signal Post (Candy Gem Lights: RED Stop -> GREEN Clear) */}
                        <div className="flex flex-col items-center filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.18)] mb-0">
                            {/* Signal Head */}
                            <div className="w-6 h-13 bg-slate-900 rounded-full border-2 border-slate-700 flex flex-col items-center justify-around py-1 shadow-sm z-10">
                                <div className="w-4 h-4 rounded-full bg-red-600 border border-red-400 signal-light-red shadow-inner flex items-center justify-center">
                                    <div className="w-1 h-1 rounded-full bg-white opacity-60"></div>
                                </div>
                                <div className="w-4 h-4 rounded-full bg-emerald-500 border border-emerald-300 signal-light-green shadow-inner flex items-center justify-center">
                                    <div className="w-1 h-1 rounded-full bg-white opacity-60"></div>
                                </div>
                            </div>
                            {/* Striped Toy Post */}
                            <div
                                className="w-2 h-11 border-x border-slate-600"
                                style={{
                                    backgroundImage:
                                        'repeating-linear-gradient(180deg, #f59e0b 0px, #f59e0b 4px, #1e293b 4px, #1e293b 8px)'
                                }}
                            ></div>
                            <div className="w-6 h-2.5 bg-red-600 border border-red-700 rounded-t-xs"></div>
                        </div>

                        {/* Right Colorful Toy Platform Lamp */}
                        <div className="hidden sm:flex flex-col items-center mb-0 filter drop-shadow-sm">
                            <div className="w-4 h-4 rounded-full border-2 border-amber-600 bg-amber-300 shadow-inner flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80"></div>
                            </div>
                            <div className="w-1.5 h-10 bg-blue-600 border-x border-blue-700"></div>
                            <div className="w-5 h-2.5 bg-red-600 border border-red-700 rounded-t-xs shadow-xs"></div>
                        </div>
                    </div>

                    {/* Raised Continuous Platform Deck: TOY PLAYSET with TOY MINIFIGURES (880px fits the full train perfectly) */}
                    <div className="w-[680px] sm:w-[880px] flex flex-col relative">
                        
                        {/* Platform Surface with Yellow Hazard Warning Strip (Birchwood Toy Deck - Lowered) */}
                        <div className="w-full h-2.5 bg-amber-100 border-t-2 border-amber-300 flex items-center shadow-xs relative">
                            <div
                                className="w-full h-1.5 bg-amber-400 border-y border-amber-500"
                                style={{
                                    backgroundImage:
                                        'repeating-linear-gradient(90deg, #d97706 0px, #d97706 8px, #fde047 8px, #fde047 16px)'
                                }}
                            ></div>

                            {/* ============================================================== */}
                            {/* 3 TOY MINIFIGURES (2 PORTERS & STATION MASTER) ON PLATFORM     */}
                            {/* Cute peg-head, C-clip hands, blocky legs, snap-on toy caps    */}
                            {/* ============================================================== */}
                            <div className="absolute bottom-full left-0 right-0 h-0 z-25 pointer-events-none mb-0">
                                
                                {/* TOY PORTER 1 (BLUE TOY MINIFIGURE: UNLOADS WAGON 1 ABC & WAGON 2 DEF) */}
                                <div className="absolute bottom-0 left-[27%] sm:left-[28%] flex flex-col items-center animate-porter-1 filter drop-shadow-md">
                                    <svg width="58" height="72" viewBox="0 0 58 72" fill="none">
                                        {/* Snap-on Royal Blue Toy Porter Cap */}
                                        <path d="M15 13 C15 6 43 6 43 13 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
                                        <rect x="12" y="13" width="34" height="4" rx="2" fill="#F59E0B" />
                                        <path d="M11 17 Q29 20 47 17" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="29" cy="10" r="2.2" fill="#FDE047" stroke="#D97706" strokeWidth="0.8" />
                                        
                                        {/* Cylindrical Yellow Toy Peg Head */}
                                        <rect x="20" y="16" width="18" height="15" rx="5" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
                                        {/* Forehead Specular Highlight */}
                                        <path d="M23 18 Q29 19.5 35 18" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" strokeLinecap="round" />
                                        {/* Big Sparkly Toy Eyes */}
                                        <circle cx="24.5" cy="22" r="1.6" fill="#0F172A" />
                                        <circle cx="24.9" cy="21.5" r="0.6" fill="#FFFFFF" />
                                        <circle cx="33.5" cy="22" r="1.6" fill="#0F172A" />
                                        <circle cx="33.9" cy="21.5" r="0.6" fill="#FFFFFF" />
                                        {/* Rosy Pink Toy Cheeks */}
                                        <circle cx="22.5" cy="25" r="1.5" fill="#FB7185" opacity="0.6" />
                                        <circle cx="35.5" cy="25" r="1.5" fill="#FB7185" opacity="0.6" />
                                        {/* Wide Happy Toy Smile */}
                                        <path d="M25.5 25.5 Q29 28.5 32.5 25.5" stroke="#9A3412" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                                        
                                        {/* Trapezoidal Royal Blue Toy Torso */}
                                        <polygon points="19,32 39,32 42,50 16,50" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
                                        {/* Red Toy Collar */}
                                        <polygon points="25,32 33,32 30,36 28,36" fill="#EF4444" />
                                        {/* Painted Double-Breasted Gold Toy Buttons */}
                                        <circle cx="26" cy="38" r="1.4" fill="#FDE047" />
                                        <circle cx="32" cy="38" r="1.4" fill="#FDE047" />
                                        <circle cx="26" cy="43" r="1.4" fill="#FDE047" />
                                        <circle cx="32" cy="43" r="1.4" fill="#FDE047" />
                                        {/* Black Toy Belt & Silver Buckle */}
                                        <rect x="16" y="47.5" width="26" height="3" fill="#0F172A" />
                                        <rect x="27" y="47" width="4" height="4" rx="0.8" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.8" />

                                        {/* 1. Empty Arms (Relaxed at sides with iconic C-clip hands) */}
                                        <g className="p1-arms-empty">
                                            {/* Left Arm & Hand */}
                                            <path d="M19 34 L11 43 L13 52" stroke="#2563EB" strokeWidth="4.5" strokeLinecap="round" />
                                            {/* Yellow C-Clip Toy Hand */}
                                            <path d="M11 50 C8 51, 8 55, 12 56 C14 56.5, 15 54, 13 52" stroke="#FCD34D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                            
                                            {/* Right Arm & Hand */}
                                            <path d="M39 34 L47 43 L45 52" stroke="#2563EB" strokeWidth="4.5" strokeLinecap="round" />
                                            {/* Yellow C-Clip Toy Hand */}
                                            <path d="M47 50 C50 51, 50 55, 46 56 C44 56.5, 43 54, 45 52" stroke="#FCD34D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                        </g>

                                        {/* 2. Reaching Down Arms (Stretching forward into wagon with C-clips) */}
                                        <g className="p1-arms-reach">
                                            <path d="M19 34 L13 46 L17 58" stroke="#2563EB" strokeWidth="4.5" strokeLinecap="round" />
                                            <circle cx="17" cy="58" r="3" fill="#FCD34D" />
                                            <path d="M39 34 L45 46 L41 58" stroke="#2563EB" strokeWidth="4.5" strokeLinecap="round" />
                                            <circle cx="41" cy="58" r="3" fill="#FCD34D" />
                                        </g>

                                        {/* 3. Carrying BIG TOY CRATE [A][B][C] (Heaved in both C-clip hands) */}
                                        <g className="p1-held-abc">
                                            <path d="M19 34 L6 42 L8 47" stroke="#2563EB" strokeWidth="4.8" strokeLinecap="round" />
                                            <path d="M39 34 L52 42 L50 47" stroke="#2563EB" strokeWidth="4.8" strokeLinecap="round" />
                                            {/* C-Clip Hands clipping onto crate */}
                                            <circle cx="7" cy="46" r="3.2" fill="#FCD34D" />
                                            <circle cx="51" cy="46" r="3.2" fill="#FCD34D" />
                                            {/* 3 Large 3D Toy Alphabet Blocks */}
                                            <g filter="drop-shadow(0 4px 10px rgba(0,0,0,0.4))">
                                                <rect x="6" y="32" width="15" height="19" rx="3" fill="#DC2626" stroke="#B91C1C" strokeWidth="1.4" />
                                                <rect x="8" y="34" width="11" height="3" rx="1" fill="#FFF" opacity="0.5" />
                                                <text x="13.5" y="46" fill="#FFF" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">A</text>

                                                <rect x="21.5" y="32" width="15" height="19" rx="3" fill="#F59E0B" stroke="#D97706" strokeWidth="1.4" />
                                                <rect x="23.5" y="34" width="11" height="3" rx="1" fill="#FFF" opacity="0.5" />
                                                <text x="29" y="46" fill="#0F172A" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">B</text>

                                                <rect x="37" y="32" width="15" height="19" rx="3" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.4" />
                                                <rect x="39" y="34" width="11" height="3" rx="1" fill="#FFF" opacity="0.5" />
                                                <text x="44.5" y="46" fill="#FFF" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">C</text>
                                            </g>
                                        </g>

                                        {/* 4. Carrying BIG TOY CRATE [D][E][F] (Heaved in both C-clip hands) */}
                                        <g className="p1-held-def">
                                            <path d="M19 34 L6 42 L8 47" stroke="#2563EB" strokeWidth="4.8" strokeLinecap="round" />
                                            <path d="M39 34 L52 42 L50 47" stroke="#2563EB" strokeWidth="4.8" strokeLinecap="round" />
                                            <circle cx="7" cy="46" r="3.2" fill="#FCD34D" />
                                            <circle cx="51" cy="46" r="3.2" fill="#FCD34D" />
                                            {/* 3 Large 3D Toy Alphabet Blocks */}
                                            <g filter="drop-shadow(0 4px 10px rgba(0,0,0,0.4))">
                                                <rect x="6" y="32" width="15" height="19" rx="3" fill="#059669" stroke="#047857" strokeWidth="1.4" />
                                                <rect x="8" y="34" width="11" height="3" rx="1" fill="#FFF" opacity="0.5" />
                                                <text x="13.5" y="46" fill="#FFF" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">D</text>

                                                <rect x="21.5" y="32" width="15" height="19" rx="3" fill="#7C3AED" stroke="#6D28D9" strokeWidth="1.4" />
                                                <rect x="23.5" y="34" width="11" height="3" rx="1" fill="#FFF" opacity="0.5" />
                                                <text x="29" y="46" fill="#FFF" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">E</text>

                                                <rect x="37" y="32" width="15" height="19" rx="3" fill="#EA580C" stroke="#C2410C" strokeWidth="1.4" />
                                                <rect x="39" y="34" width="11" height="3" rx="1" fill="#FFF" opacity="0.5" />
                                                <text x="44.5" y="46" fill="#FFF" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">F</text>
                                            </g>
                                        </g>

                                        {/* 5. Quick Wave Goodbye (50.8% to 55.0% - drops arm right after) */}
                                        <g className="p1-arms-wave">
                                            <path d="M19 34 L11 43 L13 52" stroke="#2563EB" strokeWidth="4.5" strokeLinecap="round" />
                                            <circle cx="11" cy="52" r="3" fill="#FCD34D" />
                                            <path d="M39 34 L48 24 L52 16" stroke="#2563EB" strokeWidth="4.5" strokeLinecap="round" />
                                            {/* Raised Waving C-Clip Toy Hand */}
                                            <path d="M50 14 C52 11, 56 12, 55 16 C54.5 18, 51 18, 50 14" stroke="#FCD34D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                        </g>

                                        {/* Blocky Toy Minifigure Legs */}
                                        <rect x="18" y="50" width="10" height="15" fill="#1E293B" />
                                        <rect x="30" y="50" width="10" height="15" fill="#1E293B" />
                                        {/* Center Joint Seam */}
                                        <line x1="29" y1="50" x2="29" y2="65" stroke="#0F172A" strokeWidth="1.5" />
                                        {/* Blocky Toy Shoes with Peg Hole Indents */}
                                        <rect x="16" y="64" width="12" height="6" rx="1.5" fill="#0F172A" />
                                        <circle cx="22" cy="67" r="1.5" fill="#334155" />
                                        <rect x="30" y="64" width="12" height="6" rx="1.5" fill="#0F172A" />
                                        <circle cx="36" cy="67" r="1.5" fill="#334155" />
                                    </svg>
                                </div>

                                {/* TOY PORTER 2 (EMERALD TOY MINIFIGURE: UNLOADS WAGON 3 GHI) */}
                                <div className="absolute bottom-0 left-[49%] sm:left-[50%] flex flex-col items-center animate-porter-2 filter drop-shadow-md">
                                    <svg width="58" height="72" viewBox="0 0 58 72" fill="none">
                                        {/* Snap-on Emerald Green Toy Porter Cap */}
                                        <path d="M15 13 C15 6 43 6 43 13 Z" fill="#059669" stroke="#047857" strokeWidth="1.5" />
                                        <rect x="12" y="13" width="34" height="4" rx="2" fill="#F59E0B" />
                                        <path d="M11 17 Q29 20 47 17" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="29" cy="10" r="2.2" fill="#FDE047" stroke="#D97706" strokeWidth="0.8" />
                                        
                                        {/* Cylindrical Yellow Toy Peg Head */}
                                        <rect x="20" y="16" width="18" height="15" rx="5" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
                                        {/* Forehead Specular Highlight */}
                                        <path d="M23 18 Q29 19.5 35 18" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" strokeLinecap="round" />
                                        {/* Sparkly Toy Eyes */}
                                        <circle cx="24.5" cy="22" r="1.6" fill="#0F172A" />
                                        <circle cx="24.9" cy="21.5" r="0.6" fill="#FFFFFF" />
                                        <circle cx="33.5" cy="22" r="1.6" fill="#0F172A" />
                                        <circle cx="33.9" cy="21.5" r="0.6" fill="#FFFFFF" />
                                        {/* Rosy Cheeks */}
                                        <circle cx="22.5" cy="25" r="1.5" fill="#FB7185" opacity="0.6" />
                                        <circle cx="35.5" cy="25" r="1.5" fill="#FB7185" opacity="0.6" />
                                        {/* Happy Toy Smile */}
                                        <path d="M25.5 25.5 Q29 28.5 32.5 25.5" stroke="#9A3412" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                                        
                                        {/* Trapezoidal Emerald Green Toy Torso */}
                                        <polygon points="19,32 39,32 42,50 16,50" fill="#059669" stroke="#047857" strokeWidth="1.5" />
                                        {/* Yellow Toy Collar */}
                                        <polygon points="25,32 33,32 30,36 28,36" fill="#FDE047" />
                                        {/* Painted Gold Buttons */}
                                        <circle cx="26" cy="38" r="1.4" fill="#FDE047" />
                                        <circle cx="32" cy="38" r="1.4" fill="#FDE047" />
                                        <circle cx="26" cy="43" r="1.4" fill="#FDE047" />
                                        <circle cx="32" cy="43" r="1.4" fill="#FDE047" />
                                        {/* Black Toy Belt */}
                                        <rect x="16" y="47.5" width="26" height="3" fill="#0F172A" />
                                        <rect x="27" y="47" width="4" height="4" rx="0.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />

                                        {/* 1. Empty Arms (Relaxed at sides with C-clip hands) */}
                                        <g className="p2-arms-empty">
                                            <path d="M19 34 L11 43 L13 52" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" />
                                            <path d="M11 50 C8 51, 8 55, 12 56 C14 56.5, 15 54, 13 52" stroke="#FCD34D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                            <path d="M39 34 L47 43 L45 52" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" />
                                            <path d="M47 50 C50 51, 50 55, 46 56 C44 56.5, 43 54, 45 52" stroke="#FCD34D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                        </g>

                                        {/* 2. Reaching Down Arms */}
                                        <g className="p2-arms-reach">
                                            <path d="M19 34 L13 46 L17 58" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" />
                                            <circle cx="17" cy="58" r="3" fill="#FCD34D" />
                                            <path d="M39 34 L45 46 L41 58" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" />
                                            <circle cx="41" cy="58" r="3" fill="#FCD34D" />
                                        </g>

                                        {/* 3. Carrying BIG TOY CRATE [G][H][I] (Heaved in both C-clip hands) */}
                                        <g className="p2-held-ghi">
                                            <path d="M19 34 L6 42 L8 47" stroke="#059669" strokeWidth="4.8" strokeLinecap="round" />
                                            <path d="M39 34 L52 42 L50 47" stroke="#059669" strokeWidth="4.8" strokeLinecap="round" />
                                            <circle cx="7" cy="46" r="3.2" fill="#FCD34D" />
                                            <circle cx="51" cy="46" r="3.2" fill="#FCD34D" />
                                            {/* 3 Large 3D Toy Alphabet Blocks */}
                                            <g filter="drop-shadow(0 4px 10px rgba(0,0,0,0.4))">
                                                <rect x="6" y="32" width="15" height="19" rx="3" fill="#0891B2" stroke="#0E7490" strokeWidth="1.4" />
                                                <rect x="8" y="34" width="11" height="3" rx="1" fill="#FFF" opacity="0.5" />
                                                <text x="13.5" y="46" fill="#FFF" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">G</text>

                                                <rect x="21.5" y="32" width="15" height="19" rx="3" fill="#DB2777" stroke="#BE185D" strokeWidth="1.4" />
                                                <rect x="23.5" y="34" width="11" height="3" rx="1" fill="#FFF" opacity="0.5" />
                                                <text x="29" y="46" fill="#FFF" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">H</text>

                                                <rect x="37" y="32" width="15" height="19" rx="3" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.4" />
                                                <rect x="39" y="34" width="11" height="3" rx="1" fill="#FFF" opacity="0.5" />
                                                <text x="44.5" y="46" fill="#0F172A" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">I</text>
                                            </g>
                                        </g>

                                        {/* 4. Quick Wave Goodbye (50.8% to 55.0% - drops arm right after) */}
                                        <g className="p2-arms-wave">
                                            <path d="M19 34 L11 43 L13 52" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" />
                                            <circle cx="11" cy="52" r="3" fill="#FCD34D" />
                                            <path d="M39 34 L48 24 L52 16" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" />
                                            <path d="M50 14 C52 11, 56 12, 55 16 C54.5 18, 51 18, 50 14" stroke="#FCD34D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                        </g>

                                        {/* Blocky Toy Minifigure Legs */}
                                        <rect x="18" y="50" width="10" height="15" fill="#334155" />
                                        <rect x="30" y="50" width="10" height="15" fill="#334155" />
                                        <line x1="29" y1="50" x2="29" y2="65" stroke="#0F172A" strokeWidth="1.5" />
                                        <rect x="16" y="64" width="12" height="6" rx="1.5" fill="#0F172A" />
                                        <circle cx="22" cy="67" r="1.5" fill="#475569" />
                                        <rect x="30" y="64" width="12" height="6" rx="1.5" fill="#0F172A" />
                                        <circle cx="36" cy="67" r="1.5" fill="#475569" />
                                    </svg>
                                </div>

                                {/* TOY STATION MASTER (NAVY TOY MINIFIGURE WITH SNAP-ON FLAG) */}
                                <div className="absolute bottom-0 right-4 sm:right-6 flex flex-col items-center animate-station-master filter drop-shadow-md">
                                    <svg width="58" height="72" viewBox="0 0 58 72" fill="none">
                                        {/* Station Master Peaked Toy Cap */}
                                        <path d="M17 12 C17 5 39 5 39 12 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                                        <rect x="14" y="12" width="28" height="4" rx="2" fill="#F59E0B" />
                                        <circle cx="28" cy="9" r="2.2" fill="#FDE047" stroke="#D97706" strokeWidth="0.8" />
                                        
                                        {/* Cylindrical Yellow Toy Peg Head */}
                                        <rect x="20" y="16" width="17" height="15" rx="5" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
                                        <path d="M23 18 Q28.5 19.5 34 18" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" strokeLinecap="round" />
                                        <circle cx="24.5" cy="22" r="1.5" fill="#0F172A" />
                                        <circle cx="24.8" cy="21.5" r="0.5" fill="#FFFFFF" />
                                        <circle cx="32.5" cy="22" r="1.5" fill="#0F172A" />
                                        <circle cx="32.8" cy="21.5" r="0.5" fill="#FFFFFF" />
                                        {/* Dapper Toy Station Master Mustache */}
                                        <path d="M23 25 C25 24 28 24 29 25 C30 24 33 24 35 25" stroke="#451A03" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                                        
                                        {/* Trapezoidal Navy Toy Torso */}
                                        <polygon points="19,32 38,32 41,50 16,50" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                                        {/* Red Toy Necktie */}
                                        <polygon points="27,32 30,32 29,41 28,41" fill="#DC2626" />
                                        {/* Gold Buttons */}
                                        <circle cx="24" cy="38" r="1.3" fill="#F59E0B" />
                                        <circle cx="33" cy="38" r="1.3" fill="#F59E0B" />
                                        <circle cx="24" cy="44" r="1.3" fill="#F59E0B" />
                                        <circle cx="33" cy="44" r="1.3" fill="#F59E0B" />

                                        {/* Left Hand at Side */}
                                        <path d="M19 34 L11 43 L13 52" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                                        <path d="M11 50 C8 51, 8 55, 12 56 C14 56.5, 15 54, 13 52" stroke="#FCD34D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                        
                                        {/* 1. DYNAMIC RED TOY FLAG (Station Master holds during train arrival & halt: 0% to 45.9%) */}
                                        <g className="master-arm-red">
                                            <path d="M38 34 L46 25 L49 14" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                                            <circle cx="49" cy="14" r="3" fill="#FCD34D" />
                                            <line x1="49" y1="22" x2="49" y2="2" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" />
                                            <circle cx="49" cy="2" r="2" fill="#F59E0B" />
                                            <g className="master-red-flutter">
                                                <polygon points="49,3 31,8 49,13" fill="#EF4444" stroke="#DC2626" strokeWidth="1.4" filter="drop-shadow(0 2px 4px rgba(220,38,38,0.4))" />
                                                <circle cx="37" cy="8" r="2" fill="#FEE2E2" opacity="0.6" />
                                            </g>
                                        </g>

                                        {/* 2. DYNAMIC GREEN TOY FLAG (Raised & Actively Waves Back and Forth at 46% to 56%!) */}
                                        <g className="master-arm-green">
                                            <g className="master-green-wave">
                                                <path d="M38 34 L46 25 L49 14" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                                                <circle cx="49" cy="14" r="3" fill="#FCD34D" />
                                                <line x1="49" y1="22" x2="49" y2="2" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" />
                                                <circle cx="49" cy="2" r="2" fill="#F59E0B" />
                                                <polygon points="49,3 31,8 49,13" fill="#22C55E" stroke="#16A34A" strokeWidth="1.4" filter="drop-shadow(0 2px 4px rgba(34,197,94,0.4))" />
                                                <circle cx="37" cy="8" r="2" fill="#DCFCE7" opacity="0.6" />
                                            </g>
                                        </g>

                                        {/* 3. AT EASE RIGHT ARM (Resting down at side after train departs: 56.1% to 100%) */}
                                        <g className="master-arm-empty">
                                            <path d="M38 34 L46 43 L44 52" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                                            <path d="M46 50 C49 51, 49 55, 45 56 C43 56.5, 42 54, 44 52" stroke="#FCD34D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                        </g>

                                        {/* Blocky Toy Minifigure Legs */}
                                        <rect x="18" y="50" width="10" height="15" fill="#0F172A" />
                                        <rect x="29" y="50" width="10" height="15" fill="#0F172A" />
                                        <line x1="28.5" y1="50" x2="28.5" y2="65" stroke="#000000" strokeWidth="1.5" />
                                        <rect x="16" y="64" width="12" height="6" rx="1.5" fill="#000000" />
                                        <rect x="29" y="64" width="12" height="6" rx="1.5" fill="#000000" />
                                    </svg>
                                </div>

                            </div>

                            {/* ============================================================== */}
                            {/* DELIVERED TOY BLOCKS: UNLOADED HORIZONTALLY, GLIDES TO 3x3 ON LEFT */}
                            {/* Initially placed at wagons, then transfers to Left Deck at 50.8% */}
                            {/* ============================================================== */}
                            <div className="platform-cargo-cluster absolute bottom-full left-[37%] sm:left-[38%] flex items-end gap-2 sm:gap-3 z-26 pointer-events-none mb-1 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                                {/* 1st Toy Crate: [A] [B] [C] (Placed down by Porter 1 at 37.2%) */}
                                <div className="flex items-center gap-1 p-1 bg-red-100/95 border-2 border-red-500 rounded-md shadow-md platform-crate-abc">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-red-600 text-[13px] sm:text-[14px] font-black text-white flex items-center justify-center shadow-xs border border-red-700">A</div>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-amber-400 text-[13px] sm:text-[14px] font-black text-slate-900 flex items-center justify-center shadow-xs border border-amber-500">B</div>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-blue-600 text-[13px] sm:text-[14px] font-black text-white flex items-center justify-center shadow-xs border border-blue-700">C</div>
                                </div>
                                {/* 2nd Toy Crate: [D] [E] [F] (Placed down by Porter 1 at 44.0%) */}
                                <div className="flex items-center gap-1 p-1 bg-emerald-100/95 border-2 border-emerald-500 rounded-md shadow-md platform-crate-def">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-emerald-600 text-[13px] sm:text-[14px] font-black text-white flex items-center justify-center shadow-xs border border-emerald-700">D</div>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-purple-600 text-[13px] sm:text-[14px] font-black text-white flex items-center justify-center shadow-xs border border-purple-700">E</div>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-orange-500 text-[13px] sm:text-[14px] font-black text-white flex items-center justify-center shadow-xs border border-orange-600">F</div>
                                </div>
                                {/* 3rd Toy Crate: [G] [H] [I] (Placed down by Porter 2 at 37.2%) */}
                                <div className="flex items-center gap-1 p-1 bg-sky-100/95 border-2 border-sky-500 rounded-md shadow-md platform-crate-ghi">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-cyan-600 text-[13px] sm:text-[14px] font-black text-white flex items-center justify-center shadow-xs border border-cyan-700">G</div>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-pink-500 text-[13px] sm:text-[14px] font-black text-white flex items-center justify-center shadow-xs border border-pink-600">H</div>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-yellow-400 text-[13px] sm:text-[14px] font-black text-slate-900 flex items-center justify-center shadow-xs border border-yellow-500">I</div>
                                </div>
                            </div>
                        </div>

                        {/* AUTHENTIC TOY BUILDING BRICKS FOUNDATION WALL (2 Clean Compact Rows of Lego-style Bricks with 3D Studs - Lowered Platform) */}
                        <div className="w-full h-[22px] bg-slate-100 border-x-2 border-b-2 border-slate-400 flex flex-col justify-between p-0.5 shadow-xs relative overflow-hidden">
                            {/* Row 1: Bright Colorful Primary Toy Blocks */}
                            <div className="w-full h-[8px] flex gap-1">
                                {[
                                    { color: 'bg-red-500 border-red-600' },
                                    { color: 'bg-blue-500 border-blue-600' },
                                    { color: 'bg-yellow-400 border-yellow-500' },
                                    { color: 'bg-green-500 border-green-600' },
                                    { color: 'bg-orange-500 border-orange-600' },
                                    { color: 'bg-purple-500 border-purple-600' },
                                    { color: 'bg-cyan-500 border-cyan-600' },
                                    { color: 'bg-pink-500 border-pink-600' },
                                    { color: 'bg-emerald-500 border-emerald-600' },
                                    { color: 'bg-amber-500 border-amber-600' },
                                    { color: 'bg-indigo-500 border-indigo-600' },
                                    { color: 'bg-rose-500 border-rose-600' },
                                ].map((b, i) => (
                                    <div key={i} className={`flex-1 h-full ${b.color} border rounded-xs shadow-xs relative flex items-center justify-around px-0.5`}>
                                        <div className="w-1 h-1 rounded-full bg-white opacity-40 shadow-inner"></div>
                                        <div className="w-1 h-1 rounded-full bg-white opacity-40 shadow-inner"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Row 2: Staggered Colorful Toy Blocks */}
                            <div className="w-full h-[8px] flex gap-1">
                                {[
                                    { color: 'bg-blue-500 border-blue-600' },
                                    { color: 'bg-yellow-400 border-yellow-500' },
                                    { color: 'bg-green-500 border-green-600' },
                                    { color: 'bg-red-500 border-red-600' },
                                    { color: 'bg-purple-500 border-purple-600' },
                                    { color: 'bg-orange-500 border-orange-600' },
                                    { color: 'bg-pink-500 border-pink-600' },
                                    { color: 'bg-cyan-500 border-cyan-600' },
                                    { color: 'bg-amber-500 border-amber-600' },
                                    { color: 'bg-emerald-500 border-emerald-600' },
                                    { color: 'bg-rose-500 border-rose-600' },
                                    { color: 'bg-indigo-500 border-indigo-600' },
                                ].map((b, i) => (
                                    <div key={i} className={`flex-1 h-full ${b.color} border rounded-xs shadow-xs relative flex items-center justify-around px-0.5`}>
                                        <div className="w-1 h-1 rounded-full bg-white opacity-40 shadow-inner"></div>
                                        <div className="w-1 h-1 rounded-full bg-white opacity-40 shadow-inner"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ============================================================== */}
            {/* 2. MEDIUM-SIZE RAILWAY TRACK (38px tall) & DIRECT TRAIN RUN    */}
            {/* ============================================================== */}
            <div className="w-full relative z-20">
                
                {/* MEDIUM SOLID REALISTIC TRACK BED (38px tall, sleek & balanced) */}
                <div className="w-full h-[38px] relative bg-[#e7e5e4] border-t border-slate-300 shadow-xs">
                    
                    {/* Crushed Granite Ballast Gravel Texture */}
                    <div
                        className="absolute inset-0 opacity-40 pointer-events-none"
                        style={{
                            backgroundImage:
                                'radial-gradient(#78716c 1px, transparent 1px), radial-gradient(#a8a29e 1px, transparent 1px)',
                            backgroundSize: '16px 16px',
                            backgroundPosition: '0 0, 8px 8px'
                        }}
                    ></div>

                    {/* Ballast Top Earth/Stone Ridge Line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#d6d3d1]"></div>

                    {/* Wooden Cross-Ties (Sleepers): Authentic timber blocks spaced every 28px */}
                    <div
                        className="absolute top-[8px] left-0 right-0 h-[12px]"
                        style={{
                            backgroundImage: `repeating-linear-gradient(
                                90deg,
                                #3b2219 0px,
                                #3b2219 14px,
                                #23140e 14px,
                                #23140e 16px,
                                transparent 16px,
                                transparent 28px
                            )`
                        }}
                    >
                        {/* Steel Tie Plates on top of each wooden tie */}
                        <div
                            className="w-full h-[3px]"
                            style={{
                                backgroundImage: `repeating-linear-gradient(
                                    90deg,
                                    #1e293b 0px,
                                    #1e293b 12px,
                                    transparent 12px,
                                    transparent 28px
                                )`
                            }}
                        ></div>
                    </div>

                    {/* HIGH-CONTRAST 3D STEEL RAIL (Medium Height: 6px total) */}
                    <div className="absolute top-[6px] left-0 right-0 z-10 flex flex-col pointer-events-none">
                        {/* Polished Steel Rail Top Surface (Where wheels firmly roll) */}
                        <div className="w-full h-[3px] bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-t border-slate-500 shadow-xs"></div>
                        {/* Metallic Crown Silver Reflection */}
                        <div className="w-full h-[1px] bg-slate-300"></div>
                        {/* Rail Web & Base Flange */}
                        <div className="w-full h-[2.5px] bg-[#1e293b] border-b border-black/40"></div>
                    </div>

                    {/* Ballast Base Shadow Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-t from-slate-300/50 to-transparent"></div>

                    {/* ========================================================== */}
                    {/* THE STEAM TRAIN: Sits 100% IN DIRECT PHYSICAL CONTACT      */}
                    {/* Positioned at bottom-[31px]: Wheels roll FIRMLY on rail!   */}
                    {/* ========================================================== */}
                    <div className="animate-train-station-stop flex items-end pointer-events-none z-30">
                        <div className="flex items-end filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)] animate-train-chug">

                            {/* CABOOSE: Vintage Red Guard's Van at the rear */}
                            <div className="relative mr-2 flex items-end">
                                <div className="absolute -right-3 bottom-4 w-3.5 h-1.5 bg-slate-900 z-0"></div>
                                <svg width="102" height="84" viewBox="0 0 102 84" fill="none">
                                    <rect x="32" y="20" width="38" height="14" rx="3" fill="#DC2626" stroke="#B91C1C" strokeWidth="2" />
                                    <rect x="38" y="23" width="26" height="7" rx="1.5" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
                                    <rect x="8" y="32" width="86" height="36" rx="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
                                    <rect x="18" y="39" width="14" height="14" rx="2" fill="#FEF08A" stroke="#B45309" strokeWidth="1.5" />
                                    <rect x="70" y="39" width="14" height="14" rx="2" fill="#FEF08A" stroke="#B45309" strokeWidth="1.5" />
                                    <circle cx="8" cy="45" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                                    <path d="M8 56 L2 56 L2 68 M94 56 L100 56 L100 68" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                                    <rect x="2" y="67" width="98" height="6" rx="2" fill="#0F172A" />
                                    
                                    {/* Wheels */}
                                    <g className="spin-train-wheel" style={{ transformOrigin: '24px 74px' }}>
                                        <circle cx="24" cy="74" r="8" fill="#1E293B" stroke="#D97706" strokeWidth="2.5" />
                                        <line x1="24" y1="66" x2="24" y2="82" stroke="#D97706" strokeWidth="1.5" />
                                        <line x1="16" y1="74" x2="32" y2="74" stroke="#D97706" strokeWidth="1.5" />
                                        <circle cx="24" cy="74" r="3" fill="#FFFFFF" />
                                    </g>
                                    <g className="spin-train-wheel" style={{ transformOrigin: '78px 74px' }}>
                                        <circle cx="78" cy="74" r="8" fill="#1E293B" stroke="#D97706" strokeWidth="2.5" />
                                        <line x1="78" y1="66" x2="78" y2="82" stroke="#D97706" strokeWidth="1.5" />
                                        <line x1="70" y1="74" x2="86" y2="74" stroke="#D97706" strokeWidth="1.5" />
                                        <circle cx="78" cy="74" r="3" fill="#FFFFFF" />
                                    </g>
                                </svg>
                            </div>

                            {/* ============================================================== */}
                            {/* WAGON 1 (Rear/Left): BIG VISIBLE TOY BLOCKS [A] [B] [C]        */}
                            {/* ALWAYS ARRIVES 100% LOADED -> Porters unload at station       */}
                            {/* ============================================================== */}
                            <div className="relative mr-2 flex items-end">
                                <div className="absolute -right-3 bottom-4 w-3.5 h-1.5 bg-slate-900 z-0"></div>
                                <svg width="122" height="84" viewBox="0 0 122 84" fill="none">
                                    {/* 3 Large Toy Blocks: A, B, C (Fully Loaded on Arrival -> Unloaded by Porter 1 at 32.2%) */}
                                    <g className="wagon1-crate">
                                        <rect x="11" y="16" width="30" height="30" rx="4" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
                                        <rect x="13" y="18" width="26" height="5" rx="1.5" fill="#FFFFFF" opacity="0.4" />
                                        <text x="26" y="38" fill="#FFFFFF" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">A</text>

                                        <rect x="46" y="16" width="30" height="30" rx="4" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
                                        <rect x="48" y="18" width="26" height="5" rx="1.5" fill="#FFFFFF" opacity="0.4" />
                                        <text x="61" y="38" fill="#0F172A" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">B</text>

                                        <rect x="81" y="16" width="30" height="30" rx="4" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
                                        <rect x="83" y="18" width="26" height="5" rx="1.5" fill="#FFFFFF" opacity="0.4" />
                                        <text x="96" y="38" fill="#FFFFFF" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">C</text>
                                    </g>

                                    {/* Flatbed Wagon Bed */}
                                    <rect x="6" y="46" width="110" height="21" rx="3" fill="#DC2626" stroke="#B91C1C" strokeWidth="2" />
                                    <rect x="12" y="51" width="98" height="9" rx="1.5" fill="#F87171" />
                                    <text x="61" y="58" fill="#FEF2F2" fontSize="7.5" fontWeight="900" textAnchor="middle" letterSpacing="1">CARGO · ABC</text>
                                    <rect x="4" y="67" width="114" height="6" rx="2" fill="#0F172A" />

                                    {/* Wheels */}
                                    <g className="spin-train-wheel" style={{ transformOrigin: '28px 74px' }}>
                                        <circle cx="28" cy="74" r="8" fill="#1E293B" stroke="#D97706" strokeWidth="2.5" />
                                        <line x1="28" y1="66" x2="28" y2="82" stroke="#D97706" strokeWidth="1.5" />
                                        <line x1="20" y1="74" x2="36" y2="74" stroke="#D97706" strokeWidth="1.5" />
                                        <circle cx="28" cy="74" r="3" fill="#FFFFFF" />
                                    </g>
                                    <g className="spin-train-wheel" style={{ transformOrigin: '94px 74px' }}>
                                        <circle cx="94" cy="74" r="8" fill="#1E293B" stroke="#D97706" strokeWidth="2.5" />
                                        <line x1="94" y1="66" x2="94" y2="82" stroke="#D97706" strokeWidth="1.5" />
                                        <line x1="86" y1="74" x2="102" y2="74" stroke="#D97706" strokeWidth="1.5" />
                                        <circle cx="94" cy="74" r="3" fill="#FFFFFF" />
                                    </g>
                                </svg>
                            </div>

                            {/* ============================================================== */}
                            {/* WAGON 2 (Center): BIG VISIBLE TOY BLOCKS [D] [E] [F]           */}
                            {/* ALWAYS ARRIVES 100% LOADED -> Porters unload at station       */}
                            {/* ============================================================== */}
                            <div className="relative mr-2 flex items-end">
                                <div className="absolute -right-3 bottom-4 w-3.5 h-1.5 bg-slate-900 z-0"></div>
                                <svg width="122" height="84" viewBox="0 0 122 84" fill="none">
                                    {/* 3 Large Toy Blocks: D, E, F (Fully Loaded on Arrival -> Unloaded by Porter 1 at 36.6%) */}
                                    <g className="wagon2-crate">
                                        <rect x="11" y="16" width="30" height="30" rx="4" fill="#059669" stroke="#047857" strokeWidth="2" />
                                        <rect x="13" y="18" width="26" height="5" rx="1.5" fill="#FFFFFF" opacity="0.4" />
                                        <text x="26" y="38" fill="#FFFFFF" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">D</text>

                                        <rect x="46" y="16" width="30" height="30" rx="4" fill="#7C3AED" stroke="#5B21B6" strokeWidth="2" />
                                        <rect x="48" y="18" width="26" height="5" rx="1.5" fill="#FFFFFF" opacity="0.4" />
                                        <text x="61" y="38" fill="#FFFFFF" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">E</text>

                                        <rect x="81" y="16" width="30" height="30" rx="4" fill="#EA580C" stroke="#C2410C" strokeWidth="2" />
                                        <rect x="83" y="18" width="26" height="5" rx="1.5" fill="#FFFFFF" opacity="0.4" />
                                        <text x="96" y="38" fill="#FFFFFF" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">F</text>
                                    </g>

                                    {/* Flatbed Wagon Bed */}
                                    <rect x="6" y="46" width="110" height="21" rx="3" fill="#059669" stroke="#047857" strokeWidth="2" />
                                    <rect x="12" y="51" width="98" height="9" rx="1.5" fill="#34D399" />
                                    <text x="61" y="58" fill="#ECFDF5" fontSize="7.5" fontWeight="900" textAnchor="middle" letterSpacing="1">CARGO · DEF</text>
                                    <rect x="4" y="67" width="114" height="6" rx="2" fill="#0F172A" />

                                    {/* Wheels */}
                                    <g className="spin-train-wheel" style={{ transformOrigin: '28px 74px' }}>
                                        <circle cx="28" cy="74" r="8" fill="#1E293B" stroke="#D97706" strokeWidth="2.5" />
                                        <line x1="28" y1="66" x2="28" y2="82" stroke="#D97706" strokeWidth="1.5" />
                                        <line x1="20" y1="74" x2="36" y2="74" stroke="#D97706" strokeWidth="1.5" />
                                        <circle cx="28" cy="74" r="3" fill="#FFFFFF" />
                                    </g>
                                    <g className="spin-train-wheel" style={{ transformOrigin: '94px 74px' }}>
                                        <circle cx="94" cy="74" r="8" fill="#1E293B" stroke="#D97706" strokeWidth="2.5" />
                                        <line x1="94" y1="66" x2="94" y2="82" stroke="#D97706" strokeWidth="1.5" />
                                        <line x1="86" y1="74" x2="102" y2="74" stroke="#D97706" strokeWidth="1.5" />
                                        <circle cx="94" cy="74" r="3" fill="#FFFFFF" />
                                    </g>
                                </svg>
                            </div>

                            {/* ============================================================== */}
                            {/* WAGON 3 (Right/Front): BIG VISIBLE TOY BLOCKS [G] [H] [I]      */}
                            {/* ALWAYS ARRIVES 100% LOADED -> Porters unload at station       */}
                            {/* ============================================================== */}
                            <div className="relative mr-2 flex items-end">
                                <div className="absolute -right-3 bottom-4 w-3.5 h-1.5 bg-slate-900 z-0"></div>
                                <svg width="122" height="84" viewBox="0 0 122 84" fill="none">
                                    {/* 3 Large Toy Blocks: G, H, I (Fully Loaded on Arrival -> Unloaded by Porter 2 at 32.2%) */}
                                    <g className="wagon3-crate">
                                        <rect x="11" y="16" width="30" height="30" rx="4" fill="#0891B2" stroke="#0E7490" strokeWidth="2" />
                                        <rect x="13" y="18" width="26" height="5" rx="1.5" fill="#FFFFFF" opacity="0.4" />
                                        <text x="26" y="38" fill="#FFFFFF" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">G</text>

                                        <rect x="46" y="16" width="30" height="30" rx="4" fill="#DB2777" stroke="#9D174D" strokeWidth="2" />
                                        <rect x="48" y="18" width="26" height="5" rx="1.5" fill="#FFFFFF" opacity="0.4" />
                                        <text x="61" y="38" fill="#FFFFFF" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">H</text>

                                        <rect x="81" y="16" width="30" height="30" rx="4" fill="#EAB308" stroke="#A16207" strokeWidth="2" />
                                        <rect x="83" y="18" width="26" height="5" rx="1.5" fill="#FFFFFF" opacity="0.5" />
                                        <text x="96" y="38" fill="#0F172A" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">I</text>
                                    </g>

                                    {/* Flatbed Wagon Bed */}
                                    <rect x="6" y="46" width="110" height="21" rx="3" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
                                    <rect x="12" y="51" width="98" height="9" rx="1.5" fill="#38BDF8" />
                                    <text x="61" y="58" fill="#E0F2FE" fontSize="7.5" fontWeight="900" textAnchor="middle" letterSpacing="1">CARGO · GHI</text>
                                    <rect x="4" y="67" width="114" height="6" rx="2" fill="#0F172A" />

                                    {/* Wheels */}
                                    <g className="spin-train-wheel" style={{ transformOrigin: '28px 74px' }}>
                                        <circle cx="28" cy="74" r="8" fill="#1E293B" stroke="#D97706" strokeWidth="2.5" />
                                        <line x1="28" y1="66" x2="28" y2="82" stroke="#D97706" strokeWidth="1.5" />
                                        <line x1="20" y1="74" x2="36" y2="74" stroke="#D97706" strokeWidth="1.5" />
                                        <circle cx="28" cy="74" r="3" fill="#FFFFFF" />
                                    </g>
                                    <g className="spin-train-wheel" style={{ transformOrigin: '94px 74px' }}>
                                        <circle cx="94" cy="74" r="8" fill="#1E293B" stroke="#D97706" strokeWidth="2.5" />
                                        <line x1="94" y1="66" x2="94" y2="82" stroke="#D97706" strokeWidth="1.5" />
                                        <line x1="86" y1="74" x2="102" y2="74" stroke="#D97706" strokeWidth="1.5" />
                                        <circle cx="94" cy="74" r="3" fill="#FFFFFF" />
                                    </g>
                                </svg>
                            </div>

                            {/* WAGON: Coal Tender ("LITTLE JOYS") */}
                            <div className="relative mr-2 flex items-end">
                                <div className="absolute -right-3 bottom-4 w-3.5 h-1.5 bg-slate-900 z-0"></div>
                                <svg width="86" height="84" viewBox="0 0 86 84" fill="none">
                                    <circle cx="26" cy="38" r="8" fill="#0F172A" />
                                    <circle cx="40" cy="34" r="9" fill="#1E293B" />
                                    <circle cx="54" cy="37" r="8" fill="#0F172A" />
                                    <rect x="10" y="40" width="68" height="27" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                                    <rect x="16" y="45" width="56" height="16" rx="2" fill="#334155" />
                                    <text x="44" y="56" fill="#F59E0B" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="1">
                                        LITTLE JOYS
                                    </text>
                                    <rect x="6" y="67" width="76" height="5" rx="1.5" fill="#0F172A" />

                                    {/* Wheels */}
                                    <g className="spin-train-wheel" style={{ transformOrigin: '26px 74px' }}>
                                        <circle cx="26" cy="74" r="8" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
                                        <line x1="26" y1="66" x2="26" y2="82" stroke="#94A3B8" strokeWidth="1.5" />
                                        <line x1="18" y1="74" x2="34" y2="74" stroke="#94A3B8" strokeWidth="1.5" />
                                        <circle cx="26" cy="74" r="2.5" fill="#FFFFFF" />
                                    </g>
                                    <g className="spin-train-wheel" style={{ transformOrigin: '62px 74px' }}>
                                        <circle cx="62" cy="74" r="8" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
                                        <line x1="62" y1="66" x2="62" y2="82" stroke="#94A3B8" strokeWidth="1.5" />
                                        <line x1="54" y1="74" x2="70" y2="74" stroke="#94A3B8" strokeWidth="1.5" />
                                        <circle cx="62" cy="74" r="2.5" fill="#FFFFFF" />
                                    </g>
                                </svg>
                            </div>

                            {/* GRAND REALISTIC STEAM LOCOMOTIVE ENGINE (Leading Front) */}
                            <div className="relative flex items-end">
                                
                                {/* AUTHENTIC BILLOWING BLACK SMOKE CLOUDS EMITTING FROM FUNNEL */}
                                <div className="absolute -top-3 left-[96px] pointer-events-none z-40">
                                    <div className="absolute top-0 left-0 black-puff-1">
                                        <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
                                            <circle cx="14" cy="18" r="10" fill="#09090b" />
                                            <circle cx="24" cy="14" r="12" fill="#18181b" />
                                            <circle cx="30" cy="20" r="9" fill="#09090b" />
                                            <circle cx="18" cy="20" r="9" fill="#27272a" />
                                            <circle cx="22" cy="11" r="5" fill="#3f3f46" opacity="0.6" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-0 left-0 black-puff-2">
                                        <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
                                            <circle cx="15" cy="20" r="11" fill="#09090b" />
                                            <circle cx="26" cy="16" r="13" fill="#18181b" />
                                            <circle cx="34" cy="22" r="10" fill="#09090b" />
                                            <circle cx="20" cy="22" r="10" fill="#27272a" />
                                            <circle cx="24" cy="12" r="5.5" fill="#3f3f46" opacity="0.6" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-0 left-0 black-puff-3">
                                        <svg width="48" height="38" viewBox="0 0 48 38" fill="none">
                                            <circle cx="16" cy="22" r="12" fill="#18181b" />
                                            <circle cx="28" cy="17" r="14" fill="#09090b" />
                                            <circle cx="37" cy="24" r="11" fill="#18181b" />
                                            <circle cx="22" cy="24" r="11" fill="#27272a" />
                                            <circle cx="26" cy="13" r="6" fill="#3f3f46" opacity="0.6" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-0 left-0 black-puff-4">
                                        <svg width="52" height="42" viewBox="0 0 52 42" fill="none">
                                            <circle cx="18" cy="24" r="13" fill="#09090b" />
                                            <circle cx="31" cy="19" r="15" fill="#18181b" />
                                            <circle cx="41" cy="26" r="12" fill="#09090b" />
                                            <circle cx="24" cy="26" r="12" fill="#27272a" />
                                            <circle cx="29" cy="15" r="6.5" fill="#3f3f46" opacity="0.6" />
                                        </svg>
                                    </div>
                                </div>

                                <svg width="250" height="84" viewBox="0 0 250 84" fill="none">
                                    <rect x="6" y="10" width="46" height="54" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
                                    <path d="M2 12 C2 7 14 5 29 5 C44 5 56 7 56 12 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
                                    <rect x="14" y="18" width="24" height="22" rx="3" fill="#FEF08A" stroke="#B45309" strokeWidth="2" />
                                    <circle cx="26" cy="28" r="5" fill="#FED7AA" />
                                    <circle cx="24" cy="27" r="1" fill="#1E293B" />
                                    <circle cx="28" cy="27" r="1" fill="#1E293B" />
                                    <path d="M20 23 L32 23 L30 20 L22 20 Z" fill="#2563EB" />

                                    {/* Red Boiler with Gilded Brass Boiler Bands */}
                                    <rect x="50" y="24" width="76" height="40" rx="6" fill="#DC2626" stroke="#991B1B" strokeWidth="2.5" />
                                    <line x1="74" y1="24" x2="74" y2="64" stroke="#FBBF24" strokeWidth="3" />
                                    <line x1="102" y1="24" x2="102" y2="64" stroke="#FBBF24" strokeWidth="3" />

                                    {/* Smokebox & Tall Steam Funnel */}
                                    <path d="M102 24 L105 8 L121 5 L124 24 Z" fill="#0F172A" stroke="#000000" strokeWidth="2" />
                                    <ellipse cx="113" cy="6.5" rx="8" ry="2.5" fill="#FBBF24" />

                                    {/* Brass Steam Dome & Bell */}
                                    <path d="M66 24 C66 16 78 16 78 24 Z" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
                                    <circle cx="89" cy="20" r="3.5" fill="#FDE047" stroke="#B45309" strokeWidth="1" />

                                    {/* Front Brass Headlight */}
                                    <rect x="126" y="32" width="12" height="12" rx="2" fill="#0F172A" stroke="#000000" strokeWidth="1.5" />
                                    <circle cx="135" cy="38" r="5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />

                                    {/* Headlight Beam */}
                                    <polygon points="138,38 230,16 230,60" fill="#FEF08A" fillOpacity="0.3" />

                                    {/* Front Cowcatcher / Pilot Grill */}
                                    <polygon points="126,64 150,64 144,54 126,54" fill="#0F172A" stroke="#000000" strokeWidth="1.5" />
                                    <line x1="131" y1="54" x2="134" y2="64" stroke="#94A3B8" strokeWidth="2" />
                                    <line x1="137" y1="54" x2="141" y2="64" stroke="#94A3B8" strokeWidth="2" />

                                    {/* Heavy Steel Chassis */}
                                    <rect x="2" y="63" width="138" height="6" rx="2" fill="#0F172A" />

                                    {/* Front Leading Pilot Wheel */}
                                    <g className="spin-train-wheel" style={{ transformOrigin: '112px 74.5px' }}>
                                        <circle cx="112" cy="74.5" r="7.5" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
                                        <line x1="112" y1="67" x2="112" y2="82" stroke="#94A3B8" strokeWidth="1.5" />
                                        <line x1="104.5" y1="74.5" x2="119.5" y2="74.5" stroke="#94A3B8" strokeWidth="1.5" />
                                        <circle cx="112" cy="74.5" r="3" fill="#FFFFFF" />
                                    </g>

                                    {/* Large Driving Wheel 1 */}
                                    <g className="spin-train-wheel" style={{ transformOrigin: '30px 70px' }}>
                                        <circle cx="30" cy="70" r="12" fill="#DC2626" stroke="#D97706" strokeWidth="3" />
                                        <path d="M19 66 A11 11 0 0 1 41 66 Z" fill="#991B1B" />
                                        <line x1="30" y1="58" x2="30" y2="82" stroke="#D97706" strokeWidth="2" />
                                        <line x1="18" y1="70" x2="42" y2="70" stroke="#D97706" strokeWidth="2" />
                                        <line x1="21.5" y1="61.5" x2="38.5" y2="78.5" stroke="#D97706" strokeWidth="1.5" />
                                        <line x1="21.5" y1="78.5" x2="38.5" y2="61.5" stroke="#D97706" strokeWidth="1.5" />
                                        <circle cx="30" cy="70" r="4.5" fill="#1E293B" stroke="#FBBF24" strokeWidth="1.5" />
                                        <circle cx="30" cy="70" r="1.5" fill="#FFFFFF" />
                                    </g>

                                    {/* Large Driving Wheel 2 */}
                                    <g className="spin-train-wheel" style={{ transformOrigin: '64px 70px' }}>
                                        <circle cx="64" cy="70" r="12" fill="#DC2626" stroke="#D97706" strokeWidth="3" />
                                        <path d="M53 66 A11 11 0 0 1 75 66 Z" fill="#991B1B" />
                                        <line x1="64" y1="58" x2="64" y2="82" stroke="#D97706" strokeWidth="2" />
                                        <line x1="52" y1="70" x2="76" y2="70" stroke="#D97706" strokeWidth="2" />
                                        <line x1="55.5" y1="61.5" x2="72.5" y2="78.5" stroke="#D97706" strokeWidth="1.5" />
                                        <line x1="55.5" y1="78.5" x2="72.5" y2="61.5" stroke="#D97706" strokeWidth="1.5" />
                                        <circle cx="64" cy="70" r="4.5" fill="#1E293B" stroke="#FBBF24" strokeWidth="1.5" />
                                        <circle cx="64" cy="70" r="1.5" fill="#FFFFFF" />
                                    </g>

                                    {/* Heavy Side Rod Connecting Both Drivers */}
                                    <line x1="30" y1="74" x2="64" y2="74" stroke="#E2E8F0" strokeWidth="3.5" strokeLinecap="round" />
                                    <circle cx="30" cy="74" r="2.5" fill="#1E293B" stroke="#FFFFFF" strokeWidth="1" />
                                    <circle cx="64" cy="74" r="2.5" fill="#1E293B" stroke="#FFFFFF" strokeWidth="1" />
                                </svg>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

                </div>
            </div>

            {/* Clean White Bottom Spacing */}
            <div className="w-full h-3 bg-white"></div>
        </section>
    );
};

export default ToyTransitScene;
