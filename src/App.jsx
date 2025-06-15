import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import WorkoutChart from './components/WorkoutChart';

function App() {
  const [records, setRecords] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('전체');


  const fetchRecords = async () => {
    const snapshot = await getDocs(collection(db, 'workouts'));
    const loaded = snapshot.docs.map(docSnap => ({
      id: docSnap.id,        // 문서 ID 포함!
      ...docSnap.data(),
    }));
    setRecords(loaded);
  };

  const addRecord = (record) => {
    setRecords(prev => [...prev, record]);
  };

  const deleteRecord = async (id) => {
    await deleteDoc(doc(db, 'workouts', id));
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const updateRecord = async (id, newKg, newReps) => {
  const newIntensity = newKg * newReps;
  await updateDoc(doc(db, 'workouts', id), {
    kg: newKg,
    reps: newReps,
    intensity: newIntensity,
  });
  setRecords(prev =>
    prev.map(r =>
      r.id === id ? { ...r, kg: newKg, reps: newReps, intensity: newIntensity } : r
    )
  );
};

  const deleteMultipleRecords = async (ids) => {
    await Promise.all(ids.map(id => deleteDoc(doc(db, 'workouts', id))));
    setRecords(prev => prev.filter(r => !ids.includes(r.id)));
  };

  const deleteByDate = async (date) => {
    const toDelete = records.filter(r => r.date === date).map(r => r.id);
    await Promise.all(toDelete.map(id => deleteDoc(doc(db, 'workouts', id))));
    setRecords(prev => prev.filter(r => r.date !== date));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>🏋️ 운동 기록</h1>
      
      <WorkoutForm onAdd={addRecord} />
      <WorkoutList
        records={records}
        onDelete={deleteRecord}
        onDeleteGroup={deleteMultipleRecords}
        onDeleteByDate={deleteByDate}
        onUpdate={updateRecord}
      />

      {/* ✅ 여기에 종목 선택 드롭다운 삽입 */}
      <div style={{ margin: '1rem 0' }}>
        <label>운동 종목 선택: </label>
        <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
          <option value="전체">전체</option>
          {[...new Set(records.map(r => r.exercise))].map(exercise => (
            <option key={exercise} value={exercise}>{exercise}</option>
          ))}
        </select>
      </div>

      {/* ✅ 선택한 종목에 따라 그래프가 바뀜 */}
      <WorkoutChart records={records} selectedExercise={selectedExercise} />
    </div>
  );
}

export default App;
