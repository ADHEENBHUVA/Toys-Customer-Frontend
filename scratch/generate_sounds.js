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
    // file length minus 8 bytes
    buffer.writeUInt32LE(36 + numSamples * 2, 4);
    // RIFF type
    buffer.write('WAVE', 8);
    // format chunk identifier
    buffer.write('fmt ', 12);
    // format chunk length
    buffer.writeUInt32LE(16, 16);
    // sample format (1 = PCM)
    buffer.writeUInt16LE(1, 20);
    // channel count (1 = mono)
    buffer.writeUInt16LE(1, 22);
    // sample rate
    buffer.writeUInt32LE(sampleRate, 24);
    // byte rate (sampleRate * 1 * 2)
    buffer.writeUInt32LE(sampleRate * 2, 28);
    // block align (1 * 2)
    buffer.writeUInt16LE(2, 32);
    // bits per sample
    buffer.writeUInt16LE(16, 34);
    // data chunk identifier
    buffer.write('data', 36);
    // data chunk length
    buffer.writeUInt32LE(numSamples * 2, 40);

    // write 16-bit signed PCM samples
    for (let i = 0; i < numSamples; i++) {
        let s = Math.max(-1, Math.min(1, samples[i]));
        const intVal = s < 0 ? s * 0x8000 : s * 0x7FFF;
        buffer.writeInt16LE(Math.floor(intVal), 44 + i * 2);
    }

    return buffer;
}

// -------------------------------------------------------------
// 1. CAR: Real Engine Revving + Dual-Tone Honk Horn
// -------------------------------------------------------------
function generateCar() {
    const duration = 4.5;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        // Engine sound: sawtooth + noise with rising RPM
        let rpm = 70;
        if (t < 1.0) rpm = 75 + Math.sin(t * 10) * 5;
        else if (t < 2.5) rpm = 75 + (t - 1.0) * 80; // revving up!
        else if (t < 3.2) rpm = 195 - (t - 2.5) * 40;
        else rpm = 150 + Math.sin(t * 15) * 20;

        // Sawtooth engine harmonics
        const phase = (t * rpm) % 1;
        const saw = (phase * 2 - 1);
        const subSaw = ((t * rpm * 0.5) % 1) * 2 - 1;
        const noise = (Math.random() * 2 - 1) * 0.15;
        const engine = (saw * 0.6 + subSaw * 0.3 + noise) * 0.35;

        // Horn: 440Hz + 554Hz dual tone blasts
        let horn = 0;
        const hornBlast1 = (t >= 2.6 && t <= 3.1);
        const hornBlast2 = (t >= 3.4 && t <= 4.2);
        if (hornBlast1 || hornBlast2) {
            const h1 = Math.sin(2 * Math.PI * 440 * t);
            const h2 = Math.sin(2 * Math.PI * 554 * t);
            const h3 = Math.sin(2 * Math.PI * 880 * t) * 0.25;
            horn = (h1 + h2 + h3) * 0.45;
        }

        val = engine + horn;
        // Fade out at end
        if (t > 4.0) val *= (4.5 - t) / 0.5;
        samples[i] = val;
    }
    return samples;
}

// -------------------------------------------------------------
// 2. HORSE: Real Neigh / Whinny + Galloping Hooves
// -------------------------------------------------------------
function generateHorse() {
    const duration = 4.5;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        // Neigh Whinny: 0.0s to 1.8s
        if (t < 1.8) {
            let baseFreq = 800;
            if (t < 0.4) baseFreq = 700 + (t / 0.4) * 600; // rising pitch
            else if (t < 1.0) baseFreq = 1300 + Math.sin(t * 40) * 120; // vibrato flutter
            else baseFreq = 1300 - ((t - 1.0) / 0.8) * 800 + Math.sin(t * 30) * 60; // falling flutter

            const vibrato = Math.sin(2 * Math.PI * 14 * t);
            const freq = baseFreq + vibrato * 70;
            const formant1 = Math.sin(2 * Math.PI * freq * t);
            const formant2 = Math.sin(2 * Math.PI * (freq * 1.5) * t) * 0.4;
            const breath = (Math.random() * 2 - 1) * 0.2;
            let neighEnv = Math.sin((t / 1.8) * Math.PI);
            val += (formant1 + formant2 + breath) * neighEnv * 0.6;
        }

        // Galloping Hooves: paired clip-clops from 1.5s to 4.5s
        const gallopTimes = [1.6, 1.76, 2.2, 2.36, 2.8, 2.96, 3.4, 3.56, 4.0, 4.16];
        for (const gt of gallopTimes) {
            if (t >= gt && t < gt + 0.12) {
                const dt = t - gt;
                const hoofFreq = gt % 0.5 === 0 ? 320 : 250;
                const hoof = Math.sin(2 * Math.PI * hoofFreq * (1 - dt * 5) * dt) * Math.exp(-dt * 35);
                const woodClick = (Math.random() * 2 - 1) * Math.exp(-dt * 80) * 0.3;
                val += (hoof + woodClick) * 0.7;
            }
        }

        if (t > 4.2) val *= (4.5 - t) / 0.3;
        samples[i] = val;
    }
    return samples;
}

