import { useState, useEffect, useRef } from 'react'
import './App.css'
import OptionsPanel from './components/OptionsPanel'
import Floor from './components/Floor'
import LiftBox from './components/LiftBox'

function App() {
	const [lifts, setLifts] = useState(2)
	const [floors, setFloors] = useState(3)
	const [taskCount, setTaskCount] = useState(0)
	const [trigger, setTrigger] = useState(new Date())
	const [animationEndsAt, setAnimationEndsAt] = useState([null, null])
	const [state, setState] = useState([
		{ targetFloor: 0, currentFloor: 0, direction: 0, stoppage: new Set(), fulfillment: true },
		{ targetFloor: 0, currentFloor: 0, direction: 0, stoppage: new Set(), fulfillment: true }
	]);
	const [inMotion, setInMotion] = useState([false, false]);
	let myTimer

	useEffect(() => {
		setState(prev => {
			return (
				Array(lifts).fill({
					targetFloor: 0,
					currentFloor: 0,
					direction: 0,  // -1 = going down || 0 = idle || 1 = going up
					fulfillment: true, // true = the current target floor has all tasks completed.
					stoppage: new Set()
				})
			)
		})
		setInMotion(prev => {
			return (Array(lifts).fill(false))
		})
	}, [lifts, floors])



	useEffect(() => {
		if (taskCount > 0) {
			let currState = [...state.map(val => {
				return ({ ...val })
			})];
			let currInMotion = [...inMotion];

			for (let lift = 0; lift < lifts; lift++) {
				let currLiftState = currState[lift]
				let currLiftInMotion = currInMotion[lift]
				if (!currLiftInMotion) {
					console.log(`${lift + 1} is motionless`)
					if (currLiftState.fulfillment) {
						console.log(`    ${lift + 1} is fulfilled`)
						if (currLiftState.stoppage.size) {
							console.log(`        ${lift + 1} has stoppage(s)`)
							currLiftState.fulfillment = false;
							const toFloor = Array.from(currLiftState.stoppage)[0]
							currLiftState.targetFloor = toFloor
							if (currLiftState.direction === 0) currLiftState.direction = Math.sign(toFloor - currLiftState.currentFloor)
							console.log(`            Moving lift ${lift + 1} to floor ${toFloor}`)
							let updatedstoppage = new Set(currLiftState.stoppage);
							updatedstoppage.delete(toFloor);
							currLiftState.stoppage = updatedstoppage;
							currLiftInMotion = true
						}
						else {
							if(currLiftState.direction) {
								currLiftState.direction = 0
								// setTaskCount(prev => prev - 1)
								// console.log(`Decreased task count`)
							}
						}
					}
					currState[lift] = currLiftState;
					currInMotion[lift] = currLiftInMotion;
				}
				else {
					console.log(`${lift + 1} is moving`)
					console.log(`${animationEndsAt[lift]} < ${(new Date())}`)
					if (animationEndsAt[lift] ? animationEndsAt[lift] < (new Date()) : currLiftState.targetFloor === currLiftState.currentFloor) {
						setAnimationEndsAt(prev => {
							const newEndsAt = [...prev];
							newEndsAt[lift] = null;
							return newEndsAt;
						})
						console.log(`    ${lift + 1}'s animation ended`)
						currLiftInMotion = false
						currLiftState.currentFloor = currLiftState.targetFloor
					}
					else {
						console.log(`    ${lift + 1} animation running, since ${animationEndsAt[lift]} > ${new Date()}`)
					}
				}
				currState[lift] = currLiftState;
				currInMotion[lift] = currLiftInMotion;
			}
			setState(currState)
			setInMotion(currInMotion)
		}
	}, [trigger])


	function findClosest(floor, direction) {
		let indexes = []
		let candidates = state.filter((element, index) => {
			if ((element.direction === direction) ||
				(element.direction === 0)) {
				indexes.push(index)
				return element
			}
		});
		console.log(`Candidate indexes : ${indexes}`)

		let minDistance = floors + 1;
		let closestLiftIndex = -1;

		for (let i = 0; i < candidates.length; i++) {
			const distance = Math.abs(candidates[i].targetFloor - floor);
			if (distance < minDistance) {
				minDistance = distance;
				closestLiftIndex = indexes[i];
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

	useEffect(() => {
		console.log(`task count : ${taskCount}`)
	}, [taskCount])

	useEffect(() => {
		if(!myTimer) {
			myTimer = setInterval(() => {
				if (taskCount > 0)
					setTrigger(new Date())
				else clearInterval(myTimer)
			}, 200)
		}
	}, [trigger])


	return (
		<>
			<div className=''>

				{/* Header */}
				<div className='flex justify-around content-center items-center my-6'>
					{/* <button className='border border-black' onClick={printState}>State</button>  //////////remove/////////// */}
					<h1 className='text-9xl font-sans font-bold mx-5 whitespace-pre-line'>Lift-simulation</h1>
					<OptionsPanel setLifts={setLifts} setFloors={setFloors} lifts={lifts} floors={floors} />
				</div>

				{/* Lift sim */}
				<div className='relative'>

					{/* floors */}
					{Array.from({ length: floors }).map((_, index) => (
						<Floor key={index} level={floors - index - 1} state={state} setState={setState} findClosest={findClosest} taskCount={taskCount} setTaskCount={setTaskCount} setTrigger={setTrigger} floors={floors} />
					))}

					{/* lifts */}
					<div
						className={`absolute left-36 top-0 h-full grid`}
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
										state={state}
										setState={setState}
										floors={floors}
										inMotion={inMotion}
										setInMotion={setInMotion}
										taskCount={taskCount}
										setTaskCount={setTaskCount}
										animationEndsAt={animationEndsAt}
										setAnimationEndsAt={setAnimationEndsAt} />
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
