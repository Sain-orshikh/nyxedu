import React from 'react';

const Hero = () => (
  <section className="text-center py-20">
    <h1 className="text-5xl md:text-6xl font-bold text-deepblue mb-4 leading-tight">Unlock Your Potential</h1>
    <p className="text-xl text-gold mb-6 max-w-3xl mx-auto">Access high-quality, peer-reviewed study notes for your Cambridge examinations.</p>
    <div className="bg-yellow-50 border-l-4 border-gold text-deepblue p-4 rounded-r-lg max-w-2xl mx-auto text-left mb-10">
      <p className="font-semibold">By Students, For Students</p>
      <p className="text-sm text-gold">All our study materials are created and shared by your fellow MAIS students. Learn from those who have walked the path before you and join a community of collaborative learners.</p>
    </div>
    <a className="button_secondary" href="#levels">Get Started</a>
  </section>
);

export default Hero;
