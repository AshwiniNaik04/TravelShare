import "./Modal.css";

const Modal = (props) => {
  if (!props.show) return null;

  return (
    <>
      {/*  Backdrop */}
      <div className="backdrop" onClick={props.onCancel}></div>

      <div className="modal">
        <header className="modal__header">
          <h2>{props.header}</h2>
        </header>

        <div className="modal__content">
          {props.children}
        </div>

        <footer className="modal__footer">
          {props.footer}
        </footer>
      </div>
    </>
  );
};

export default Modal;