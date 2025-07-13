export const notes = {
  mathematics: [
    {
      title: 'Algebraic Expressions',
      content: 'A detailed explanation of algebraic expressions, including simplification, expansion, and factorization techniques.',
      author: 'Emily Carter',
      date: 'Sep 15, 2023',
    },
    {
      title: 'Geometry Theorems',
      content: 'Comprehensive notes on key geometry theorems, with proofs and examples for better understanding.',
      author: 'David Lee',
      date: 'Sep 10, 2023',
    },
    {
      title: 'Calculus Basics',
      content: 'An introduction to calculus, covering differentiation and integration with practical applications.',
      author: 'Sophia Clark',
      date: 'Sep 5, 2023',
    },
    {
      title: 'Trigonometry Formulas',
      content: 'A collection of essential trigonometry formulas and their applications in solving triangles.',
      author: 'Ethan Brown',
      date: 'Aug 30, 2023',
    },
    {
      title: 'Statistics Concepts',
      content: 'Notes on fundamental statistics concepts, including probability, distributions, and hypothesis testing.',
      author: 'Olivia Green',
      date: 'Aug 25, 2023',
    },
    {
      title: 'Vectors and Matrices',
      content: 'An overview of vectors and matrices, including operations and their use in solving linear equations.',
      author: 'Noah White',
      date: 'Aug 20, 2023',
    },
  ],
  biology: require('./driveNotes').driveNotes.filter((n: { subject: string }) => n.subject === 'biology'),
  ict: require('./driveNotes').driveNotes.filter((n: { subject: string }) => n.subject === 'ict'),
  physics: [
    {
      title: 'Mechanics',
      content: 'Fundamentals of forces, motion, and energy.',
      author: 'Charlie Brown',
      date: 'Sep 10, 2023',
    },
    {
      title: 'Electromagnetism',
      content: 'Notes on electric fields, magnetic fields, and their interactions.',
      author: 'Diana Prince',
      date: 'Sep 6, 2023',
    },
  ],
  chemistry: [
    {
      title: 'Atomic Structure',
      content: 'Explanation of atomic models and electron configuration.',
      author: 'Eve Adams',
      date: 'Sep 14, 2023',
    },
    {
      title: 'Organic Chemistry',
      content: 'Introduction to hydrocarbons and functional groups.',
      author: 'Frank Miller',
      date: 'Sep 9, 2023',
    },
  ],
};