// -------------------------------------------------------------
// 3. DHOL: Indian Dhol Drum Beats (Bass Dha + Treble Stick Ta)
// -------------------------------------------------------------
function generateDhol() {
    const duration = 4.5;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    // Dhol rhythm hit events: { t: seconds, type: 'bass'|'treble'|'both' }
    const beats = [
        { t: 0.0, type: 'both' },
        { t: 0.35, type: 'treble' },
        { t: 0.60, type: 'bass' },
        { t: 0.85, type: 'treble' },
        { t: 1.15, type: 'bass' },
        { t: 1.35, type: 'bass' },
        { t: 1.55, type: 'treble' },
        { t: 1.75, type: 'treble' },
        { t: 2.05, type: 'both' },
        { t: 2.40, type: 'treble' },
        { t: 2.65, type: 'bass' },
        { t: 2.90, type: 'treble' },
        { t: 3.20, type: 'both' },
        { t: 3.50, type: 'treble' },
        { t: 3.70, type: 'treble' },
        { t: 3.90, type: 'both' }
    ];

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        for (const b of beats) {
            if (t >= b.t && t < b.t + 0.35) {
                const dt = t - b.t;
                // Bass (Dha / Dagga): low punch 65Hz decaying to 90Hz
                if (b.type === 'bass' || b.type === 'both') {
                    const bassFreq = 65 + Math.exp(-dt * 20) * 60;
                    const bass = Math.sin(2 * Math.PI * bassFreq * dt) * Math.exp(-dt * 9);
                    val += bass * 0.7;
                }
                // Treble (Ta / Tilli): snappy sharp 1200Hz stick strike with skin rattle
                if (b.type === 'treble' || b.type === 'both') {
                    const trebleSnap = Math.sin(2 * Math.PI * 1350 * dt) * Math.exp(-dt * 30);
                    const rimSnap = (Math.random() * 2 - 1) * Math.exp(-dt * 45) * 0.35;
                    val += (trebleSnap + rimSnap) * 0.55;
                }
            }
        }

        if (t > 4.2) val *= (4.5 - t) / 0.3;
        samples[i] = val;
    }
    return samples;
}

// -------------------------------------------------------------
// 4. DUCK: Real Duck Quack (Quack! Quack! Quack-Quack!)
// -------------------------------------------------------------
function generateDuck() {
    const duration = 4.0;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    const quackEvents = [0.0, 0.45, 1.1, 1.45, 2.2, 2.7, 3.1, 3.45];

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        for (const q of quackEvents) {
            if (t >= q && t < q + 0.28) {
                const dt = t - q;
                const env = Math.sin((dt / 0.28) * Math.PI);
                // Duck fundamental frequency ~320Hz down to 240Hz
                const f0 = 340 - dt * 250;
                const saw = ((dt * f0) % 1) * 2 - 1;
                // Duck formants (nasal resonances around 700Hz and 1600Hz)
                const f1 = Math.sin(2 * Math.PI * 720 * dt);
                const f2 = Math.sin(2 * Math.PI * 1550 * dt) * 0.5;
                val += (saw * 0.5 + f1 * 0.3 + f2 * 0.2) * env * 0.8;
            }
        }

        samples[i] = val;
    }
    return samples;
}

