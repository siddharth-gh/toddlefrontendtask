import { useState, useRef, useEffect } from 'react';
import { Element } from 'react-scroll';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';
import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleModal from './ModuleModal';
import UploadModal from './UploadModal';
import ItemCard from './ItemCard';

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';

import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Outline from './Outline';
import { isValidUrl } from '../../utils/validURL';

const CourseBuilder = () => {
  const [modules, setModules] = useState([
    {
      id: 'm-1',
      name: 'HTML5',
    },
    {
      id: 'm-2',
      name: 'CSS5',
    },
    {
      id: 'm-3',
      name: 'JS ES6',
    },
    {
      id: 'm-4',
      name: 'React.JS',
    },
    {
      id: 'm-5',
      name: 'AI/ML',
    },
  ]);

  const [items, setItems] = useState([
    {
      id: 'i-1',
      moduleId: null,
      type: 'link',
      title: 'Introduction',
      url: 'https://google.com',
    },
    {
      id: 'i-2',
      moduleId: 'm-1',
      type: 'upload',
      title: 'Chapter 1 Notes',
      url: 'https://example.com/file1.pdf',
    },
    {
      id: 'i-3',
      moduleId: 'm-2',
      type: 'link',
      title: 'CSS Basics',
      url: 'https://css-tricks.com',
    },
    {
      id: 'i-4',
      moduleId: 'm-2',
      type: 'upload',
      title: 'CSS Reference',
      url: 'https://example.com/file2.pdf',
    },
    {
      id: 'i-5',
      moduleId: 'm-3',
      type: 'link',
      title: 'JS ES6 Tutorial',
      url: 'https://developer.mozilla.org',
    },
    {
      id: 'i-6',
      moduleId: 'm-3',
      type: 'upload',
      title: 'JS Examples',
      url: 'https://example.com/file3.pdf',
    },
    {
      id: 'i-7',
      moduleId: 'm-4',
      type: 'link',
      title: 'React Docs',
      url: 'https://reactjs.org',
    },
    {
      id: 'i-8',
      moduleId: 'm-4',
      type: 'upload',
      title: 'React Components',
      url: 'https://example.com/file4.pdf',
    },
    {
      id: 'i-9',
      moduleId: 'm-5',
      type: 'link',
      title: 'AI/ML Overview',
      url: 'https://ai.google',
    },
    {
      id: 'i-10',
      moduleId: null,
      type: 'upload',
      title: 'ML Models',
      url: 'https://example.com/file5.pdf',
    },
  ]);

  // <----  using dnd-kit sensors for mobile support   --->
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 180, // milliseconds
      tolerance: 5, // px
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState([]);

  // search query states
  const [searchQuery, setSearchQuery] = useState('');

  // dark mode state with true/false
  const [darkMode, setDarkMode] = useState(false);

  // Current modules for editing
  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  // Current items for editing
  const [currentFile, setCurrentFile] = useState(null);
  const [currentLink, setCurrentLink] = useState(null);

  // filter modules if searchquery exists, else show all
  const filteredModules =
    searchQuery.trim() === ''
      ? modules
      : modules.filter(module => {
          const moduleMatch = module.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          const hasMatchingItem = items.some(
            item =>
              item.moduleId === module.id &&
              item.title.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return moduleMatch || hasMatchingItem;
        });

  const filteredItems =
    searchQuery.trim() === ''
      ? items.filter(item => item.moduleId === null)
      : items.filter(
          item =>
            item.moduleId === null &&
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setExpandedModules([]);
      return;
    }

    const toggleTheme = () => {
      setDarkMode(prev => !prev);
      console.log(darkMode);
    };

    const matchedIDs = modules
      .filter(module =>
        items.some(
          item =>
            item.moduleId === module.id &&
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .map(module => module.id);

    setExpandedModules(matchedIDs);
  }, [searchQuery, modules, items]);

  const handleAddClick = type => {
    switch (type) {
      case 'module':
        setCurrentModule(null);
        setIsModuleModalOpen(true);
        break;
      case 'link':
        setCurrentModule(null);
        setIsLinkModalOpen(true);
        break;
      case 'upload':
        setCurrentModule(null);
        setIsUploadModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveModule = module => {
    if (!module.name || module.name.trim() === '') {
      toast.error("Module name can't be empty!");
      return;
    }
    if (
      modules.some(
        m =>
          m.name.toLowerCase() === module.name.toLowerCase() &&
          m.id !== module.id
      )
    ) {
      toast.error('Module name already exists...');
      return;
    }

    if (currentModule) {
      setModules(modules.map(m => (m.id === module.id ? module : m)));
      toast.success('Module updated successfully!');
    } else {
      setModules([...modules, module]);
      toast.success('Module added successfully!');
    }

    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleSaveLink = linkItem => {
    if (!linkItem.title.trim()) {
      toast.error("Link title can't be empty!");
      return;
    }
    if (!isValidUrl(linkItem.url)) {
      toast.error('Invalid URL!');
      return;
    }

    setItems(prev =>
      prev.some(item => item.id === linkItem.id)
        ? prev.map(item => (item.id === linkItem.id ? linkItem : item))
        : [...prev, linkItem]
    );

    setIsLinkModalOpen(false);
    setCurrentLink(null);
    setCurrentModuleId(null);
    toast.success('Link saved!');
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  const handleSaveUpload = fileItem => {
    if (!fileItem.title.trim()) {
      toast.error('File name cannot be empty!');
      return;
    }
    if (!isValidUrl(fileItem.url)) {
      toast.error('Invalid file URL!');
      return;
    }

    setItems(prev =>
      prev.some(item => item.id === fileItem.id)
        ? prev.map(item => (item.id === fileItem.id ? fileItem : item))
        : [...prev, fileItem]
    );

    setIsUploadModalOpen(false);
    setCurrentFile(null);
    setCurrentModuleId(null);
    toast.success('File saved!');
  };

  const handleEditItem = item => {

    if (item.type === 'link') {
      setCurrentLink(item);
      setCurrentModuleId(item.moduleId);
      setIsLinkModalOpen(true);
    } else if (item.type === 'upload') {
      setCurrentFile(item);
      setCurrentModuleId(item.moduleId);
      setIsUploadModalOpen(true);
    }
  };

  const handleDeleteModule = moduleId => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;

    setModules(modules.filter(module => module.id !== moduleId));
    setItems(items.filter(item => item.moduleId !== moduleId));
    toast.success('Module deleted successfully');
  };

  const handleDeleteItem = itemId => {
    setItems(items.filter(item => item.id !== itemId));
    toast.success('Item deleted successfully');
  };

  const handleDragEnd = event => {
    const { active, over } = event;
    if (!over) return;

    // for sorting modules
    if (modules.find(m => m.id === active.id)) {
      if (active.id !== over.id) {
        setModules(prev => {
          const oldIndex = prev.findIndex(m => m.id === active.id);
          const newIndex = prev.findIndex(m => m.id === over.id);
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
      return;
    }

    // for moving items
    const activeItem = items.find(i => i.id === active.id);
    if (!activeItem) return;

    const overItem = items.find(i => i.id === over.id);
    const overModule = modules.find(m => m.id === over.id);
    const isDropZone = over.id === 'independent-drop-zone';

    const newModuleId = overItem
      ? overItem.moduleId
      : overModule
        ? overModule.id
        : isDropZone
          ? null
          : activeItem.moduleId;

    setItems(prev => {
      const updated = [...prev];

      const oldIndexGlobal = updated.findIndex(i => i.id === active.id);
      updated[oldIndexGlobal] = {
        ...updated[oldIndexGlobal],
        moduleId: newModuleId,
      };

      // reordering in database
      const itemsInTarget = updated.filter(i => i.moduleId === newModuleId);
      const oldIndexInModule = itemsInTarget.findIndex(i => i.id === active.id);
      const newIndexInModule = overItem
        ? itemsInTarget.findIndex(i => i.id === over.id)
        : itemsInTarget.length - 1;

      const reordered = arrayMove(
        itemsInTarget,
        oldIndexInModule,
        newIndexInModule
      );

      // final merge
      const rest = updated.filter(i => i.moduleId !== newModuleId);
      return [...rest, ...reordered];
    });
  };

  return (
    <div className="course-builder">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="left">
        <Header
          onAddClick={handleAddClick}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <div className="builder-content">
            {modules.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="module-list">
                <SortableContext
                  items={modules}
                  strategy={verticalListSortingStrategy}
                >
                  {/*making  Modules List */}
                  {filteredModules.map((module, index) => (
                    <Element key={module.id} name={module.id}>
                      <ModuleCard
                        key={module.id}
                        module={module}
                        items={items}
                        index={index}
                        onModuleEdit={handleEditModule}
                        onModuleDelete={handleDeleteModule}
                        onAddItem={handleAddItem}
                        onDeleteItem={handleDeleteItem}
                        onEdit={handleEditItem}
                        searchExpanded={expandedModules.includes(module.id)}
                        searchQuery={searchQuery}
                      />
                    </Element>
                  ))}
                </SortableContext>

                <SortableContext
                  items={filteredItems}
                  strategy={verticalListSortingStrategy}
                >
                  {/* making Independent Items list*/}
                  {filteredItems
                    .filter(item => item.moduleId == null)
                    .map((item, index) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        index={index}
                        itemType={item.type}
                        onDelete={handleDeleteItem}
                        onEdit={handleEditItem}
                        searchQuery={searchQuery}
                        setCurrentLink={setCurrentLink}
                        setCurrentFile={setCurrentFile}
                      />
                    ))}
                </SortableContext>
              </div>
            )}
          </div>
        </DndContext>
      </div>
      {modules.length > 1 && (
        <div className="right">
          <Outline modules={modules} />
        </div>
      )}

      {/* Module Modal */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        onSave={handleSaveModule}
        module={currentModule}
      />

      {/* Link Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
        link={currentLink}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
        file={currentFile?.id ? currentFile : null}
      />
    </div>
  );
};

export default CourseBuilder;
