export interface SearchItem {
  id: string;
  title: string;
  type: 'subject' | 'note';
  category?: string;
  description?: string;
  url?: string;
}

// Static sample data for search functionality
export const searchData: SearchItem[] = [
  // IGCSE Subject
  {
    id: 'biology-chapter1',
    title: 'Biology Chapter1',
    type: 'note',
    category: 'Biology',
    description: 'CHAPTER 1 Characteristics and classification of living organisms. Characteristics of Living Organisms, Concept & Uses of Classification Systems, Features of Organisms...',
    url: '/0610/biology-chapter1',
  },
  {
    id: 'history-chapter1',
    title: 'History Chapter1',
    type: 'note',
    category: 'History',
    description: 'CHAPTER 1 Was the Treaty of Versailles Fair? Why was there a need for the Treaty of Versailles? Motives & aims of the Big Three at Versailles...',
    url: '/0470/history-chapter1',
  },
  {
    id: 'ict-chapter1',
    title: 'Ict Chapter1',
    type: 'note',
    category: 'ICT',
    description: 'CHAPTER 1 Types and components of computer system. Hardware, Software, Analogue&Digital data, Central Processing Unit(CPU)...',
    url: '/0417/ict-chapter1',
  },
  {
    id: 'ict-chapter2',
    title: 'Ict Chapter2',
    type: 'note',
    category: 'ICT',
    description: 'CHAPTER 2 Networks. Types of Network, Network devices, Cloud computing, Conferencing, Password protection...',
    url: '/0417/ict-chapter2',
  },
  {
    id: 'music-harmony',
    title: 'Music Harmony',
    type: 'note',
    category: 'Music',
    description: 'Harmony IGCSE Music /0410/. Primary chords, secondary chords, cadence, modulation. Primary chords in music are the I, IV, and V chords...',
    url: '/0410/music-harmony',
  },
  {
    id: 'music-melody-and-rhythm',
    title: 'Music Melody And Rhythm',
    type: 'note',
    category: 'Music',
    description: 'Melody and rhythm IGCSE Music /0410/. Duple, triple, irregular metre, syncopation, swing, polyrhythm. Scales, blue notes...',
    url: '/0410/music-melody-and-rhythm',
  },
  {
    id: 'music',
    title: 'Music',
    type: 'note',
    category: 'Music',
    description: 'Rudiments author: Nyambayar.B listening Music /0410/ rudiments. Dynamics, tempo, expression markings, ornament and articulation signs...',
    url: '/0410/music',
  },
  {
    id: 'physics-chapter1',
    title: 'Physics Chapter1',
    type: 'note',
    category: 'Physics',
    description: 'Chapter 1: Motion, Forces and Energy. Physical Quantities, Motion, Mass & Weight, Forces, Moment, Momentum, Energy, work and power...',
    url: '/0625/physics-chapter1',
  },
  {
    id: 'music-composition',
    title: 'Music Composition',
    type: 'note',
    category: 'Music',
    description: 'Composing IGCSE Music 0410. Content overview: Listening, harmony, counterpoint, form, orchestration, musicianship, writing. Music theory fundamentals...',
    url: '/0410/music-composition',
  },
];
