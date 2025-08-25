const EmptyState = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-illustration">
        <img
          src="../src/assets/Resources.svg"
          alt="Empty illustration"
          className="empty-state-image"
        />
      </div>
      <h2 className="empty-state-title">Nothing added here yet</h2>
      <p className="empty-state-description">
        Click on the [+] Add button to add items to this course
      </p>
    </div>
  );
};

export default EmptyState;
