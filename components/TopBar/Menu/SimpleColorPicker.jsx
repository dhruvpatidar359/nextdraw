"use client";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Paintbrush } from "lucide-react";

import { useMemo, useState } from "react";

const SimpleColorPicker = ({
  stroke,
  setStroke,
  setChangedByUser,
  className,
}) => {
  const solids = [
    "#E2E2E2",
    "#ff75c3",
    "#ffa647",
    "#ffe83f",
    "#9fff5b",
    "#70e2ff",
    "#cd93ff",
    "#09203f",
  ];

  const defaultTab = useMemo(() => {
    return "solid";
  }, [stroke]);

  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onMouseMove={(e) => {
        e.preventDefault();
      }}
    >
      <PopoverTrigger>
        <div
          className="w-full flex items-center gap-2"
          onClick={() => {
            if (open === false) {
              setOpen(true);
            } else {
              setOpen(false);
            }
          }}
        >
          {stroke ? (
            <div
              className="h-7 w-7 rounded  !bg-center !bg-cover transition-all"
              style={{ background: stroke }}
            ></div>
          ) : (
            <Paintbrush className="h-4 w-4" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-64"
        onClick={(e) => {
          e.preventDefault();
        }}
        onMouseMove={(e) => {
          e.preventDefault();
        }}
      >
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger className="flex-1" value="solid">
              Solid
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="flex flex-wrap gap-1 mt-0">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                onClick={() => {
                  setChangedByUser(true);
                  setStroke(s);
                }}
              />
            ))}
          </TabsContent>
        </Tabs>

        <Input
          id="custom"
          value={stroke}
          className="col-span-2 h-8 mt-4"
          onChange={(e) => {
            setChangedByUser(true);
            setStroke(e.currentTarget.value);
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default SimpleColorPicker;
