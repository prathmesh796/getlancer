"use client";

import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} className="w-full p-2 border rounded mt-1" rows="4" required></textarea>
          </div>
          <button 
  type="submit" 
  className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400 transition-all">
  Send Message
</button>

        </form>
      </div>
    </div>
  );
};

export default ContactPage;