// components/Statistics/StatisticsChart.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StatisticsChart({ data, loading }) {
  const chartData = {
    labels: data.map(item => item.ruangan),
    datasets: [
      {
        label: 'Jumlah Peminjaman',
        data: data.map(item => item.jumlah_peminjaman),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Statistik Penggunaan Ruangan',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
        <p className="text-lg mb-2">Tidak ada data</p>
        <p className="text-sm">Pilih rentang tanggal untuk melihat statistik</p>
      </div>
    );
  }

  return (
    <div className="h-[400px]">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}