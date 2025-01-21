import React, { useEffect, useRef, useState } from 'react';

const SignatureCanvas = ({ onChange }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Set canvas size to match container size
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 2;
    contextRef.current = context;
  }, []);

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // For mouse events
    if (event.clientX) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
    
    // For touch events
    if (event.touches && event.touches[0]) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    }
    
    return null;
  };

  const startDrawing = (event) => {
    event.preventDefault();
    const coords = getCoordinates(event);
    if (!coords) return;

    contextRef.current.beginPath();
    contextRef.current.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (event) => {
    event.preventDefault();
    if (!isDrawing) return;

    const coords = getCoordinates(event);
    if (!coords) return;

    contextRef.current.lineTo(coords.x, coords.y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    contextRef.current.closePath();
    setIsDrawing(false);
    
    const base64Data = canvasRef.current.toDataURL();
    onChange(base64Data);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="w-full" ref={containerRef}>
      <div className="relative border border-gray-300 rounded-lg bg-white">
        <div className="absolute bottom-1/4 left-0 right-0 border-b border-gray-200" />
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-48 cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
        />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <button
          onClick={clearCanvas}
          type="button"
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear Signature
        </button>
        <span className="text-sm text-gray-500">
          Please sign above the line
        </span>
      </div>
    </div>
  );
};

export default SignatureCanvas;