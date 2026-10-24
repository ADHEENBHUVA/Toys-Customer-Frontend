const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'footer_preview.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update the javascript functions in footer_preview.html
const oldScript = `<script>
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
    </script>`;

const newScript = `<script>
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
                a.onended = () => {
                    stopAllToyAnimations();
                };
            } catch(e) {
                console.error('Audio play error:', e);
            }
        }

        function stopAllToyAnimations() {
            document.querySelectorAll('.is-walking').forEach(el => el.classList.remove('is-walking'));
            document.querySelectorAll('.is-rocking').forEach(el => el.classList.remove('is-rocking'));
            if (currentAudio) {
                try {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                } catch(e) {}
                currentAudio = null;
            }
        }

        function startPeacockWalk(el) {
            stopAllToyAnimations();
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

        function startHorseRock(el) {
            stopAllToyAnimations();
            el.classList.add('is-rocking');
            playToySound('/sounds/horse.mp3', el);
        }
        function stopHorseRock(el) {
            el.classList.remove('is-rocking');
            if (currentAudio) {
                try {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                } catch(e) {}
                currentAudio = null;
            }
        }
    </script>`;

if (content.includes(oldScript)) {
    content = content.replace(oldScript, newScript);
    console.log('Script updated successfully');
} else {
    console.log('Script tag match not exact, checking alternate replace');
}

