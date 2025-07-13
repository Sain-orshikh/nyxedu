import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface BookmarkButtonProps {
  noteId: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ noteId }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const res = await fetch('/api/user/bookmarks', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setBookmarked(Array.isArray(data.bookmarkedNotes) && data.bookmarkedNotes.includes(noteId));
        }
      } catch {}
    }
    if (noteId) fetchBookmarks();
  }, [noteId]);

  const handleBookmark = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId }),
      });
      if (res.ok) {
        setBookmarked(b => !b);
        toast.success(bookmarked ? 'Removed from bookmarks.' : 'Added to bookmarks!');
      } else {
        const data = await res.json();
        toast.error(data?.error || 'Failed to update bookmark.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <button
      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
      onClick={handleBookmark}
      disabled={loading}
    >
      <div className="flex items-center gap-4">
        <span className={`material-symbols-outlined ${bookmarked ? 'text-[#FFC107]' : 'text-[#0052CC]'}`}>
          {bookmarked ? 'bookmark' : 'bookmark_add'}
        </span>
        <span className="font-medium">{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
      </div>
    </button>
  );
};

export default BookmarkButton;
