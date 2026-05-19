import { motion } from 'framer-motion';

/**
 * GlobeGraphic — Glass sphere with animated network nodes and pulsating connections.
 * This is the primary visual for the left panel of all auth pages.
 */
export function GlobeGraphic() {
  const nodes = [
    { id: 1, x: 120, y: 110, r: 4, color: '#60a5fa' },
    { id: 2, x: 280, y: 130, r: 5, color: '#38bdf8' },
    { id: 3, x: 310, y: 230, r: 6, color: '#818cf8' },
    { id: 4, x: 210, y: 310, r: 4, color: '#60a5fa' },
    { id: 5, x: 110, y: 250, r: 5, color: '#818cf8' },
    { id: 6, x: 190, y: 180, r: 7, color: '#38bdf8' },
  ];

  const connections = [
    { source: 6, target: 1 },
    { source: 6, target: 2 },
    { source: 6, target: 3 },
    { source: 6, target: 4 },
    { source: 6, target: 5 },
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
    { source: 5, target: 1 },
  ];

  return (
    <div className="globe-wrapper">
       {/* Ambient bright fog */}
       <div className="globe-ambient" />

       <motion.div
        className="globe-inner"
        animate={{ rotateZ: [0, 2, -2, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
      >

         {/* Base Glass Sphere */}
         <svg viewBox="0 0 400 400" className="globe-layer globe-layer--base">
            <defs>
               <radialGradient id="glassSphereLight" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="#f8fafc" stopOpacity="0.6" />
                  <stop offset="70%" stopColor="#e0f2fe" stopOpacity="0.3" />
                  <stop offset="90%" stopColor="#bae6fd" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.2" />
               </radialGradient>
               <radialGradient id="rimLightLight" cx="50%" cy="50%" r="50%">
                  <stop offset="88%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="96%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#e0f2fe" stopOpacity="1" />
               </radialGradient>
               <filter id="bottomGlow">
                  <feGaussianBlur stdDeviation="15" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
               </filter>
            </defs>
            <circle cx="200" cy="200" r="160" fill="url(#glassSphereLight)" />
            <circle cx="200" cy="200" r="160" fill="url(#rimLightLight)" />
         </svg>

         {/* Rotating Grids, Lines, Nodes */}
         <motion.svg
            viewBox="0 0 400 400"
            className="globe-layer globe-layer--grid"
            animate={{ rotate: 360, rotateY: [0, 10, -10, 0] }}
            transition={{
               rotate: { duration: 160, repeat: Infinity, ease: 'linear' },
               rotateY: { duration: 20, repeat: Infinity, ease: 'easeInOut' }
            }}
            style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
         >
            <defs>
               <filter id="nodeGlowLight">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
               </filter>
            </defs>

            {/* Subtle Equator and Grids */}
            <g opacity="0.45">
               <ellipse cx="200" cy="200" rx="160" ry="35" fill="none" stroke="#bae6fd" strokeWidth="1" />
               <ellipse cx="200" cy="200" rx="160" ry="80" fill="none" stroke="#e0f2fe" strokeWidth="0.75" strokeDasharray="4 4" />
               <ellipse cx="200" cy="200" rx="160" ry="120" fill="none" stroke="#e0f2fe" strokeWidth="0.5" strokeDasharray="2 4" />
               <ellipse cx="200" cy="200" rx="35" ry="160" fill="none" stroke="#bae6fd" strokeWidth="0.75" />
               <ellipse cx="200" cy="200" rx="80" ry="160" fill="none" stroke="#e0f2fe" strokeWidth="0.5" strokeDasharray="4 4" />
               <ellipse cx="200" cy="200" rx="120" ry="160" fill="none" stroke="#e0f2fe" strokeWidth="0.5" strokeDasharray="2 4" />
            </g>

            {/* Connections */}
            {connections.map((c, i) => {
              const n1 = nodes.find(n => n.id === c.source);
              const n2 = nodes.find(n => n.id === c.target);
              const dx = n2.x - n1.x;
              const dy = n2.y - n1.y;
              const cpx = n1.x + dx/2 + dy * 0.15;
              const cpy = n1.y + dy/2 - dx * 0.15;
              const pathD = `M ${n1.x} ${n1.y} Q ${cpx} ${cpy} ${n2.x} ${n2.y}`;
              return (
                 <g key={`conn-${i}`}>
                   <path d={pathD} fill="none" stroke="#7dd3fc" strokeWidth="1" opacity="0.4" />
                   <motion.path d={pathD} fill="none" stroke="#eff6ff" strokeWidth="2.5"
                     initial={{ pathLength: 0, opacity: 0 }}
                     animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                     transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                     filter="url(#nodeGlowLight)"
                   />
                   <motion.path d={pathD} fill="none" stroke={n2.color} strokeWidth="1.5"
                     initial={{ pathLength: 0, opacity: 0 }}
                     animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
                     transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 + 0.2, ease: "easeInOut" }}
                     filter="url(#nodeGlowLight)"
                   />
                 </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => (
               <g key={`node-${node.id}`}>
                  <motion.circle cx={node.x} cy={node.y} r={node.r} fill="none" stroke={node.color} strokeWidth={2}
                    initial={{ scale: 1, opacity: 0.9 }}
                    animate={{ scale: [1, 3], opacity: [0.9, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: node.id * 0.3 }}
                  />
                  <circle cx={node.x} cy={node.y} r={node.r + 1.5} fill="#fff" filter="url(#nodeGlowLight)" />
                  <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} />
               </g>
            ))}
         </motion.svg>

         {/* Orbiting outer elements & ground reflections */}
         <svg viewBox="0 0 400 400" className="globe-layer globe-layer--orbit">
            <ellipse cx="200" cy="360" rx="120" ry="15" fill="none" stroke="#7dd3fc" strokeWidth="1" opacity="0.3" filter="url(#bottomGlow)" />
            <ellipse cx="200" cy="360" rx="160" ry="20" fill="none" stroke="#bae6fd" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.4" />
            <ellipse cx="200" cy="360" rx="200" ry="25" fill="none" stroke="#e0f2fe" strokeWidth="0.5" opacity="0.3" />
            <motion.g animate={{ rotate: -360 }} transition={{ duration: 200, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: 'center' }}>
               <circle cx="200" cy="200" r="180" fill="none" stroke="#e0f2fe" strokeWidth="0.5" strokeDasharray="5 15" opacity="0.6" />
               <circle cx="200" cy="200" r="215" fill="none" stroke="#bae6fd" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.4" />
            </motion.g>
         </svg>

         {/* Front Top Specular */}
         <svg viewBox="0 0 400 400" className="globe-layer globe-layer--specular">
            <defs>
               <radialGradient id="topReflectionLight" cx="30%" cy="20%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
               </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="160" fill="url(#topReflectionLight)" />
         </svg>

      </motion.div>
    </div>
  );
}
