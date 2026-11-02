const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'sounds');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const sampleRate = 44100;

function createWavBuffer(samples) {
    const numSamples = samples.length;
    const buffer = Buffer.alloc(44 + numSamples * 2);

    // RIFF identifier
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + numSamples * 2, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20); // PCM
    buffer.writeUInt16LE(1, 22); // Mono
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(numSamples * 2, 40);

    // Write 16-bit signed PCM samples with soft tube saturation limiter
    for (let i = 0; i < numSamples; i++) {
        let s = samples[i];
        // Soft tube limiter to prevent any harsh digital clipping
        if (s > 1.0) s = 1.0 - Math.exp(-s);
        else if (s < -1.0) s = -1.0 + Math.exp(s);

        const intVal = s < 0 ? s * 0x8000 : s * 0x7FFF;
        buffer.writeInt16LE(Math.max(-32768, Math.min(32767, Math.floor(intVal))), 44 + i * 2);
    }

    return buffer;
}

// =========================================================================
// 1. BRAND NEW REAL MOTOR SOUND ("Moter no avaj pan fervi de")
// Real Engine Starter + Throaty Roar Acceleration + Turbo Spool + Friendly Dual-Tone Horn
// =========================================================================
function generateNewCarSound() {
    const duration = 4.8;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    let phase = 0;
    let turboPhase = 0;

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        // Stage 1: Key Ignition Turnover (0.0s to 0.45s) -> "chk-chk-chk-chk-ROAR!"
        let starter = 0;
        if (t < 0.45) {
            const starterP = Math.sin(2 * Math.PI * 18 * t); // 18 Hz starter motor chugs
            const starterClick = Math.sin(2 * Math.PI * 320 * t) * Math.max(0, starterP);
            starter = (starterClick + (Math.random() * 2 - 1) * 0.15) * 0.6;
        }

        // Stage 2: Dynamic Engine RPM Profile
        // 0.45 - 1.2s: Initial powerful rev roar (90Hz -> 185Hz)
        // 1.2 - 1.7s: Gear shift burble (185Hz -> 130Hz)
        // 1.7 - 2.8s: Full throttle acceleration roar (130Hz -> 230Hz)
        // 2.8 - 3.8s: High cruising purr (180Hz) + Dual-tone horn
        // 3.8 - 4.8s: Satisfying decelerating idle rumble (180Hz -> 85Hz)
        let rpm = 65;
        let driveVolume = 0;

        if (t >= 0.35) {
            if (t < 1.2) {
                const p = (t - 0.35) / 0.85;
                rpm = 75 + Math.pow(p, 1.3) * 110;
                driveVolume = Math.min(1.0, (t - 0.35) / 0.2);
            } else if (t < 1.7) {
                const p = (t - 1.2) / 0.5;
                rpm = 185 - p * 55;
                driveVolume = 0.85;
            } else if (t < 2.8) {
                const p = (t - 1.7) / 1.1;
                rpm = 130 + Math.pow(p, 1.4) * 100;
                driveVolume = 0.95;
            } else if (t < 3.8) {
                rpm = 180 + Math.sin(t * 12) * 8;
                driveVolume = 0.75;
            } else {
                const p = (t - 3.8) / 1.0;
                rpm = 180 - p * 95;
                driveVolume = 0.7 - p * 0.35;
            }

            phase += rpm / sampleRate;
            if (phase >= 1.0) phase -= 1.0;

            // Deep V8 Multi-Cylinder Acoustic Pulses (Asymmetric firing order)
            const cylinderPulse = Math.sin(2 * Math.PI * phase);
            const subRumble = Math.sin(2 * Math.PI * (phase * 0.5)) * 0.65; // deep exhaust chest rumble
            const harmonic2 = Math.sin(2 * Math.PI * (phase * 2.0)) * 0.4;
            const harmonic3 = Math.sin(2 * Math.PI * (phase * 3.0)) * 0.22;
            const harmonic4 = Math.sin(2 * Math.PI * (phase * 4.0)) * 0.12;

            // Exhaust backpressure flutter
            const exhaustFlutter = (Math.random() * 2 - 1) * (0.08 + (rpm / 230) * 0.12);

            const engineBody = (cylinderPulse + subRumble + harmonic2 + harmonic3 + harmonic4 + exhaustFlutter) * 0.38;
            val += engineBody * driveVolume;

            // Turbo spool whistle (1.8s to 2.8s) -> "whoooosh"
            if (t >= 1.8 && t < 2.8) {
                const turboP = (t - 1.8) / 1.0;
                const turboFreq = 1400 + turboP * 1200;
                turboPhase += turboFreq / sampleRate;
                if (turboPhase >= 1.0) turboPhase -= 1.0;
                const turboWhistle = Math.sin(2 * Math.PI * turboPhase) * Math.sin(turboP * Math.PI) * 0.12;
                val += turboWhistle;
            }
        }

        // Friendly Dual-Tone Car Horn: "Beep-Beep!"
        // Blast 1: 2.85s to 3.15s (300ms)
        // Blast 2: 3.30s to 3.65s (350ms)
        const hornBlasts = [
            { start: 2.85, end: 3.15 },
            { start: 3.30, end: 3.65 }
        ];

        for (const blast of hornBlasts) {
            if (t >= blast.start && t < blast.end) {
                const ht = t - blast.start;
                const dur = blast.end - blast.start;
                // Soft attack and decay so no click
                let hornEnv = 1.0;
                if (ht < 0.02) hornEnv = ht / 0.02;
                else if (ht > dur - 0.03) hornEnv = (dur - ht) / 0.03;

                // Authentic dual vehicle horn frequencies (F4: 349Hz, A4: 440Hz + harmonics)
                const h1 = Math.sin(2 * Math.PI * 349.2 * t);
                const h2 = Math.sin(2 * Math.PI * 440.0 * t);
                const h3 = Math.sin(2 * Math.PI * 698.4 * t) * 0.3;
                const h4 = Math.sin(2 * Math.PI * 880.0 * t) * 0.2;

                val += (h1 + h2 + h3 + h4) * hornEnv * 0.42;
            }
        }

        val += starter;

        // Smooth end fade-out
        if (t > duration - 0.25) {
            val *= (duration - t) / 0.25;
        }

        samples[i] = val;
    }

    return samples;
}

