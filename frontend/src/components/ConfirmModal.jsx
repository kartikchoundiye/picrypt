// frontend/src/components/ConfirmModal.jsx

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs rounded-2xl">
      <div className="bg-[#0b1426]/95 rounded-xl shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_20px_rgba(0,217,245,0.2)] p-5 w-80 text-center border border-cyan-500/30 text-slate-200">
        <p className="text-sm font-medium mb-5 text-slate-100">{message}</p>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs font-semibold bg-red-600/90 hover:bg-red-600 text-white rounded-lg shadow-[0_0_12px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
          >
            Clear Form
          </button>

          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-xs font-semibold bg-[#16233b] hover:bg-[#1f3152] text-slate-300 hover:text-white rounded-lg border border-slate-700/60 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
