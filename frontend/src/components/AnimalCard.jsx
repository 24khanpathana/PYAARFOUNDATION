import React from 'react';
import './AnimalCard.css';

const AnimalCard = ({ animal, onClick }) => {
    return (
        <div className="animal-card card-theme" onClick={onClick}>
            <div className="animal-card-image-wrapper">
                <img src={animal.imageUrl} alt={animal.name} className="animal-card-image" />
            </div>
            <div className="animal-card-content">
                <h3 className="animal-card-name">{animal.name}</h3>
                <span className="animal-card-tag">{animal.tag}</span>
            </div>
        </div>
    );
};

export default AnimalCard;