import './LiftBox.css';
import React, { useEffect, useRef, useState } from 'react';

export default function LiftBox({ index, transitionLift, state, setState, floors, isOpen, setIsOpen }) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const liftRef = useRef(null);
    let animationTime = 2
    if(index<state.length)
        animationTime = `${Math.abs(state[index].previousFloor - state[index].currentFloor) * 2}`

    function open() {
        setIsOpen(prev => {
            let newArr = [...prev]
            newArr[index] = true
            return newArr
        })
        setTimeout(() => {
            close()
        }, 2500)
    }

    function close() {
        setTimeout(() => {
            setIsOpen(prev => {
                let newArr = [...prev]
                newArr[index] = false
                return newArr
            })
            if(state[index].stoppage.size !== 0){
                transitionLift(index, Array.from(state[index].stoppage)[0])
            }
            else {
                setState(prev => {
                    let updatedState = [...prev]
                    updatedState[index] = { ...updatedState[index], previousFloor: updatedState[index].currentFloor, direction:0 };
                    return updatedState;
                  })
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
            className={`liftbox absolute m-5 border-y-[1.2rem] border-x-4 border-black w-20 h-32 rounded-sm overflow-hidden ${isOpen[index] ? '' : 'active'}`}
            style={{
                left: '0%',
                bottom: `${((state[index] && state[index].currentFloor) / floors) * 100}%`,
                transition: `all ${animationTime}s ease-in-out`
            }}
        />
    );
}
