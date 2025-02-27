import React, { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import StepFour from "./components/StepFour";
import Navbar from "./components/navBar1";
import WelcomeMessage from "./components/WelcomeMessege1";

// Create axios instance for API calls
const api = axios.create({
  baseURL: 'http://localhost:5000', // Change this to your backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNext = async () => {
    // Validate form data before proceeding
    if (currentStep === 1) {
      if (!formData.name || !formData.age || !formData.location) {
        setError("Please fill in all required fields");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.aadhaar || !formData.mobile) {
        setError("Please fill in all required fields");
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Submit data to backend based on current step
      if (currentStep === 1) {
        // Register user with basic info
        const response = await api.post('/api/users/register', {
          name: formData.name,
          age: formData.age,
          location: formData.location,
          dob: formData.dob
        });
        console.log("Step 1 data submitted:", response.data);
      } else if (currentStep === 2) {
        // Submit verification information
        const response = await api.post('/api/users/verify', {
          aadhaar: formData.aadhaar,
          mobile: formData.mobile,
          email: formData.email,
          policeStation: formData.policeStation
        });
        console.log("Step 2 data submitted:", response.data);
      } else if (currentStep === 3) {
        // Submit location data
        const response = await api.post('/api/users/location', {
          userId: formData.aadhaar, // Use Aadhaar as user identifier
          location: formData.manualLocation || formData.fetchedLocation
        });
        console.log("Step 3 data submitted:", response.data);
      }

      // Move to next step if API call was successful
      setCurrentStep(currentStep + 1);
    } catch (err) {
      console.error("API error:", err);
      setError(err.response?.data?.message || "An error occurred connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setError(null); // Clear any errors when navigating back
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // Handle file inputs
    if (type === "file" && files) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      // Handle other input types
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields to FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'imageEvidence' && key !== 'videoEvidence') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add files if they exist
      if (formData.imageEvidence) {
        formDataToSend.append('imageEvidence', formData.imageEvidence);
      }
      if (formData.videoEvidence) {
        formDataToSend.append('videoEvidence', formData.videoEvidence);
      }
      
      // Use a different instance for multipart/form-data
      const response = await axios.post('http://localhost:5000/api/reports/submit', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Report submitted successfully:", response.data);
      alert("Your report has been submitted successfully!");
      
      // Reset form after successful submission
      setFormData({});
      setCurrentStep(1);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="container mx-auto max-w-2xl mt-8">
        <WelcomeMessage />
        
        {/* Error message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <Card className="app-card">
          <div className="bg-purple-800 p-4 text-white text-center">
            <h1 className="text-2xl font-bold">Slum Connect</h1>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 transition-all
                    ${step === currentStep ? 'bg-white text-purple-900 scale-110' : 'bg-purple-600 text-white'}`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
          
          {currentStep === 1 && (
            <StepOne 
              onNext={handleNext} 
              onChange={handleChange}
              loading={loading}
              data={formData}
            />
          )}
          {currentStep === 2 && (
            <StepTwo 
              onNext={handleNext} 
              onBack={handleBack} 
              onChange={handleChange}
              loading={loading}
              data={formData}
            />
          )}
          {currentStep === 3 && (
            <StepThree 
              onNext={handleNext} 
              onBack={handleBack} 
              onChange={handleChange}
              loading={loading}
              data={formData}
            />
          )}
          {currentStep === 4 && (
            <StepFour 
              onBack={handleBack}
              onSubmit={handleSubmit}
              loading={loading}
              data={formData}
              onChange={handleChange}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;