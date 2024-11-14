import React, { useState, useRef } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/ai.webp';

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState("/");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const imageGenerator = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt === "") {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_API_KEY_HERE`,  // Replace YOUR_API_KEY_HERE with your actual API key
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: '512x512',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Data:", errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'No message provided'}`);
      }

      const data = await response.json();
      const data_array = data.data;

      if (data_array && data_array.length > 0) {
        setImage_url(data_array[0].url);
      } else {
        console.error("No images generated:", data);
        setImage_url(default_image);
      }

    } catch (error) {
      console.error("Error fetching image:", error);
      setImage_url(default_image);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='ai-image-generator'>
      <div className='header'>
        AI image 
        <span>
          Generator
        </span>
      </div>
      <div className='img-loading'>
        <div className="image"><img src={image_url === "/" ? default_image : image_url} alt="Generated" /></div>
        <div className='loading'>
          <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
          <div className={loading ? "loading-text" : "display-none"}>loading...</div>
        </div>
      </div>
      <div className="searchbox">
        <input type="text" ref={inputRef} className='search-input' placeholder='Describe what you want to see' />
        <div className="generate-btn" onClick={imageGenerator}>Generate</div>
      </div>
    </div>
  );
};

export default ImageGenerator;
