import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#16404D] w-full  text-[#FBF5DD] py-6">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 ReskU. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="/terms" className="text-[#DDA853] hover:text-[#FBF5DD]">Terms of Service</a>
          <a href="/privacy" className="text-[#DDA853] hover:text-[#FBF5DD]">Privacy Policy</a>
          <a href="/contact" className="text-[#DDA853] hover:text-[#FBF5DD]">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
