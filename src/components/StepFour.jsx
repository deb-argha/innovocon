import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { FaPhone, FaCamera, FaVideo, FaSignature } from "react-icons/fa";

const StepFour = ({ onBack, onSubmit, loading, data, onChange }) => {
  const [sosLoading, setSosLoading] = useState(false);
  const [sosError, setSosError] = useState(null);

  const handleSOS = async () => {
    try {
      setSosLoading(true);
      setSosError(null);
      
      // Make SOS API call
      const response = await axios.post('http://localhost:5000/api/emergency/sos', {
        userId: data.aadhaar, // Use Aadhaar as identifier
        name: data.name,
        mobile: data.mobile,
        location: data.manualLocation || data.fetchedLocation,
        timestamp: new Date().toISOString()
      });
      
      console.log("SOS sent:", response.data);
      alert("Emergency services have been notified and are on their way!");
    } catch (err) {
      console.error("SOS error:", err);
      setSosError("Failed to send SOS. Please try calling emergency services directly.");
    } finally {
      setSosLoading(false);
    }
  };

  return (
    <CardContent className="bg-gradient-to-b from-purple-50 to-purple-100 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-900 animate-fadeIn">SOS & Report Issue</h2>
      
      {/* Display SOS-specific errors */}
      {sosError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {sosError}
        </div>
      )}
      
      <Button 
        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg text-lg flex items-center justify-center gap-3 transition-all hover:shadow-lg mb-4"
        onClick={handleSOS}
        disabled={sosLoading}
      >
        <FaPhone className="animate-pulse" /> 
        {sosLoading ? "Contacting Emergency Services..." : "SOS (Call Police)"}
      </Button>
      
      <textarea
        name="issue"
        placeholder="Describe your issue in detail"
        className="w-full p-4 mt-2 border border-purple-300 focus:border-purple-500 rounded-lg min-h-32"
        onChange={onChange}
        value={data.issue || ""}
      ></textarea>
      
      <div className="flex gap-4 mt-4">
        <Button 
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
          onClick={() => document.getElementById('imageUpload').click()}
        >
          <FaCamera /> Upload Image
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            name="imageEvidence"
            onChange={onChange}
          />
        </Button>
        <Button 
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
          onClick={() => document.getElementById('videoUpload').click()}
        >
          <FaVideo /> Upload Video
          <input
            id="videoUpload"
            type="file"
            accept="video/*"
            className="hidden"
            name="videoEvidence"
            onChange={onChange}
          />
        </Button>
      </div>
      
      {/* File upload status indicators */}
      <div className="mt-2 space-y-2">
        {data.imageEvidence && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
            Image uploaded: {data.imageEvidence.name}
          </div>
        )}
        {data.videoEvidence && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
            Video uploaded: {data.videoEvidence.name}
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-black bg-opacity-10 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-purple-800 animate-pulse">Support Slum People</h3>
        <Button 
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg"
          onClick={() => window.open('https://your-petition-link.com', '_blank')}
        >
          <FaSignature /> Sign Petition
        </Button>
      </div>
      
      <div className="flex gap-4 mt-6">
        <Button 
          onClick={onBack} 
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg text-lg transition-transform hover:scale-105"
          disabled={loading}
        >
          Back
        </Button>
        <Button 
          onClick={onSubmit}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg transition-transform hover:scale-105"
          disabled={loading || !data.issue}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </CardContent>
  );
};

export default StepFour;