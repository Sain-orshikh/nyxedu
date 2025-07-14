import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegUserCircle, FaBookmark, FaBook } from 'react-icons/fa';
import { MdOutlineExitToApp } from "react-icons/md";

interface ProfileDropdownProps {
  onLogout: () => void;
  email?: string;
  onOpenBookmarks: () => void;
  onOpenSubjects: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onLogout, email, onOpenBookmarks, onOpenSubjects }) => {
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
            onClick={onOpenBookmarks}
          >
            <FaBookmark size={18} />
            Bookmarks
          </button>
          <button
            type="button"
            className="flex items-center gap-2 py-2 px-4 text-deepblue hover:bg-gray-100 rounded transition text-md w-full text-left cursor-pointer"
            onClick={onOpenSubjects}
          >
            <FaBook size={18} />
            Subjects
          </button>
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
    </>
  );
};

export default ProfileDropdown;
