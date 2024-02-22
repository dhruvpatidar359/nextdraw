import store from "@/app/store";
import { distance } from "@/utils/common";
import { setElement } from "../Redux/features/elementSlice";
import { GlobalProps } from "../Redux/GlobalProps";

let threshold = 6;

export const resizeElement = (event, elements) => {

  const selectedElement = store.getState().selectedElement.value;
  const resizeDirection = store.getState().resizeDirection.value;



  const cx = event.clientX;
  const cy = event.clientY;

  let { id, x1, x2, y1, y2, type, text } = selectedElement;
  if (type === 'rectangle' || type === 'ellipse' || type === 'diamond') {

    switch (resizeDirection) {

      case 4:

        return {
          id: id,
          x1: x1,
          y1: y1,
          x2: cx - threshold,
          y2: y2,
          type: type
        };

      case 1:

        return { id: id, x1: cx + threshold, y1: cy + threshold, x2: x2, y2: y2, type: type };

      case 2:
        return { id: id, x1: x1, y1: cy + threshold, x2: x2, y2: y2, type: type };

      case 3:
        return { id: id, x1: x1, y1: cy + threshold, x2: cx - threshold, y2: y2, type: type };

      case 5:
        return { id: id, x1: x1, y1: y1, x2: cx - threshold, y2: cy - threshold, type: type };

      case 6:
        return { id: id, x1: x1, y1: y1, x2: x2, y2: cy - threshold, type: type };

      case 7:
        return { id: id, x1: cx + threshold, y1: y1, x2: x2, y2: cy - threshold, type: type };

      case 8:

        return {
          id: id,
          x1: cx + threshold,
          y1: y1,
          x2: x2,
          y2: y2,
          type: type
        };

      default:
        break;
    }
  }

  else if (type === 'text') {
    // console.log(selectedElement.text);

    switch (resizeDirection) {

      case 4:

        return {
          id: id,
          x1: x1,
          y1: y1,
          x2: cx - threshold,
          y2: y2,
          type: type

        };

      case 1:

        return { id: id, x1: cx + threshold, y1: cy + threshold, x2: x2, y2: y2, type: type };

      case 2:
        return { id: id, x1: x1, y1: cy + threshold, x2: x2, y2: y2, type: type };

      case 3:
        return { id: id, x1: x1, y1: cy + threshold, x2: cx - threshold, y2: y2, type: type, text: text };

      case 5:
        return { id: id, x1: x1, y1: y1, x2: cx - threshold, y2: cy - threshold, type: type };

      case 6:
        return { id: id, x1: x1, y1: y1, x2: x2, y2: cy - threshold, type: type };

      case 7:
        return { id: id, x1: cx + threshold, y1: y1, x2: x2, y2: cy - threshold, type: type };

      case 8:

        return {
          id: id,
          x1: cx + threshold,
          y1: y1,
          x2: x2,
          y2: y2,
          type: type
        };

      default:
        break;
    }
  }

  else if (type === 'line') {
    switch (resizeDirection) {
      case 1:
        return { id: id, x1: cx, y1: cy, x2: x2, y2: y2, type: type };


      case 2:
        return { id: id, x1: x1, y1: y1, x2: cx, y2: cy, type: type };

      default:
        break;
    }
  } else if (type === 'pencil') {
    const roomId = GlobalProps.room;
    id = (id.split("#"));
    const key = id[0];
    id = parseInt(id[1]);

    switch (resizeDirection) {




      //    case 1:

      //      return {id : id ,x1 : cx + threshold ,y1 : cy + threshold  ,x2 : x2,y2 : y2,type : type};

      case 1:
        {
          const newPoints = [];


          selectedElement.points.forEach((point) => {



            newPoints.push({
              x: point.x + ((-point.x + x2) / (x2 - x1)) * (cx - x1)

              , y: point.y + ((-point.y + y2) / (y2 - y1)) * (cy - y1)
            });
          });

          const tempNewArray = [...elements];

          tempNewArray[id] = {
            ...tempNewArray[id],
            points: newPoints, x1: cx - threshold,
            y1: cy - threshold,
            x2: x2,
            y2: y2,
          };

          store.dispatch(setElement([tempNewArray, true, key]));

          if (roomId != null) {

            GlobalProps.socket.emit("render-elements", { tempNewArray, roomId, key });
          }

        }

        break;

      case 2:

        {
          const newPoints = [];


          selectedElement.points.forEach((point) => {



            newPoints.push({
              x: point.x

              , y: point.y + ((y2 - point.y) / (y2 - y1)) * (cy - y1)
            });
          });

          const tempNewArray = [...elements];

          tempNewArray[id] = {
            ...tempNewArray[id],
            points: newPoints, x1: x1,
            y1: cy - threshold,
            x2: x2,
            y2: y2,
          };

          store.dispatch(setElement([tempNewArray, true, key]));

          if (roomId != null) {
            GlobalProps.socket.emit("render-elements", { tempNewArray, roomId, key });
          }

        }
        break;

      case 3:
        {
          const newPoints = [];


          selectedElement.points.forEach((point) => {



            newPoints.push({
              x: point.x + ((point.x - x1) / (x2 - x1)) * (cx - x2)

              , y: point.y + ((-point.y + y2) / (y2 - y1)) * (cy - y1)
            });
          });

          const tempNewArray = [...elements];

          tempNewArray[id] = {
            ...tempNewArray[id],
            points: newPoints, x1: x1,
            y1: cy - threshold,
            x2: cx - threshold,
            y2: y2,
          };

          store.dispatch(setElement([tempNewArray, true, key]));
          GlobalProps.socket.emit("render-elements", { tempNewArray, roomId, key });
        }

        break;

      case 4:
        {
          const newPoints = [];



          selectedElement.points.forEach((point) => {



            newPoints.push({
              x: x1 + ((point.x - x1) / (x2 - x1)) * (cx - x1)

              , y: point.y
            });
          });

          const tempNewArray = [...elements];

          tempNewArray[id] = {
            ...tempNewArray[id],
            points: newPoints, x1: x1,
            y1: y1,
            x2: cx - threshold,
            y2: y2,
          };

          store.dispatch(setElement([tempNewArray, true, key]));
          GlobalProps.socket.emit("render-elements", { tempNewArray, roomId, key });

        }
        break;

      case 5:
        {
          const newPoints = [];


          selectedElement.points.forEach((point) => {



            newPoints.push({
              x: point.x + ((point.x - x1) / (x2 - x1)) * (cx - x2)

              , y: point.y + ((point.y - y1) / (y2 - y1)) * (cy - y2)
            });
          });

          const tempNewArray = [...elements];

          tempNewArray[id] = {
            ...tempNewArray[id],
            points: newPoints, x1: x1,
            y1: y1,
            x2: cx - threshold,
            y2: cy - threshold,
          };

          store.dispatch(setElement([tempNewArray, true, key]));
          GlobalProps.socket.emit("render-elements", { tempNewArray, roomId, key });
        }

        break;


      case 6:
        {
          const newPoints = [];


          selectedElement.points.forEach((point) => {



            newPoints.push({
              x: point.x

              , y: point.y - ((y1 - point.y) / (y2 - y1)) * (cy - y2)
            });
          });

          const tempNewArray = [...elements];

          tempNewArray[id] = {
            ...tempNewArray[id],
            points: newPoints, x1: x1,
            y1: y1,
            x2: x2,
            y2: cy - threshold,
          };

          store.dispatch(setElement([tempNewArray, true, key]));
          GlobalProps.socket.emit("render-elements", { tempNewArray, roomId, key });
        }
        break;
      case 7:
        {
          const newPoints = [];


          selectedElement.points.forEach((point) => {



            newPoints.push({
              x: point.x + ((-point.x + x2) / (x2 - x1)) * (cx - x1)

              , y: point.y + ((point.y - y1) / (y2 - y1)) * (cy - y2)
            });
          });

          const tempNewArray = [...elements];

          tempNewArray[id] = {
            ...tempNewArray[id],
            points: newPoints, x1: cx - threshold,
            y1: y1,
            x2: x2,
            y2: cy - threshold,
          };

          store.dispatch(setElement([tempNewArray, true, key]));
          GlobalProps.socket.emit("render-elements", { tempNewArray, roomId, key });
        }

        break;


      case 8:
        {
          const newPoints = [];


          selectedElement.points.forEach((point) => {



            newPoints.push({
              x: point.x + ((x2 - point.x) / (x2 - x1)) * (cx - x1)

              , y: point.y
            });
          });

          const tempNewArray = [...elements];

          tempNewArray[id] = {
            ...tempNewArray[id],
            points: newPoints, x1: cx - threshold,
            y1: y1,
            x2: x2,
            y2: y2,
          };

          store.dispatch(setElement([tempNewArray, true, key]));
          GlobalProps.socket.emit("render-elements", { tempNewArray, roomId, key });
        }

        break;




      default:
        break;
    }


  }

}


