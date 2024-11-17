import { memo, useCallback, useEffect, useState } from "react";
import clickSound from "./ClickSound.m4a";

function Calculator({ workouts, allowSound }) {
  const [number, setNumber] = useState(workouts.at(0).numExercises);
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);
  //updating state based on other state
  const [duration, setDuration] = useState(0);

  // reactive values as it depends on allowsound props
  /**
   * Order of best way to use helper fxn in useEffect
   *
   * 1- move it outside component it is not have reactive value
   * 2- move it inside useEffect if it is not calling from any other fxn
   * 3- wrap in useCallback
   */
  // const playSound = useCallback(
  //   function () {
  //     if (!allowSound) return;
  //     //browser api
  //     const sound = new Audio(clickSound);
  //     sound.play();
  //   },
  //   [allowSound]
  // );

  useEffect(
    function () {
      setDuration((number * sets * speed) / 60 + (sets - 1) * durationBreak);
      // playSound();
    },
    [durationBreak, number, sets, speed]
  );

  /**
   * the another useEffect is needed becasuse on allowSound update it re creating the fxn and above useEffect hook is running
   * and reset the duration state and also playing the sound  which is not correct
   */
  useEffect(
    function () {
      const playSound = function () {
        if (!allowSound) return;
        //browser api
        const sound = new Audio(clickSound);
        sound.play();
      };
      playSound();
    },
    [allowSound, duration]
  );

  //closure
  //as duration and sets are not in array -> it will always the previous value of duration and sets evern on re render due to number (stale clourse -> showing old snapshot)
  //addding all respective dependicies will remove the stale closure
  useEffect(
    function () {
      console.log(duration, sets);
      document.title = `Your ${number}-exercie workout`;
    },
    [number]
  );

  // const duration = (number * sets * speed) / 60 + (sets - 1) * durationBreak;
  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  function handleInc() {
    setDuration((duration) => Math.floor(duration) + 1);
    // playSound();
  }

  function handleDec() {
    setDuration((duration) => (duration > 1 ? Math.ceil(duration) - 1 : 0));
    // playSound();
  }

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={(e) => setNumber(+e.target.value)}>
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => setDurationBreak(e.target.value)}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button
          onClick={() => {
            handleDec();
          }}
        >
          –
        </button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button
          onClick={() => {
            handleInc();
          }}
        >
          +
        </button>
      </section>
    </>
  );
}

export default memo(Calculator);
