
import { Card, CardContent } from '@/components/ui/card';


const StatisticBox = ({ title, value, icon: Icon, color, bgColor }) => (
    <Card className={`${bgColor} border  hover:shadow-xl transition-shadow duration-200`}>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                </div>
                <div className={`p-3 rounded-full ${bgColor} bg-opacity-20`}>
                    <Icon className={`h-8 w-8 ${color}`} />
                </div>
            </div>
        </CardContent>
    </Card>
);

export default StatisticBox