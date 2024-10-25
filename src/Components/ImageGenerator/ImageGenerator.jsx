import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/coast-landscape-digital-art.jpg';

const ImageGenerator = () => {
    const [image_url, setImageUrl] = useState(default_image); // Initialize with the default image
    const inputRef = useRef(null);

    const imageGenerator = async () => {
        // Check for empty input
        if (inputRef.current.value === '') {
            return; // Exit if no input
        }

        const apiKey = process.env.REACT_APP_API_KEY;

        try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`, // Use template literals for concatenation
                    "User-Agent": "OpenAI-GPT-3",
                },
                body: JSON.stringify({
                    prompt: inputRef.current.value, // Correctly interpolate the value
                    n: 1,
                    size: "512x512",
                }),
            });

            // Check if the response is OK
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const data_array = data.data;

            // Check if data_array is not undefined and has at least one item
            if (data_array && data_array.length > 0) {
                setImageUrl(data_array[0].url); // Update image URL
            } else {
                console.error("No images found in response");
                setImageUrl(default_image); // Fallback to default image
            }
        } catch (error) {
            console.error("Error fetching image:", error);
            setImageUrl(default_image); // Fallback to default image on error
        }
    };

    return (
        <div className='ai-image-generator'>
            <div className="header">AI Image <span>Generator</span></div>
            <div className="img-loading">
                <div className="image">
                    <img src={image_url} alt="Generated" />
                </div>
            </div>
            <div className="search-box">
                <input 
                    type="text" 
                    ref={inputRef} 
                    className='search-input' 
                    placeholder='Describe what you want to see' 
                />
                <div className='generate-btn' onClick={imageGenerator}>
                    Generate
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
