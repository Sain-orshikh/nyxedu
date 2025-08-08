import React from 'react';
import { TextEffect } from '@/components/animation/texteffect';
import AuthDialog from '@/components/auth/AuthDialog';
import { useAuth } from '@/context/AuthContext';



const Hero = () => {
  const { openDialog } = useAuth(); 

  const handleGetStarted = () => {
      openDialog('signup');
  };

  return (
    <section className="text-center pt-20">
      <h1 className="text-5xl md:text-6xl font-bold text-green-900 mb-4 leading-tight">
        <TextEffect per="word" preset="fade-in-blur">By Students, For Students</TextEffect>
      </h1>
      <p className="text-xl mb-10 max-w-3xl mx-auto">
        <TextEffect as="span" per="word" preset="fade">
          {`All our study materials are created and shared by your fellow MAIS students. Learn from those who have walked the path before you.`}
        </TextEffect>
      </p>
      <button
        className="group relative px-8 cursor-pointer py-4 rounded-full bg-gradient-to-r from-green-400 to-green-900 text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        onClick={handleGetStarted}
        type="button"
      >
        <TextEffect per="word" preset="fade">Get Started</TextEffect>
      </button>
      <AuthDialog />
    </section>
  );
};

export default Hero;