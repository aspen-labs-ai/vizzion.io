import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Brand colors
const colors = {
  primary: '#0A1628',
  accent: '#00D9C0',
  accentLight: '#00D9C020',
  text: '#FFFFFF',
  textSecondary: '#A0AEC0',
};

const Scene1Problem = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const slideUp = interpolate(frame, [0, 20], [50, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity, transform: `translateY(${slideUp}px)`, textAlign: 'center', padding: '60px' }}>
        <h1 style={{ 
          fontSize: '80px', 
          fontWeight: 'bold', 
          color: colors.text,
          marginBottom: '40px',
          fontFamily: 'Space Grotesk, system-ui, sans-serif',
          lineHeight: 1.1
        }}>
          The Problem
        </h1>
        <p style={{ 
          fontSize: '48px', 
          color: colors.textSecondary,
          fontFamily: 'Inter, system-ui, sans-serif',
          maxWidth: '1000px',
          lineHeight: 1.3
        }}>
          Homeowners <span style={{ color: colors.accent }}>can't visualize</span> how your products look on their property
        </p>
      </div>
    </AbsoluteFill>
  );
};

const Scene2Solution = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFrame = frame - 90; // Start at frame 90
  const opacity = interpolate(sceneFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const slideUp = interpolate(sceneFrame, [0, 20], [50, 0], { extrapolateRight: 'clamp' });
  
  const widgetScale = spring({
    frame: sceneFrame - 20,
    fps,
    config: { damping: 12 }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity, transform: `translateY(${slideUp}px)`, textAlign: 'center', padding: '60px' }}>
        <h1 style={{ 
          fontSize: '80px', 
          fontWeight: 'bold', 
          color: colors.accent,
          marginBottom: '40px',
          fontFamily: 'Space Grotesk, system-ui, sans-serif',
          lineHeight: 1.1
        }}>
          The Solution
        </h1>
        
        {/* Widget visualization mockup */}
        <div style={{
          transform: `scale(${widgetScale})`,
          margin: '40px auto',
          maxWidth: '800px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 217, 192, 0.1) 0%, rgba(0, 217, 192, 0.05) 100%)',
            border: `3px solid ${colors.accent}`,
            borderRadius: '24px',
            padding: '40px',
            boxShadow: `0 20px 60px rgba(0, 217, 192, 0.3)`
          }}>
            <div style={{
              fontSize: '36px',
              color: colors.text,
              fontFamily: 'Space Grotesk, system-ui, sans-serif',
              marginBottom: '20px'
            }}>
              📸 Upload Your Photo
            </div>
            <div style={{
              fontSize: '36px',
              color: colors.text,
              fontFamily: 'Space Grotesk, system-ui, sans-serif',
              marginBottom: '20px'
            }}>
              ↓
            </div>
            <div style={{
              fontSize: '36px',
              color: colors.accent,
              fontFamily: 'Space Grotesk, system-ui, sans-serif',
              fontWeight: 'bold'
            }}>
              See Your New Roof Instantly
            </div>
          </div>
        </div>

        <p style={{ 
          fontSize: '42px', 
          color: colors.textSecondary,
          fontFamily: 'Inter, system-ui, sans-serif',
          marginTop: '40px'
        }}>
          Vizzion widget = Instant visualization
        </p>
      </div>
    </AbsoluteFill>
  );
};

const Scene3Result = () => {
  const frame = useCurrentFrame();
  
  const sceneFrame = frame - 180; // Start at frame 180
  const opacity = interpolate(sceneFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const slideUp = interpolate(sceneFrame, [0, 20], [50, 0], { extrapolateRight: 'clamp' });

  const stats = [
    { icon: '✉️', label: 'Email Captured', value: 'Before Visualization' },
    { icon: '🎯', label: 'Qualified Leads', value: 'Every Visitor' },
    { icon: '⚡', label: 'Close Deals', value: '2x Faster' }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity, transform: `translateY(${slideUp}px)`, textAlign: 'center', padding: '60px' }}>
        <h1 style={{ 
          fontSize: '80px', 
          fontWeight: 'bold', 
          color: colors.accent,
          marginBottom: '60px',
          fontFamily: 'Space Grotesk, system-ui, sans-serif',
          lineHeight: 1.1
        }}>
          The Result
        </h1>

        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginBottom: '60px' }}>
          {stats.map((stat, i) => (
            <div 
              key={i}
              style={{
                opacity: interpolate(sceneFrame, [10 + i * 5, 20 + i * 5], [0, 1], { extrapolateRight: 'clamp' }),
                transform: `translateY(${interpolate(sceneFrame, [10 + i * 5, 20 + i * 5], [20, 0], { extrapolateRight: 'clamp' })}px)`,
                background: colors.accentLight,
                border: `2px solid ${colors.accent}`,
                borderRadius: '16px',
                padding: '30px',
                minWidth: '250px'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>{stat.icon}</div>
              <div style={{ 
                fontSize: '28px', 
                color: colors.accent,
                fontFamily: 'Space Grotesk, system-ui, sans-serif',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: '20px', 
                color: colors.textSecondary,
                fontFamily: 'Inter, system-ui, sans-serif'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene4CTA = () => {
  const frame = useCurrentFrame();
  
  const sceneFrame = frame - 270; // Start at frame 270
  const opacity = interpolate(sceneFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(sceneFrame, [0, 20], [0.8, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ 
      backgroundColor: colors.primary, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '40px'
    }}>
      <div style={{ 
        opacity, 
        transform: `scale(${scale})`,
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '100px', 
          fontWeight: 'bold', 
          background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.text} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '40px',
          fontFamily: 'Space Grotesk, system-ui, sans-serif',
          lineHeight: 1.1
        }}>
          Vizzion
        </h1>
        
        <p style={{ 
          fontSize: '48px', 
          color: colors.textSecondary,
          fontFamily: 'Inter, system-ui, sans-serif',
          marginBottom: '60px'
        }}>
          Turn every visitor into a qualified lead
        </p>

        <div style={{
          background: colors.accent,
          color: colors.primary,
          fontSize: '42px',
          fontWeight: 'bold',
          fontFamily: 'Space Grotesk, system-ui, sans-serif',
          padding: '24px 48px',
          borderRadius: '12px',
          display: 'inline-block'
        }}>
          vizzion.io
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const VizzionPromo = () => {
  return (
    <AbsoluteFill>
      {/* Scene 1: The Problem (0-90 frames = 3 seconds at 30fps) */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1Problem />
      </Sequence>

      {/* Scene 2: The Solution (90-180 frames = 3 seconds) */}
      <Sequence from={90} durationInFrames={90}>
        <Scene2Solution />
      </Sequence>

      {/* Scene 3: The Result (180-270 frames = 3 seconds) */}
      <Sequence from={180} durationInFrames={90}>
        <Scene3Result />
      </Sequence>

      {/* Scene 4: CTA (270-360 frames = 3 seconds) */}
      <Sequence from={270} durationInFrames={90}>
        <Scene4CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
