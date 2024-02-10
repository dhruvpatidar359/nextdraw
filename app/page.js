
'use client';

import App from '@/components/App';

import { Provider, useSelector } from 'react-redux';
import store from './store';



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



