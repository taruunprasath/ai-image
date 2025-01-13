import React from 'react';

const Header = () => {
  return (
    <header className="bg-indigo-600 text-white py-4">
      <div className="max-w-screen-xl mx-auto flex justify-center items-center px-4">
        
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold">Your App Title</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
