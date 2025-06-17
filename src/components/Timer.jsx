import { useState, useRef, useEffect } from 'react';
import alarmSound from '../assets/alarm.mp3';

function Timer() {
  const [inputSeconds, setInputSeconds] = useState(30); // 기본 30초
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev === 1) {
            audioRef.current?.play(); // 종료 시 알람!
            setIsRunning(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStart = () => {
    if (remaining === 0) {
      setRemaining(inputSeconds);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setRemaining(0);
  };

  return (
    <div>
      <h3>⏱️ 타이머</h3>
      <div>
        <label>시간 (초): </label>
        <input
          type="number"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(Number(e.target.value))}
          disabled={isRunning}
        />
      </div>

      <h2 style={{ margin: '1rem 0' }}>{remaining > 0 ? remaining : 0}초</h2>

      <button onClick={handleStart} disabled={isRunning}>시작</button>
      <button onClick={handlePause} disabled={!isRunning}>일시정지</button>
      <button onClick={handleReset}>초기화</button>

      <audio ref={audioRef}>
        <source src={alarmSound} type="audio/mp3" />
      </audio>
    </div>
  );
}

export default Timer;