import React from 'react';
import { TextEffect } from '@/components/animation/texteffect';
import AuthDialog from '@/components/auth/AuthDialog';
import { useAuth } from '@/context/AuthContext';

const Hero = () => {
  const { openDialog } = useAuth();

  return (
    <section className="text-center pt-20">
      <h1 className="text-5xl md:text-6xl font-bold text-deepblue mb-4 leading-tight">
        <TextEffect per="word" preset="fade-in-blur">By Students, For Students</TextEffect>
      </h1>
      <p className="text-xl mb-10 max-w-3xl mx-auto">
        <TextEffect as="span" per="word" preset="fade">
          {`All our study materials are created and shared by your fellow MAIS students. Learn from those who have walked the path before you.`}
        </TextEffect>
      </p>
      <button
        className="bg-deepblue text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:opacity-80 cursor-pointer"
        onClick={() => openDialog('signup')}
        type="button"
      >
        <TextEffect per="word" preset="fade">Get Started</TextEffect>
      </button>
      <AuthDialog />
    </section>
  );
};

export default Hero;
