"use client";

import { Provider } from "react-redux";
import store from "./store";
import App from "@/components/app";
import React from "react";

export default function Home() {
  return (
    <main>
      <Provider store={store}>
        <App></App>
      </Provider>
    </main>
  );
}
