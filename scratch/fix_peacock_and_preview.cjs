const fs = require('fs');
const path = require('path');

// 1. Ensure clean_peacock_call.wav is copied to public/sounds/peacock.wav and peacock.ogg
const cleanWavPath = path.join(__dirname, 'clean_peacock_call.wav');
const publicSoundsDir = path.join(__dirname, '..', 'public', 'sounds');

if (fs.existsSync(cleanWavPath)) {
    fs.copyFileSync(cleanWavPath, path.join(publicSoundsDir, 'peacock.wav'));
    fs.copyFileSync(cleanWavPath, path.join(publicSoundsDir, 'peacock.ogg'));
    console.log('[SUCCESS] Copied clean authentic peacock audio to public/sounds/peacock.wav and peacock.ogg');
}

// 2. Fix footer_preview.html
const previewHtmlPath = path.join(__dirname, '..', 'public', 'footer_preview.html');
let html = fs.readFileSync(previewHtmlPath, 'utf8');

// The original peacock SVG that the user loved
const originalPeacockSvg = `<svg viewBox="0 0 96 88" class="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] overflow-visible">
                        <defs>
                            <radialGradient id="pToyBlue" cx="35%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#60A5FA" />
                                <stop offset="35%" stopColor="#2563EB" />
                                <stop offset="75%" stopColor="#1D4ED8" />
                                <stop offset="100%" stopColor="#0F172A" />
                            </radialGradient>
                            <radialGradient id="pToyFan" cx="40%" cy="35%" r="65%">
                                <stop offset="0%" stopColor="#34D399" />
                                <stop offset="60%" stopColor="#059669" />
                                <stop offset="100%" stopColor="#064E3B" />
                            </radialGradient>
                            <linearGradient id="pToyGold" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FEF08A" />
                                <stop offset="50%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#D97706" />
                            </linearGradient>
                            <radialGradient id="pToyBrass" cx="35%" cy="35%" r="65%">
                                <stop offset="0%" stopColor="#FEF08A" />
                                <stop offset="60%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#92400E" />
                            </radialGradient>
                            <linearGradient id="pToyLeg" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#FBBF24" />
                                <stop offset="100%" stopColor="#D97706" />
                            </linearGradient>
                        </defs>

                        <!-- Back Leg (Left) -->
                        <g class="preview-toy-foot-left">
                            <circle cx="38" cy="58" r="4.5" fill="#1E3A8A" stroke="#0F172A" stroke-width="1.5" />
                            <circle cx="38" cy="58" r="2" fill="#FBBF24" />
                            <rect x="36" y="58" width="4.5" height="17" rx="2.2" fill="url(#pToyLeg)" stroke="#B45309" stroke-width="1.5" />
                            <circle cx="38" cy="67" r="3" fill="#F59E0B" stroke="#B45309" stroke-width="1.2" />
                            <path d="M32 75 C32 72 46 72 46 75 C46 77.5 44 79 39 79 C34 79 32 77.5 32 75 Z" fill="#F59E0B" stroke="#92400E" stroke-width="1.8" />
                            <circle cx="34" cy="75" r="1.8" fill="#FDE047" />
                            <circle cx="39" cy="75" r="2.2" fill="#FDE047" />
                            <circle cx="44" cy="75" r="1.8" fill="#FDE047" />
                        </g>

                        <!-- Gorgeous Feather Fan -->
                        <g class="preview-toy-fan">
                            <path d="M34 52 C22 36 10 42 4 54 C0 66 8 76 22 74 C30 72 36 62 38 54 Z" fill="url(#pToyFan)" stroke="#047857" stroke-width="2.2" />

                            <g transform="rotate(-18 28 38)">
                                <path d="M28 30 C33 30 36 36 33 42 C30 46 26 46 23 42 C20 36 23 30 28 30 Z" fill="url(#pToyFan)" stroke="url(#pToyGold)" stroke-width="1.8" />
                                <ellipse cx="28" cy="36" rx="4.8" ry="3.6" fill="#06B6D4" stroke="#0891B2" stroke-width="1" />
                                <circle cx="28" cy="36" r="2.2" fill="#1E1B4B" />
                                <circle cx="27.2" cy="35.2" r="1" fill="#FFFFFF" />
                            </g>

                            <g transform="rotate(-6 16 45)">
                                <path d="M16 38 C21 38 24 44 21 50 C18 54 14 54 11 50 C8 44 11 38 16 38 Z" fill="url(#pToyFan)" stroke="url(#pToyGold)" stroke-width="1.8" />
                                <ellipse cx="16" cy="44" rx="4.8" ry="3.6" fill="#06B6D4" stroke="#0891B2" stroke-width="1" />
                                <circle cx="16" cy="44" r="2.2" fill="#1E1B4B" />
                                <circle cx="15.2" cy="43.2" r="1" fill="#FFFFFF" />
                            </g>

                            <g transform="rotate(8 8 56)">
                                <path d="M8 50 C13 50 16 56 13 61 C10 65 6 65 3 61 C0 56 3 50 8 50 Z" fill="url(#pToyFan)" stroke="url(#pToyGold)" stroke-width="1.8" />
                                <ellipse cx="8" cy="55.5" rx="4.4" ry="3.3" fill="#06B6D4" stroke="#0891B2" stroke-width="1" />
                                <circle cx="8" cy="55.5" r="2" fill="#1E1B4B" />
                                <circle cx="7.3" cy="54.8" r="0.9" fill="#FFFFFF" />
                            </g>

                            <g transform="rotate(-3 18 60)">
                                <path d="M18 54 C23 54 26 60 23 65 C20 69 16 69 13 65 C10 60 13 54 18 54 Z" fill="url(#pToyFan)" stroke="url(#pToyGold)" stroke-width="1.8" />
                                <ellipse cx="18" cy="60" rx="4.6" ry="3.4" fill="#06B6D4" stroke="#0891B2" stroke-width="1" />
                                <circle cx="18" cy="60" r="2" fill="#1E1B4B" />
                                <circle cx="17.3" cy="59.3" r="0.9" fill="#FFFFFF" />
                            </g>

                            <g transform="rotate(-14 28 58)">
                                <path d="M28 52 C33 52 36 58 33 63 C30 67 26 67 23 63 C20 58 23 52 28 52 Z" fill="url(#pToyFan)" stroke="url(#pToyGold)" stroke-width="1.8" />
                                <ellipse cx="28" cy="58" rx="4.5" ry="3.3" fill="#06B6D4" stroke="#0891B2" stroke-width="1" />
                                <circle cx="28" cy="58" r="2" fill="#1E1B4B" />
                                <circle cx="27.3" cy="57.3" r="0.9" fill="#FFFFFF" />
                            </g>
                        </g>

                        <!-- Wind-Up Key -->
                        <g class="preview-toy-key">
                            <line x1="22" y1="46" x2="30" y2="46" stroke="#78350F" stroke-width="3" stroke-linecap="round" />
                            <circle cx="26" cy="46" r="3" fill="url(#pToyBrass)" stroke="#78350F" stroke-width="1.2" />
                            <path d="M26 46 C23 39 16 39 18 45 C19 48 24 47 26 46 Z" fill="url(#pToyBrass)" stroke="#78350F" stroke-width="1.2" />
                            <circle cx="19" cy="43" r="1.3" fill="#78350F" />
                            <path d="M26 46 C29 53 36 53 34 47 C33 44 28 45 26 46 Z" fill="url(#pToyBrass)" stroke="#78350F" stroke-width="1.2" />
                            <circle cx="33" cy="49" r="1.3" fill="#78350F" />
                        </g>

                        <!-- Chubby Body & Wing -->
                        <g class="preview-toy-body">
                            <ellipse cx="45" cy="51" rx="17" ry="15" fill="url(#pToyBlue)" stroke="#1E3A8A" stroke-width="2.4" />
                            <path d="M34 44 C39 39 49 39 55 44" stroke="#BAE6FD" stroke-width="2.2" stroke-linecap="round" opacity="0.8" fill="none" />
                            <ellipse cx="54" cy="51" rx="5" ry="8" fill="#FBBF24" stroke="#D97706" stroke-width="1.5" transform="rotate(-15 54 51)" />
                            <ellipse cx="54" cy="51" rx="3.2" ry="5.5" fill="#FEF08A" transform="rotate(-15 54 51)" />
                            <path d="M36 46 C44 41 53 44 55 50 C52 57 42 59 34 53 Z" fill="#10B981" stroke="#047857" stroke-width="2" />
                            <path d="M39 48 Q46 53 52 49" stroke="#FDE047" stroke-width="2.2" stroke-linecap="round" />
                            <path d="M37 52 Q43 57 48 53" stroke="#5EEAD4" stroke-width="2" stroke-linecap="round" />
                            <circle cx="45" cy="50" r="1.8" fill="#FDE047" />
                        </g>

                        <!-- Head, Crown & Cute Beak -->
                        <g class="preview-toy-head">
                            <path d="M44 44 C42 34 46 24 53 20 C58 20 61 26 57 35 C54 41 51 46 44 48 Z" fill="url(#pToyBlue)" stroke="#1E3A8A" stroke-width="2.4" />
                            <g class="preview-toy-crown">
                                <line x1="53" y1="14" x2="47" y2="5" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" />
                                <circle cx="46" cy="4" r="3.4" fill="#06B6D4" stroke="#F59E0B" stroke-width="1.5" />
                                <circle cx="45" cy="3" r="1.2" fill="#FFFFFF" />

                                <line x1="55" y1="13" x2="55" y2="2" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
                                <circle cx="55" cy="1.5" r="4" fill="#FDE047" stroke="#D97706" stroke-width="1.6" />
                                <circle cx="53.8" cy="0.5" r="1.4" fill="#FFFFFF" />

                                <line x1="57" y1="14" x2="63" y2="5" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" />
                                <circle cx="64" cy="4" r="3.4" fill="#06B6D4" stroke="#F59E0B" stroke-width="1.5" />
                                <circle cx="63" cy="3" r="1.2" fill="#FFFFFF" />
                            </g>

                            <circle cx="55" cy="19" r="11" fill="url(#pToyBlue)" stroke="#1E3A8A" stroke-width="2.4" />
                            <path d="M49 14 C52 11 58 11 61 14" stroke="#BAE6FD" stroke-width="2" stroke-linecap="round" opacity="0.8" fill="none" />

                            <circle cx="57" cy="18" r="4.5" fill="#FEF08A" stroke="#B45309" stroke-width="1.2" />
                            <circle cx="57" cy="18" r="3.5" fill="#0F172A" />
                            <circle cx="55.8" cy="16.8" r="1.5" fill="#FFFFFF" />
                            <circle cx="58.2" cy="19.2" r="0.8" fill="#FFFFFF" />

                            <ellipse cx="52" cy="23" rx="3" ry="2" fill="#FDA4AF" opacity="0.8" />

                            <path d="M63 16 C68 18 73 19 73 20 C73 21 68 22 63 24 Z" fill="#F59E0B" stroke="#B45309" stroke-width="1.8" stroke-linejoin="round" />
                            <line x1="63" y1="20" x2="70" y2="20" stroke="#92400E" stroke-width="1.2" />
                        </g>

                        <!-- Near Leg (Right) -->
                        <g class="preview-toy-foot-right">
                            <circle cx="50" cy="58" r="5" fill="#1E3A8A" stroke="#0F172A" stroke-width="1.5" />
                            <circle cx="50" cy="58" r="2.2" fill="#FDE047" />
                            <rect x="47.5" y="58" width="5" height="17" rx="2.4" fill="url(#pToyLeg)" stroke="#B45309" stroke-width="1.6" />
                            <circle cx="50" cy="67" r="3.2" fill="#F59E0B" stroke="#B45309" stroke-width="1.2" />
                            <path d="M43 75 C43 72 58 72 58 75 C58 77.5 56 79 50.5 79 C45 79 43 77.5 43 75 Z" fill="#F59E0B" stroke="#92400E" stroke-width="1.8" />
                            <circle cx="45.5" cy="75" r="2" fill="#FDE047" />
                            <circle cx="50.5" cy="75" r="2.4" fill="#FDE047" />
                            <circle cx="55.5" cy="75" r="2" fill="#FDE047" />
                        </g>
                    </svg>`;

