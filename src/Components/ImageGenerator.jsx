import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../Components/Header";

const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  const query = async (data) => {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate image.");
      }

      const result = await response.blob();
      return URL.createObjectURL(result);
    } catch (error) {
      console.error("Error during API call:", error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a valid prompt!");
      return;
    }
    setIsLoading(true);
    setImageUrl(null);

    try {
      const imageBlob = await query({ inputs: prompt });
      setImageUrl(imageBlob);
      setShowModal(true);
    } catch (error) {
      alert(`Error: ${error.message || "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "generated_image.png";
      link.click();
    }
  };

  return (
    <>
    <Header />
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
          AI Image Generator
        </h1>
        <p className="text-gray-300 mb-4">Generate stunning images using AI</p>
        <input
          type="text"
          value={prompt}
          onChange={handleChange}
          placeholder="Enter your image prompt"
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <motion.button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition text-white font-semibold"
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          {isLoading ? "Generating..." : "Generate Image"}
        </motion.button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-400 text-2xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">Generated Image</h2>
              <img src={imageUrl} alt="Generated" className="w-full rounded-lg shadow-lg mb-4" />
              <button
                onClick={handleDownload}
                className="w-full p-3 rounded-lg bg-green-600 hover:bg-green-700 transition text-white font-semibold"
              >
                Download Image
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default ImageGenerator;
