import { teamMembers } from '@/data/teamMembers';
import { FaInstagram, FaFacebook, FaXTwitter } from 'react-icons/fa6';

const founderEmails = teamMembers.filter(m => m.role === 'Founder').map(m => m.email);
const webDevEmail = teamMembers.find(m => m.role === 'Web Developer')?.email;

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 w-full">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <p className="text-sm">&copy; 2025 NyxEdu. All rights reserved.</p>
          <div className="flex gap-4 mt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-pink-500 transition-colors duration-200 text-2xl">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-2xl">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-500 hover:text-black transition-colors duration-200 text-2xl">
              <FaXTwitter />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full mt-2 sm:mt-0 md:w-auto md:items-end md:text-right">
          <span className="text-xs text-gray-500">Contact founders: {founderEmails.join(', ')}</span>
          <span className="text-xs text-gray-500">Found a bug? Contact: {webDevEmail}</span>
        </div>
      </div>
    </footer>
  );
}