// gives the current resizing node on which the mouse is lying
export const getCurrentResizingNode = (event, element, scale) => {
  const cx = event.clientX;
  const cy = event.clientY;



  if (element != null) {
    let { x1, x2, y1, y2, type } = element;

    // text has been removed for some issues
    if (type === 'rectangle' || type === 'ellipse' || type === 'diamond') {
      x1 -= threshold;
      y1 -= threshold;
      x2 += threshold;
      y2 += threshold;


      if (distance(x1, y1, cx, cy) < 12 / (scale / 2)) {
        // top left

        console.log("top left");
        return [1, "se-resize", 1];

      } else if (distance(x2, y1, cx, cy) < 12 / (scale / 2)) {
        // top right
        console.log("top right");
        return [1, "sw-resize", 3];

      } else if (distance(x1, y2, cx, cy) < 12 / scale) {
        // bottom left
        console.log("bottom left");
        return [1, "ne-resize", 7];

      } else if (distance(x2, y2, cx, cy) < 12 / scale) {
        // bottom right
        console.log("bottom right");
        return [1, "nw-resize", 5];

      } else if (distance(x1, y1 + (y2 - y1) / 2, cx, cy) < 12 / scale) {
        // left mid
        console.log("left mid");
        return [1, "ew-resize", 8];
      } else if (distance(x2, y1 + (y2 - y1) / 2, cx, cy) < 12 / scale) {
        // right mid
        console.log("right mid");
        return [1, "ew-resize", 4];
      } else if (distance(x1 + (x2 - x1) / 2, y1, cx, cy) < 12 / scale) {
        // top mid
        console.log("top mid");
        return [1, "n-resize", 2];
      } else if (distance(x1 + (x2 - x1) / 2, y2, cx, cy) < 12 / scale) {
        // bottom mid
        console.log("bottom mid");
        return [1, "s-resize", 6];
      }
    } else if (type === 'line') {

      if (distance(x1, y1, cx, cy) < 10 / scale) {
        console.log("upper point of line");
        return [1, 'se-resize', 1];
      } else if (distance(x2, y2, cx, cy) < 10 / scale) {
        console.log("lower point of the line");
        return [1, 'se-resize', 2];
      }
    } else if (type === 'pencil') {

      x1 -= threshold;
      y1 -= threshold;
      x2 += threshold;
      y2 += threshold;

      let minX = element.x1;
      let minY = element.y1;
      let maxX = element.x2;
      let maxY = element.y2;

      if (event.clientX > (minX - 15) && event.clientX < maxX + 15 && event.clientY > minY - 15 && event.clientY < maxY + 15) {
        if (distance(minX, minY, cx, cy) < 12 / scale) {
          // top left

          console.log("top left");
          return [1, "se-resize", 1];

        } else if (distance(maxX, minY, cx, cy) < 12 / scale) {
          // top right
          console.log("top right");
          return [1, "sw-resize", 3];

        } else if (distance(minX, maxY, cx, cy) < 12 / scale) {
          // bottom left
          console.log("bottom left");
          return [1, "ne-resize", 7];

        } else if (distance(maxX, maxY, cx, cy) < 12 / scale) {
          // bottom right
          console.log("bottom right");
          return [1, "nw-resize", 5];

        } else if (distance(minX, minY + (maxY - minY) / 2, cx, cy) < 12 / scale) {
          // left mid
          console.log("left mid");
          return [1, "ew-resize", 8];
        } else if (distance(maxX, minY + (maxY - minY) / 2, cx, cy) < 12 / scale) {
          // right mid
          console.log("right mid");
          return [1, "ew-resize", 4];
        } else if (distance(minX + (maxX - minX) / 2, minY, cx, cy) < 12 / scale) {
          // top mid
          console.log("top mid");
          return [1, "n-resize", 2];
        } else if (distance(minX + (maxX - minX) / 2, maxY, cx, cy) < 12 / scale) {
          // bottom mid
          console.log("bottom mid");
          return [1, "s-resize", 6];
        }
      }
    }

    return [0];
  }
}


