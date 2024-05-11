import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: true,
};

export const closeSlice = createSlice({
    name: 'close',
    initialState,
    reducers: {
        setOpen: (state) => {
            state.isOpen = true;
        },
        setClose: (state) => {
            state.isOpen = false;
        },
        toggleClose: (state) => {
            state.isOpen = !state.isOpen;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setOpen, setClose, toggleClose } = closeSlice.actions;

export default closeSlice.reducer;
