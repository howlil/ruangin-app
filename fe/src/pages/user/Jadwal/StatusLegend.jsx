export const StatusLegend = () => {
    const statuses = [
      { label: 'Disetujui', color: 'bg-green-500' },
      { label: 'Diproses', color: 'bg-yellow-400' },
      { label: 'Selesai', color: 'bg-gray-500' }
    ];
  
    return (
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {statuses.map(status => (
          <div key={status.label} className="flex items-center gap-2">
            <div className={`h-4 w-4 border rounded ${status.color}`} />
            <span className="text-sm text-gray-600">{status.label}</span>
          </div>
        ))}
      </div>
    );
  };
  