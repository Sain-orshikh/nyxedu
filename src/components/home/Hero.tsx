import React from 'react';
import AuthDialog from '@/components/auth/AuthDialog';
import { useAuth } from '@/context/AuthContext';

const Hero = () => {
  const { openDialog } = useAuth();

  return (
    <section className="text-center pt-20">
      <h1 className="text-5xl md:text-6xl font-bold text-deepblue mb-4 leading-tight">
        By Students, For Students
      </h1>
      <p className="text-xl mb-10 max-w-3xl mx-auto">
        All our study materials are created and shared by your fellow MAIS students. Learn from those who have walked the path before you.
      </p>
      <button
        className="bg-deepblue text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:opacity-80 cursor-pointer"
        onClick={() => openDialog('signup')}
        type="button"
      >
        Get Started
      </button>
      <AuthDialog />
    </section>
  );
};

export default Hero;
