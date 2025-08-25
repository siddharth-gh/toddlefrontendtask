import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import boldSearch from '../../utils/boldSearch';

function ItemCard({
  item,
  index,
  itemType,
  onDelete,
  onRename,
  onEdit,
  searchQuery,
}) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOptionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const toggleOptions = e => {
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);
  };

  const handleEditItem = e => {
    e.stopPropagation();
    onEdit(item);
    setIsOptionsOpen(false);
  };

  const handleRename = e => {
    e.stopPropagation();
    onEdit(item);
    setIsOptionsOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(item.id);
    }
    setIsOptionsOpen(false);
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (itemType == 'link') {
    return (
      <div className="module-item link-item" ref={setNodeRef} style={style}>
        <span {...attributes} {...listeners} className="item-drag-handle">
          <img
            src="/DragHandleOutlined.svg"
            alt=""
            draggable="false"
            style={{ pointerEvents: 'none' }}
          />
        </span>
        <div className={'item-wrapper'}>
          <div className="item-content">
            <div className="item-icon">
              <span className="icon-link">🔗</span>
            </div>
            <div className="item-info">
              <h4 className="item-title">
                {boldSearch(item.title, searchQuery)}
              </h4>
              <a
                href={item.url}
                className="item-url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.url}
              </a>
            </div>
          </div>
          <div className="module-actions" ref={dropdownRef}>
            <button className="btn-options" onClick={toggleOptions}>
              <span className="options-icon">⋮</span>
            </button>
            {isOptionsOpen && (
              <div className="options-menu">
                <button className="option-item" onClick={handleEditItem}>
                  <span className="option-icon">
                    <img src="/PencilLineOutlined.svg" alt="" />
                  </span>
                  Edit
                </button>
                <button className="option-item delete" onClick={handleDelete}>
                  <span className="option-icon">
                    <img src="/DeleteOutlined.svg" alt="" />
                  </span>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else if (itemType == 'upload') {
    return (
      <div className="module-item file-item" ref={setNodeRef} style={style}>
        <span {...attributes} {...listeners} className="item-drag-handle">
          <img
            src="/DragHandleOutlined.svg"
            alt=""
            draggable="false"
            style={{ pointerEvents: 'none' }}
          />
        </span>
        <div className="item-wrapper">
          <div className="item-content">
            <div className="item-icon">
              <img
                src="/PDFColored.svg"
                alt="Empty illustration"
                className="empty-state-image"
              />
            </div>
            <div className="item-info">
              <h4 className="item-title">
                {/* {item.title} */}
                {boldSearch(item.title, searchQuery)}
              </h4>
              <p className="item-details">
                {item.fileName} ({Math.round(item.fileSize / 1024)} KB)
              </p>
            </div>
          </div>
          <div className="module-actions" ref={dropdownRef}>
            <button className="btn-options" onClick={toggleOptions}>
              <span className="options-icon">⋮</span>
            </button>
            {isOptionsOpen && (
              <div className="options-menu">
                <button className="option-item" onClick={handleRename}>
                  <span className="option-icon">
                    <img src="/PencilLineOutlined.svg" alt="" />
                  </span>
                  Rename
                </button>
                <button className="option-item">
                  <span className="option-icon">
                    <img src="/DownloadOutlined.svg" alt="" />
                  </span>
                  <a
                    href="/test.jpg"
                    download="test.jpg"
                    className="download-file"
                  >
                    Download File
                  </a>
                </button>
                <hr />
                <button className="option-item delete" onClick={handleDelete}>
                  <span className="option-icon">
                    <img src="/DeleteOutlined.svg" alt="" />
                  </span>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return null; // Fallback for unknown item types
  }
}

export default ItemCard;
