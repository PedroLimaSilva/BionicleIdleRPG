import './index.scss';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  classNames: string;
};

export function Modal({ children, onClose, classNames }: ModalProps) {
  return (
    <div className={`modal-backdrop ${classNames}`} onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close-button' onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
