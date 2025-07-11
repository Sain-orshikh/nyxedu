export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 text-center flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">&copy; 2025 NyxEdu. All rights reserved.</p>
        <div className="flex gap-6 mt-2 md:mt-0">
          <a className="text-white hover:text-gold transition-colors" href="/subjects">Subjects</a>
          <a className="text-white hover:text-gold transition-colors" href="/bookmarks">Bookmarks</a>
          <a className="text-white hover:text-gold transition-colors" href="/contact-us">Contact</a>
        </div>
      </div>
    </footer>
  );
}
