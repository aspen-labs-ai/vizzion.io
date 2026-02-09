'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Check, Mail } from 'lucide-react';

const MATERIALS = [
  { key: 'metal', label: 'Metal', swatch: '/images/swatch-metal.png', roof: '/images/demo-house-metal-roof.png' },
  { key: 'shingles', label: 'Shingles', swatch: '/images/swatch-shingles.png', roof: '/images/demo-house-shingles-roof.png' },
  { key: 'tile', label: 'Spanish Tile', swatch: '/images/swatch-spanish-tile-v2.png', roof: '/images/demo-house-tile-roof.png' },
  { key: 'wood', label: 'Wood', swatch: '/images/swatch-wood.png', roof: '/images/demo-house-wood-roof.png' },
];

const STEPS = [
  { label: 'Upload' },
  { label: 'Select' },
  { label: 'Reveal' },
];

const PHASE_HINTS: Record<number, string> = {
  0: 'Your customer uploads a photo of their home',
  1: 'They choose from your product catalog',
  2: 'They enter their email to see the result',
  3: 'You get an exclusive, qualified lead',
};

const DEMO_EMAIL = 'sarah@summit-leads.com';
const TYPING_SPEED = 70;
const LOOP_DURATION = 16500;

function SpeechBubble({ text }: { text: string }) {
  return (
    <motion.div
      className="absolute -top-1 left-4 right-4 z-20"
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="relative bg-accent rounded-lg px-4 py-2.5 shadow-lg shadow-accent/20">
        <p className="text-sm text-primary font-semibold text-center">{text}</p>
        {/* Triangle tail pointing down */}
        <svg className="absolute -bottom-[8px] left-8 w-4 h-[9px]" viewBox="0 0 16 9" fill="none">
          <path d="M0 0 L8 9 L16 0" fill="var(--color-accent)" />
        </svg>
      </div>
    </motion.div>
  );
}

const phaseTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: 'easeInOut' as const },
};

