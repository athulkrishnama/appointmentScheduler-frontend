import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import { motion } from 'framer-motion';
import { FaCog, FaHammer, FaLightbulb, FaRocket, FaShieldAlt, FaTools } from 'react-icons/fa';
import service1 from '../../assets/service1.jpg';
import service2 from '../../assets/service2.jpg';
import service3 from '../../assets/service3.jpg';
import defaultLogo from '../../assets/defaultLogo.png'
const bannerImages = [service1, service2, service3];

const HomePage = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/client/getTopServices');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  return (
    <main className="max-w-screen-xl mx-auto mt-8 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
      <div className="relative h-96 overflow-hidden">
        {bannerImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Banner ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          />
        ))}
      </div>

      <section className="py-8">
        <h2 className="text-4xl font-bold text-center mb-8 font-sans">Our Service Providers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              className="border border-gray-300 rounded-lg p-4 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={service.serviceDetails.logo || defaultLogo}
                alt={service.fullname}
                className="w-full  object-cover mb-4"
              />
              <h3 className="mb-2">{service.fullname}</h3>
              <p>{service.serviceDetails.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
