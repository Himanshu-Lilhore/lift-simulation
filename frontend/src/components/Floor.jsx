import upButton from '../assets/up-button.png';

export default function Floor({ level, setState, findClosest, setTrigger }) {

    function handleUp() {
        setTrigger(new Date())
        console.log(`Handling UP for level ${level}`)
        const closest = findClosest(level, 1);
        console.log("closest : ", closest)
        if (closest !== -1) {
            setState(prev => {
                return prev.map((lift, index) => {
                    if (index === closest) {
                        const updatedstoppage = new Set(lift.stoppage);
                        updatedstoppage.add(level);
                        console.log(updatedstoppage)
                        
                        return {
                            ...lift,
                            stoppage: updatedstoppage
                        };
                    }
                    return lift;
                });
            });
        }
    }
    
    function handleDown() {
        setTrigger(new Date())
        console.log(`Handling DOWN for level ${level}`)
        const closest = findClosest(level, -1);
        console.log("closest : ", closest)
        if (closest !== 1) {
            setState(prev => {
                return prev.map((lift, index) => {
                    if (index === closest) {
                        const updatedstoppage = new Set(lift.stoppage);
                        updatedstoppage.add(level);
                        console.log(updatedstoppage)
    
                        return {
                            ...lift,
                            stoppage: updatedstoppage
                        };
                    }
                    return lift;
                });
            });
        }
    }

    return (
        <div className="w-full relative">
            <div className="absolute top-10 left-[40rem] text-6xl opacity-15 font-bold"> {level === 0 ? 'Ground' : `Level-${level}`} </div>

            <div className="flex flex-col p-4">
                <div className='h-16 w-16' onClick={handleUp}>
                    <img src={upButton} />
                </div>
                <div className='h-16 w-16' onClick={handleDown}>
                    <img className='rotate-180' src={upButton} />
                </div>

            </div>

            <div className="border-2 border-black w-full"></div>
        </div>
    )
}