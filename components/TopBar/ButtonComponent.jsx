import React from 'react'


const ButtonComponent = ({ button }) => {
    return (
       

      
      <button  className=" rounded-md p-4 m-2 bg-purple-200 text-black relative " >
        <span className=""><button.icon/></span>
        <span className="absolute bottom-0 right-0 text-white p-1 rounded">
          {button.shortcut}
        </span>
      </button>
     
    );
  };
  
  export default ButtonComponent;