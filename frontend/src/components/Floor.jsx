import upButton from '../assets/up-button.png';
import { useState, useEffect } from 'react'
import './Floor.css'

export default function Floor({ level, state, setState, findClosest, taskCount, setTaskCount, setTrigger, floors }) {
    const [keyState, setKeyState] = useState({ up: false, down: false })
    const [handlers, setHandlers] = useState({ up: 0, down: 0 })

    useEffect(() => {
        if (keyState.up && state[handlers.up].currentFloor === level) {
            setKeyState(prev => { return ({ ...prev, up: !prev.up }) })
        }
    }, [state, handlers.up])

    useEffect(() => {
        if (keyState.down && state[handlers.down].currentFloor === level) {
            setKeyState(prev => { return ({ ...prev, down: !prev.down }) })
        }
    }, [state, handlers.down])


    function handleUp() {
        if (level !== floors-1 && !keyState.up) {
            setKeyState(prev => { return ({ ...prev, up: !prev.up }) })
            setTaskCount(prev => prev + 1)
            console.log(`Updated task count`)
            console.log(`Handling UP for level ${level}`)
            const closest = findClosest(level, 1);
            console.log("closest : ", closest)
            if (closest !== -1) {
                setHandlers(prev => { return { ...prev, up: closest } })
                setState(prev => {
                    const newState = [...prev];
                    const updatedStoppage = new Set(newState[closest].stoppage);
                    updatedStoppage.add(level);
                    newState[closest] = { ...newState[closest], stoppage: updatedStoppage };
                    console.log(`Added stoppage to ${closest + 1}`);
                    return newState;
                });

                setTrigger(new Date())
            }
        }
    }

    function handleDown() {
        if (level !== 0 && !keyState.down) {
            setKeyState(prev => { return ({ ...prev, down: !prev.down }) })
            setTaskCount(prev => prev + 1)
            console.log(`Updated task count`)
            console.log(`Handling DOWN for level ${level}`)
            const closest = findClosest(level, -1);
            console.log("closest : ", closest)
            if (closest !== -1) {
                setHandlers(prev => { return { ...prev, down: closest } })
                setState(prev => {
                    const newState = [...prev];
                    const updatedStoppage = new Set(newState[closest].stoppage);
                    updatedStoppage.add(level);
                    newState[closest] = { ...newState[closest], stoppage: updatedStoppage };
                    console.log(`Added stoppage to ${closest + 1}`);
                    return newState;
                });

                setTrigger(new Date())
            }
        }
    }

    return (
        <div className="w-full relative">
            <div className="absolute top-10 left-[40rem] text-6xl opacity-15 font-bold"> {level === 0 ? 'Ground' : `Level-${level}`} </div>

            <div className="flex flex-col p-4 gap-1">
                <div className={`${level === floors-1 && 'opacity-10'} liftBtn h-14 w-14 p-1 rounded-full ${keyState.up ? 'bg-red-600/90 neon-glow' : ''}`} onClick={handleUp}>
                    <img src={upButton} alt="Up Button" />
                </div>

                <div className={`${level === 0 && 'opacity-10'} liftBtn h-14 w-14 p-1 rounded-full ${keyState.down ? 'bg-red-600/90 neon-glow' : ''}`} onClick={handleDown}>
                    <img className='rotate-180' src={upButton} alt="Down Button" />
                </div>

            </div>

            <div className="border-2 border-black w-full"></div>
        </div>
    )
}