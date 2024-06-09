const ConfirmCancelModal = ({ isOpen, onClose, onConfirm, advertisementId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-10 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Confirm Plan Cancellation</h2>
                <p>Are you sure you want to cancel this plan?</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button 
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                        onClick={() => onConfirm(advertisementId)}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmCancelModal;