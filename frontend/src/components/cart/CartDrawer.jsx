export const CartDrawer = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close cart drawer"
          className="fixed inset-0 z-40 cursor-default bg-black/50"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-96 max-w-full overflow-y-auto bg-base-100 shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <button
            type="button"
            className="btn btn-ghost btn-circle absolute right-4 top-4"
            onClick={onClose}
            aria-label="Close cart drawer"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </>
  );
};
