import { useEffect } from 'react';
import './Modal.css';

const Modal = ({isVisible, setIsVisible, children}) => {

    useEffect(()=>{

        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } 
        else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };

    }, [isVisible]);

    return (
        <>
            {
                (isVisible)
                ?
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-close-icon" onClick={()=>setIsVisible(false)}></div>
                            <div className="p-4">
                                {children}
                            </div>
                        </div>
                    </div>
                :
                    null
            }
        </>
    )
}

export default Modal;