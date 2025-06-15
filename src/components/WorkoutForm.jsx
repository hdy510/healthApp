import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

function WorkoutForm({ onAdd }) {
  const [date, setDate] = useState(null);
  const [exercise, setExercise] = useState('');
  const [kg, setKg] = useState('');
  const [reps, setReps] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !exercise || !kg || !reps) return;

    const formattedDate = format(date, 'yyyy-MM-dd');

    const recordData = {
      date: formattedDate,
      exercise,
      kg: Number(kg),
      reps: Number(reps),
      intensity: Number(kg) * Number(reps),
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'workouts'), recordData);
      const recordWithId = { id: docRef.id, ...recordData };
      onAdd(recordWithId);
    } catch (err) {
      console.error("Error adding workout: ", err);
    }

    setExercise('');
    setKg('');
    setReps('');
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
  <div>
    <DatePicker
      selected={date}
      onChange={(selectedDate) => setDate(selectedDate)}
      dateFormat="yyyy-MM-dd"
      inline
      maxDate={new Date()}
    />
  </div>

  <form onSubmit={handleSubmit}>
    <div>
      <label>운동 종목: </label>
      <input value={exercise} onChange={e => setExercise(e.target.value)} required />
    </div>
    <div>
      <label>중량(kg): </label>
      <input type="number" value={kg} onChange={e => setKg(e.target.value)} required />
    </div>
    <div>
      <label>횟수: </label>
      <input type="number" value={reps} onChange={e => setReps(e.target.value)} required />
    </div>
    <button type="submit" style={{ marginTop: '1rem' }}>기록 추가</button>
  </form>
</div>

  );
}

export default WorkoutForm;