// =========================================================================
// 2. AUTHENTIC PROPER HORSE SOUND ("Horse no proper avaj aap")
// Natural Equine Whinny (Real Throat & Nostril Formants) + Galloping Hooves (Clip-Clop)
// =========================================================================
function generateProperHorseSound() {
    const duration = 4.8;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    let neighPhase = 0;
    let formant1Phase = 0;
    let formant2Phase = 0;

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        // Part 1: Real Horse Neigh / Whinny (0.1s to 2.1s)
        if (t >= 0.1 && t <= 2.1) {
            const nt = t - 0.1;
            const neighDur = 2.0;

            // Natural horse vocal pitch contour (NOT shrill 1450Hz, but real 400Hz - 720Hz - 320Hz)
            // 0.0 - 0.4s: Warm rising intake & call initiation (380Hz -> 680Hz)
            // 0.4 - 1.2s: Resonant vocal fold flutter at 680Hz
            // 1.2 - 2.0s: Warm descending chest release to friendly equine snort (680Hz -> 280Hz)
            let baseFreq = 380;
            if (nt < 0.4) {
                const p = nt / 0.4;
                baseFreq = 380 + Math.sin(p * Math.PI * 0.5) * 300;
            } else if (nt < 1.2) {
                baseFreq = 680;
            } else {
                const p = (nt - 1.2) / 0.8;
                baseFreq = 680 - Math.sin(p * Math.PI * 0.5) * 400;
            }

            // Natural equine vocal flutter / laryngeal tremolo (12.8 Hz)
            const tremoloRate = 12.8;
            const flutter = Math.sin(2 * Math.PI * tremoloRate * nt);
            const instFreq = baseFreq * (1 + flutter * 0.09);

            neighPhase += instFreq / sampleRate;
            if (neighPhase >= 1.0) neighPhase -= 1.0;

            // Formant 1 (Vocal tract pharyngeal acoustic cavity ~ 1.7x)
            formant1Phase += (instFreq * 1.72) / sampleRate;
            if (formant1Phase >= 1.0) formant1Phase -= 1.0;

            // Formant 2 (Nasal / oral cavity resonance ~ 2.6x)
            formant2Phase += (instFreq * 2.58) / sampleRate;
            if (formant2Phase >= 1.0) formant2Phase -= 1.0;

            // Low chest undertone
            const chestUndertone = Math.sin(2 * Math.PI * (neighPhase * 0.5)) * 0.4;

            // Vocal folds wave
            const vocalFold = Math.sin(2 * Math.PI * neighPhase);
            const f1 = Math.sin(2 * Math.PI * formant1Phase) * 0.45;
            const f2 = Math.sin(2 * Math.PI * formant2Phase) * 0.25;

            // Breathy nostril air turbulence (equine nasal breath)
            const breath = (Math.random() * 2 - 1) * 0.14 * (1 + flutter * 0.3);

            // Equine soft lip snort at the tail of the whinny (1.5s to 2.0s) -> "brrr-pfff"
            let lipSnort = 0;
            if (nt > 1.4 && nt < 2.0) {
                const snortT = nt - 1.4;
                const lipFlutter = Math.sin(2 * Math.PI * 26 * snortT); // 26Hz fluttering horse lips
                lipSnort = ((Math.random() * 2 - 1) * 0.3 + lipFlutter * 0.25) * Math.sin((snortT / 0.6) * Math.PI);
            }

            // Natural amplitude envelope with smooth attack and decay
            let env = 1.0;
            if (nt < 0.12) env = Math.sin((nt / 0.12) * Math.PI * 0.5);
            else if (nt > 1.6) env = Math.cos(((nt - 1.6) / 0.4) * Math.PI * 0.5);

            val += ((vocalFold + chestUndertone + f1 + f2 + breath) * env + lipSnort) * 0.82;
        }

        // Part 2: Realistic Hollow Wooden Rocking Horse Gallop Hooves (Clip-Clop)
        // Pairs of hooves at authentic cadence:
        // Clip (leading hoof): 420 Hz hollow resonant wood tone with sharp 1.5ms tap
        // Clop (trailing hoof, +130ms): 310 Hz deep body wood thud
        const gallopPairs = [
            1.75, // Gallop 1
            2.30, // Gallop 2
            2.85, // Gallop 3
            3.40, // Gallop 4
            3.95, // Gallop 5
        ];

        for (const gp of gallopPairs) {
            // Hoof 1: Clip
            const t1 = gp;
            if (t >= t1 && t < t1 + 0.16) {
                const dt = t - t1;
                const tap = (Math.random() * 2 - 1) * Math.exp(-dt * 180) * 0.6; // sharp wood contact
                const woodHollow = Math.sin(2 * Math.PI * 420 * dt) * Math.exp(-dt * 32);
                const woodBody = Math.sin(2 * Math.PI * 210 * dt) * Math.exp(-dt * 22) * 0.5;
                val += (tap + woodHollow + woodBody) * 0.72;
            }

            // Hoof 2: Clop (130ms after Hoof 1)
            const t2 = gp + 0.13;
            if (t >= t2 && t < t2 + 0.18) {
                const dt = t - t2;
                const tap = (Math.random() * 2 - 1) * Math.exp(-dt * 150) * 0.5;
                const woodHollow = Math.sin(2 * Math.PI * 310 * dt) * Math.exp(-dt * 28);
                const woodThud = Math.sin(2 * Math.PI * 155 * dt) * Math.exp(-dt * 18) * 0.6;
                val += (tap + woodHollow + woodThud) * 0.78;
            }
        }

        // Smooth end fade
        if (t > duration - 0.2) {
            val *= (duration - t) / 0.2;
        }

        samples[i] = val;
    }

    return samples;
}

// Generate new pristine sound files
console.log('Generating updated sound files...');

const carSamples = generateNewCarSound();
const carBuffer = createWavBuffer(carSamples);
fs.writeFileSync(path.join(outputDir, 'car.wav'), carBuffer);
fs.writeFileSync(path.join(outputDir, 'car.ogg'), carBuffer);
console.log('✓ car.wav & car.ogg created successfully (' + carBuffer.length + ' bytes)');

const horseSamples = generateProperHorseSound();
const horseBuffer = createWavBuffer(horseSamples);
fs.writeFileSync(path.join(outputDir, 'horse.wav'), horseBuffer);
fs.writeFileSync(path.join(outputDir, 'horse.mp3'), horseBuffer);
console.log('✓ horse.wav & horse.mp3 created successfully (' + horseBuffer.length + ' bytes)');

console.log('All sounds refreshed!');

