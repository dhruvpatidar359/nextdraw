export const drawBounds = (Canvas2DContext, element) => {
  if (element === null) {
    return;
  }

  const { x1, y1, x2, y2, type } = element;

  if (type === 'rect' || type === 'pencil') {
    // Calculate dimensions and positions
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);

    // Calculate padding for the bounding box
    const paddingX = 6;
    const paddingY = 6;

    // Draw the bounding box
    Canvas2DContext.strokeStyle = '#27ae60'; // Change the color to a nice green, you can use any valid color code
    Canvas2DContext.lineWidth = 2; // Change the line width if needed
    Canvas2DContext.strokeRect(minX - paddingX, minY - paddingY, maxX - minX + 2 * paddingX, maxY - minY + 2 * paddingY);

    // Draw handles at corners with curved rectangles
    drawCurvyRectHandle(Canvas2DContext, minX - paddingX, minY - paddingY); // Top-left
    drawCurvyRectHandle(Canvas2DContext, maxX + paddingX, minY - paddingY); // Top-right
    drawCurvyRectHandle(Canvas2DContext, minX - paddingX, maxY + paddingY); // Bottom-left
    drawCurvyRectHandle(Canvas2DContext, maxX + paddingX, maxY + paddingY); // Bottom-right

    // Draw handles at midpoints
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    drawCurvyRectHandle(Canvas2DContext, midX, minY - paddingY); // Top-middle
    drawCurvyRectHandle(Canvas2DContext, midX, maxY + paddingY); // Bottom-middle
    drawCurvyRectHandle(Canvas2DContext, minX - paddingX, midY); // Left-middle
    drawCurvyRectHandle(Canvas2DContext, maxX + paddingX, midY); // Right-middle
  } else if (type === 'line') {
    // Draw bounding boxes for line endpoints
    drawCurvyRectHandle(Canvas2DContext, x1, y1);
    drawCurvyRectHandle(Canvas2DContext, x2, y2);
  }
};

// Helper function to draw a curved rectangle handle at a specific position
const drawCurvyRectHandle = (context, x, y) => {
  const handleSize = 10;
  const borderRadius = 3;
  const borderSize = 2;

  // Draw the curved rectangle
  context.fillStyle = '#27ae60'; // Use the same color as the bounding box
  context.beginPath();
  context.moveTo(x - handleSize / 2 + borderRadius, y - handleSize / 2);
  context.lineTo(x + handleSize / 2 - borderRadius, y - handleSize / 2);
  context.arcTo(x + handleSize / 2, y - handleSize / 2, x + handleSize / 2, y + handleSize / 2, borderRadius);
  context.lineTo(x + handleSize / 2, y + handleSize / 2 - borderRadius);
  context.arcTo(x + handleSize / 2, y + handleSize / 2, x - handleSize / 2, y + handleSize / 2, borderRadius);
  context.lineTo(x - handleSize / 2 + borderRadius, y + handleSize / 2);
  context.arcTo(x - handleSize / 2, y + handleSize / 2, x - handleSize / 2, y - handleSize / 2, borderRadius);
  context.lineTo(x - handleSize / 2, y - handleSize / 2 + borderRadius);
  context.arcTo(x - handleSize / 2, y - handleSize / 2, x + handleSize / 2, y - handleSize / 2, borderRadius);
  context.fill();

  // Draw border for the curved rectangle
  context.strokeStyle = '#2c3e50'; // Use a different color for the border
  context.lineWidth = borderSize;
  context.stroke();
};
