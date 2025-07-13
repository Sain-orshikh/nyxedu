import React, { useState } from 'react';
import { TextEffect } from '@/components/animation/texteffect';
import { subjects as subjectList } from '../../data/subjects';

const levels = [
  { key: 'igcse', label: 'IGCSE' },
  { key: 'as', label: 'AS Level' },
  { key: 'alevel', label: 'A Level' },
];

export default function SubjectsSection() {
  const [selectedLevel, setSelectedLevel] = useState('igcse');

  return (
    <section className="mt-24">
      <h2 className="text-4xl font-bold mb-6 text-deepblue text-center">
        <TextEffect per="word" preset="fade-in-blur">Choose Your Level</TextEffect>
      </h2>
      <div className="flex justify-center gap-4 mb-12">
        {levels.map((level) => (
          <button
            key={level.key}
            className={`px-6 py-3 rounded-lg font-semibold border border-gray-200 text-deepblue transition-all duration-200 shadow-sm hover:shadow-lg cursor-pointer focus:outline-none focus:ring-gold ${selectedLevel === level.key ? 'bg-gold text-deepblue border-none' : 'bg-white'}`}
            onClick={() => setSelectedLevel(level.key)}
          >
            <TextEffect per="word" preset="fade">{level.label}</TextEffect>
          </button>
        ))}
      </div>
      <h3 className="text-2xl font-semibold mb-6 text-deepblue text-center">
        <TextEffect per="word" preset="fade">{`${levels.find(l => l.key === selectedLevel)?.label ?? ''} Subjects`}</TextEffect>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {selectedLevel === 'igcse' ? (
          subjectList.igcse.map((subject) => (
            <a
              key={subject.code}
              href={`/${subject.code}`}
              className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-gold transition-all duration-200 shadow-sm hover:shadow-lg text-deepblue font-semibold text-lg text-center cursor-pointer"
            >
              <TextEffect per="word" preset="fade">{subject.name}</TextEffect>
            </a>
          ))
        ) : (
          <div className="col-span-4 text-center text-deepblue font-semibold text-xl pb-6">
            <TextEffect per="word" preset="fade">
              {`Subjects for ${selectedLevel === 'as' ? 'AS Level' : 'A Level'} are coming soon!`}
            </TextEffect>
          </div>
        )}
      </div>
    </section>
  );
}
