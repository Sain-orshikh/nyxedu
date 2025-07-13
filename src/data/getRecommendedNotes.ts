import { driveNotes, DriveNote } from './driveNotes';

/**
 * Returns recommended notes based on subject and chapter logic.
 * @param currentNoteId - The id of the current note
 * @param currentSubject - The subject of the current note
 * @param currentChapter - The chapter of the current note
 * @param count - Number of recommendations to return (default 3)
 */
export function getRecommendedNotes(currentNoteId: string, currentSubject: string, currentChapter: string, count: number = 3): DriveNote[] {
  // Filter out the current note
  const otherNotes = driveNotes.filter(n => n.id !== currentNoteId);

  // 1. Same subject, concurrent chapters (chapter +/- 1)
  const chapterNum = parseInt(currentChapter, 10);
  let recommended = otherNotes.filter(n => n.subject === currentSubject && Math.abs(parseInt(n.chapter, 10) - chapterNum) === 1);

  // 2. Same subject if not enough
  if (recommended.length < count) {
    const sameSubject = otherNotes.filter(n => n.subject === currentSubject && !recommended.includes(n));
    recommended = [...recommended, ...sameSubject];
  }

  // 3. Random from other subjects if still not enough
  if (recommended.length < count) {
    const otherSubjects = otherNotes.filter(n => n.subject !== currentSubject);
    // Shuffle and pick
    for (let i = otherSubjects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherSubjects[i], otherSubjects[j]] = [otherSubjects[j], otherSubjects[i]];
    }
    recommended = [...recommended, ...otherSubjects];
  }

  return recommended.slice(0, count);
}
