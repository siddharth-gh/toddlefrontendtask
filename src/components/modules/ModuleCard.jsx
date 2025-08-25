import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import boldSearch from '../../utils/boldSearch';

import ItemCard from './ItemCard';
import { useTheme } from '../../ThemeContext';

const ModuleCard = ({
  module,
  onModuleEdit,
  onModuleDelete,
  items,
  index,
  moveModule,
  onAddItem,
  onDeleteItem,
  searchExpanded,
  searchQuery,
  onEdit,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: module.id });

  const { darkMode } = useTheme();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // items of respective modules
  const moduleItems = items.filter(item => item.moduleId === module.id);

  // dropdown closing refs
  const optionsRef = useRef(null);
  const addMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setIsOptionsOpen(false);
      }

      if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
        setIsAddMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOptions = e => {
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    onModuleEdit(module);
    setIsOptionsOpen(false);
  };

  const handleDelete = () => {
    onModuleDelete(module.id);
    setIsOptionsOpen(false);
  };

  const toggleAddMenu = e => {
    e.stopPropagation();
    setIsAddMenuOpen(!isAddMenuOpen);
  };

  const handleAddClick = type => {
    onAddItem(module.id, type);
    setIsAddMenuOpen(false);
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform), // - converts object to valid css string
  };

  return (
    <div
      className={
        darkMode ? 'module-card-container dark' : 'module-card-container'
      }
      ref={setNodeRef}
      style={style}
      id={module.id}
      data-module-id={module.id}
    >
      <span {...attributes} {...listeners} className="drag-handle">
        <img
          src="/DragHandleOutlined.svg"
          alt=""
          draggable="false"
          style={{ pointerEvents: 'none' }}
        />
      </span>
      <div
        className={darkMode ? 'module-card dark' : 'module-card'}
        onClick={toggleExpanded}
      >
        <div className="module-content">
          <div className="module-icon">
            <span className={`icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          <div className="module-info">
            <h3 className="module-title">
              {boldSearch(module.name, searchQuery)}
            </h3>
            <p className="module-subtitle">
              {moduleItems.length === 0
                ? 'Add items to this module'
                : `${moduleItems.length} item${moduleItems.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="module-actions" ref={optionsRef}>
          <button className="btn-options" onClick={toggleOptions}>
            <span className="options-icon">⋮</span>
          </button>
          {isOptionsOpen && (
            <div className="options-menu">
              <button className="option-item" onClick={handleEdit}>
                <span className="option-icon">✏️</span>
                Edit module name
              </button>
              <button className="option-item delete" onClick={handleDelete}>
                <span className="option-icon">🗑️</span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {(isExpanded || searchExpanded) && (
        <div className="module-content-expanded">
          {moduleItems.length === 0 ? (
            <div className="empty-module-content">
              <p className="empty-module-message">
                No content added to this module yet.
              </p>
              <div className="add-item-container" ref={addMenuRef}>
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <span className="item-icon">🔗</span>
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <span className="item-icon">⬆️</span>
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="module-items">
              <div className="module-items-list">
                <SortableContext
                  items={moduleItems.map(i => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {/* generating list of items inside  module */}

                  {moduleItems.map(item => (
                    <ItemCard
                      key={item.id}
                      itemType={item.type}
                      item={item}
                      onDelete={onDeleteItem}
                      searchQuery={searchQuery}
                      onEdit={onEdit}
                    />
                  ))}
                </SortableContext>
              </div>
              <div className="add-item-container" ref={addMenuRef}>
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <span className="item-icon">🔗</span>
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <span className="item-icon">⬆️</span>
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
