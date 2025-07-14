import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { IoClose } from 'react-icons/io5';
import { subjects as allSubjectsData } from '../../data/subjects';

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
  const [selectedAdd, setSelectedAdd] = useState('');

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch('/api/user/subjects')
        .then(res => res.json())
        .then(data => {
          setUserSubjects(Array.isArray(data.subjects) ? data.subjects : []);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  // Add subject handler (placeholder)
  // Flatten allSubjectsData to a single array
  const flatSubjects: { code: string; name: string; description?: string }[] = [
    ...((allSubjectsData.igcse ?? []) as any[]),
    ...((allSubjectsData.as ?? []) as any[]),
    ...((allSubjectsData.alevel ?? []) as any[])
  ];

  const handleAddSubject = () => {
    if (!selectedAdd) return;
    // Simulate add
    const found = flatSubjects.find((s: { code: string }) => s.code === selectedAdd);
    if (found) setUserSubjects([...userSubjects, found]);
    setAddDropdownOpen(false);
    setSelectedAdd('');
  };

  // Remove subject handler (placeholder)
  const handleConfirmRemove = () => {
    setUserSubjects(userSubjects.filter(s => !toRemove.includes(s.code)));
    setToRemove([]);
    setRemoveMode(false);
  };

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
            <button
              type="button"
              className="px-3 py-1 rounded bg-gold text-deepblue font-bold text-sm hover:opacity-80 focus:outline-none"
              onClick={() => setAddDropdownOpen(v => !v)}
            >
              Add
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded bg-red-100 text-red-700 font-bold text-sm hover:opacity-80 focus:outline-none ${removeMode ? 'ring-2 ring-red-400' : ''}`}
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
            <select
              value={selectedAdd}
              onChange={e => setSelectedAdd(e.target.value)}
              className="px-2 py-1 rounded border border-gray-300 text-deepblue"
            >
              <option value="">Select subject...</option>
              {flatSubjects.filter(s => !userSubjects.some(u => u.code === s.code)).map(subject => (
                <option key={subject.code} value={subject.code}>{subject.name}</option>
              ))}
            </select>
            <button
              type="button"
              className="px-3 py-1 rounded bg-gold text-deepblue font-bold text-sm hover:opacity-80 focus:outline-none"
              onClick={handleAddSubject}
            >
              Add Subject
            </button>
          </div>
        )}
        {/* Remove confirmation */}
        {removeMode && toRemove.length > 0 && (
          <div className="mb-4 flex gap-2 items-center">
            <span className="text-red-600 font-semibold">Selected for removal: {toRemove.length}</span>
            <button
              type="button"
              className="px-3 py-1 rounded bg-red-600 text-white font-bold text-sm hover:opacity-80 focus:outline-none"
              onClick={handleConfirmRemove}
            >
              Confirm Remove
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold text-sm hover:opacity-80 focus:outline-none"
              onClick={() => { setToRemove([]); setRemoveMode(false); }}
            >
              Cancel
            </button>
          </div>
        )}
        {loading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : userSubjects.length === 0 ? (
          <Typography variant="body1" color="text.secondary">No subjects found.</Typography>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userSubjects.map(subject => (
              <div
                key={subject.code || subject.id}
                className="bg-white rounded-xl p-6 border border-gray-200 block shadow-md transition-shadow duration-300 hover:shadow-lg cursor-pointer relative"
              >
                <div className="flex items-center justify-between mb-2 relative">
                  <h3 className="text-xl font-semibold text-[#000033]">{subject.name}</h3>
                  {removeMode && (
                    <button
                      type="button"
                      className={`absolute top-0 right-0 z-10 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-lg shadow hover:bg-red-700 transition-all duration-200 focus:outline-none`}
                      onClick={() => setToRemove(prev => prev.includes(subject.code) ? prev : [...prev, subject.code])}
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
              </div>
            ))}
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default SubjectsDialog;
