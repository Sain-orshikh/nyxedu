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
  {
    id: 'biology-chapter11',
    title: 'Biology Chapter 11',
    type: 'note',
    category: 'Biology',
    description: 'CHAPTER 11 Gas Exchange in Humans Features of Gas Exchange Surfaces TheBreathing System Investigating the Differences in Inspired & Expired Air Investigating the Effects of Physical Activity on Breathing Effects of Physical Activity on Breathing Identifying Intercostal Muscles Function of Cartilage in the Trachea Volume & Pressure Changes in the Lungs Differences in Inspired & Expired Air Explaining the Link Between Physical Activity & Breathing Protecting the Breathing System👉 In humans, alveol...',
    url: '/0610/biology-chapter11',
  },
  {
    id: 'biology-chapter12',
    title: 'Biology Chapter 12',
    type: 'note',
    category: 'Biology',
    description: 'CHAPTER 12 Respiration Respirations in cells Aerobic respiration Anaerobic respirationUses of Energy in the Body | Бие дэх энергийн хэрэгцээ Energy from respiration is used for: Active transport (идэвхтэй тээвэрлэл) Growth (өсөлт) Cell division (эсийн хуваалт) Protein synthesis (уургийн нийлэгжэлт) Nerve impulses (нервийн дохио) Maintaining body temperature (биеийн температурыг тогтворжуулах) Author: Tselmeg.Kh Uses of energy in living organisms What is Respiration? | Амьсгалт гэж юу вэ? Definit...',
    url: '/0610/biology-chapter12',
  },
  {
    id: 'biology-chapter13',
    title: 'Biology Chapter 13',
    type: 'note',
    category: 'Biology',
    description: 'CHAPTER 13 Excretion in Humans Excretions in humans The kidney The Role of the Liver in Excretion EXCRETION IN HUMANS Key Waste Products (Гол ялгаруулалтын бүтээгдэхүүнүүд) LungsCarbon dioxide (CO₂)produced by aerobic respiration and exhaled via lungs. Аэробик амьсгалтаар үүсэх нүүрстөрөгчийн давхар ислийг уушгинаар дамжуулан ялгаруулдаг. KidneysUrea formed in the liver from excess amino acids (deamination), then excreted by kidneys. Ийлдэм амин х хүчлээс үүсэх хорт усыг элэг задлаад (де аминаци)...',
    url: '/0610/biology-chapter13',
  },
  {
    id: 'ict-chapter3',
    title: 'ICT Chapter 3',
    type: 'note',
    category: 'ICT',
    description: 'CHAPTER 3 Effects of using IT Microprocessor-Controlled device Health issues Author:Maralmaa.OMicroprocessor: an electronic circuit or chip that makes the computer or electronic device work by processing data, performing calculations, and issuing instructions based on the results  Smart device: as the name suggests, an electronic gadget that is able to connect, share, and interact with its user and other smart devices  Internet of Things (IOT): the interconnection via the internet of computing d...',
    url: '/0417/ict-chapter3',
  },
  {
    id: 'ict-chapter7',
    title: 'ICT Chapter 7',
    type: 'note',
    category: 'ICT',
    description: "CHAPTER 7 Communication Email The internet Internet protocols Author:Maralmaa.OEmail: short for electronic mail Author: Maralmaa.O Communication with other ICT users using email cc: short for 'carbon copy'. This is the field you type an address into if you want the person to see the email, but not necessarily respond to it  bcc: short for 'blind carbon copy'. This is the field you type an address into if you don't want others to see who you have copied into the email  Netiquette: a set of rules...",
    url: '/0417/ict-chapter7',
  },
  {
    id: 'ict-chapter10',
    title: 'ICT Chapter 10',
    type: 'note',
    category: 'ICT',
    description: 'CHAPTER 10 Databases Types of Database Primary & Foreign Keys Perform Calculations Sorting & Searching Data Form DesignAuthor: Saruul.GCHAPTER 10: Databases Definition: A database is a structured, persistent collection of data. It allows easy storage,retrieval, and management ofinformation Author: Saruul.G (Өгөгдлийн сан) Type / ТөрөлDefinition / ТайлбарPros / Давуу талCons / Сул тал Example / Жишээ Flat file / Нэг хүснэгттэйStores all data in a single table Бүх өгөгдлийг нэг хүснэгтэд хадгалнаS...',
    url: '/0417/ict-chapter10',
  },
  {
    id: 'ict-chapter4',
    title: 'ICT Chapter 4',
    type: 'note',
    category: 'ICT',
    description: 'CHAPTER 4 ICT Applications Communication Computer Modelling Computer Controlled Systems School Management Systems OnlineBooking Systems Banking Applications Computers in Medicine Expert Systems Computers in Retail Industry Recognition Systems Satellite SystemsAuthor: Saruul.GCHAPTER 4: Communication Media Definition: Tools and channels for sharing information between sender & receiver. →Newsletters (мэдээллийн товхимол) Sent by email or print to inform/educate/entertain. Used by schools, clubs,...',
    url: '/0417/ict-chapter4',
  },
  {
    id: 'ict-chapter6',
    title: 'ICT Chapter 6',
    type: 'note',
    category: 'ICT',
    description: 'CHAPTER 6 Security and Safety Physical Safety E-Safety: Data E-Safety: Using IT Threats to Data Protection of Data CopyrightAuthor: Saruul.GCHAPTER 6: Security and Safety 1. Physical Safety Definition: Creating a safe environment when using technology; preventing injuries or equipment damage. Risks & Prevention: Electrocution: Keep liquids away; insulate cables; use circuit breakers. Fire hazard: Don’t overload sockets; use surge protectors; turn off devices when away. Overheating: Ensure ventil...',
    url: '/0417/ict-chapter6',
  },
  {
    id: 'ict-chapter8',
    title: 'ICT Chapter 8',
    type: 'note',
    category: 'ICT',
    description: 'CHAPTER 8 File management Compression File FormatsAuthor: Saruul.GCHAPTER 8: File Management Author: Saruul.G (Файлын менежмент) Concept / ТодорхойлолтDetails / Нарийвчилсан тайлбарExample / Жишээ Compression / Файлын шахалтReducing file size to store or transfer efficiently.            🔹Файлын хэмжээг багасгах, хадгалах болон дамжуулахад хялбар болгох.Mobile photo, video uploads Need / Шаардлага- Store more on device - Reduce transfer time - Reduce image file size via resolution or colour depth...',
    url: '/0417/ict-chapter8',
  },
];
