import React, { useState } from 'react';

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

const LevelSelector = () => {
  const [selectedLevel, setSelectedLevel] = useState('igcse');
  return (
    <section className="py-12" id="levels">
      <h2 className="text-3xl font-bold text-deepblue mb-8 text-center">Choose Your Level</h2>
      <div className="level-selector flex justify-center items-center gap-4 md:gap-8 mb-12">
        {levels.map((level) => (
          <div
            key={level.key}
            className={`level-card${selectedLevel === level.key ? ' active' : ''}`}
            data-level={level.key}
            onClick={() => setSelectedLevel(level.key)}
          >
            {level.label}
          </div>
        ))}
      </div>
      <div id="subjects-container">
        {levels.map((level) => (
          <div
            key={level.key}
            className={`subject-grid${selectedLevel === level.key ? '' : ' hidden'}`}
            id={`${level.key}-subjects`}
          >
            <h3 className="text-2xl font-bold text-center text-deepblue mb-8 col-span-full">
              {level.label} Subjects
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {(subjects[level.key as keyof typeof subjects] as string[]).map((subject: string) => (
                <div key={subject} className="subject-card">{subject}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LevelSelector;
