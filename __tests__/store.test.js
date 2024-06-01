// store.test.js
import store from "../app/store";

describe("Redux store configuration", () => {
  it("should create a store with the correct reducers", () => {
    const state = store.getState();

    expect(state.tool).toBeDefined();
    expect(state.elements).toBeDefined();
    expect(state.canvas).toBeDefined();
    expect(state.action).toBeDefined();
    expect(state.hover).toBeDefined();
    expect(state.selectedElement).toBeDefined();
    expect(state.resizeDirection).toBeDefined();
    expect(state.oldElement).toBeDefined();
  });

  it("should apply middleware configuration correctly", () => {
    const actions = store.dispatch({ type: "canvas/setCanvas", payload: {} });

    expect(actions.type).toBe("canvas/setCanvas");
  });
});
