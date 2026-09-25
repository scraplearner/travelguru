import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface CityHub {
  name: string;
  code: string;
  lat: number;
  lon: number;
  country: string;
}

interface FlightRoute {
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  progress: number;
  color: string;
}

const HUBS: CityHub[] = [
  { name: 'London', code: 'LHR', lat: 51.5, lon: -0.1, country: 'UK' },
  { name: 'Paris', code: 'CDG', lat: 48.8, lon: 2.3, country: 'France' },
  { name: 'Dubai', code: 'DXB', lat: 25.2, lon: 55.3, country: 'UAE' },
  { name: 'New Delhi', code: 'DEL', lat: 28.6, lon: 77.2, country: 'India' },
  { name: 'Singapore', code: 'SIN', lat: 1.3, lon: 103.8, country: 'Singapore' },
  { name: 'Bali', code: 'DPS', lat: -8.4, lon: 115.1, country: 'Indonesia' },
  { name: 'Tokyo', code: 'HND', lat: 35.6, lon: 139.7, country: 'Japan' },
  { name: 'New York', code: 'JFK', lat: 40.7, lon: -74.0, country: 'USA' },
  { name: 'Sydney', code: 'SYD', lat: -33.8, lon: 151.2, country: 'Australia' }
];

const ROUTES: FlightRoute[] = [
  { from: 'London', to: 'Dubai', fromCode: 'LHR', toCode: 'DXB', progress: 0.65, color: '#38BDF8' },
  { from: 'Dubai', to: 'New Delhi', fromCode: 'DXB', toCode: 'DEL', progress: 0.88, color: '#F59E0B' },
  { from: 'New Delhi', to: 'Bali', fromCode: 'DEL', toCode: 'DPS', progress: 0.42, color: '#10B981' },
  { from: 'Bali', to: 'Tokyo', fromCode: 'DPS', toCode: 'HND', progress: 0.15, color: '#A855F7' },
  { from: 'Paris', to: 'Singapore', fromCode: 'CDG', toCode: 'SIN', progress: 0.72, color: '#EC4899' }
];

