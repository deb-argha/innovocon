import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";

const StepOne = ({ onNext, onChange }) => {
  return (
    <CardContent className="bg-gradient-to-b from-purple-50 to-purple-100 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-900 animate-fadeIn">Sign Up</h2>
      <div className="space-y-4">
        <Input 
          name="name" 
          placeholder="Full Name" 
          onChange={onChange} 
          className="border-purple-300 focus:border-purple-500 rounded-lg p-3"
        />
        <Input 
          name="age" 
          type="number" 
          placeholder="Age" 
          onChange={onChange} 
          className="border-purple-300 focus:border-purple-500 rounded-lg p-3"
        />
        <Input 
          name="location" 
          placeholder="Location" 
          onChange={onChange} 
          className="border-purple-300 focus:border-purple-500 rounded-lg p-3"
        />
        <Input 
          name="dob" 
          type="date" 
          onChange={onChange} 
          className="border-purple-300 focus:border-purple-500 rounded-lg p-3"
        />
      </div>
      <Button 
        onClick={onNext} 
        className="w-full mt-6 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg text-lg transition-transform hover:scale-105"
      >
        Next
      </Button>
    </CardContent>
  );
};

export default StepOne;