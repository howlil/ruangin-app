import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Loader2, CheckCircle2, XCircle, Clock4, FileCheck2 } from 'lucide-react';
import api from '@/utils/api';
import StatisticsChart from './StatisticsChart';
import DateRangePicker from '@/components/ui/Calenders/DateRangePicker';
import { Toaster } from 'react-hot-toast';
import StatisticBox from './StatisticBox';
import { HandleResponse } from '@/components/ui/HandleResponse';


const Dashboard = () => {
  const [statisticsData, setStatisticsData] = useState([]);
  const [statusData, setStatusData] = useState({
    DIPROSES: 0,
    DISETUJUI: 0,
    DITOLAK: 0,
    SELESAI: 0
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    tanggalMulai: undefined,
    tanggalAkhir: undefined
  });

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        tanggalMulai: filters.tanggalMulai,
        tanggalAkhir: filters.tanggalAkhir
      };

      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const [ruanganStats, statusStats] = await Promise.all([
        api.get('/v1/statistik', { params }),
        api.get('/v2/statistik', { params })
      ]);

      if (ruanganStats.data.status) {
        setStatisticsData(ruanganStats.data.data);
      }

      if (statusStats.data.status) {
        setStatusData(statusStats.data.data);
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal mengambil data statistik';
      HandleResponse({
        error,
        errorMessage: 'Gagal menghapus ruangan'
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [filters]);

  useEffect(() => {
    if (selectedDate) {
      setFilters(prev => ({
        ...prev,
        tanggalMulai: selectedDate.start_date,
        tanggalAkhir: selectedDate.end_date
      }));
    }
  }, [selectedDate]);

  const handleReset = useCallback(() => {
    setSelectedDate(null);
    setFilters(prev => ({
      ...prev,
      tanggalMulai: undefined,
      tanggalAkhir: undefined
    }));
  }, []);

  const statisticBoxes = [
    {
      title: "Diproses",
      value: statusData.DIPROSES,
      icon: Clock4,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      title: "Disetujui",
      value: statusData.DISETUJUI,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Ditolak",
      value: statusData.DITOLAK,
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50"
    },
    {
      title: "Selesai",
      value: statusData.SELESAI,
      icon: FileCheck2,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <DashboardLayout>
      <Toaster/>
      <div className="bg-white  rounded-lg shadow-md  overflow-hidden">
        {error ? (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between pb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
                <DateRangePicker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  onReset={handleReset}
                />
              </div>
            </div>

            {/* Statistic Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statisticBoxes.map((box, index) => (
                <StatisticBox
                  key={index}
                  title={box.title}
                  value={box.value}
                  icon={box.icon}
                  color={box.color}
                  bgColor={box.bgColor}
                />
              ))}
            </div>

            <div className="min-h-[400px] bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistik Penggunaan Ruangan</h2>
              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : (
                <div className="w-full  overflow-x-auto no-scrollbar">
                  <StatisticsChart
                    data={statisticsData}
                    loading={loading}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;