import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  title: string;
  content: ReactNode;
  onClose: () => void;
  actions: Array<{
    label: string;
    onClick: () => void;
  }>;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  content,
  onClose,
  actions,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <div className="mb-4">{content}</div>

        <div className="flex justify-end">
          {actions.map((action, index) => (
            <button
              className="ml-2 px-4 py-2 bg-dark-blue text-white rounded"
              key={index}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
        <button className='absolute top-2 right-2' onClick={onClose}>
          &times;
        </button>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default Modal;
