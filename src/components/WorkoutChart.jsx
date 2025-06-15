import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function WorkoutChart({ records, selectedExercise }) {
  // 1. 종목 필터링
  const filtered = selectedExercise === '전체'
    ? records
    : records.filter(r => r.exercise === selectedExercise);

  // 2. 날짜별 총합 계산
  const totalsByDate = {};
  filtered.forEach(record => {
    if (!totalsByDate[record.date]) {
      totalsByDate[record.date] = 0;
    }
    totalsByDate[record.date] += record.intensity;
  });

  // 3. 정렬된 날짜별 데이터 만들기
  const labels = Object.keys(totalsByDate).sort();
  const data = labels.map(date => totalsByDate[date]);

  const chartData = {
    labels,
    datasets: [
      {
        label: selectedExercise === '전체' ? '전체 운동 강도' : `${selectedExercise} 운동 강도`,
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

  return (
    <div>
      <h2>📊 운동 강도 변화</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default WorkoutChart;