// 2. Add Live 3D Rocking Horse section after the Peacock section (before Option 1)
const horseSection = `
    <!-- LIVE 3D ROCKING HORSE (રમકડાંનો રોકિંગ ઘોડો - ઉપર નીચે થતો) -->
    <div class="mb-14 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-500/40 text-white">
        <div class="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <span class="text-3xl">🐴</span>
                <div>
                    <h2 class="font-black text-xl text-white">3D Wooden Rocking Horse (લાકડાનો રોકિંગ ઘોડો)</h2>
                    <p class="text-xs text-amber-100 font-semibold">અવાજ આવે ત્યારે જ ઘોડો ઉપર-નીચે (Up & Down Rocking) થશે! માઉસ હટાવતા જ શાંતિથી ઊભો રહેશે.</p>
                </div>
            </div>
            <span class="text-xs bg-amber-950 text-amber-300 border border-amber-400 px-3 py-1.5 rounded-full font-black">Hover to Rock</span>
        </div>

        <div class="p-8 flex flex-col md:flex-row items-center justify-around gap-8">
            <style>
                /* By default: HORSE IS AT REST (શાંતિથી સ્થિર ઊભો છે) */
                .horse-rock-container .preview-horse-svg {
                    transform-origin: 39px 72px;
                    transform: translateY(0px) rotate(0deg) scale(1);
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                /* ONLY ON HOVER OR ACTIVE: HORSE ROCKS UP AND DOWN! (અવાજ આવે ત્યારે જ ઉપર-નીચે હિંચકે છે) */
                .horse-rock-container:hover .preview-horse-svg,
                .horse-rock-container.is-rocking .preview-horse-svg {
                    animation: horseLiveRock 0.55s ease-in-out infinite alternate !important;
                }

                @keyframes horseLiveRock {
                    0% {
                        transform: translateY(-2px) rotate(-22deg) scale(1.14);
                    }
                    50% {
                        transform: translateY(-22px) rotate(0deg) scale(1.22);
                    }
                    100% {
                        transform: translateY(-2px) rotate(22deg) scale(1.14);
                    }
                }
            </style>

            <div class="flex flex-col items-center">
                <!-- SVG Rocking Horse Display: HOVER TO ROCK UP AND DOWN -->
                <div
                    class="horse-rock-container relative w-56 h-56 flex flex-col items-center justify-center cursor-pointer select-none group p-4 bg-white/5 rounded-3xl border border-white/10 hover:border-amber-400/50 transition-all"
                    onmouseenter="startHorseRock(this)"
                    onmouseleave="stopHorseRock(this)"
                    onclick="startHorseRock(this)"
                    title="Hover mouse to watch Horse rock up and down with neigh & hooves sound!"
                >
                    <svg viewBox="0 0 78 78" class="preview-horse-svg w-44 h-44 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] overflow-visible">
                        {/* Horse Head & Ears */}
                        <polygon points="56,19 60,12 53,16" fill="#10B981" stroke="#059669" stroke-width="1.5" />
                        
                        {/* Horse Neck and Head Profile */}
                        <path d="M42 36 L52 20 C54 18 64 21 66 26 C68 31 63 33 58 35 L52 42 Z" fill="#34D399" stroke="#059669" stroke-width="2" />
                        {/* Golden Mane */}
                        <path d="M48 22 C46 25 45 29 47 34" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" />
                        {/* Gentle Eye */}
                        <circle cx="58" cy="24" r="2.2" fill="#0F172A" />
                        <circle cx="57.5" cy="23.5" r="0.8" fill="#FFFFFF" />
                        {/* Bridle & Reins */}
                        <line x1="58" y1="28" x2="52" y2="35" stroke="#DC2626" stroke-width="1.5" />
                        <line x1="64" y1="29" x2="58" y2="28" stroke="#DC2626" stroke-width="1.5" />

                        {/* Horse Torso Body */}
                        <ellipse cx="36" cy="45" rx="18" ry="11" fill="#34D399" stroke="#059669" stroke-width="2" />
                        
                        {/* Red Leather Saddle with Gold Button */}
                        <rect x="30" y="38" width="12" height="12" rx="3" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5" />
                        <circle cx="36" cy="44" r="2.2" fill="#FDE047" />

                        {/* Golden Yarn Tail */}
                        <path d="M18 45 C14 48 12 55 16 58" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" />

                        {/* Legs Extending to Rocker */}
                        <line x1="25" y1="52" x2="18" y2="67" stroke="#059669" stroke-width="3" stroke-linecap="round" />
                        <line x1="47" y1="52" x2="58" y2="67" stroke="#059669" stroke-width="3" stroke-linecap="round" />

                        {/* Curved Wooden Rocking Skids (Natural 3D Rocker) */}
                        <path d="M8 68 Q38 77 68 68" stroke="#B45309" stroke-width="4.5" stroke-linecap="round" fill="none" />
                        <path d="M12 69 Q38 77 64 69" stroke="#FDE68A" stroke-width="1.5" stroke-linecap="round" fill="none" />
                    </svg>

                    <div class="mt-4 text-xs font-bold text-amber-300 opacity-80 group-hover:opacity-100 transition-opacity">
                        🖱️ Hover or Click to Rock Up & Down
                    </div>
                </div>
            </div>

            <!-- Horse Characteristics List -->
            <div class="max-w-md space-y-3 text-sm">
                <div class="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <span class="text-xl">🐴</span>
                    <div>
                        <strong class="text-amber-300 block font-bold">100% Real Rocking Horse Toy:</strong>
                        <span class="text-slate-300 text-xs">તમારા ફોટા જેવો જ અસલી લીલા રંગનો લાકડાનો રોકિંગ ઘોડો લાલ જીન (Saddle) સાથે.</span>
                    </div>
                </div>

                <div class="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <span class="text-xl">↕️</span>
                    <div>
                        <strong class="text-cyan-300 block font-bold">Up & Down Rocking Motion (ઉપર-નીચે હિંચકો):</strong>
                        <span class="text-slate-300 text-xs">માઉસ ઉપર જાય અથવા ક્લિક કરો ત્યારે જ ઘોડો મસ્ત ઉપર-નીચે આગળ-પાછળ હિંચકે છે, બાકી શાંતિથી ઊભો રહે છે.</span>
                    </div>
                </div>

                <div class="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <span class="text-xl">🔊</span>
                    <div>
                        <strong class="text-emerald-300 block font-bold">Authentic Gallop & Neigh Audio:</strong>
                        <span class="text-slate-300 text-xs">અસલી ઘોડાનો હણહણાટ (Whinny/Neigh) અને દોડવાના ડાબલાંનો અવાજ (Clip-Clop).</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

if (!content.includes('3D Wooden Rocking Horse (લાકડાનો રોકિંગ ઘોડો)')) {
    const opt1Marker = '<!-- OPTION 1: 3D Pixar Toyland Panorama';
    if (content.includes(opt1Marker)) {
        content = content.replace(opt1Marker, horseSection + '\n    ' + opt1Marker);
        console.log('Horse section added successfully');
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('File footer_preview.html updated successfully');
