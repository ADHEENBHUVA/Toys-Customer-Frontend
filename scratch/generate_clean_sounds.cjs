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

    // Write 16-bit signed PCM samples with soft limiter
    for (let i = 0; i < numSamples; i++) {
        let s = Math.max(-0.95, Math.min(0.95, samples[i]));
        const intVal = s < 0 ? s * 0x8000 : s * 0x7FFF;
        buffer.writeInt16LE(Math.floor(intVal), 44 + i * 2);
    }

    return buffer;
}

// =========================================================================
// 1. CLEAN MOTOR / TOY CAR SOUND (ચોખ્ખો અને સારો અવાજ / Clean Motor Rev + Beep-Beep)
// Zero harsh static, zero distortion, velvety smooth engine purr + crisp clear horn
// =========================================================================
function generateCleanCar() {
    const duration = 4.2;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        // Smooth acceleration profile: idle -> rev up -> cruise -> slow down
        let rpm = 70;
        if (t < 0.6) {
            rpm = 70 + Math.sin(t * 12) * 4;
        } else if (t < 1.8) {
            // Smooth rev acceleration (vroom!)
            const p = (t - 0.6) / 1.2;
            rpm = 70 + (Math.sin(p * Math.PI * 0.5) * 110);
        } else if (t < 2.5) {
            // High cruise
            rpm = 175 + Math.sin(t * 16) * 6;
        } else if (t < 3.2) {
            // Gentle decelerate
            const p = (t - 2.5) / 0.7;
            rpm = 175 - (p * 75);
        } else {
            rpm = 100 + Math.sin(t * 10) * 4;
        }

        // Clean Harmonic Synthesis (no raw sawtooth, no white noise!)
        // 1. Fundamental warm cylinder pulse
        const f1 = Math.sin(2 * Math.PI * rpm * t);
        // 2. Sub-bass rumble (adds depth without harshness)
        const fSub = Math.sin(2 * Math.PI * (rpm * 0.5) * t) * 0.65;
        // 3. 2nd Harmonic (exhaust purr)
        const f2 = Math.sin(2 * Math.PI * (rpm * 2) * t) * 0.35;
        // 4. 3rd Harmonic (smooth metallic body resonance)
        const f3 = Math.sin(2 * Math.PI * (rpm * 3) * t) * 0.15;
        // 5. Very subtle soft tire whoosh on smooth asphalt
        const whoosh = Math.sin(2 * Math.PI * 45 * t) * (rpm / 180) * 0.12;

        let engine = (f1 + fSub + f2 + f3 + whoosh) * 0.32;

        // Smooth fade-in at very start so zero click
        if (t < 0.08) {
            engine *= (t / 0.08);
        }

        // Clean, cheerful dual-tone horn (Beep-Beep!)
        // Blast 1: t = 2.0 to 2.3s
        // Blast 2: t = 2.45 to 2.85s
        let horn = 0;
        const blasts = [
            { start: 2.0, end: 2.3 },
            { start: 2.45, end: 2.85 }
        ];

        for (const b of blasts) {
            if (t >= b.start && t <= b.end) {
                const dt = t - b.start;
                const bDur = b.end - b.start;
                // Soft attack and release envelope for bell-like sweetness
                let env = 1.0;
                if (dt < 0.02) env = dt / 0.02;
                else if (dt > bDur - 0.03) env = (bDur - dt) / 0.03;

                // Melodic dual-tone horn (C5: 523.25Hz, E5: 659.25Hz + soft octave 1046.5Hz)
                const h1 = Math.sin(2 * Math.PI * 523.25 * dt);
                const h2 = Math.sin(2 * Math.PI * 659.25 * dt) * 0.85;
                const h3 = Math.sin(2 * Math.PI * 1046.5 * dt) * 0.25;

                horn += (h1 + h2 + h3) * env * 0.45;
            }
        }

        val = engine + horn;

        // Smooth final fade out
        if (t > 3.8) {
            val *= (4.2 - t) / 0.4;
        }

        samples[i] = val;
    }

    return samples;
}

