import './LiftBox.css';
import React, { useEffect, useRef, useState } from 'react';

export default function LiftBox({ index, state, setState, floors, inMotion, setInMotion, animationEndsAt, setAnimationEndsAt, taskCount, setTaskCount }) {
    const [isOpen, setIsOpen] = useState(false)
    const doorMotion = 2500, doorPause = 200, timeBtwFloors = 2000  // time in ms
    const [totalAniTime, setTotalAniTime] = useState(2000)

    useEffect(() => {
        if (state[index] && state[index].targetFloor !== state[index].currentFloor) {
            const tt = Math.abs(state[index].targetFloor - state[index].currentFloor) * timeBtwFloors
            console.log(`tt : ${tt}`)
            setTotalAniTime(tt)
            setAnimationEndsAt(prev => {
                const newEndsAt = [...prev];
                newEndsAt[index] = new Date((new Date()).getTime() + tt);
                console.log(`${index + 1} Setting animation end at ${((new Date()).getTime() + tt)}`);
                return newEndsAt;
            })
        }
    }, [inMotion[index]])

    useEffect(() => {
        console.log(`totalAniTime : ${totalAniTime}`)
    }, [totalAniTime])


    useEffect(() => {
        if (state[index] && !inMotion[index] && !state[index].fulfillment && !isOpen) {
            setIsOpen(true);
            
            setTimeout(() => {
                setIsOpen(false)
                setState(prev => {
                    const newState = [...prev];
                    newState[index] = { ...newState[index], fulfillment: true };
                    return newState;
                })
                setTaskCount(prev => prev - 1)
                console.log(`Decreased task count`)
            }, (doorMotion + doorPause + doorMotion))
        }
    }, [inMotion[index], state])


    return (
        <div
            className={`${!isOpen && 'active'} liftbox absolute m-3 border-y-[1.2rem] border-x-4 border-black w-20 h-32 rounded-sm overflow-hidden`}
            style={{
                left: '0%',
                bottom: `${(state[index]) && (((inMotion[index] ? state[index].targetFloor : state[index].currentFloor) / floors) * 100)}%`,
                transition: `all ${totalAniTime}ms ease-in-out`
            }}
        />
    );
}
