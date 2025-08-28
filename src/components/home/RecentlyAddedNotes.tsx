import React from 'react';

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

const RecentlyAddedNotes = () => (
  <section className="pt-24">
    <h2 className="text-4xl font-bold text-deepblue mb-8 text-center">Recently Added Notes</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recentNotes.map((note, idx) => (
        <div key={idx} className="note-card border border-gray-200 bg-white rounded-xl p-6 shadow-sm flex flex-col">
          <span className="text-sm font-semibold bg-green-300 text-deepblue px-3 py-1 rounded-full self-start">{note.tag}</span>
          <h3 className="text-xl font-bold text-deepblue pt-2">{note.title}</h3>
          <p className="text-sm flex-grow">{note.desc}</p>
          <a className="font-semibold text-deepblue hover:opacity-80 transition-all duration-300 self-end mt-4" href={note.href}>Read More →</a>
        </div>
      ))}
    </div>
  </section>
);

export default RecentlyAddedNotes;
