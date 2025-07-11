import React from 'react';
import { subjects } from '../../data/subjects';

interface Subject {
  code: string;
  name: string;
}

interface SubjectsByLevel {
  igcse: Subject[];
  as: Subject[];
  alevel: Subject[];
}

const levels = [
  { key: 'igcse', label: 'IGCSE' },
  { key: 'as', label: 'AS Level' },
  { key: 'alevel', label: 'A Level' },
];

export default function SubjectsPage() {
  const allSubjects = subjects as SubjectsByLevel;
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-deepblue mb-8">All Subjects</h1>
        {levels.map((level) => (
          <section key={level.key} className="mb-10">
            <h2 className="text-2xl font-semibold text-gold mb-4">{level.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(allSubjects as any)[level.key].map((subject: Subject) => (
                <a
                  key={subject.code}
                  href={`/${subject.code}`}
                  className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-gold transition-all duration-200 shadow-sm hover:shadow-lg text-deepblue font-semibold text-lg text-center cursor-pointer"
                >
                  <span className="block mb-2">{subject.name}</span>
                  <span className="text-xs text-gray-500">{subject.code}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
