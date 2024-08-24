import './LiftBox.css';
import React, { useEffect, useRef, useState } from 'react';

export default function LiftBox({ style, index, transitionLift, state, setState }) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const liftRef = useRef(null);

    function open() {
        setIsOpen(true)
        setTimeout(() => {
            close()
        }, 2500)
    }

    function close() {
        setTimeout(() => {
            setIsOpen(false)
            if(state[index].stoppage.size !== 0){
                transitionLift(index, stoppage[0])
            }
        }, 2500)
    }

    useEffect(() => {
        const liftElement = liftRef.current;
      
        const handleTransitionStart = (event) => {
          if (event.propertyName === 'transform' || event.propertyName === 'top' || event.propertyName === 'bottom') {
            setIsTransitioning(true);
          }
        };
      
        const handleTransitionEnd = (event) => {
          if (event.propertyName === 'transform' || event.propertyName === 'top' || event.propertyName === 'bottom') {
            setIsTransitioning(false);
            open();
          }
        };
      
        liftElement.addEventListener('transitionstart', handleTransitionStart);
        liftElement.addEventListener('transitionend', handleTransitionEnd);
      
        return () => {
          liftElement.removeEventListener('transitionstart', handleTransitionStart);
          liftElement.removeEventListener('transitionend', handleTransitionEnd);
        };
      }, []);
      

    return (
        <div
            ref={liftRef}
            className={`liftbox absolute m-5 border-y-[1.2rem] border-x-4 border-black w-20 h-32 rounded-sm overflow-hidden ${isOpen ? '' : 'active'}`}
            style={style}
        />
    );
}
