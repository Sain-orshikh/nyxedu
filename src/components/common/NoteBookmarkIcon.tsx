import React, { useState, useEffect } from 'react';
import { IoBookmarks, IoBookmarksOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';

interface Props {
  noteId: string;
}

const NoteBookmarkIcon: React.FC<Props> = ({ noteId }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch('/api/user/bookmarks', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setBookmarked(Array.isArray(data.bookmarks) && data.bookmarks.includes(noteId));
      }
    } catch {}
  };

  useEffect(() => {
    if (noteId) fetchBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user/bookmarkUnbookmark', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId }),
      });
      if (res.ok) {
        toast.success(bookmarked ? 'Removed from bookmarks.' : 'Added to bookmarks!');
        await fetchBookmarks();
      } else {
        const data = await res.json();
        toast.error(data?.error || 'Failed to update bookmark.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <span
      onClick={handleBookmark}
      className="hover:opacity-80 transition-all duration-200"
      style={{ cursor: loading ? 'not-allowed' : 'pointer', marginLeft: 8 }}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? (
        <IoBookmarks size={24} color="#222" />
      ) : (
        <IoBookmarksOutline size={24} color="#222" />
      )}
    </span>
  );
};

export default NoteBookmarkIcon;
