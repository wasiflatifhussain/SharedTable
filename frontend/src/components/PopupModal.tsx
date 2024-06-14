import './PopupModal.css';

const PopupModal = ({ show, onClose, ad }) => {
    if (!show) {
        return null;
    }

    const handleImageClick = () => {
        window.open(ad.imageUrl, '_blank');
    };

    return (
        <div className="modal-container">
            <div className="modal-bottom-left">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h1 style={{ cursor: 'pointer', marginBottom: "5px" }} onClick={handleImageClick}>Advertisement: Click to <br></br>learn more.</h1>
                <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    style={{ maxWidth: '100%', maxHeight: '50vh', cursor: 'pointer' }}
                    onClick={handleImageClick}
                />
            </div>
        </div>
    );
};

export default PopupModal;
