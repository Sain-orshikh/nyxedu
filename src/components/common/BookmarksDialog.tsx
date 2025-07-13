
import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { IoClose } from 'react-icons/io5';
import { driveNotes } from '../../data/driveNotes';

interface BookmarksDialogProps {
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

const BookmarksDialog: React.FC<BookmarksDialogProps> = ({ open, onClose }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch('/api/user/bookmarks')
        .then(res => res.json())
        .then(data => {
          setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : []);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  const bookmarkedNotes = driveNotes.filter(note => bookmarks.includes(note.id));

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="bookmarks-modal-title">
      <Box sx={style}>
        <div className="flex items-center justify-between mb-4">
          <Typography id="bookmarks-modal-title" variant="h5" fontWeight={700}>
            Bookmarked Notes
          </Typography>
          <IconButton onClick={onClose} size="large">
            <IoClose size={28} />
          </IconButton>
        </div>
        {loading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : bookmarkedNotes.length === 0 ? (
          <Typography variant="body1" color="text.secondary">No notes bookmarked.</Typography>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookmarkedNotes.map(note => (
              <a
                key={note.id}
                href={`/${note.subjectCode}/${note.id}`}
                className="bg-white rounded-xl p-6 border border-gray-200 block shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-2 relative">
                  <h3 className="text-xl font-semibold text-[#000033]">{note.title}</h3>
                </div>
                <p className="text-[#555566] text-sm mb-4">{note.content}</p>
                <div className="flex items-center text-xs text-[#555566]">
                  <span>By {note.author}</span>
                  <span className="mx-2">•</span>
                  <span>{note.date}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default BookmarksDialog;
