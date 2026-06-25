/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        warm: {
          950: '#0f0e0c',
          900: '#161410',
          800: '#1e1b16',
          700: '#26221b',
          600: '#2e2920',
        },
        glass: {
          10: 'rgba(255,248,235,0.10)',
          8: 'rgba(255,248,235,0.08)',
          6: 'rgba(255,248,235,0.06)',
          4: 'rgba(255,248,235,0.04)',
          2: 'rgba(255,248,235,0.02)',
        },
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
        'gradient-dark': 'linear-gradient(135deg, #161410 0%, #1e1b16 50%, #0f0e0c 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(146,64,14,0.2) 0%, rgba(180,83,9,0.08) 50%, rgba(15,14,12,0.95) 100%)',
      },
      boxShadow: {
        'glow-amber': '0 0 40px rgba(180, 83, 9, 0.18), 0 0 80px rgba(180, 83, 9, 0.07)',
        'glow-stone': '0 0 40px rgba(120, 113, 108, 0.15), 0 0 80px rgba(120, 113, 108, 0.06)',
        'glow-warm': '0 0 40px rgba(217, 119, 6, 0.15), 0 0 80px rgba(217, 119, 6, 0.06)',
        'card': '0 25px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,248,235,0.05)',
      },
      animation: {
        'float': 'floatCard 6s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'scan-line': 'scanLine 2s ease-in-out infinite',
        'data-flow': 'dataFlow 2s ease-in-out infinite',
        'orb-1': 'orbFloat1 8s ease-in-out infinite',
        'orb-2': 'orbFloat2 10s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        floatCard: {
          '0%, 100%': { transform: 'rotateY(-8deg) rotateX(4deg) translateY(0px)' },
          '50%': { transform: 'rotateY(-8deg) rotateX(4deg) translateY(-8px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        scanLine: {
          '0%': { top: '10%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '90%', opacity: '0' },
        },
        dataFlow: {
          '0%': { left: '0%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { left: '100%', opacity: '0' },
        },
        orbFloat1: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -30px)' },
        },
        orbFloat2: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-15px, 20px)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};