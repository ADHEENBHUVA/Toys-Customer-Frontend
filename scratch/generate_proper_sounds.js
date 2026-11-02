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

    // write 16-bit signed PCM samples with soft limiter
    for (let i = 0; i < numSamples; i++) {
        let s = samples[i];
        // Soft tube limiter to prevent harsh digital clipping
        if (s > 1.0) s = 1.0 - Math.exp(-s);
        else if (s < -1.0) s = -1.0 + Math.exp(s);
        
        const intVal = s < 0 ? s * 0x8000 : s * 0x7FFF;
        buffer.writeInt16LE(Math.max(-32768, Math.min(32767, Math.floor(intVal))), 44 + i * 2);
    }

    return buffer;
}

// ----------------------------------------------------------------------
// 1. REAL PROPER CAR (MOTER) SOUND
// Authentic 4-cylinder engine ignition rumble + roaring throttle rev
// ("VROOOOM, VROOOOOM!") + crisp, happy dual-tone horn ("Beep-Beep!")
// ----------------------------------------------------------------------
function generateProperCar() {
    const duration = 4.8;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    let enginePhase = 0;
    let subPhase = 0;

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        // Dynamic RPM envelope:
        // 0.0 - 0.7s: Low idle rumble (45 Hz fundamental)
        // 0.7 - 2.2s: Huge acceleration rev! (45 -> 180 Hz) "VROOOOM!"
        // 2.2 - 2.8s: Shift & burble (180 -> 120 Hz)
        // 2.8 - 3.8s: Second gear rev up! (120 -> 210 Hz) "VROOOOM!"
        // 3.8 - 4.8s: High purr with horn blasts!
        let freq = 45;
        let throttle = 0.4;
        if (t < 0.7) {
            freq = 45 + Math.sin(t * 12) * 4;
            throttle = 0.45;
        } else if (t < 2.2) {
            const p = (t - 0.7) / 1.5;
            freq = 45 + Math.pow(p, 1.4) * 140;
            throttle = 0.5 + p * 0.45;
        } else if (t < 2.8) {
            const p = (t - 2.2) / 0.6;
            freq = 185 - p * 60;
            throttle = 0.55;
        } else if (t < 3.8) {
            const p = (t - 2.8) / 1.0;
            freq = 125 + Math.pow(p, 1.2) * 90;
            throttle = 0.6 + p * 0.35;
        } else {
            freq = 175 + Math.sin(t * 15) * 15;
            throttle = 0.7;
        }

        // Advance phases
        enginePhase += (freq / sampleRate);
        if (enginePhase >= 1.0) enginePhase -= 1.0;

        subPhase += ((freq * 0.5) / sampleRate);
        if (subPhase >= 1.0) subPhase -= 1.0;

        // Engine harmonics: pulse wave + asymmetrical triangle (rich combustion sound)
        const p1 = enginePhase;
        const p2 = subPhase;
        const pulse = (p1 < 0.3 ? 1.0 : -0.4);
        const sub = Math.sin(2 * Math.PI * p2);
        const harm3 = Math.sin(2 * Math.PI * p1 * 3) * 0.4;
        const harm5 = Math.sin(2 * Math.PI * p1 * 5) * 0.25;
        const exhaustRumble = (Math.random() * 2 - 1) * 0.12 * throttle;

        const engineSound = (pulse * 0.45 + sub * 0.35 + harm3 + harm5 + exhaustRumble) * throttle * 0.65;

        // Dual-Tone Car Horn: F4 (349Hz) + A4 (440Hz) + C5 (523Hz)
        // Two crisp blasts at 2.6s - 2.95s and 3.4s - 3.85s ("Beep! Beep!")
        let horn = 0;
        const horn1 = (t >= 2.6 && t <= 2.92);
        const horn2 = (t >= 3.25 && t <= 3.65);
        if (horn1 || horn2) {
            const ht = horn1 ? (t - 2.6) : (t - 3.25);
            const hDuration = horn1 ? 0.32 : 0.40;
            // Horn envelope: fast attack, sustained, smooth release
            let hEnv = 1.0;
            if (ht < 0.02) hEnv = ht / 0.02;
            else if (ht > hDuration - 0.04) hEnv = (hDuration - ht) / 0.04;

            const tone1 = Math.sin(2 * Math.PI * 349.2 * t);
            const tone2 = Math.sin(2 * Math.PI * 440.0 * t);
            const tone3 = Math.sin(2 * Math.PI * 523.2 * t) * 0.5;
            const overtone = Math.sin(2 * Math.PI * 880.0 * t) * 0.2;
            horn = (tone1 + tone2 + tone3 + overtone) * hEnv * 0.65;
        }

        val = engineSound + horn;

        // Smooth fade-in and fade-out at ends
        if (t < 0.1) val *= (t / 0.1);
        if (t > duration - 0.25) val *= (duration - t) / 0.25;

        samples[i] = val;
    }

    return samples;
}

// ----------------------------------------------------------------------
// 2. REAL PROPER HORSE SOUND
// Authentic Equine Neigh / Whinny with vocal tract resonance +
// crisp wooden Rocking Horse galloping hooves (clip-clop clip-clop)
// ----------------------------------------------------------------------
function generateProperHorse() {
    const duration = 4.8;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    let neighPhase = 0;

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        // Part 1: Majestic Horse Neigh (0.1s to 2.2s)
        if (t >= 0.1 && t <= 2.3) {
            const nt = t - 0.1;
            // Pitch curve:
            // 0.0 - 0.4s: fast rising whinny (650Hz -> 1450Hz)
            // 0.4 - 1.3s: intense vibrato flutter at 1450Hz
            // 1.3 - 2.2s: descending vocal fade (1450Hz -> 450Hz)
            let baseFreq = 650;
            if (nt < 0.4) {
                baseFreq = 650 + Math.pow(nt / 0.4, 1.2) * 800;
            } else if (nt < 1.3) {
                baseFreq = 1450;
            } else {
                const p = (nt - 1.3) / 0.9;
                baseFreq = 1450 - p * 980;
            }

            // Rapid vocal flutter / tremolo (15 Hz)
            const tremoloRate = 14.5;
            const flutter = Math.sin(2 * Math.PI * tremoloRate * nt);
            const freq = baseFreq * (1 + flutter * 0.08);

            neighPhase += (freq / sampleRate);
            if (neighPhase >= 1.0) neighPhase -= 1.0;

            // Formants: F1 (freq), F2 (freq * 1.6), F3 (freq * 2.4)
            const f1 = Math.sin(2 * Math.PI * neighPhase);
            const f2 = Math.sin(2 * Math.PI * ((neighPhase * 1.6) % 1)) * 0.55;
            const f3 = Math.sin(2 * Math.PI * ((neighPhase * 2.4) % 1)) * 0.35;
            const breath = (Math.random() * 2 - 1) * 0.18;

            // Amplitude envelope
            let env = Math.sin((nt / 2.2) * Math.PI);
            env = Math.pow(Math.max(0, env), 0.7);

            val += (f1 + f2 + f3 + breath) * env * 0.75;
        }

        // Part 2: Galloping Rocking Horse Hooves (paired clip-clops)
        // 4 gallop cycles starting at 1.8s, 2.4s, 3.0s, 3.6s, 4.2s
        const gallops = [
            1.80, 1.95,  // Clip-Clop 1
            2.38, 2.53,  // Clip-Clop 2
            2.96, 3.11,  // Clip-Clop 3
            3.54, 3.69,  // Clip-Clop 4
            4.12, 4.27   // Clip-Clop 5
        ];

        for (let g = 0; g < gallops.length; g++) {
            const gt = gallops[g];
            if (t >= gt && t < gt + 0.18) {
                const dt = t - gt;
                // Lead hoof slightly higher pitch than trailing hoof
                const isLead = (g % 2 === 0);
                const woodTone = isLead ? 360 : 280;
                
                // Wooden click transient (sharp 2ms click)
                const click = (Math.random() * 2 - 1) * Math.exp(-dt * 120) * 0.5;
                // Hollow wooden body resonance
                const body = Math.sin(2 * Math.PI * woodTone * dt) * Math.exp(-dt * 28);
                const subThump = Math.sin(2 * Math.PI * (woodTone * 0.5) * dt) * Math.exp(-dt * 20) * 0.4;
                
                val += (click + body + subThump) * 0.75;
            }
        }

        // End fade
        if (t > duration - 0.2) val *= (duration - t) / 0.2;

        samples[i] = val;
    }

    return samples;
}

// ----------------------------------------------------------------------
// 3. ROBOT SOUND BACKGROUND TRACK:
// Futuristic computerized bleeps + mechanical servo whirring
// (Plays in synergy with the speech: "I am Robo, please tell me, I am your help!")
// ----------------------------------------------------------------------
function generateProperRobotBleeps() {
    const duration = 4.8;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let val = 0;

        // Futuristic servo motor whirr
        const servoPitch = 480 + Math.sin(t * 8) * 160 + (t % 0.8) * 120;
        const servo = Math.sin(2 * Math.PI * servoPitch * t) * 0.22;
        const servoSub = Math.sin(2 * Math.PI * (servoPitch * 0.5) * t) * 0.15;

        // Computerized digital arpeggio bleeps
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        const noteIdx = Math.floor(t * 7) % notes.length;
        const bleepFreq = notes[noteIdx];
        const noteTime = (t * 7) % 1;
        const bleepEnv = Math.exp(-noteTime * 4.5);
        const bleep = Math.sin(2 * Math.PI * bleepFreq * t) * bleepEnv * 0.35;

        // Digital modulation
        const ringMod = Math.sin(2 * Math.PI * 60 * t);

        val = (servo + servoSub) * ringMod * 0.6 + bleep;

        if (t < 0.1) val *= (t / 0.1);
        if (t > duration - 0.2) val *= (duration - t) / 0.2;

        samples[i] = val;
    }

    return samples;
}

// Generate files
console.log('Generating proper sound files...');

const carSamples = generateProperCar();
const carBuffer = createWavBuffer(carSamples);
fs.writeFileSync(path.join(outputDir, 'car.wav'), carBuffer);
fs.writeFileSync(path.join(outputDir, 'car.ogg'), carBuffer);
console.log('✓ Created car.wav & car.ogg (duration: 4.8s)');

const horseSamples = generateProperHorse();
const horseBuffer = createWavBuffer(horseSamples);
fs.writeFileSync(path.join(outputDir, 'horse.wav'), horseBuffer);
fs.writeFileSync(path.join(outputDir, 'horse.mp3'), horseBuffer);
console.log('✓ Created horse.wav & horse.mp3 (duration: 4.8s)');

const robotSamples = generateProperRobotBleeps();
const robotBuffer = createWavBuffer(robotSamples);
fs.writeFileSync(path.join(outputDir, 'robot.wav'), robotBuffer);
fs.writeFileSync(path.join(outputDir, 'robot.ogg'), robotBuffer);
console.log('✓ Created robot.wav & robot.ogg (duration: 4.8s)');

console.log('All sounds generated successfully!');

