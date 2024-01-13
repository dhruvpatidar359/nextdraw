import actionSlice from '@/components/Redux/features/actionSlice';
import canvasSlice from '@/components/Redux/features/canvasSlice';
import elementSlice from '@/components/Redux/features/elementSlice'
import hoverSlice from '@/components/Redux/features/hoverSlice';
import resizeSlice from '@/components/Redux/features/resizeSlice';
import selectedElementSlice from '@/components/Redux/features/selectedElementSlice';
import toolSlice from '@/components/Redux/features/toolSlice'
import { configureStore } from '@reduxjs/toolkit'

const store =  configureStore({

  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    
    serializableCheck: {
      // Ignore these action types
      ignoredActions: ['canvas/setCanvas'],
      ignoredPaths: ['canvas.value'],
     
    },
  }),


  reducer: {
    tool:toolSlice,
    elements:elementSlice, 
    canvas:canvasSlice,
    action:actionSlice,
    hover:hoverSlice,
    selectedElement: selectedElementSlice,
    resizeDirection: resizeSlice

  }
})

export default store;