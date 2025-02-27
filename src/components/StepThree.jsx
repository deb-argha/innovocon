import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { FaMapMarkerAlt } from "react-icons/fa";

const StepThree = ({ onNext, onBack, onChange, loading, data }) => {
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const handleFetchLocation = () => {
    setFetchingLocation(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setFetchingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update form data with coordinates
        const locationEvent = {
          target: {
            name: 'fetchedLocation',
            value: `${latitude},${longitude}`
          }
        };
        onChange(locationEvent);
        
        // Also update a display field for user feedback
        const locationDisplayEvent = {
          target: {
            name: 'locationDisplay',
            value: `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`
          }
        };
        onChange(locationDisplayEvent);
        
        setFetchingLocation(false);
      },
      (error) => {
        setLocationError(`Failed to get location: ${error.message}`);
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <CardContent className="bg-gradient-to-b from-purple-50 to-purple-100 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-900 animate-fadeIn">Location</h2>
      
      {locationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {locationError}
        </div>
      )}
      
      <div className="space-y-4">
        <Button 
          onClick={handleFetchLocation} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg"
          disabled={fetchingLocation}
        >
          <FaMapMarkerAlt className={fetchingLocation ? "" : "animate-bounce"} /> 
          {fetchingLocation ? "Fetching Location..." : "Fetch My Location"}
        </Button>
        
        {data.locationDisplay && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="font-medium">Location fetched successfully!</p>
            <p className="text-sm">{data.locationDisplay}</p>
          </div>
        )}
        
        <Input 
          name="manualLocation" 
          placeholder="Enter Location Manually" 
          onChange={onChange} 
          value={data.manualLocation || ""}
          className="border-purple-300 focus:border-purple-500 rounded-lg p-3 mt-4"
        />
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
          onClick={onNext} 
          className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg text-lg transition-transform hover:scale-105"
          disabled={loading || (!data.fetchedLocation && !data.manualLocation)}
        >
          {loading ? "Processing..." : "Next"}
        </Button>
      </div>
    </CardContent>
  );
};

export default StepThree;