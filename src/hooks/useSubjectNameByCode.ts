
import { subjects } from '../data/subjects';

/**
 * Returns subject name(s) for given code(s), searching all levels (igcse, as, alevel).
 * - If input is empty, returns undefined.
 * - If input is a single code, returns { code, name } or undefined.
 * - If input is an array of codes, returns array of { code, name } (skips undefined).
 */
export function useSubjectNameByCode(codes?: string | string[]) {
  const subjectList = [
    ...(subjects.igcse ?? []),
    ...(subjects.as ?? []),
    ...(subjects.alevel ?? [])
  ];

  if (!codes || (Array.isArray(codes) && codes.length === 0)) {
    return undefined;
  }

  // Single code
  if (typeof codes === 'string') {
    if (codes.length === 4) {
      const subject = subjectList.find(subj => subj.code === codes);
      const result = subject ? { code: codes, name: subject.name } : { code: codes, name: codes };
      return result;
    }
    return undefined;
  }

  // Array of codes
  if (Array.isArray(codes)) {
    const result = codes
      .filter(code => typeof code === 'string' && code.length === 4)
      .map(code => {
        const subject = subjectList.find(subj => subj.code === code);
        return subject ? { code, name: subject.name } : { code, name: code };
      });
    return result;
  }

  return undefined;
}
