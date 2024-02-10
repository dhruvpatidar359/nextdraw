
'use client';



import { Provider, useSelector } from 'react-redux';
import store from './store';
import App from '@/components/app';



export default function Home() {

  


  return (
    <main>
      <Provider store = {store}>


      <App>



      </App>
     
      </Provider>
    
    </main>
  )
}