export const GlobeVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [lastMouseY, setLastMouseY] = useState(0);

  // Rotation angles (radians)
  const rotationY = useRef(0.8);
  const rotationX = useRef(0.2);
  const autoRotateSpeed = useRef(0.0035);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let flightParticleOffset = 0;

    // Responsive Canvas Resizing with DevicePixelRatio
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const degToRad = (deg: number) => (deg * Math.PI) / 180;

    // Convert Lat / Lon to 3D Cartesian coordinates
    const to3D = (lat: number, lon: number, radius: number, rotY: number, rotX: number) => {
      const phi = degToRad(90 - lat);
      const theta = degToRad(lon) + rotY;

      let x = radius * Math.sin(phi) * Math.sin(theta);
      let y = -radius * Math.cos(phi);
      let z = radius * Math.sin(phi) * Math.cos(theta);

      // Rotate around X axis
      const yNew = y * Math.cos(rotX) - z * Math.sin(rotX);
      const zNew = y * Math.sin(rotX) + z * Math.cos(rotX);

      return { x, y: yNew, z: zNew };
    };

    // Render loop
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const globeRadius = Math.min(width, height) * 0.40;

      ctx.clearRect(0, 0, width, height);

      // Auto rotation when not dragging
      if (!isDragging) {
        rotationY.current += autoRotateSpeed.current;
      }
      flightParticleOffset = (flightParticleOffset + 0.008) % 1;

      // 1. Draw Globe Atmospheric Outer Glow
      const glowGrad = ctx.createRadialGradient(
        centerX, centerY, globeRadius * 0.7,
        centerX, centerY, globeRadius * 1.35
      );
      glowGrad.addColorStop(0, 'rgba(59, 130, 246, 0.22)');
      glowGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.12)');
      glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Globe Body Sphere Gradient (Dark luxury sphere)
      const sphereGrad = ctx.createRadialGradient(
        centerX - globeRadius * 0.35,
        centerY - globeRadius * 0.35,
        globeRadius * 0.1,
        centerX,
        centerY,
        globeRadius
      );
      sphereGrad.addColorStop(0, '#1E293B');
      sphereGrad.addColorStop(0.7, '#0F172A');
      sphereGrad.addColorStop(1, '#020617');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.clip(); // Clip to sphere

      // 3. Draw Latitude Rings
      [-60, -30, 0, 30, 60].forEach(lat => {
        ctx.beginPath();
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = to3D(lat, lon, globeRadius, rotationY.current, rotationX.current);
          const screenX = centerX + pt.x;
          const screenY = centerY + pt.y;
          if (lon === -180) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
        ctx.strokeStyle = lat === 0 ? 'rgba(59, 130, 246, 0.35)' : 'rgba(148, 163, 184, 0.12)';
        ctx.lineWidth = lat === 0 ? 1.2 : 0.7;
        ctx.stroke();
      });

      // 4. Draw Longitude Meridian Rings
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
          const pt = to3D(lat, lon, globeRadius, rotationY.current, rotationX.current);
          const screenX = centerX + pt.x;
          const screenY = centerY + pt.y;
          if (lat === -90) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // 5. Draw Flight Arcs & Traveling Beziers
      ROUTES.forEach((route) => {
        const fromHub = HUBS.find(h => h.code === route.fromCode);
        const toHub = HUBS.find(h => h.code === route.toCode);
        if (!fromHub || !toHub) return;

        const arcPoints: { x: number; y: number; z: number }[] = [];
        const numSteps = 32;

        for (let i = 0; i <= numSteps; i++) {
          const t = i / numSteps;
          const curLat = fromHub.lat + (toHub.lat - fromHub.lat) * t;
          const curLon = fromHub.lon + (toHub.lon - fromHub.lon) * t;
          const elevation = Math.sin(t * Math.PI) * (globeRadius * 0.22);
          const pt = to3D(curLat, curLon, globeRadius + elevation, rotationY.current, rotationX.current);
          arcPoints.push(pt);
        }

        // Draw Arc Line
        ctx.beginPath();
        let hasStarted = false;
        arcPoints.forEach((pt) => {
          if (pt.z > -globeRadius * 0.15) {
            const sx = centerX + pt.x;
            const sy = centerY + pt.y;
            if (!hasStarted) {
              ctx.moveTo(sx, sy);
              hasStarted = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          }
        });

        ctx.strokeStyle = route.color;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = route.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Animated Flight Particle Pulse along the arc
        const activeT = (route.progress + flightParticleOffset) % 1;
        const pulseIndex = Math.floor(activeT * (arcPoints.length - 1));
        const pulsePt = arcPoints[pulseIndex];

        if (pulsePt && pulsePt.z > -globeRadius * 0.1) {
          const px = centerX + pulsePt.x;
          const py = centerY + pulsePt.y;

          // Glowing pulse beacon
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = route.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Mini radar ring
          ctx.beginPath();
          ctx.arc(px, py, 9, 0, Math.PI * 2);
          ctx.strokeStyle = route.color;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // 6. Draw City Hub Pins & Labels
      HUBS.forEach((hub) => {
        const pt = to3D(hub.lat, hub.lon, globeRadius, rotationY.current, rotationX.current);
        if (pt.z > 0) {
          const sx = centerX + pt.x;
          const sy = centerY + pt.y;
          const depthAlpha = Math.max(0.2, (pt.z / globeRadius));

          // Pin marker dot
          ctx.beginPath();
          ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${depthAlpha})`;
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Hub Code text
          ctx.font = '600 10px Inter, sans-serif';
          ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha * 0.9})`;
          ctx.fillText(hub.code, sx + 6, sy - 4);
        }
      });

      ctx.restore();

      // Ambient horizon rim light
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDragging]);

  // Mouse / Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouseX(e.clientX);
    setLastMouseY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;

    rotationY.current += deltaX * 0.008;
    rotationX.current = Math.max(-0.8, Math.min(0.8, rotationX.current + deltaY * 0.008));

    setLastMouseX(e.clientX);
    setLastMouseY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="globe-viz-container">
      {/* Interactive 3D Canvas */}
      <div 
        className="globe-canvas-wrapper"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        title="Click and drag to spin the 3D globe"
      >
        <canvas ref={canvasRef} className="globe-canvas" />

        <div className="globe-drag-hint">
          <Sparkles size={11} className="text-amber" />
          <span>Interactive 3D: Drag to rotate the globe</span>
        </div>
      </div>
    </div>
  );
};
