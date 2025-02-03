import React from 'react';
import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/ui/animated-list";
import { Clock, MapPin } from 'lucide-react';
import EmptyState from "./EmptyState"

const ScheduleNotification = ({ booking, roomName }) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10"
        >
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{roomName}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{booking.jam_mulai} - {booking.jam_selesai}</span>
          </figcaption>
          <p className="text-sm font-normal text-gray-500 dark:text-white/60 flex items-center gap-1">
            {booking.nama_kegiatan.length > 40 ? booking.nama_kegiatan.substring(0, 40) + '...' : booking.nama_kegiatan}          </p>
        </div>
      </div>
    </figure>
  );
};

const RoomScheduleList = ({ schedules }) => {
  const allBookings = schedules.flatMap(room =>
    room.jadwal.map(booking => ({
      ...booking,
      roomName: room.ruang_rapat
    }))
  ).sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai));

  return (
    <div
      className={cn(
        "relative flex h-[360px] w-full flex-col overflow-hidden  "
      )}
    >
      {allBookings.length > 0 ? (
        <AnimatedList delay={3000}>
          {allBookings.map((booking, idx) => (
            <ScheduleNotification
              key={`${booking.nama_kegiatan}-${idx}`}
              booking={booking}
              roomName={booking.roomName}
            />
          ))}
        </AnimatedList>
      ) : (
        <div className="flex items-center justify-center h-full">
          <EmptyState />
        </div>
      )}
    </div>
  );
};

export default RoomScheduleList;