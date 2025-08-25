import { useState, useEffect } from 'react';

const UploadModal = ({ isOpen, onClose, onSave, moduleId, file = null }) => {
  const [fileTitle, setFileTitle] = useState(file ? file.title : '');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setFileTitle(file ? file.title : '');
    setSelectedFile(null);
  }, [file, isOpen]);

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (file) {
      // renaming
      onSave({ ...file, title: fileTitle.trim() });
    } else {
      // adding new file
      onSave({
        id: Date.now().toString(),
        moduleId,
        type: 'upload',
        title: fileTitle.trim(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
      });
    }

    setFileTitle('');
    setSelectedFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{file ? 'Rename file' : 'Upload file'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="file-title">File name</label>
              <input
                id="file-title"
                type="text"
                value={fileTitle}
                onChange={e => setFileTitle(e.target.value)}
                placeholder="File title"
                className="form-input"
                autoFocus
              />
            </div>

            {!file && (
              <div className="form-group">
                <label htmlFor="file-upload">Select file</label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                />
                {selectedFile && (
                  <div className="selected-file">
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">
                      ({Math.round(selectedFile.size / 1024)} KB)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={!fileTitle.trim() || (!file && !selectedFile)}
            >
              {file ? 'Save' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
