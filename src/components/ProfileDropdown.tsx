import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegUserCircle, FaBookmark, FaBook, FaSignOutAlt } from 'react-icons/fa';
import { MdOutlineExitToApp } from "react-icons/md";
import BookmarksDialog from './common/BookmarksDialog';

interface ProfileDropdownProps {
  onLogout: () => void;
  email?: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onLogout, email }) => {
  const [openBookmarks, setOpenBookmarks] = useState(false);
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="bg-white shadow-lg rounded-lg py-2 min-w-[220px] border border-gray-200 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 text-deepblue font-semibold text-base px-4 pt-2">
            <FaRegUserCircle size={22} />
            {email || 'Profile'}
          </div>
          <hr className="border-t border-gray-200 my-1 w-full" />
          <button
            type="button"
            className="flex items-center gap-2 py-2 px-4 text-deepblue hover:bg-gray-100 rounded transition text-md w-full text-left cursor-pointer"
            onClick={() => setOpenBookmarks(true)}
          >
            <FaBookmark size={18} />
            Bookmarks
          </button>
          <a
            href="/subjects"
            className="flex items-center gap-2 py-2 px-4 text-deepblue hover:bg-gray-100 rounded transition text-md"
          >
            <FaBook size={18} />
            Subjects
          </a>
          <hr className="border-t border-gray-200 my-1 w-full" />
          <button
            className="flex items-center gap-2 w-full text-left py-2 px-4 text-red-600 hover:bg-gray-100 rounded transition-all duration-200 cursor-pointer text-md"
            onClick={onLogout}
          >
            <MdOutlineExitToApp size={18} />
            Logout
          </button>
        </motion.div>
      </AnimatePresence>
      <BookmarksDialog open={openBookmarks} onClose={() => setOpenBookmarks(false)} />
    </>
  );
};

export default ProfileDropdown;
