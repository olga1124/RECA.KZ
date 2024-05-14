import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface CloseButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <button className="popup-close-btn" onClick={onClick}>
      <FaTimes />
    </button>
  );
};

export default CloseButton;