// Complete and robust HTML block from line 98 to the end of the Peacock section
const targetSection = `    <script>
        let currentAudio = null;
        function playToySound(src, btn) {
            if (currentAudio) {
                try {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                } catch(e) {}
            }
            try {
                const a = new Audio(src);
                a.volume = 0.95;
                a.play().catch(e => console.log('Autoplay notice:', e));
                currentAudio = a;
            } catch(e) {
                console.error('Audio play error:', e);
            }
        }
        function startPeacockWalk(el) {
            el.classList.add('is-walking');
            playToySound('/sounds/peacock.wav', el);
        }
        function stopPeacockWalk(el) {
            el.classList.remove('is-walking');
            if (currentAudio) {
                try {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                } catch(e) {}
                currentAudio = null;
            }
        }
    </script>

    <!-- LIVE 3D CUTE TOY PEACOCK (રમકડાંનો ક્યુટ મોર) -->
    <div class="mb-14 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-500/40 text-white">
        <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <span class="text-3xl">🦚</span>
                <div>
                    <h2 class="font-black text-xl text-white">3D Wind-Up Toy Peacock (રમકડાંનો ચાલતો ક્યુટ મોર)</h2>
                    <p class="text-xs text-emerald-100 font-semibold">100% બાળકોના રમકડાં જેવો મોર - માઉસ પોઇન્ટર ઉપર જાય ત્યારે જ ચાલશે અને મધુર અવાજ કરશે!</p>
                </div>
            </div>
            <span class="text-xs bg-emerald-950 text-emerald-300 border border-emerald-400 px-3 py-1.5 rounded-full font-black">Hover to Walk</span>
        </div>

        <div class="p-8 flex flex-col md:flex-row items-center justify-around gap-8">
            <style>
                /* By default: PEACOCK IS AT REST (સ્થિર છે) */
                .peacock-walk-container .preview-toy-body,
                .peacock-walk-container .preview-toy-head,
                .peacock-walk-container .preview-toy-crown,
                .peacock-walk-container .preview-toy-fan,
                .peacock-walk-container .preview-toy-key,
                .peacock-walk-container .preview-toy-foot-left,
                .peacock-walk-container .preview-toy-foot-right,
                .peacock-walk-container .prev-lawn-strip {
                    animation-play-state: paused !important;
                }

                /* ONLY ON HOVER OR ACTIVE: PEACOCK WALKS AND ANIMATES! (માઉસ જાય ત્યારે જ ચાલે) */
                .peacock-walk-container:hover .preview-toy-body,
                .peacock-walk-container.is-walking .preview-toy-body {
                    animation: pToyWaddle 0.72s ease-in-out infinite !important;
                    animation-play-state: running !important;
                }
                .peacock-walk-container:hover .preview-toy-head,
                .peacock-walk-container.is-walking .preview-toy-head {
                    animation: pToyHeadBob 0.72s cubic-bezier(0.4, 0, 0.2, 1) infinite !important;
                    animation-play-state: running !important;
                }
                .peacock-walk-container:hover .preview-toy-crown,
                .peacock-walk-container.is-walking .preview-toy-crown {
                    animation: pToyCrown 0.36s ease-in-out infinite alternate !important;
                    animation-play-state: running !important;
                }
                .peacock-walk-container:hover .preview-toy-fan,
                .peacock-walk-container.is-walking .preview-toy-fan {
                    animation: pToyFan 0.72s ease-in-out infinite !important;
                    animation-play-state: running !important;
                }
                .peacock-walk-container:hover .preview-toy-key,
                .peacock-walk-container.is-walking .preview-toy-key {
                    animation: pToyKey 0.72s linear infinite !important;
                    animation-play-state: running !important;
                }
                .peacock-walk-container:hover .preview-toy-foot-left,
                .peacock-walk-container.is-walking .preview-toy-foot-left {
                    animation: pToyFootLeft 0.72s ease-in-out infinite !important;
                    animation-play-state: running !important;
                }
                .peacock-walk-container:hover .preview-toy-foot-right,
                .peacock-walk-container.is-walking .preview-toy-foot-right {
                    animation: pToyFootRight 0.72s ease-in-out infinite !important;
                    animation-play-state: running !important;
                }
                .peacock-walk-container:hover .prev-lawn-strip,
                .peacock-walk-container.is-walking .prev-lawn-strip {
                    animation: prevLawnTrack 0.72s linear infinite !important;
                    animation-play-state: running !important;
                }

                .preview-toy-body { transform-origin: 46px 54px; }
                @keyframes pToyWaddle {
                    0%, 100% { transform: translateY(0px) rotate(-2deg); }
                    50%      { transform: translateY(-3px) rotate(2deg); }
                }
                .preview-toy-head { transform-origin: 50px 38px; }
                @keyframes pToyHeadBob {
                    0%, 50%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                    25%, 75%      { transform: translate(3px, 0.8px) rotate(3deg); }
                }
                .preview-toy-crown { transform-origin: 56px 12px; }
                @keyframes pToyCrown { 0% { transform: rotate(-7deg); } 100% { transform: rotate(7deg); } }

                .preview-toy-fan { transform-origin: 28px 52px; }
                @keyframes pToyFan {
                    0%, 100% { transform: rotate(-3.5deg) translateY(0px); }
                    50%      { transform: rotate(3.5deg) translateY(-2px); }
                }

                .preview-toy-key { transform-origin: 26px 46px; }
                @keyframes pToyKey { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                .preview-toy-foot-left { transform-origin: 38px 58px; }
                .preview-toy-foot-right { transform-origin: 50px 58px; }

                @keyframes pToyFootLeft {
                    0%   { transform: translate(5px, 0px) rotate(12deg); }
                    25%  { transform: translate(0px, 0px) rotate(0deg); }
                    50%  { transform: translate(-6px, 0px) rotate(-14deg); }
                    75%  { transform: translate(-1px, -8px) rotate(-4deg); }
                    100% { transform: translate(5px, 0px) rotate(12deg); }
                }

                @keyframes pToyFootRight {
                    0%   { transform: translate(-6px, 0px) rotate(-14deg); }
                    25%  { transform: translate(-1px, -8px) rotate(-4deg); }
                    50%  { transform: translate(5px, 0px) rotate(12deg); }
                    75%  { transform: translate(0px, 0px) rotate(0deg); }
                    100% { transform: translate(-6px, 0px) rotate(-14deg); }
                }

                @keyframes prevLawnTrack {
                    0%   { background-position: 0 0; }
                    100% { background-position: -48px 0; }
                }
                .prev-lawn-strip {
                    background-image: repeating-linear-gradient(90deg, #10B981 0, #10B981 12px, #34D399 12px, #34D399 24px, #059669 24px, #059669 48px);
                }
            </style>

            <div class="flex flex-col items-center">
                <!-- SVG Peacock Walk Display: HOVER TO WALK -->
                <div
                    class="peacock-walk-container relative w-56 h-56 flex flex-col items-center justify-center cursor-pointer select-none group"
                    onmouseenter="startPeacockWalk(this)"
                    onmouseleave="stopPeacockWalk(this)"
                    onclick="startPeacockWalk(this)"
                    title="Hover mouse to watch Peacock walk and hear call!"
                >
                    ${originalPeacockSvg}
                    
                    <!-- Moving Garden Lawn Track under feet -->
                    <div class="w-64 h-3.5 rounded-full overflow-hidden border border-emerald-400/40 shadow-inner prev-lawn-strip mt-2"></div>
                    <div class="mt-2 text-xs font-bold text-emerald-300 opacity-80 group-hover:opacity-100 transition-opacity">
                        🖱️ Hover to Walk
                    </div>
                </div>
            </div>

            <!-- Walk Characteristics List -->
            <div class="max-w-md space-y-3 text-sm">
                <div class="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <span class="text-xl">🦚</span>
                    <div>
                        <strong class="text-emerald-300 block font-bold">100% Real Toy Appearance:</strong>
                        <span class="text-slate-300 text-xs">બાળકોના લાકડાના સુંદર રમકડાં જેવો ગોળમટોળ મોર.</span>
                    </div>
                </div>

                <div class="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <span class="text-xl">🖱️</span>
                    <div>
                        <strong class="text-cyan-300 block font-bold">Interactive Hover-Only Walking:</strong>
                        <span class="text-slate-300 text-xs">માઉસ પોઇન્ટર ઉપર જાય ત્યારે જ ડગલાં ભરીને ચાલશે અને માઉસ હટાવતા જ શાંતિથી ઊભો રહેશે.</span>
                    </div>
                </div>

                <div class="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <span class="text-xl">🎵</span>
                    <div>
                        <strong class="text-amber-300 block font-bold">Authentic Indian Peacock Call:</strong>
                        <span class="text-slate-300 text-xs">અસલી ભારતીય મોરનો મધુર ગહેકતો ટહૂકો (Pee-Huu!), કોઈ પણ કર્કશ અવાજ વગર.</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

// Replace from '<script>' after toy shelf up to the start of '<!-- OPTION 1'
const scriptStartIdx = html.indexOf('<script>\n        let currentAudio = null;');
const nextOptionIdx = html.indexOf('<!-- OPTION 1:');

if (scriptStartIdx !== -1 && nextOptionIdx !== -1) {
    html = html.slice(0, scriptStartIdx) + targetSection + '\n\n    ' + html.slice(nextOptionIdx);
    console.log('[SUCCESS] Replaced section in footer_preview.html');
} else {
    console.log('[WARN] Could not find indices, checking fallback...');
    const fallbackStart = html.indexOf('<script>');
    if (fallbackStart !== -1 && nextOptionIdx !== -1) {
        html = html.slice(0, fallbackStart) + targetSection + '\n\n    ' + html.slice(nextOptionIdx);
        console.log('[SUCCESS] Replaced section with fallback in footer_preview.html');
    }
}

fs.writeFileSync(previewHtmlPath, html, 'utf8');
console.log('[SUCCESS] footer_preview.html is now 100% valid with no syntax errors!');

// 3. Now also update InteractiveToyRow.jsx so the main website also has the original peacock design!
const toyRowPath = path.join(__dirname, '..', 'src', 'components', 'InteractiveToyRow.jsx');
let toyRowCode = fs.readFileSync(toyRowPath, 'utf8');

// Update peacock SVG in InteractiveToyRow to match the beloved design
const toyRowPeacockSvg = `<svg viewBox="0 0 96 88" fill="none" className="w-[48px] h-[44px] xs:w-[58px] xs:h-[53px] sm:w-[72px] sm:h-[66px] md:w-[96px] md:h-[88px] filter drop-shadow-lg relative z-10 overflow-visible">
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
                        </svg>`;

const toy5SvgStart = toyRowCode.indexOf('<svg viewBox="0 0 96 88" fill="none" className="w-[48px] h-[44px]');
if (toy5SvgStart !== -1) {
    const toy5SvgEnd = toyRowCode.indexOf('</svg>', toy5SvgStart);
    if (toy5SvgEnd !== -1) {
        toyRowCode = toyRowCode.slice(0, toy5SvgStart) + toyRowPeacockSvg + toyRowCode.slice(toy5SvgEnd + 6);
        fs.writeFileSync(toyRowPath, toyRowCode, 'utf8');
        console.log('[SUCCESS] Replaced Peacock SVG in InteractiveToyRow.jsx with the beloved original design!');
    }
}
