import { useState } from 'react';
import { format } from 'date-fns';

function WorkoutList({ records, selectedDate, onDelete, onDeleteGroup, onDeleteByDate, onUpdate }) {
  const [editId, setEditId] = useState(null); // 수정 중인 record의 id
  const [editKg, setEditKg] = useState(0);
  const [editReps, setEditReps] = useState(0);

  const formattedSelectedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const filteredRecords = formattedSelectedDate
    ? records.filter(r => r.date === formattedSelectedDate)
    : records;

  const grouped = filteredRecords.reduce((acc, record) => {
    const { date, exercise } = record;
    if (!acc[date]) acc[date] = {};
    if (!acc[date][exercise]) acc[date][exercise] = [];
    acc[date][exercise].push(record);
    return acc;
  }, {});

  const handleEditStart = (item) => {
    setEditId(item.id);
    setEditKg(item.kg);
    setEditReps(item.reps);
  };

  const handleEditSubmit = async () => {
    if (onUpdate && editId !== null) {
      await onUpdate(editId, Number(editKg), Number(editReps));
      setEditId(null);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>📋 운동 기록</h2>
      {Object.entries(grouped)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([date, exercises]) => {
          const totalIntensity = Object.values(exercises).flat().reduce((sum, r) => sum + r.intensity, 0);
          return (
            <div key={date} style={{ marginTop: '2rem' }}>
              <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  {date} - <span style={{ color: '#555' }}>총 강도: {totalIntensity}kg</span>
                </span>
                {onDeleteByDate && (
                  <button onClick={() => onDeleteByDate(date)} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    [해당 날짜 전체 삭제]
                  </button>
                )}
              </h3>
              {Object.entries(exercises).map(([exercise, list]) => {
                const exerciseTotal = list.reduce((sum, r) => sum + r.intensity, 0);
                const idsToDelete = list.map(item => item.id);
                return (
                  <div key={exercise} style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <strong>{exercise}</strong> - 총 강도: {exerciseTotal}kg
                    {onDeleteGroup && (
                      <button onClick={() => onDeleteGroup(idsToDelete)} style={{ marginLeft: '1rem', color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        [전체 삭제]
                      </button>
                    )}
                    <ul style={{ marginTop: '0.5rem' }}>
                      {list.map((item, i) => (
                        <li key={item.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {editId === item.id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleEditSubmit();
                              }}
                              style={{ display: 'flex', gap: '8px' }}
                            >
                              <input
                                type="number"
                                value={editKg}
                                onChange={(e) => setEditKg(e.target.value)}
                                style={{ width: '60px' }}
                                autoFocus
                              />
                              <span>kg ×</span>
                              <input
                                type="number"
                                value={editReps}
                                onChange={(e) => setEditReps(e.target.value)}
                                style={{ width: '60px' }}
                              />
                              <span>회</span>
                              <button type="submit">✔</button>
                            </form>
                          ) : (
                            <span
                              onClick={() => handleEditStart(item)}
                              style={{ cursor: 'pointer' }}
                              title="클릭하여 수정"
                            >
                              {item.kg}kg × {item.reps}회 = {item.intensity}kg
                            </span>
                          )}
                          {item.id && (
                            <button
                              style={{ marginLeft: '1rem', color: 'red', cursor: 'pointer', border: 'none', background: 'transparent' }}
                              onClick={() => onDelete(item.id)}
                            >
                              삭제
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}

export default WorkoutList;
