import { Dialog } from '@/components/ui/Dialog';
import Button from '../Button';

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="mt-4">
        <p className="text-gray-600">{message}</p>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button color='red' variant="primary" onClick={onConfirm}>
          Hapus
        </Button>
      </div>
    </Dialog>
  );
}