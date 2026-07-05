export const night = {
  sky: {
    top: '#0a0015',
    mid: '#2d0060',
    bottom: '#6600aa',
  },
  grid: {
    color: '#ff00ff',
    opacity: 0.25,
    radius: 280,
    segments: 24,
  },
  sun: {
    colorTop: '#00cfff',
    colorMid: '#ff2d78',
    colorBottom: '#ff6ec7',
    glowInner: '#ff2d78',
    glowOuter: '#7700ff',
    glowRadius: 4.8,
    sunScale: 0.32,
  },
  stars: {
    colors: ['#00ffff', '#ff00ff', '#ffff00', '#ffffff', '#7700ff', '#00ff88'],
    small: {
      count: 300,
      sizeRange: [0.3, 1.2],
    },
    large: {
      count: 20,
      poolSize: 10,
      sizeRange: [3, 8],
    },
    shooting: {
      speed: 1.5,
      length: 60,
      thickness: 4,
      cooldown: 1.5,
    },
    galaxies: {
      count: 10,
      poolSize: 3,
      sizeRange: [20, 35],
      rotSpeed: 0.003,
    },
    constellations: {
      count: 10,
      scaleRange: [8, 18],
      lineOpacity: 1.25,
      starSize: 1.4,
      color: '#00ffff',
    },
  },
  water: {
    surface: {
      color: '#1a0030',
      gridColor: '#ff00ff',
      waveSpeed: 0.4,
    },
    bubbles: {
      count: 40,
      color: '#88eeff',
    },
    godRays: {
      count: 24,
      opacity: 0.07,
      color: '#aaddff',
    },
    crt: {
      count: 10,
      bodyColor: '#1a0030',
      screenColorA: '#ff00ff',
      screenColorB: '#00ffe1',
    },
    caustics: {
      scale: 17.0,
      speed: 0.3,
      edgeWidth: 0.06,
      intensity: 0.55,
      colorA: '#ff00ff',
      colorB: '#00ffe1',
    },
  },
  jellyfish: {
    count: 5,
    scale: 1.0,
    pulseSpeed: 0.8,
    palettes: [
      { color: '#3a0a5e', glow: '#ff5fc4' },
      { color: '#1a1a5e', glow: '#7a5cff' },
      { color: '#0a2a4a', glow: '#5ce1ff' },
      { color: '#0a3a2a', glow: '#5cffb0' },
    ],
  },
}

export const day = {
  sky: {
    top: '#ff6a00',
    mid: '#ff2d78',
    bottom: '#ffb347',
  },
  grid: {
    color: '#ffd700',
    opacity: 0.25,
    radius: 280,
    segments: 24,
  },
  sun: {
    colorTop: '#fffde7',
    colorMid: '#ffab00',
    colorBottom: '#ff6d00',
    glowInner: '#ffab00',
    glowOuter: '#ff6d00',
    glowRadius: 2.5,
    sunScale: 0.14,
  },
  clouds: {
    color: '#ffb6c1',
    spread: 180,
    scaleRange: [1.5, 3.5],
    lightTop: '#fff5e0',
    lightBottom: '#ffc0cb',
    cloudCount: 130,
  },
  water: {
    surface: {
      color: '#1a0030',
      gridColor: '#ff00ff',
      waveSpeed: 0.4,
    },
    bubbles: {
      count: 40,
      color: '#88eeff',
    },
    godRays: {
      count: 24,
      opacity: 0.07,
      color: '#aaddff',
    },
    crt: {
      count: 10,
      bodyColor: '#1a0030',
      screenColorA: '#ff00ff',
      screenColorB: '#00ffe1',
    },
    caustics: {
      scale: 17.0,
      speed: 0.3,
      edgeWidth: 0.06,
      intensity: 0.55,
      colorA: '#ff00ff',
      colorB: '#00ffe1',
    },
  },
  cassettes: {
    count: 12,
    scale: 1.2,
    color: '#ffd700',
    labelColor: '#ff2d78',
  },
}
