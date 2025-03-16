import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="max-w-4xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">About Us</h1>
        <p className="text-gray-600 text-lg text-center mb-4">
          Welcome to <span className="font-semibold">FreelanceHub</span>, your go-to platform for connecting top-tier freelancers with clients worldwide.
        </p>
        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Our Mission</h2>
        <p className="text-gray-600 mt-2">
          We aim to empower freelancers by providing a seamless, user-friendly platform to showcase their skills and connect with potential clients.
          Our goal is to bridge the gap between businesses and talented individuals, ensuring quality work and successful collaborations.
        </p>
        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Why Choose Us?</h2>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Access to a global network of skilled professionals.</li>
          <li>Secure payment system ensuring hassle-free transactions.</li>
          <li>Transparent and fair platform with no hidden fees.</li>
          <li>Easy-to-use interface for both freelancers and clients.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Join Us Today!</h2>
        <p className="text-gray-600 mt-2">
          Whether you're a freelancer looking for opportunities or a business searching for the right talent, <span className="font-semibold">FreelanceHub</span> is the perfect place to start.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;