import React, { useState, useEffect } from 'react';

const FontSelector = () => {
  const [fonts, setFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState('');

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await fetch(
          'https://www.googleapis.com/webfonts/v1/webfonts?key=API key'
        );
        const data = await response.json();
        setFonts(data.items.map((item) => item.family));
      } catch (error) {
        console.error('Error fetching fonts:', error);
      }
    };

    fetchFonts();
  }, []);

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  return (
    <div>
        <span className='text-xs'>Font-Style</span>
        <div>
      <select value={selectedFont} onChange={handleFontChange}
       
       className="p-1.5 text-center text-sm  rounded-md mt-2 bg-[#ffffff] border-[1.5px] border-black"
      >
        {fonts.map((font) => (
          <option key={font} value={font} 
          >
        {font}
          </option>
        ))}
        
      </select>
      </div>
    </div>
  );
};

export default FontSelector;