// =========================================================================
// 2. AUTHENTIC MAJESTIC PEACOCK CALL (મોરનો અસલી ટહૂકો / Real Indian Peacock Tahuko)
// Starts with gentle smooth attack, rich vocal resonance, zero harsh scratch/buzz
// =========================================================================
function generateCleanPeacock() {
    const duration = 4.2;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    // Three natural peacock cries: "Pee-Huu! ... Pee-Huu-uu! ... Pee-Huu!"
    const cries = [
        { start: 0.12, dur: 1.05, peakVol: 0.85, fStart: 640, fPeak: 1220, fEnd: 580 },
        { start: 1.50, dur: 1.25, peakVol: 0.95, fStart: 660, fPeak: 1320, fEnd: 540 },
        { start: 3.05, dur: 0.95, peakVol: 0.70, fStart: 620, fPeak: 1180, fEnd: 560 }
    ];

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        for (const cry of cries) {
            if (t >= cry.start && t < cry.start + cry.dur) {
                const dt = t - cry.start;
                const progress = dt / cry.dur;

                // 1. Natural Peacock Frequency Contour (Smooth rising "Pee-" then falling "-Huu")
                let currentFreq = cry.fStart;
                const peakTime = 0.38; // peak reached at 38% of call
                if (progress < peakTime) {
                    const p = progress / peakTime;
                    // Smooth sinusoidal rise to peak
                    currentFreq = cry.fStart + (cry.fPeak - cry.fStart) * Math.sin(p * Math.PI * 0.5);
                } else {
                    const p = (progress - peakTime) / (1.0 - peakTime);
                    // Smooth graceful descent to deep resonant bottom
                    currentFreq = cry.fPeak - (cry.fPeak - cry.fEnd) * Math.sin(p * Math.PI * 0.5);
                }

                // 2. Natural subtle vocal throat trill (7.5 Hz, soft 18Hz depth)
                const trill = Math.sin(2 * Math.PI * 7.5 * dt) * 18;
                const instFreq = currentFreq + trill;

                // 3. Smooth Envelope (Soft 60ms attack -> NO harsh scratch at start!)
                let env = 0;
                const attackTime = 0.08;
                const releaseTime = 0.35;
                if (dt < attackTime) {
                    // Gentle sinusoidal fade-in
                    env = Math.sin((dt / attackTime) * Math.PI * 0.5);
                } else if (progress > (1.0 - releaseTime / cry.dur)) {
                    const relProgress = (dt - (cry.dur - releaseTime)) / releaseTime;
                    env = Math.cos(relProgress * Math.PI * 0.5);
                } else {
                    env = 1.0;
                }

                // 4. Rich Acoustic Harmonics (Natural bird syrinx vocal resonance)
                // Fundamental
                const fundamental = Math.sin(2 * Math.PI * instFreq * dt);
                // 2nd Harmonic (adds warmth and royal bird majesty)
                const harm2 = Math.sin(2 * Math.PI * (instFreq * 2) * dt) * 0.35;
                // 3rd Harmonic (chime clarity)
                const harm3 = Math.sin(2 * Math.PI * (instFreq * 3) * dt) * 0.12;
                // Formant resonance filter
                const formant = Math.sin(2 * Math.PI * 2400 * dt) * 0.08 * (instFreq / 1200);

                const cryWave = (fundamental + harm2 + harm3 + formant) * env * cry.peakVol;

                val += cryWave;
            }
        }

        // Atmosphere / soft natural garden reverb tail
        samples[i] = val;
    }

    return samples;
}

// Generate files
const sounds = [
    { name: 'car.wav', fn: generateCleanCar },
    { name: 'peacock.wav', fn: generateCleanPeacock }
];

sounds.forEach((s) => {
    const samples = s.fn();
    const buffer = createWavBuffer(samples);
    const dest = path.join(outputDir, s.name);
    fs.writeFileSync(dest, buffer);
    console.log(`[SUCCESS] Generated ${s.name} (${(buffer.length / 1024).toFixed(1)} KB)`);

    // Also write a copy to .ogg filename so any cached / legacy references receive the clean audio!
    const oggCopyName = s.name.replace('.wav', '.ogg');
    const oggDest = path.join(outputDir, oggCopyName);
    fs.writeFileSync(oggDest, buffer);
    console.log(`[SUCCESS] Synchronized ${oggCopyName} with clean master audio!`);
});

console.log('Clean audio generation complete!');
