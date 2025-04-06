const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold">DeLinked</h3>
              <p className="text-sm text-gray-400">Blockchain-based authentication</p>
            </div>
            
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} DeLinked. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;