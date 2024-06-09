
const ConfirmModal = ({ isOpen, onClose, onConfirm, advertisementId, newPlan }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Confirm Plan Change</h2>
                {newPlan === "20ads" &&
                    <div>
                        <p>Are you sure you want to change the plan to 20 ads/day?</p>
                        <p style={{fontSize: "15px", color: "#048a52"}}>You will be compensated for/charged in the next billing cycle.</p>
                    </div>
                }
                {newPlan === "40ads" &&
                    <div>
                        <p>Are you sure you want to change the plan to 40 ads/day?</p>
                        <p style={{fontSize: "15px", color: "#048a52"}}>You will be compensated for/charged in the next billing cycle.</p>
                    </div>
                }
                {newPlan === "60ads" &&
                    <div>
                        <p>Are you sure you want to change the plan to 60 ads/day?</p>
                        <p style={{fontSize: "15px", color: "#048a52"}}>You will be compensated for/charged in the next billing cycle.</p>
                    </div>
                }
                <div className="mt-4 flex justify-end space-x-2">
                    <button 
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="bg-[#048a52] hover:bg-[#048a52] text-white font-bold py-2 px-4 rounded-md"
                        onClick={() => onConfirm(advertisementId, newPlan)}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