function StepIndicator({ activeStep, completedSteps }: { activeStep: number; completedSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-5">
      {STEPS.map((step, i) => {
        const isCompleted = i < completedSteps;
        const isActive = i === activeStep;
        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  isCompleted
                    ? 'bg-accent text-primary'
                    : isActive
                      ? 'bg-accent text-primary shadow-accent-glow'
                      : 'bg-bg-tertiary text-text-tertiary border border-border-default'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-300 ${
                  isCompleted || isActive ? 'text-text-primary' : 'text-text-tertiary'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-1.5 mb-4 transition-all duration-500 ${
                  i < completedSteps ? 'bg-accent' : 'bg-border-default'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function NextButton({ label, pressed }: { label: string; pressed: boolean }) {
  return (
    <motion.div
      className="w-full px-5 py-3 bg-accent text-primary text-sm font-semibold rounded-md text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        ...(pressed ? {
          scale: [1, 0.96, 1],
          boxShadow: [
            '0 0 0px rgba(16, 185, 129, 0)',
            '0 0 20px rgba(16, 185, 129, 0.4)',
            '0 0 20px rgba(16, 185, 129, 0.4)',
          ],
        } : {}),
      }}
      transition={pressed
        ? { duration: 0.35, ease: 'easeInOut' }
        : { duration: 0.3, ease: 'easeOut' }
      }
    >
      {label}
    </motion.div>
  );
}

function AutoSlider({ beforeImage, afterImage }: { beforeImage: string; afterImage: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/2] rounded-lg overflow-hidden border border-border-default"
    >
      {/* After image (behind) */}
      <div className="absolute inset-0">
        <Image src={afterImage} alt="After" fill className="object-cover" />
      </div>

      {/* Before image (clipped) */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ width: '100%' }}
        animate={{ width: ['100%', '20%', '65%', '35%'] }}
        transition={{
          duration: 3,
          ease: 'easeInOut',
          times: [0, 0.4, 0.7, 1],
        }}
      >
        <div className="relative w-full h-full" style={{ width: containerWidth }}>
          <Image src={beforeImage} alt="Before" fill className="object-cover" />
        </div>
      </motion.div>

      {/* Slider line */}
      <motion.div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10"
        initial={{ left: '100%' }}
        animate={{ left: ['100%', '20%', '65%', '35%'] }}
        transition={{
          duration: 3,
          ease: 'easeInOut',
          times: [0, 0.4, 0.7, 1],
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-bg-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M8 15l4 4 4-4" />
          </svg>
        </div>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-bg-primary/80 backdrop-blur-sm rounded-full text-[10px] font-semibold text-text-primary z-10">
        Before
      </div>
      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-accent/80 backdrop-blur-sm rounded-full text-[10px] font-semibold text-primary z-10">
        After
      </div>
    </div>
  );
}

export default function WidgetMockup() {
  const [phase, setPhase] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [selectedSwatch, setSelectedSwatch] = useState<string | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Derive stepper state from phase
  const activeStep = Math.min(phase, 3);
  const completedSteps = phase >= 3 ? 3 : phase;

  const runLoop = useCallback(() => {
    clearAllTimeouts();

    // Reset
    setPhase(0);
    setSubStep(0);
    setTypedText('');
    setSelectedSwatch(null);

    // Phase 0: Upload (~4.2s)
    schedule(() => setSubStep(1), 600);     // photo drops in
    schedule(() => setSubStep(2), 1600);    // progress bar
    schedule(() => setSubStep(3), 2600);    // checkmark
    schedule(() => setSubStep(4), 3200);    // button appears
    schedule(() => setSubStep(5), 3800);    // button press

    // Phase 1: Material Selection (~3.3s)
    schedule(() => {
      setPhase(1);
      setSubStep(0);
    }, 4300);
    schedule(() => setSubStep(1), 4900);    // swatches stagger in
    schedule(() => {
      setSelectedSwatch('metal');
      setSubStep(2);
    }, 5900);                                // metal auto-selects
    schedule(() => setSubStep(3), 6600);    // button appears
    schedule(() => setSubStep(4), 7200);    // button press

    // Phase 2: Email Gate (~3.5s)
    schedule(() => {
      setPhase(2);
      setSubStep(0);
      setTypedText('');
    }, 7700);
    schedule(() => setSubStep(1), 8300);    // start typing

    // Phase 3: The Big Reveal (~4s with slider animation)
    schedule(() => {
      setPhase(3);
      setSubStep(0);
    }, 11500);
    schedule(() => setSubStep(1), 12000);   // lead captured badge

    // Phase 4: Fade out + loop restart
    schedule(() => setPhase(4), 15200);
    schedule(runLoop, LOOP_DURATION);
  }, [clearAllTimeouts, schedule]);

  // Main loop
  useEffect(() => {
    runLoop();
    return clearAllTimeouts;
  }, [runLoop, clearAllTimeouts]);

  // Typing effect — only trigger once when subStep first hits 1
  useEffect(() => {
    if (phase === 2 && subStep === 1) {
      let charIndex = 0;
      typingRef.current = setInterval(() => {
        charIndex++;
        if (charIndex <= DEMO_EMAIL.length) {
          setTypedText(DEMO_EMAIL.slice(0, charIndex));
        } else {
          if (typingRef.current) clearInterval(typingRef.current);
          typingRef.current = null;
          // Show "Reveal" button after typing
          setTimeout(() => setSubStep(2), 300);
          // Auto-press button
          setTimeout(() => setSubStep(3), 800);
        }
      }, TYPING_SPEED);
    }
    return () => {
      if (typingRef.current) {
        clearInterval(typingRef.current);
        typingRef.current = null;
      }
    };
  }, [phase, subStep]);

  return (
    <div className="relative pt-12 max-w-md lg:max-w-lg mx-auto pointer-events-none select-none">
      {/* Floating Speech Bubble — above the widget */}
      <AnimatePresence mode="wait">
        {phase <= 3 && PHASE_HINTS[phase] && (
          <SpeechBubble key={phase} text={PHASE_HINTS[phase]} />
        )}
      </AnimatePresence>

      {/* Website Mockup Frame */}
      <div className="bg-bg-secondary rounded-xl shadow-xl overflow-hidden border border-border-default">
        {/* Browser Chrome with URL bar */}
        <div className="bg-bg-tertiary px-4 py-2.5 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 bg-bg-primary/60 rounded-md px-3 py-1 flex items-center gap-2">
            <svg className="w-3 h-3 text-text-tertiary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="text-[11px] text-text-tertiary truncate">summitroofing.com</span>
          </div>
        </div>

        {/* Fake Website Navbar */}
        <div className="px-4 py-2.5 bg-bg-secondary border-b border-border-subtle flex items-center justify-between">
          <span className="text-sm font-bold text-text-primary">Summit Roofing</span>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-text-tertiary">Services</span>
            <span className="text-[11px] text-text-tertiary">Gallery</span>
            <span className="text-[11px] text-text-tertiary">Contact</span>
          </div>
        </div>

        {/* Widget Content (embedded on the "website") */}
        <div className="p-5 bg-bg-secondary">
          {/* Step Indicator */}
          <StepIndicator activeStep={activeStep} completedSteps={completedSteps} />

          {/* Phase Content — fixed height */}
          <div className="h-[320px] overflow-hidden">
            <AnimatePresence mode="wait">
            {/* Phase 0: Upload */}
            {phase === 0 && (
              <motion.div
                key="upload"
                {...phaseTransition}
                className="h-full flex flex-col"
              >
                <div className="rounded-lg border-2 border-dashed border-border-default bg-bg-tertiary p-6 flex flex-col items-center justify-center flex-1 relative overflow-hidden">
                  {subStep === 0 && (
                    <motion.div
                      className="flex flex-col items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Upload className="w-10 h-10 text-text-tertiary" />
                      <p className="text-sm font-medium text-text-secondary">Upload your home photo</p>
                      <p className="text-xs text-text-tertiary">Drag & drop or click to browse</p>
                    </motion.div>
                  )}

                  {subStep >= 1 && (
                    <div className="flex flex-col items-center gap-3 w-full">
                      <motion.div
                        className="w-32 h-24 rounded-lg overflow-hidden relative"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      >
                        <Image
                          src="/images/demo-house-old-roof.png"
                          alt="Uploaded house"
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                      <motion.p
                        className="text-xs text-text-secondary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        my-house.jpg
                      </motion.p>

                      {subStep >= 2 && (
                        <div className="w-full max-w-[200px] h-1.5 bg-bg-primary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-accent rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                      )}

                      {subStep >= 3 && (
                        <motion.div
                          className="flex items-center gap-1.5"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                          </div>
                          <span className="text-xs text-accent font-medium">Upload complete</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {subStep >= 4 && (
                  <div className="pt-3">
                    <NextButton label="Choose Your Material →" pressed={subStep >= 5} />
                  </div>
                )}
              </motion.div>
            )}

            {/* Phase 1: Material Selection */}
            {phase === 1 && (
              <motion.div
                key="selection"
                {...phaseTransition}
                className="h-full flex flex-col"
              >
                <h5 className="text-sm font-semibold mb-3 text-text-primary">Choose Your Material</h5>

                {subStep >= 1 ? (
                  <motion.div
                    className="grid grid-cols-2 gap-3 flex-1"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.1 } },
                    }}
                  >
                    {MATERIALS.map((m) => (
                      <motion.div
                        key={m.key}
                        variants={{
                          hidden: { opacity: 0, y: 16 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.3 }}
                        className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                          selectedSwatch === m.key
                            ? 'border-2 border-accent shadow-accent-glow'
                            : 'border border-border-default'
                        }`}
                      >
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={m.swatch}
                            alt={m.label}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {selectedSwatch === m.key && (
                          <motion.div
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          >
                            <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                          </motion.div>
                        )}
                        <div className="bg-bg-tertiary py-1.5 text-center">
                          <span className={`text-xs ${selectedSwatch === m.key ? 'text-accent font-semibold' : 'text-text-primary'}`}>
                            {m.label}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="flex-1" />
                )}

                {subStep >= 3 && (
                  <div className="pt-3">
                    <NextButton label="Continue →" pressed={subStep >= 4} />
                  </div>
                )}
              </motion.div>
            )}

            {/* Phase 2: Email Gate */}
            {phase === 2 && (
              <motion.div
                key="email"
                {...phaseTransition}
                className="h-full flex flex-col items-center justify-center"
              >
                <div className="w-full space-y-5">
                  <div className="flex items-center gap-3 justify-center">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-text-primary">Almost there!</h5>
                      <p className="text-xs text-text-secondary">Enter your email to see your visualization</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-2">Email Address</label>
                    <div className="w-full px-4 py-3.5 bg-bg-tertiary border border-border-default rounded-lg text-sm text-text-primary flex items-center min-h-[48px]">
                      <span>{typedText}</span>
                      {subStep === 1 && (
                        <span className="animate-blink-cursor text-accent ml-px">|</span>
                      )}
                    </div>
                  </div>

                  {subStep >= 2 ? (
                    <NextButton label="Reveal Visualization →" pressed={subStep >= 3} />
                  ) : (
                    <p className="text-[11px] text-text-tertiary text-center">
                      Your visualization will be ready instantly
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Phase 3: The Big Reveal — Before/After Slider */}
            {phase === 3 && (
              <motion.div
                key="result"
                {...phaseTransition}
                className="h-full flex flex-col"
              >
                <AutoSlider
                  beforeImage="/images/demo-house-old-roof.png"
                  afterImage={MATERIALS.find(m => m.key === (selectedSwatch || 'metal'))?.roof || '/images/demo-house-metal-roof.png'}
                />

                {/* Success state */}
                <div className="flex flex-col items-center gap-2.5 pt-4 flex-1">
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-text-primary">Visualization sent!</span>
                  </motion.div>

                  {subStep >= 1 && (
                    <motion.div
                      className="w-full px-4 py-3 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-between"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-xs font-medium text-accent">New Lead</span>
                      </div>
                      <span className="text-xs text-text-secondary">{DEMO_EMAIL}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Phase 4: Fade out for loop restart */}
            {phase === 4 && (
              <motion.div
                key="fadeout"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-[320px]"
              />
            )}
            </AnimatePresence>
          </div>
        </div>

        {/* Preload all roof images (hidden) */}
        <div className="hidden">
          {MATERIALS.map(m => (
            <Image key={m.key} src={m.roof} alt="" width={1} height={1} />
          ))}
          <Image src="/images/demo-house-old-roof.png" alt="" width={1} height={1} />
        </div>
      </div>
    </div>
  );
}
