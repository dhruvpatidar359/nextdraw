import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  setCopyElement,
  setSelectedElement,
} from "../Redux/features/selectedElementSlice";
import { setAction } from "../Redux/features/actionSlice";
import {
  addElementToInventory,
  updateElement,
} from "../ElementManipulation/Element";
import store from "@/app/store";
import { changeTool } from "../Redux/features/toolSlice";
import { GlobalProps } from "../Redux/GlobalProps";
import {
  redo,
  setChanged,
  setElement,
  undo,
} from "../Redux/features/elementSlice";
import { ShapeCache } from "../Redux/ShapeCache";
import { setHover } from "../Redux/features/hoverSlice";

const Shortcuts = ({ mouseEvent }) => {
  const dispatch = useDispatch();

  const action = useSelector((state) => state.action.value);
  const index = useSelector((state) => state.elements.index);
  const elements = useSelector(
    (state) => state.elements.value[index][0],
    shallowEqual
  );
  const selectedElement = useSelector((state) => state.selectedElement.value);
  const changed = useSelector((state) => state.elements.changed);

  const updateText = () => {
    if (store.getState().action.value === "writing") {
      const textArea = document.getElementById("textarea").value;

      const { id, x1, y1, type, x2, y2 } =
        store.getState().selectedElement.value;
      // console.log(textArea);
      updateElement(id, x1, y1, x2, y2, type, { text: textArea });
      dispatch(setAction("none"));
      dispatch(setSelectedElement(null));
    }
  };

  useEffect(() => {
    const handler = (event) => {
      // when we are writing we should not listen to any changeTool
      if (action === "writing") {
        return;
      }

      if (event.key === "1") {
        dispatch(changeTool("rectangle"));
        updateText();
      } else if (event.key === "2") {
        dispatch(changeTool("line"));
        updateText();
      } else if (event.key === "3") {
        dispatch(changeTool("selection"));
        updateText();
      } else if (event.key === "4") {
        dispatch(changeTool("pencil"));
        updateText();
      } else if (event.key === "5") {
        dispatch(changeTool("ellipse"));
        updateText();
      } else if (event.key === "6") {
        dispatch(changeTool("diamond"));
        updateText();
      } else if (event.key === "7") {
        dispatch(changeTool("text"));
        updateText();
      } else if (event.key === "8") {
        dispatch(changeTool("eraser"));
        updateText();
      } else if (
        (event.key === "z" || event.key === "Z") &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        if (GlobalProps.room != null) return;

        if (store.getState().action.value === "writing") {
          return;
        }
        dispatch(setSelectedElement(null));
        dispatch(redo());
      } else if (event.ctrlKey && (event.key === "z" || event.key === "Z")) {
        if (GlobalProps.room != null) return;
        if (store.getState().action.value === "writing") {
          return;
        }
        dispatch(setSelectedElement(null));
        dispatch(undo());
      } else if (event.key === "Delete") {
        if (selectedElement != null) {
          let elementsCopy = [...elements];
          const key = selectedElement.id.split("#")[0];
          const id = parseInt(selectedElement.id.split("#")[1]);

          if (ShapeCache.cache.has(elements[id])) {
            ShapeCache.cache.delete(elements[id]);
          }

          elementsCopy[id] = null;

          if (!changed) {
            dispatch(setElement([elementsCopy, true, key]));
            dispatch(setChanged(true));
          } else {
            dispatch(setElement([elementsCopy, false, key]));
          }
          const roomId = GlobalProps.room;
          if (roomId != null) {
            GlobalProps.socket.emit("delete-element", { roomId, key });
          }

          dispatch(setSelectedElement(null));
          dispatch(setHover("none"));
          document.body.style.cursor = `url('defaultCursor.svg'), auto`;
        }
      } else if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "c" || event.key === "C")
      ) {
        dispatch(setCopyElement(selectedElement));
      } else if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "v" || event.key === "V")
      ) {
        const copyElement = store.getState().selectedElement.copyElement;
        if (copyElement != null) {
          addElementToInventory(
            elements,
            null,
            null,
            null,
            null,
            copyElement,
            mouseEvent
          );
          store.dispatch(changeTool("selection"));
        }
      } else if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "d" || event.key === "D")
      ) {
        event.preventDefault();
        const selectedElement = store.getState().selectedElement.value;

        if (selectedElement != null) {
          const getElementFromInventory =
            elements[parseInt(selectedElement.id.split("#")[1])];
          addElementToInventory(
            elements,
            null,
            null,
            null,
            null,
            getElementFromInventory
          );
          store.dispatch(changeTool("selection"));
        }
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handler);
    }

    return () => window.removeEventListener("keydown", handler);
  });

  return;
};

export default Shortcuts;
