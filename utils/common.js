export const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
  }


 export const getminMax = (element) => {
    let minX = element.points[0].x;
    let minY = element.points[0].y;
    let maxX = element.points[0].x;
    let maxY = element.points[0].y;

    element.points.forEach(point => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });

    return { minX, minY, maxX, maxY };
  }
