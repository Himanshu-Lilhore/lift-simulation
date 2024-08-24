import { useState, useEffect, useRef } from 'react'
import './App.css'
import OptionsPanel from './components/OptionsPanel'
import Floor from './components/Floor'
import LiftBox from './components/LiftBox'

function App() {
  const [lifts, setLifts] = useState(2)
  const [floors, setFloors] = useState(2)
  const [state, setState] = useState([
    { currentFloor: 0, direction: 0, stoppage: new Set() },
    { currentFloor: 0, direction: 0, stoppage: new Set() }
  ]);

  useEffect(() => {
    setState(prev => {
      return (Array.from({ length: lifts }).map(index => {
        return ({
          currentFloor: 0,
          direction: 0,  // -1 = going down || 0 = idle || 1 = going up
          stoppage: new Set()
        })
      }))
    })
  }, [lifts, floors])


  useEffect(() => {
    console.log(`State updated`)
    state.forEach(val => {console.log(val)})
    // for(let lift=0; lift<lifts; lift++){
    //   if(lifts[lift].direction === 0){

    //   }
    // }
  }, [state])


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





  function transitionLift(liftIdx, toFloor) {
    setState(prev => {
      let updatedState = [...prev]
      const lift = prev[liftIdx];
      let updatedstoppage = new Set(lift.stoppage);
      updatedstoppage.delete(lift.currentFloor);
      updatedState[liftIdx] = { ...updatedState[liftIdx], currentFloor: toFloor, stoppage: updatedstoppage };
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
          <h1 className='text-9xl font-sans font-bold mx-5 whitespace-pre-line'>Lift-simulation</h1>
          <OptionsPanel setLifts={setLifts} setFloors={setFloors} lifts={lifts} floors={floors} />
        </div>

        {/* Lift sim */}
        <div className='relative'>

          {/* floors */}
          {Array.from({ length: floors }).map((_, index) => (
            <Floor key={index} level={floors - index - 1} setState={setState} findClosest={findClosest} />
          ))}

          {/* lifts */}
          <div
            className={`absolute left-36 top-0 border-2 border-red-400 h-full grid`}
            style={{
              gridTemplateRows: `repeat(${floors}, 1fr)`,
              gridTemplateColumns: `repeat(${lifts}, 1fr)`,
              transition: 'all 2.5s linear'
            }}
          >
            {Array.from({ length: lifts }).map((_, index) => {
              return <div
                className='relative w-28 h-full'
                style={{ gridArea: `1/${index + 1}/-1/${index + 2}` }}
                key={index}>
                <LiftBox
                  index={index}
                  transitionLift={transitionLift}
                  state={state}
                  setState={setState}
                  style={{
                    left: '0%',
                    bottom: `${((state[index] && state[index].currentFloor) / floors) * 100}%`,
                    transition: 'all 2s linear'
                  }} />
              </div>
            }
            )}
          </div>
        </div>

      </div>
    </>
  )
}

export default App
