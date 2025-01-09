import DashboardLayout from '@/components/layout/DashboardLayout';
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/utils/api';
import DateRangePicker from './DateRangePicker';
import StatisticsChart from './StatisticsChart';
import useCustomToast from '@/components/ui/Toast/useCustomToast';

const Dashboard = () => {
  const [statisticsData, setStatisticsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useCustomToast();

  const getRequestParams = useCallback(() => {
    const params = {};
    if (selectedDate?.start_date) {
      params.tanggalMulai = selectedDate.start_date;
    }
    if (selectedDate?.end_date) {
      params.tanggalAkhir = selectedDate.end_date;
    }
    return params;
  }, [selectedDate]);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = getRequestParams();
      const response = await api.get('/v1/statistik', { params });

      if (response.data.status) {
        setStatisticsData(response.data.data);
        showToast('Data statistik berhasil dimuat', 'success');
      } else {
        throw new Error('Gagal mengambil data statistik');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal mengambil data statistik';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const handleReset = useCallback(() => {
    setSelectedDate(null);
    showToast('Filter tanggal berhasil direset', 'info');
  }, [showToast]);

  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate);
    if (newDate) {
      showToast('Filter tanggal berhasil diubah', 'success');
    }
  }, [showToast]);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow max-h-[calc(100vh-2rem)] overflow-hidden">
        {error ? (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="p-6 overflow-auto no-scrollbar">
            <div className=" bg-white pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <DateRangePicker
                  selectedDate={selectedDate}
                  setSelectedDate={handleDateChange}
                  onReset={handleReset}
                />
              </div>
            </div>

            <div className="min-h-[400px]">
              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : (
                <div className="w-full min-w-[768px]">
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