// frontend/src/components/ConfirmModal.jsx

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-5 w-72 text-center border">
        <p className="text-sm mb-4">{message}</p>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear
          </button>

          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
