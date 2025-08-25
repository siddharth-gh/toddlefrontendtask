import { useState, useEffect } from 'react';

const LinkModal = ({
  isOpen,
  onClose,
  onSave,
  moduleId,
  setCurrentLink,
  link = null,
}) => {
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    setLinkTitle(link ? link.title : '');
    setLinkUrl(link ? link.url : '');
  }, [link, isOpen]);

  const handleSubmit = e => {
    e.preventDefault();

    if (link) {
      onSave({ ...link, title: linkTitle.trim(), url: linkUrl.trim() });
    } else {
      onSave({
        id: Date.now().toString(),
        moduleId,
        type: 'link',
        title: linkTitle.trim(),
        url: linkUrl.trim(),
      });
    }

    setLinkTitle('');
    setLinkUrl('');
    setCurrentLink(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{link ? 'Edit link' : 'Add a link'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="link-title">Link title</label>
              <input
                id="link-title"
                type="text"
                value={linkTitle}
                onChange={e => setLinkTitle(e.target.value)}
                placeholder="Link title"
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="link-url">URL</label>
              <input
                id="link-url"
                type="text"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="form-input"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={!linkTitle.trim() || !linkUrl.trim()}
            >
              {link ? 'Save' : 'Add link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;
