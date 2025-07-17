import React, { useEffect } from 'react';

function CanvasSection({ isLoggedIn }) {
  useEffect(() => {
    if (isLoggedIn) {
      const canvas = document.getElementById('interactiveCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Set canvas background
        ctx.fillStyle = '#f0f2f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Drawing event handlers
        const startDrawing = (e) => {
          isDrawing = true;
          const rect = canvas.getBoundingClientRect();
          lastX = e.clientX - rect.left;
          lastY = e.clientY - rect.top;
        };

        const draw = (e) => {
          if (!isDrawing) return;
          
          const rect = canvas.getBoundingClientRect();
          const currentX = e.clientX - rect.left;
          const currentY = e.clientY - rect.top;

          ctx.beginPath();
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(currentX, currentY);
          ctx.strokeStyle = '#ff6b35';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.stroke();

          lastX = currentX;
          lastY = currentY;
        };

        const stopDrawing = () => {
          isDrawing = false;
        };

        // Add event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Cleanup function
        return () => {
          canvas.removeEventListener('mousedown', startDrawing);
          canvas.removeEventListener('mousemove', draw);
          canvas.removeEventListener('mouseup', stopDrawing);
          canvas.removeEventListener('mouseout', stopDrawing);
        };
      }
    }
  }, [isLoggedIn]);

  return (
    <div className="canvas-section">
      <h3>Interactive Canvas</h3>
      <canvas 
        id="interactiveCanvas" 
        width="400" 
        height="200" 
        className="interactive-canvas"
      >
        Your browser does not support the canvas element.
      </canvas>
      <p>Click on the canvas to draw! (Simple interactive feature)</p>
    </div>
  );
}

export default CanvasSection; 