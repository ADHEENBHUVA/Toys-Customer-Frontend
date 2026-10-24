const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'peacock_walk_test.html');
if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\/sounds\/peacock\.ogg/g, '/sounds/peacock.wav');
    content = content.replace(/\/sounds\/car\.ogg/g, '/sounds/car.wav');

    const newPeacockSvg = `<svg viewBox="0 0 96 88" class="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] overflow-visible">
                        <defs>
                            <radialGradient id="pToyBlue" cx="35%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#93C5FD" />
                                <stop offset="25%" stopColor="#3B82F6" />
                                <stop offset="65%" stopColor="#1D4ED8" />
                                <stop offset="100%" stopColor="#0F172A" />
                            </radialGradient>
                            <radialGradient id="pMorEyeCore" cx="40%" cy="35%" r="65%">
                                <stop offset="0%" stopColor="#1E3A8A" />
                                <stop offset="70%" stopColor="#172554" />
                                <stop offset="100%" stopColor="#020617" />
                            </radialGradient>
                            <radialGradient id="pMorFeatherEmerald" cx="45%" cy="35%" r="65%">
                                <stop offset="0%" stopColor="#6EE7B7" />
                                <stop offset="40%" stopColor="#10B981" />
                                <stop offset="80%" stopColor="#047857" />
                                <stop offset="100%" stopColor="#064E3B" />
                            </radialGradient>
                            <linearGradient id="pMorGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FEF08A" />
                                <stop offset="50%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#B45309" />
                            </linearGradient>
                            <radialGradient id="pMorTurquoiseRing" cx="40%" cy="40%" r="60%">
                                <stop offset="0%" stopColor="#67E8F9" />
                                <stop offset="60%" stopColor="#06B6D4" />
                                <stop offset="100%" stopColor="#0E7490" />
                            </radialGradient>
                            <radialGradient id="pToyBrass" cx="35%" cy="35%" r="65%">
                                <stop offset="0%" stopColor="#FEF08A" />
                                <stop offset="60%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#78350F" />
                            </radialGradient>
                            <linearGradient id="pToyWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#FDE68A" />
                                <stop offset="60%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#B45309" />
                            </linearGradient>
                        </defs>

                        <!-- LAYER 1: RADIANT MAJESTIC PEACOCK FEATHER FAN (મોરપીંછનો પંખો) -->
                        <g class="toy-fan-sway">
                            <path
                                d="M34 58 C16 52 8 38 12 24 C18 12 32 4 48 4 C64 4 78 12 84 24 C88 38 80 52 62 58 Z"
                                fill="url(#pMorFeatherEmerald)"
                                stroke="url(#pMorGoldRim)"
                                stroke-width="2.2"
                                opacity="0.95"
                            />
                            <!-- Quill Spines -->
                            <line x1="48" y1="56" x2="16" y2="28" stroke="#FDE047" stroke-width="1.2" stroke-opacity="0.75" />
                            <line x1="48" y1="56" x2="26" y2="16" stroke="#FDE047" stroke-width="1.2" stroke-opacity="0.75" />
                            <line x1="48" y1="56" x2="38" y2="9" stroke="#FDE047" stroke-width="1.2" stroke-opacity="0.75" />
                            <line x1="48" y1="56" x2="48" y2="7" stroke="#FDE047" stroke-width="1.4" stroke-opacity="0.8" />
                            <line x1="48" y1="56" x2="58" y2="9" stroke="#FDE047" stroke-width="1.2" stroke-opacity="0.75" />
                            <line x1="48" y1="56" x2="70" y2="16" stroke="#FDE047" stroke-width="1.2" stroke-opacity="0.75" />
                            <line x1="48" y1="56" x2="80" y2="28" stroke="#FDE047" stroke-width="1.2" stroke-opacity="0.75" />

                            <!-- 7 Eyes -->
                            <g transform="translate(18, 30)">
                                <ellipse cx="0" cy="0" rx="6.5" ry="5" fill="url(#pMorFeatherEmerald)" stroke="url(#pMorGoldRim)" stroke-width="1.5" transform="rotate(-35)" />
                                <circle cx="0" cy="0" r="4.2" fill="#FEF08A" />
                                <circle cx="0" cy="0" r="3.2" fill="url(#pMorTurquoiseRing)" />
                                <circle cx="0" cy="0" r="1.8" fill="url(#pMorEyeCore)" />
                                <circle cx="-0.8" cy="-0.8" r="0.7" fill="#FFFFFF" />
                            </g>
                            <g transform="translate(28, 18)">
                                <ellipse cx="0" cy="0" rx="6.8" ry="5.2" fill="url(#pMorFeatherEmerald)" stroke="url(#pMorGoldRim)" stroke-width="1.5" transform="rotate(-20)" />
                                <circle cx="0" cy="0" r="4.5" fill="#FEF08A" />
                                <circle cx="0" cy="0" r="3.5" fill="url(#pMorTurquoiseRing)" />
                                <circle cx="0" cy="0" r="2.0" fill="url(#pMorEyeCore)" />
                                <circle cx="-0.9" cy="-0.9" r="0.8" fill="#FFFFFF" />
                            </g>
                            <g transform="translate(40, 11)">
                                <ellipse cx="0" cy="0" rx="7" ry="5.4" fill="url(#pMorFeatherEmerald)" stroke="url(#pMorGoldRim)" stroke-width="1.6" transform="rotate(-8)" />
                                <circle cx="0" cy="0" r="4.6" fill="#FEF08A" />
                                <circle cx="0" cy="0" r="3.6" fill="url(#pMorTurquoiseRing)" />
                                <circle cx="0" cy="0" r="2.1" fill="url(#pMorEyeCore)" />
                                <circle cx="-0.9" cy="-0.9" r="0.8" fill="#FFFFFF" />
                            </g>
                            <g transform="translate(48, 8)">
                                <ellipse cx="0" cy="0" rx="7.5" ry="5.8" fill="url(#pMorFeatherEmerald)" stroke="url(#pMorGoldRim)" stroke-width="1.8" />
                                <circle cx="0" cy="0" r="5.0" fill="#FEF08A" />
                                <circle cx="0" cy="0" r="3.9" fill="url(#pMorTurquoiseRing)" />
                                <circle cx="0" cy="0" r="2.3" fill="url(#pMorEyeCore)" />
                                <circle cx="-1" cy="-1" r="0.9" fill="#FFFFFF" />
                            </g>
                            <g transform="translate(56, 11)">
                                <ellipse cx="0" cy="0" rx="7" ry="5.4" fill="url(#pMorFeatherEmerald)" stroke="url(#pMorGoldRim)" stroke-width="1.6" transform="rotate(8)" />
                                <circle cx="0" cy="0" r="4.6" fill="#FEF08A" />
                                <circle cx="0" cy="0" r="3.6" fill="url(#pMorTurquoiseRing)" />
                                <circle cx="0" cy="0" r="2.1" fill="url(#pMorEyeCore)" />
                                <circle cx="-0.9" cy="-0.9" r="0.8" fill="#FFFFFF" />
                            </g>
                            <g transform="translate(68, 18)">
                                <ellipse cx="0" cy="0" rx="6.8" ry="5.2" fill="url(#pMorFeatherEmerald)" stroke="url(#pMorGoldRim)" stroke-width="1.5" transform="rotate(20)" />
                                <circle cx="0" cy="0" r="4.5" fill="#FEF08A" />
                                <circle cx="0" cy="0" r="3.5" fill="url(#pMorTurquoiseRing)" />
                                <circle cx="0" cy="0" r="2.0" fill="url(#pMorEyeCore)" />
                                <circle cx="-0.9" cy="-0.9" r="0.8" fill="#FFFFFF" />
                            </g>
                            <g transform="translate(78, 30)">
                                <ellipse cx="0" cy="0" rx="6.5" ry="5" fill="url(#pMorFeatherEmerald)" stroke="url(#pMorGoldRim)" stroke-width="1.5" transform="rotate(35)" />
                                <circle cx="0" cy="0" r="4.2" fill="#FEF08A" />
                                <circle cx="0" cy="0" r="3.2" fill="url(#pMorTurquoiseRing)" />
                                <circle cx="0" cy="0" r="1.8" fill="url(#pMorEyeCore)" />
                                <circle cx="-0.8" cy="-0.8" r="0.7" fill="#FFFFFF" />
                            </g>
                        </g>

                        <!-- LAYER 2: BRASS WIND-UP KEY -->
                        <g class="toy-key-spin">
                            <line x1="20" y1="52" x2="28" y2="52" stroke="#78350F" stroke-width="3" stroke-linecap="round" />
                            <circle cx="23" cy="52" r="3.2" fill="url(#pToyBrass)" stroke="#78350F" stroke-width="1.2" />
                            <path d="M23 52 C20 44 12 44 14 51 C15 54 21 53 23 52 Z" fill="url(#pToyBrass)" stroke="#78350F" stroke-width="1.2" />
                            <circle cx="16" cy="48" r="1.4" fill="#78350F" />
                            <path d="M23 52 C26 60 34 60 32 53 C31 50 25 51 23 52 Z" fill="url(#pToyBrass)" stroke="#78350F" stroke-width="1.2" />
                            <circle cx="30" cy="56" r="1.4" fill="#78350F" />
                        </g>

                        <!-- LAYER 3: BACK TOY LEG -->
                        <g class="toy-foot-left">
                            <circle cx="42" cy="62" r="4.5" fill="#1E3A8A" stroke="#0F172A" stroke-width="1.5" />
                            <rect x="40" y="62" width="4.5" height="15" rx="2.2" fill="url(#pToyWoodGrad)" stroke="#92400E" stroke-width="1.4" />
                            <ellipse cx="44" cy="77" rx="7" ry="3.2" fill="#F59E0B" stroke="#92400E" stroke-width="1.6" />
                            <circle cx="40" cy="77" r="1.6" fill="#FEF08A" />
                            <circle cx="44" cy="77" r="1.8" fill="#FEF08A" />
                            <circle cx="48" cy="77" r="1.6" fill="#FEF08A" />
                        </g>

                        <!-- LAYER 4: CHARMING LACQUERED BODY & WING -->
                        <g class="toy-body-waddle">
                            <path
                                d="M30 54 C30 42 39 37 49 42 C57 46 62 55 58 63 C54 70 38 70 30 54 Z"
                                fill="url(#pToyBlue)"
                                stroke="#1E3A8A"
                                stroke-width="2.4"
                            />
                            <path
                                d="M34 46 C41 40 50 41 55 46"
                                stroke="#BFDBFE"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                opacity="0.8"
                                fill="none"
                            />
                            <path
                                d="M36 50 C44 45 54 48 56 55 C53 62 43 64 35 58 Z"
                                fill="url(#pMorFeatherEmerald)"
                                stroke="url(#pMorGoldRim)"
                                stroke-width="1.8"
                            />
                            <path d="M39 52 Q46 57 52 53" stroke="#FEF08A" stroke-width="2.0" stroke-linecap="round" />
                            <path d="M37 56 Q43 61 48 57" stroke="#67E8F9" stroke-width="1.8" stroke-linecap="round" />
                            <circle cx="45" cy="54" r="1.8" fill="#FDE047" />
                        </g>

                        <!-- LAYER 5: PROUD S-CURVED LACQUER NECK & HEAD -->
                        <g class="toy-head-bob">
                            <path
                                d="M45 47 C43 38 47 28 53 23 C58 23 61 29 57 38 C54 44 51 49 45 51 Z"
                                fill="url(#pToyBlue)"
                                stroke="#1E3A8A"
                                stroke-width="2.4"
                            />
                            <path
                                d="M49 28 C48 35 48 43 47 48"
                                stroke="#BFDBFE"
                                stroke-width="1.8"
                                stroke-linecap="round"
                                opacity="0.8"
                                fill="none"
                            />
                            <circle cx="56" cy="21" r="10.5" fill="url(#pToyBlue)" stroke="#1E3A8A" stroke-width="2.4" />
                            <path d="M50 16 C53 13 58 13 61 16" stroke="#BFDBFE" stroke-width="1.8" stroke-linecap="round" opacity="0.8" fill="none" />

                            <!-- 3-FEATHER CROWN CREST -->
                            <g class="toy-crown-bounce">
                                <line x1="53" y1="13" x2="47" y2="4" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" />
                                <circle cx="46" cy="3.5" r="3.2" fill="#06B6D4" stroke="#F59E0B" stroke-width="1.4" />
                                <circle cx="45" cy="2.5" r="1.0" fill="#FFFFFF" />

                                <line x1="56" y1="12" x2="56" y2="1.5" stroke="#F59E0B" stroke-width="2.4" stroke-linecap="round" />
                                <circle cx="56" cy="1.2" r="3.8" fill="#FDE047" stroke="#D97706" stroke-width="1.5" />
                                <circle cx="55" cy="0.2" r="1.2" fill="#FFFFFF" />

                                <line x1="59" y1="13" x2="65" y2="4" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" />
                                <circle cx="66" cy="3.5" r="3.2" fill="#06B6D4" stroke="#F59E0B" stroke-width="1.4" />
                                <circle cx="65" cy="2.5" r="1.0" fill="#FFFFFF" />
                            </g>

                            <!-- Sparkling Eye -->
                            <circle cx="58" cy="20" r="4.2" fill="#FEF08A" stroke="#B45309" stroke-width="1.2" />
                            <circle cx="58" cy="20" r="3.2" fill="#0F172A" />
                            <circle cx="56.8" cy="18.8" r="1.4" fill="#FFFFFF" />
                            <circle cx="59.2" cy="21.2" r="0.7" fill="#FFFFFF" />

                            <!-- Rosy Blush -->
                            <ellipse cx="53" cy="25" rx="3.0" ry="2.0" fill="#FDA4AF" opacity="0.8" />

                            <!-- Beak -->
                            <path d="M64 18 C69 20 74 21 74 22 C74 23 69 24 64 26 Z" fill="#F59E0B" stroke="#B45309" stroke-width="1.8" stroke-linejoin="round" />
                            <line x1="64" y1="22" x2="71" y2="22" stroke="#92400E" stroke-width="1.2" />
                        </g>

                        <!-- LAYER 6: FOREGROUND LEG -->
                        <g class="toy-foot-right">
                            <circle cx="52" cy="62" r="5" fill="#1E3A8A" stroke="#0F172A" stroke-width="1.5" />
                            <rect x="49.5" y="62" width="5" height="15" rx="2.4" fill="url(#pToyWoodGrad)" stroke="#92400E" stroke-width="1.5" />
                            <ellipse cx="54" cy="77" rx="7.5" ry="3.4" fill="#F59E0B" stroke="#92400E" stroke-width="1.7" />
                            <circle cx="49.5" cy="77" r="1.8" fill="#FEF08A" />
                            <circle cx="54" cy="77" r="2.0" fill="#FEF08A" />
                            <circle cx="58.5" cy="77" r="1.8" fill="#FEF08A" />
                        </g>
                    </svg>`;

    const oldSvgStart = content.indexOf('<svg viewBox="0 0 96 88" class="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] overflow-visible">');
    if (oldSvgStart !== -1) {
        const oldSvgEnd = content.indexOf('</svg>', oldSvgStart);
        if (oldSvgEnd !== -1) {
            content = content.slice(0, oldSvgStart) + newPeacockSvg + content.slice(oldSvgEnd + 6);
            console.log('[SUCCESS] Replaced Peacock SVG in peacock_walk_test.html');
        }
    }
    fs.writeFileSync(filePath, content, 'utf8');
}
