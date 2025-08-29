import React, { useMemo } from 'react';
import { driveNotes } from '../../data/driveNotes';

const RecentlyAddedNotes = () => {
  // Get the latest 3 notes sorted by date
  const recentNotes = useMemo(() => {
    return driveNotes
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(note => ({
        tag: `${note.subject.charAt(0).toUpperCase() + note.subject.slice(1)} (${note.subjectCode})`,
        title: note.title,
        desc: note.content.length > 150 ? note.content.substring(0, 150) + '...' : note.content,
        href: `/${note.subjectCode}/${note.id}`,
        author: note.author,
        date: note.date
      }));
  }, []);

  return (
    <section className="pt-24">
      <h2 className="text-4xl font-bold text-deepblue mb-8 text-center">Recently Added Notes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recentNotes.map((note, idx) => (
          <div key={idx} className="note-card border border-gray-200 bg-white rounded-xl p-6 shadow-sm flex flex-col">
            <span className="text-sm font-semibold bg-green-300 text-deepblue px-3 py-1 rounded-full self-start">{note.tag}</span>
            <h3 className="text-xl font-bold text-deepblue pt-2">{note.title}</h3>
            <p className="text-sm flex-grow">{note.desc}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-500">By {note.author}</span>
              <a className="font-semibold text-deepblue hover:opacity-80 transition-all duration-300" href={note.href}>Read More →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyAddedNotes;
