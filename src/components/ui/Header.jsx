import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../ThemeContext';

const Header = ({ onAddClick, searchQuery, setSearchQuery }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { darkMode, setDarkMode } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleAddClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCreateModule = () => {
    onAddClick('module');
    setIsDropdownOpen(false);
  };

  const handleAddLink = () => {
    onAddClick('link');
    setIsDropdownOpen(false);
  };

  const handleUpload = () => {
    onAddClick('upload');
    setIsDropdownOpen(false);
  };

  function toggleTheme() {
    setDarkMode(prev => !prev);
    console.log(darkMode);
  }

  return (
    <div className="header">
      <h1 className="header-title">Course builder</h1>
      <div className="header-right">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery('')}
              style={{
                backgroundColor: 'white',
                border: 'none',
                fontWeight: '800',
                fontSize: '16px',
                transform: 'translateX(-23px)',
              }}
            >
              ✕
            </button>
          )}
        </div>
        <div className="dropdown-container" ref={dropdownRef}>
          <button className="add-button" onClick={handleAddClick}>
            Add
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleCreateModule}>
                <span className="item-icon">
                  <img src="/SinglePointRubric.svg" alt="" />
                </span>
                Create module
              </button>
              <button className="dropdown-item" onClick={handleAddLink}>
                <span className="item-icon">
                  <img src="/LinkOutlined.svg" alt="" />
                </span>
                Add a link
              </button>
              <button className="dropdown-item" onClick={handleUpload}>
                <span className="item-icon">
                  <img src="/UploadOutlined.svg" alt="" />
                </span>
                Upload
              </button>
            </div>
          )}
        </div>
          <div className="theme" onClick={toggleTheme}>
            {darkMode ? (
              <img
                src="/toLight.png"
                style={{ height: '30px', filter: 'invert(1)' }}
                alt="themeToggler"
              />
            ) : (
              <img
                src="/toDark.png"
                style={{ height: '30px' }}
                alt="themeToggler"
              />
            )}
          </div>
      </div>
    </div>
  );
};

export default Header;
