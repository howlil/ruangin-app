import React from 'react';

export default function GridBackground({
  size = 96,
  lineColor = 'rgba(247, 247, 247, 0.883)',
  opacity = '1',
}) {
  return (
    <div
      className="absolute -top-96 -bottom-96 -z-20 -left-96 -right-96 transform rotate-12 "
      style={{
        backgroundImage: `
          linear-gradient(0deg, ${lineColor} 1px, transparent 1px),
          linear-gradient(90deg, ${lineColor} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        opacity: opacity,
      }}
    ></div>
  );
}