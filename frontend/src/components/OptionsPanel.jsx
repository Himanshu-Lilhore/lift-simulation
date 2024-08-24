
export default function OptionsPanel({ lifts, floors, setLifts, setFloors }) {
    
    return (
        <div className="border-4 border-cyan-900 rounded-lg py-6 px-8 m-2 text-2xl w-fit content-center font-semibold max-h-36">
            <div className="flex whitespace-nowrap justify-between w-full">
                <label>No. of floors : </label>
                <input type='number'
                    className="text-right w-16"
                    value={floors}
                    onChange={(e) => setFloors((prev) => parseInt(e.target.value))}
                    required />
            </div>
            <div className="flex whitespace-nowrap justify-between w-full">
                <label>No. of lifts : </label>
                <input type='number'
                    className="text-right w-16"
                    value={lifts}
                    onChange={(e) => setLifts((prev) => parseInt(e.target.value))}
                    required />
            </div>

        </div>
    )
}