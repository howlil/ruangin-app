import React from 'react';
import { Dialog } from '@/components/ui/Dialog';

const AttendanceDialog = ({ isOpen, onClose, listAbsensi }) => {
    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose}
            title="Daftar Hadir Peserta"
            size="2xl"
        >
            <div className="overflow-y-auto max-h-[450px] no-scrollbar w-full rounded-md border p-4">
                <div className="space-y-3">
                    {listAbsensi?.map((peserta, index) => (
                        <div
                            key={peserta.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500 font-medium min-w-[24px]">
                                    {index + 1}.
                                </span>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">
                                        {peserta.nama}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {peserta.jabatan}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 whitespace-nowrap">
                                {peserta.unit_kerja}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Dialog>
    );
};

export default AttendanceDialog;