import React, { useState, useEffect } from 'react';
import { IoBookmarks, IoBookmarksOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useAuthUser } from '../../hooks/useAuthUser';

interface Props {
  noteId: string;
}

const NoteBookmarkIcon: React.FC<Props> = ({ noteId }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const { data: user } = useAuthUser();

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
    if (noteId && user) fetchBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, user]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      toast.error('You must be logged in to bookmark notes.');
      return;
    }
    
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
  };

  return (
    <span
      onClick={handleBookmark}
      className={`transition-all duration-200 ${user ? 'hover:opacity-80 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
      style={{ marginLeft: 8 }}
      title={user ? (bookmarked ? 'Remove bookmark' : 'Add bookmark') : 'Login required to bookmark'}
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
