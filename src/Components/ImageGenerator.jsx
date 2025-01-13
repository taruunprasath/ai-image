import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import video from "../assets/background.gif";

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
      console.log("Prompt being sent:", prompt);

      const imageBlob = await query({ inputs: prompt });
      setImageUrl(imageBlob);
      setShowModal(true);
    } catch (error) {
      const errorMessage = error.message || "An unknown error occurred.";
      alert(`Error: ${errorMessage}`);
      console.error("Error generating image:", errorMessage);
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img
          className="w-full h-full object-cover"
          src={video}
          alt="Background"
        />
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6 py-12 sm:px-4 sm:py-8">
        <motion.div
          className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl max-w-lg w-full"
          {...fadeInUp}
        >
          <motion.h1
            className="text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 sm:text-3xl"
            initial={{ opacity: 1, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              color: ["#ff6347", "#32cd32", "#1e90ff", "#ff4500"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            AI Image Generator
          </motion.h1>

          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-lg text-gray-800 font-semibold mb-6 sm:text-base">
              Create stunning images using AI!
            </p>

            <motion.input
              type="text"
              value={prompt}
              onChange={handleChange}
              placeholder="Enter your image prompt"
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-lg sm:text-base"
              aria-label="Image prompt input"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            />

            <motion.button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`${
                isLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              } text-white py-3 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xl w-full sm:w-auto`}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                "Start Generating"
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-3xl font-bold text-gray-700"
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold text-center mb-4 text-indigo-600 sm:text-xl">
                Generated Image
              </h2>
              <img
                src={imageUrl}
                alt="Generated from AI prompt"
                className="w-full rounded-2xl shadow-lg mb-6"
              />
              <div className="text-center">
                <button
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg sm:px-6"
                >
                  Download Image
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGenerator;
