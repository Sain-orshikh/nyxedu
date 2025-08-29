'use client';

import React from 'react';
import Hero from '@/components/home/Hero';
import SubjectsSection from '@/components/home/SubjectsSection';
import RecentlyAddedNotes from '@/components/home/RecentlyAddedNotes';
import AboutUs from '@/components/home/AboutUs';
import FAQ from '@/components/home/FAQ';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gray-50">
      <main className="container mx-auto flex-grow px-6 py-6 sm:py-12">
        <Hero />
        <SubjectsSection />
        <RecentlyAddedNotes />
        <AboutUs />
        <FAQ />
      </main>
    </div>
  );
}
