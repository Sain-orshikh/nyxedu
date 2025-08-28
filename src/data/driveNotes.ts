export interface DriveNote {
  id: string;
  title: string;
  author: string;
  date: string;
  driveLink: string;
  subject: string;
  subjectCode: string;
  chapter: string;
  content: string;
}

export const driveNotes: DriveNote[] = [
  {
    id: 'biology-chp1',
    title: 'Biology Chapter 1',
    author: 'Khaliun.E',
    date: '2025-07-01',
    driveLink: 'https://drive.google.com/file/d/1WITUw4tTdNAlTYn8dHdTtqrN9oW9lgdt/view?usp=drive_link',
    subject: 'biology',
    subjectCode: '0610',
    chapter: '1',
    content: 'Chapter 1 notes for Biology. Includes PDF for download/view.',
  },
  {
    id: 'ict-chp1',
    title: 'ICT Chapter 1',
    author: 'Maralmaa.O',
    date: '2025-07-08',
    driveLink: 'https://drive.google.com/file/d/1WgjvLcnHQflKzDjGPheT7fNiVFZcQiCk/view?usp=drive_link',
    subject: 'ict',
    subjectCode: '0417',
    chapter: '1',
    content: 'Chapter 1 notes for ICT. Includes PDF for download/view.',
  },
];
