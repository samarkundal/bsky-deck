import React from 'react';
import './Modal.scss';
import { TbX } from 'react-icons/tb';
import { motion } from 'framer-motion';

export default function Modal({ children, open, onClose, title }) {
  const handleClose = () => {
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="modal-core">
      <div className="modal-overlay"></div>
      <motion.div
        className="modal-content"
        initial={{ opacity: 1, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="close-icon">
          <TbX size={20} onClick={handleClose} />
        </div>
        {title && (
          <div className="modal-header">
            <h3>{title}</h3>
          </div>
        )}
        <div className="modal-children">{children}</div>
      </motion.div>
    </div>
  );
}
