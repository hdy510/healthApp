import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function WorkoutChart({ records, selectedExercise, selectedDate }) {
  // 1. 날짜 문자열로 포맷
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  // 2. 선택한 날짜까지의 운동 기록 필터링
  const filteredByDate = formattedDate
    ? records.filter(r => r.date <= formattedDate)
    : records;

  // 3. 운동 종목 필터링
  const filtered = selectedExercise === '전체'
    ? filteredByDate
    : filteredByDate.filter(r => r.exercise === selectedExercise);

  // ✅ 4. 선택한 날짜에 실제 운동 기록이 있는지 확인
  const hasSelectedDateData = formattedDate
    ? filtered.some(r => r.date === formattedDate)
    : true;

  // 5. 날짜별 총 강도 계산
  const totalsByDate = {};
  filtered.forEach(record => {
    if (!totalsByDate[record.date]) {
      totalsByDate[record.date] = 0;
    }
    totalsByDate[record.date] += record.intensity;
  });

  const labels = Object.keys(totalsByDate).sort();
  const data = labels.map(date => totalsByDate[date]);

  // 6. 차트 데이터 구성
  const chartData = {
    labels,
    datasets: [
      {
        label:
          selectedExercise === '전체'
            ? '전체 운동 강도'
            : `${selectedExercise} 운동 강도`,
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // ✅ 7. 조건에 따라 차트 표시 or 안내 메시지
  if (!hasSelectedDateData || labels.length === 0 || data.length === 0) {
    return (
      <div>
        <h2>📊 운동 강도 변화</h2>
        <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>
          표시할 운동 기록이 없습니다.
        </p>
      </div>
    );
  }

  // 8. 차트 렌더링
  return (
    <div>
      <h2>📊 운동 강도 변화</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default WorkoutChart;
