export function addElement(id, x1, y1, x2, y2, type,roughCanvasRef) {

    const root = roughCanvasRef.current.generator;
    let ele;

    switch (type) {
      case 'rect':
        ele = root.rectangle(x1,
          y1,
          x2 - x1,
          y2 - y1, { seed: 15, strokeWidth: 3, fillStyle: 'solid', fill: 'grey' }
        );
        return { id, x1, x2, y1, y2, ele, type };


      case 'line':
        ele = root.line(x1, y1, x2, y2, { seed: 15 });
        return { id, x1, x2, y1, y2, ele, type };

      default:
        ele = root.line(x1, y1, x2, y2, { seed: 15 });
        return { id, x1, x2, y1, y2, ele, type };

    }

  }

