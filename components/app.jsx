"use client";
import ExportDialog from "@/export/ExportDialog";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Canvas from "./Canvas";
import PropertiesBar from "./PropertiesBar/PropertiesBar";
import { GlobalProps } from "./Redux/GlobalProps";
import CircularToolBar from "./TopBar/CircularToolBar/CircularToolBar";
import Topbar from "./TopBar/Topbar";
import UniqueUsernameFetcher from "./username/UniqueUsernameFetcher";

const App = () => {
  const toolWheel = useSelector((state) => state.tool.toolWheel);
  const selectedElemenet = useSelector((state) => state.selectedElement.value);
  const index = useSelector((state) => state.elements.index);
  const elements = useSelector(
    (state) => state.elements.value[index][0],
    shallowEqual
  );
  const tool = useSelector((state) => state.tool.value);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const syncInterval = setInterval(() => {
      localStorage.setItem("elements", JSON.stringify(elements));
    }, 2000);

    return () => clearInterval(syncInterval);
  }, [elements]);

  const [username, setUsername] = useState(null);

  const handleUsernameFetched = (fetchedUsername) => {
    setUsername(fetchedUsername);
    GlobalProps.username = fetchedUsername;
  };

  return (
    <div>
      <Topbar></Topbar>
      {selectedElemenet != null ||
      (tool !== "selection" && tool !== "eraser") ? (
        <PropertiesBar></PropertiesBar>
      ) : null}
      <Canvas></Canvas>

      {open ? <ExportDialog open={open} changeOpen={setOpen} /> : null}
      {toolWheel ? <CircularToolBar changeOpen={setOpen} /> : null}
      {!username && (
        <div className="loadingBackdrop">
          <div className="flex flex-col align-bottom">
            <svg className="spinner" viewBox="0 0 50 50">
              <circle
                className="path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="5"
              ></circle>
            </svg>
          </div>
        </div>
      )}

      <UniqueUsernameFetcher onUsernameFetched={handleUsernameFetched} />
    </div>
  );
};

export default App;
