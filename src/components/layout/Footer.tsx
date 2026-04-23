import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 px-8 bg-white border-t border-slate-200 text-center text-slate-500 text-sm">
      <p>© {new Date().getFullYear()} <span className="font-semibold text-pink-500">QuizDash</span>. Built with 💖 by Nurani for Pangeran Nunu.</p>
    </footer>
  );
};

export default Footer;
