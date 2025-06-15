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
  // 1. 날짜 필터링 (과거까지 포함)
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const filteredByDate = formattedDate
    ? records.filter(r => r.date <= formattedDate)
    : records;

  // 2. 종목 필터링
  const filtered = selectedExercise === '전체'
    ? filteredByDate
    : filteredByDate.filter(r => r.exercise === selectedExercise);

  // 3. 날짜별 총합 계산
  const totalsByDate = {};
  filtered.forEach(record => {
    if (!totalsByDate[record.date]) {
      totalsByDate[record.date] = 0;
    }
    totalsByDate[record.date] += record.intensity;
  });

  // 4. 차트용 데이터 준비
  const labels = Object.keys(totalsByDate).sort();
  const data = labels.map(date => totalsByDate[date]);

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

  return (
    <div>
      <h2>📊 운동 강도 변화</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default WorkoutChart;