// -------------------------------------------------------------
// 5. ROBOT: Mechanical Servo Movement + Electronic Speech Voice
// -------------------------------------------------------------
function generateRobot() {
    const duration = 4.5;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        // Servo Motor Whirr (pitch glides on mechanical movement)
        const servoPitch = 500 + Math.sin(t * 8) * 350;
        const servo = Math.sin(2 * Math.PI * servoPitch * t) * 0.15;

        // Robotic Computer Voice / Beep-Boop Speech sequence
        const beeps = [
            { t: 0.1, f: 520, d: 0.15 },
            { t: 0.3, f: 780, d: 0.15 },
            { t: 0.55, f: 650, d: 0.2 },
            { t: 0.85, f: 1040, d: 0.3 },
            { t: 1.4, f: 440, d: 0.18 },
            { t: 1.65, f: 880, d: 0.18 },
            { t: 1.9, f: 660, d: 0.25 },
            { t: 2.3, f: 980, d: 0.15 },
            { t: 2.5, f: 1320, d: 0.2 },
            { t: 2.8, f: 750, d: 0.35 },
            { t: 3.4, f: 880, d: 0.2 },
            { t: 3.7, f: 1100, d: 0.3 }
        ];

        let voice = 0;
        for (const b of beeps) {
            if (t >= b.t && t < b.t + b.d) {
                const dt = t - b.t;
                const env = Math.sin((dt / b.d) * Math.PI);
                const carrier = Math.sin(2 * Math.PI * b.f * dt);
                const modulator = Math.sin(2 * Math.PI * (b.f * 0.5) * dt) * 0.5;
                const ringMod = carrier * (1 + modulator);
                voice += ringMod * env * 0.5;
            }
        }

        val = servo + voice;
        if (t > 4.2) val *= (4.5 - t) / 0.3;
        samples[i] = val;
    }
    return samples;
}

// -------------------------------------------------------------
// 6. TEDDY BEAR: Plush Air Squeaker Squeeze + Happy Giggle
// -------------------------------------------------------------
function generateTeddy() {
    const duration = 3.5;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    const squeaks = [0.1, 0.65, 1.6, 2.1, 2.7];

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        for (const sq of squeaks) {
            if (t >= sq && t < sq + 0.32) {
                const dt = t - sq;
                // High squeaker reed pitch: 1800Hz rising to 2600Hz
                const f = 1900 + (dt / 0.32) * 800;
                const whistle = Math.sin(2 * Math.PI * f * dt);
                const airRush = (Math.random() * 2 - 1) * 0.15;
                const env = Math.sin((dt / 0.32) * Math.PI);
                val += (whistle + airRush) * env * 0.65;
            }
        }

        samples[i] = val;
    }
    return samples;
}

// -------------------------------------------------------------
// 7. BUNNY: Cartoon Spring Boing + Squeak
// -------------------------------------------------------------
function generateBunny() {
    const duration = 3.5;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    const hops = [0.0, 0.7, 1.4, 2.1, 2.8];

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        for (const h of hops) {
            if (t >= h && t < h + 0.5) {
                const dt = t - h;
                // Cartoon spring boing frequency glide 220Hz -> 900Hz
                const f = 240 + Math.pow(dt / 0.5, 0.7) * 750;
                const spring = Math.sin(2 * Math.PI * f * dt) * Math.exp(-dt * 4.5);
                const metallic = Math.sin(2 * Math.PI * (f * 2.7) * dt) * Math.exp(-dt * 7) * 0.3;
                val += (spring + metallic) * 0.7;
            }
        }

        samples[i] = val;
    }
    return samples;
}

// Generate and write all files
const soundGenerators = {
    'car.wav': generateCar,
    'horse.wav': generateHorse,
    'dhol.wav': generateDhol,
    'duck.wav': generateDuck,
    'robot.wav': generateRobot,
    'teddy.wav': generateTeddy,
    'bunny.wav': generateBunny
};

for (const [filename, genFn] of Object.entries(soundGenerators)) {
    const samples = genFn();
    const wavBuffer = createWavBuffer(samples);
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, wavBuffer);
    console.log(`Generated: ${filename} (${(wavBuffer.length / 1024).toFixed(1)} KB)`);
}
console.log('All 7 toy sounds successfully generated!');
