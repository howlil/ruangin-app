// src/pages/Ruangan/components/AddEditRoomModal.jsx
import { Dialog } from "@/components/ui/Dialog";
import Input  from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useState } from "react";
import api from "@/utils/api";
import useCustomToast from "@/components/ui/Toast/useCustomToast";
import { Upload } from "lucide-react";

export default function AddEditRoomModal({
    isOpen,
    onClose,
    room = null,
    onSuccess
}) {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(room?.foto_ruangan || null);
    const [formData, setFormData] = useState({
        nama_ruangan: room?.nama_ruangan || '',
        lokasi_ruangan: room?.lokasi_ruangan || '',
        kapasitas: room?.kapasitas?.toString().replace(/[^0-9]/g, '') || '',
        deskripsi: room?.deskripsi || '',
        foto_ruangan: null
    });
    const {showToast} = useCustomToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { 
                showToast('Ukuran file terlalu besar. Maksimal 10MB','error');
                return;
            }

            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                showToast('Format file tidak didukung. Gunakan JPG, PNG, atau GIF','error');
                return;
            }

            setFormData(prev => ({ ...prev, foto_ruangan: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Validate required fields
            const requiredFields = ['nama_ruangan', 'lokasi_ruangan', 'kapasitas'];
            const missingFields = requiredFields.filter(field => !formData[field]);

            if (missingFields.length > 0) {
                showToast('Mohon lengkapi semua field yang diperlukan','error');
                return;
            }

            // Create FormData object
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) {
                    submitData.append(key, value);
                }
            });

            // Send request
            if (room) {
                // PATCH request for edit
                await api.patch(`/v1/ruang-rapat/${room.id}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                showToast('Ruangan berhasil diperbarui','success');
            } else {
                // POST request for create
                await api.post('/v1/ruang-rapat', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                showToast('Ruangan berhasil ditambahkan','success');
            }

            onSuccess();
        } catch (error) {
            console.error('Error:', error);
            showToast(
                room ? 'Gagal memperbarui ruangan' : 'Gagal menambahkan ruangan'
            ,'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            title={room ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto Ruangan
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                        {imagePreview ? (
                            <div className="w-full">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-48 mx-auto object-cover rounded-lg"
                                />
                                <div className="mt-4 flex justify-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setFormData(prev => ({ ...prev, foto_ruangan: null }));
                                        }}
                                    >
                                        Hapus Foto
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark">
                                        <span>Upload file</span>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            accept="image/jpeg,image/png,image/gif"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                    <p className="pl-1">atau drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF maksimal 10MB
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Ruangan <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="nama_ruangan"
                            value={formData.nama_ruangan}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full"
                            placeholder="Masukkan nama ruangan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Lokasi <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="lokasi_ruangan"
                            value={formData.lokasi_ruangan}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full"
                            placeholder="Masukkan lokasi ruangan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Kapasitas (Orang) <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            name="kapasitas"
                            value={formData.kapasitas}
                            onChange={handleChange}
                            required
                            min="1"
                            className="mt-1 w-full"
                            placeholder="Masukkan kapasitas ruangan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Deskripsi
                        </label>
                        <Textarea
                            name="deskripsi"
                            value={formData.deskripsi}
                            onChange={handleChange}
                            rows={4}
                            className="mt-1"
                            placeholder="Masukkan deskripsi ruangan (opsional)"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button type="submit" loading={loading}>
                        {room ? 'Simpan Perubahan' : 'Tambah Ruangan'}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}