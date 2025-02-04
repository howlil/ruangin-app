import { Card } from "@/components/ui/Card";
const HolidayCard = ({ holiday }) => (
    <div className="absolute top-8 left-0 right-0 px-1">
        <Card className=" p-1 border-none shadow-sm">
            <div className="p-1">
                <p className="text-[10px] font-semibold leading-tight text-black">
                    {holiday.keterangan}
                </p>
            </div>
        </Card>
    </div>
);

export default HolidayCard