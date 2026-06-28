import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './AnimalDetailModal.css';

const AnimalDetailModal = ({ animal, onClose }) => {
    // Prevent background scroll when modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content card-theme" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                <div className="modal-body">
                    <img src={animal.imageUrl} alt={animal.name} className="modal-image" />
                    <div className="modal-details">
                        <h2 className="modal-name">{animal.name}</h2>
                        <p><strong>Age:</strong> {animal.age}</p>
                        <p><strong>Breed:</strong> {animal.breed}</p>
                        <p><strong>Health:</strong> {animal.healthStatus}</p>
                        <h3 className="modal-story-title">Rescue Story</h3>
                        <p className="modal-story">{animal.story}</p>
                        <button className="button-primary adoption-contact-btn">
                            Inquire About Adoption
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimalDetailModal;