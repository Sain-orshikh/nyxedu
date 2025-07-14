import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import { IoClose } from 'react-icons/io5';
import { subjects as allSubjectsData } from '../../data/subjects';
import { useSubjectNameByCode } from '../../hooks/useSubjectNameByCode';

interface SubjectsDialogProps {
  open: boolean;
  onClose: () => void;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const SubjectsDialog: React.FC<SubjectsDialogProps> = ({ open, onClose }) => {
  const [userSubjects, setUserSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [toRemove, setToRemove] = useState<string[]>([]);
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [selectedAdd, setSelectedAdd] = useState<string[]>([]);
  // Use static subjects as base
  const staticSubjects: { code: string; name: string; description?: string }[] = Array.isArray(allSubjectsData)
    ? allSubjectsData
    : [
        ...(allSubjectsData.igcse ?? []),
        ...(allSubjectsData.as ?? []),
        ...(allSubjectsData.alevel ?? [])
      ];

  useEffect(() => {
    if (open) {
      setLoading(true);
      // Fetch user's subjects only
      fetch('/api/user/subjects')
        .then(res => res.json())
        .then(data => {
          setUserSubjects(Array.isArray(data.subjects) ? data.subjects : []);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  // Add subject handler (API)
  const handleAddSubject = async () => {
    if (!selectedAdd.length) return;
    setLoading(true);
    try {
      const res = await fetch('/api/user/addSubjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects: selectedAdd })
      });
      const data = await res.json();
      if (Array.isArray(data.subjects)) {
        setUserSubjects(data.subjects);
      }
    } finally {
      setLoading(false);
      setAddDropdownOpen(false);
      setSelectedAdd([]);
    }
  };

  // Remove subject handler (API)
  const handleConfirmRemove = async () => {
    if (!toRemove.length) return;
    setLoading(true);
    try {
      const res = await fetch('/api/user/removeSubjects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects: toRemove })
      });
      const data = await res.json();
      if (Array.isArray(data.subjects)) {
        setUserSubjects(data.subjects);
      }
    } finally {
      setLoading(false);
      setToRemove([]);
      setRemoveMode(false);
    }
  };
  // If userSubjects is an array of codes (strings), handle accordingly
  const subjectNamesResult = React.useMemo(() => {
    if (userSubjects.length === 0) return [];
    // If userSubjects is array of strings, use directly
    const codes = typeof userSubjects[0] === 'string' ? userSubjects : userSubjects.map(s => s.code);
    const result = useSubjectNameByCode(codes);
    if (!result) return [];
    return Array.isArray(result) ? result : [result];
  }, [userSubjects]);

  // If userSubjects is array of strings, build objects with code and name
  const userSubjectsWithNames = typeof userSubjects[0] === 'string'
    ? subjectNamesResult.map((subjectObj) => ({ code: subjectObj.code, name: subjectObj.name }))
    : userSubjects.map((subj, idx) => {
        const subjectObj = subjectNamesResult[idx];
        return {
          ...subj,
          name: subjectObj ? subjectObj.name : subj.name || subj.code
        };
      });
      
  return (
    <Modal open={open} onClose={(_event, reason) => {
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
      onClose();
    }} aria-labelledby="subjects-modal-title">
      <Box sx={style} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <Typography id="subjects-modal-title" variant="h5" fontWeight={700}>
            Your Subjects
          </Typography>
          <div className="flex gap-2">
            {!addDropdownOpen ? (
              <button
                type="button"
                className="w-24 rounded-xl border-2 border-green-500 text-green-500 font-bold text-sm bg-transparent hover:bg-green-500 hover:text-white focus:outline-none transition-all duration-300 cursor-pointer"
                onClick={() => setAddDropdownOpen(true)}
              >
                Add
              </button>
            ) : (
              <button
                type="button"
                className="w-24 rounded-xl border-2 border-green-500 text-green-500 font-bold text-sm bg-transparent hover:bg-green-500 hover:text-white focus:outline-none transition-all duration-300 cursor-pointer"
                onClick={handleAddSubject}
                disabled={selectedAdd.length === 0}
              >
                Confirm
              </button>
            )}
            <button
              type="button"
              className={`w-24 rounded-xl border-2 border-red-500 text-red-500 font-bold text-sm bg-transparent hover:bg-red-500 hover:text-white focus:outline-none transition-all duration-300 cursor-pointer ${removeMode ? 'ring-2 ring-red-400' : ''}`}
              onClick={() => setRemoveMode(v => !v)}
            >
              Remove
            </button>
            <IconButton onClick={onClose} size="large">
              <IoClose size={28} />
            </IconButton>
          </div>
        </div>
        {/* Add dropdown */}
        {addDropdownOpen && (
          <div className="mb-4 flex gap-2 items-center">
            <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
              <InputLabel id="add-multi-subject-label">Select Subjects</InputLabel>
              <Select
                labelId="add-multi-subject-label"
                id="add-multi-subject"
                multiple
                value={selectedAdd}
                onChange={e => {
                  const value = e.target.value;
                  setSelectedAdd(typeof value === 'string' ? value.split(',') : value);
                }}
                input={<OutlinedInput label="Select Subjects" />}
                renderValue={selected =>
                  staticSubjects
                    .filter(s => selected.includes(s.code))
                    .map(s => `${s.name} (${s.code})`)
                    .join(', ')
                }
                MenuProps={{ PaperProps: { style: { maxHeight: 48 * 4.5 + 8, width: 250 } } }}
              >
                {staticSubjects
                  .filter(s => {
                    if (typeof userSubjects[0] === 'string') {
                      return !userSubjects.includes(s.code);
                    }
                    return !userSubjects.some(u => u.code === s.code);
                  })
                  .map((subject, idx) => (
                    <MenuItem key={subject.code + '-' + idx} value={subject.code}>
                      {subject.name} ({subject.code})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        )}
        {/* Remove confirmation */}
        {removeMode && toRemove.length > 0 && (
          <div className="mb-4 flex flex-col gap-2 items-start">
            <span className="text-red-600 font-semibold">Selected for removal: {toRemove.length}</span>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                className="w-24 rounded-xl border-2 py-3 border-red-500 text-red-500 font-bold text-sm bg-transparent hover:bg-red-500 hover:text-white focus:outline-none transition-all duration-300 cursor-pointer"
                onClick={handleConfirmRemove}
              >
                Confirm
              </button>
              <button
                type="button"
                className="w-24 rounded-xl border-2 py-3 border-gray-400 text-gray-700 font-bold text-sm bg-transparent hover:bg-gray-400 hover:text-white focus:outline-none transition-all duration-300 cursor-pointer"
                onClick={() => { setToRemove([]); setRemoveMode(false); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {loading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : userSubjectsWithNames.length === 0 ? (
        <Typography variant="body1" color="text.secondary">No subjects found.</Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userSubjectsWithNames.map((subject, idx) => (
            <a
              key={(subject.code || subject.id) + '-' + idx}
              href={`/${subject.code}`}
              className="bg-white rounded-xl p-6 border border-gray-200 block shadow-md transition-shadow duration-300 hover:shadow-lg cursor-pointer relative"
            >
              <div className="flex items-center justify-between mb-2 relative">
                <h3 className="text-xl font-semibold text-[#000033]">{subject.name || subject.code}</h3>
                {removeMode && (
                  <button
                    type="button"
                    className={`absolute top-0 right-0 z-10 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-lg shadow focus:outline-none transition-all duration-200 cursor-pointer hover:bg-red-700 hover:scale-110`}
                    onClick={e => { e.preventDefault(); setToRemove(prev => prev.includes(subject.code) ? prev : [...prev, subject.code]); }}
                    style={{ right: '-12px', top: '-12px' }}
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="text-[#555566] text-sm mb-4">{subject.description || ''}</p>
              <div className="flex items-center text-xs text-[#555566]">
                <span>Code: {subject.code}</span>
              </div>
            </a>
          ))}
        </div>
      )}
      </Box>
    </Modal>
  );
};

export default SubjectsDialog;
