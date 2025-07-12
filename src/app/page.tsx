'use client';

import React, { useState } from 'react';
import Hero from '@/components/Hero';
import SubjectsSection from '@/components/SubjectsSection';
import RecentlyAddedNotes from '@/components/RecentlyAddedNotes';
import AboutUs from '@/components/AboutUs';
import FAQ from '@/components/FAQ';
import { subjects as subjectList } from '../data/subjects';

const levels = [
  { key: 'igcse', label: 'IGCSE' },
  { key: 'as', label: 'AS Level' },
  { key: 'alevel', label: 'A Level' },
];

const subjects = {
  igcse: [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language',
    'History', 'Geography', 'Computer Science', 'Business Studies', 'Economics',
  ],
  as: [
    'Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Psychology', 'Sociology', 'Law', 'Economics', 'Business',
  ],
  alevel: [
    'Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Computer Science', 'History', 'English Literature', 'Economics', 'Business',
  ],
};

const recentNotes = [
  {
    tag: 'Physics (IGCSE)',
    title: 'Kinematics Revision',
    desc: 'A comprehensive guide to the equations of motion, displacement-time graphs, and velocity-time graphs. Includes worked examples and common pitfalls...',
    href: '#',
  },
  {
    tag: 'Chemistry (A Level)',
    title: 'Organic Synthesis Pathways',
    desc: 'Detailed mind maps and reaction schemes for synthesizing various organic compounds from alkanes, alkenes, and alcohols. Essential for A2 Chemistry...',
    href: '#',
  },
  {
    tag: 'Business Studies (AS)',
    title: 'Marketing Mix (4Ps)',
    desc: 'An in-depth analysis of Product, Price, Place, and Promotion with real-world case studies from successful international businesses. Perfect for case study prep...',
    href: '#',
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gray-50">
      {/* Main */}
      <main className="container mx-auto flex-grow px-6 py-12">
        <Hero />
        {/* Subjects Section */}
        <SubjectsSection />
        <RecentlyAddedNotes />
        <AboutUs />
        <FAQ />
      </main>
      {/* Footer */}
    </div>
  );
}
