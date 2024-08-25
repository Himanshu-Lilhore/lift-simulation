import { useState, useEffect, useRef } from 'react'
import './App.css'
import OptionsPanel from './components/OptionsPanel'
import Floor from './components/Floor'
import LiftBox from './components/LiftBox'

function App() {
  const [lifts, setLifts] = useState(2)
  const [floors, setFloors] = useState(2)
  const [trigger, setTrigger] = useState(new Date())
  const [state, setState] = useState([
    { previousFloor: 0, currentFloor: 0, direction: 0, stoppage: new Set() },
    { previousFloor: 0, currentFloor: 0, direction: 0, stoppage: new Set() }
  ]);
  const [isOpen, setIsOpen] = useState([false, false]);

  useEffect(() => {
    setState(prev => {
      return (
        Array(lifts).fill({
          previousFloor: 0,
          currentFloor: 0,
          direction: 0,  // -1 = going down || 0 = idle || 1 = going up
          stoppage: new Set()
        })
        //   Array.from({ length: lifts }).map(index => {
        //   return ({
        //     previousFloor: 0,
        //     currentFloor: 0,
        //     direction: 0,  // -1 = going down || 0 = idle || 1 = going up
        //     stoppage: new Set()
        //   })
        // })
      )
    })
    setIsOpen(prev => {
      return (Array(lifts).fill(false))
    })
  }, [lifts, floors])


  useEffect(() => {
    console.log(`Trigger updated`)
    for (let lift = 0; lift < lifts; lift++) {
      if (state[lift].direction === 0) {
        if (state[lift].stoppage.size !== 0) {
          if (state[lift].currentFloor !== Array.from(state[lift].stoppage)[0]) {
            setState(prev => {
              let updatedState = [...prev]
              const liftState = prev[lift]
              const toFloor = Array.from(liftState.stoppage)[0]
              console.log("to floor : ", toFloor)
              let updatedstoppage = new Set(liftState.stoppage);
              updatedstoppage.delete(toFloor);
              updatedState[lift] = { ...updatedState[lift], direction: liftState.currentFloor > toFloor ? -1 : 1, currentFloor: toFloor, previousFloor: liftState.currentFloor, stoppage: updatedstoppage };
              console.log("updating state @1");
              return updatedState
            })
          } else {
            setState(prev => {
              let updatedState = [...prev]
              const liftState = prev[lift]
              let updatedstoppage = new Set(liftState.stoppage);
              updatedstoppage.delete(state[lift].currentFloor);
              updatedState[lift] = { ...updatedState[lift], direction: 0, stoppage: updatedstoppage, previousFloor: liftState.currentFloor };
              console.log("updating state @2");
              return updatedState
            })
          }
        }
      }
    }
  }, [trigger])


  function findClosest(floor, direction) {
    let directionalCandidates = state.filter(element => element.direction === direction);
    let idleCandidates = state.filter(element => element.direction === 0);

    let candidates = [...directionalCandidates, ...idleCandidates];

    let minDistance = floors + 1;
    let closestLiftIndex = -1;

    for (let i = 0; i < candidates.length; i++) {
      const distance = Math.abs(candidates[i].currentFloor - floor);
      if (distance < minDistance) {
        minDistance = distance;
        closestLiftIndex = i;
      }
    }

    return closestLiftIndex;
  }

  function printState() {
    console.log("State : ")
    state.forEach(val => { console.log(val) })
  }

  useEffect(() => {
    printState()
  }, [state])



  function transitionLift(liftIdx, toFloor) {
    setState(prev => {
      let updatedState = [...prev]
      const lift = prev[liftIdx];
      let updatedstoppage = new Set(lift.stoppage);
      updatedstoppage.delete(lift.currentFloor);
      updatedState[liftIdx] = { ...updatedState[liftIdx], currentFloor: toFloor, previousFloor: liftState.currentFloor, stoppage: updatedstoppage };
      return updatedState;
    })
  }

  // setTimeout(() => {
  //   transitionLift(0, 1)
  // }, 2000)

  return (
    <>
      <div className=''>

        {/* Header */}
        <div className='flex justify-around content-center items-center my-6'>
          <button className='border border-black' onClick={printState}>State</button>  {/* //////////remove/////////// */}
          <h1 className='text-9xl font-sans font-bold mx-5 whitespace-pre-line'>Lift-simulation</h1>
          <OptionsPanel setLifts={setLifts} setFloors={setFloors} lifts={lifts} floors={floors} />
        </div>

        {/* Lift sim */}
        <div className='relative'>

          {/* floors */}
          {Array.from({ length: floors }).map((_, index) => (
            <Floor key={index} level={floors - index - 1} setState={setState} findClosest={findClosest} setTrigger={setTrigger} />
          ))}

          {/* lifts */}
          <div
            className={`absolute left-36 top-0 border-2 border-red-400 h-full grid`}
            style={{
              gridTemplateColumns: `repeat(${lifts}, 1fr)`,
              gridTemplateRows: `1fr`
            }}
          >
            {Array.from({ length: lifts }).map((_, index) => {
              return (
                <div
                  className='relative w-28 h-full'
                  key={index}
                  style={{ gridArea: `1/${index + 1}/2/${index + 2}` }}>
                  <LiftBox
                    index={index}
                    transitionLift={transitionLift}
                    state={state}
                    setState={setState}
                    floors={floors}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen} />
                </div>
              )
            }
            )}
          </div>
        </div>

      </div>
    </>
  )
}

export default App
