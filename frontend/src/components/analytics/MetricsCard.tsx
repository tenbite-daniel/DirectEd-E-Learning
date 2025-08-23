import React from "react";

interface MetricsCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, icon }) => {
    return (
        <div className="p-4 bg-yellow-100 dark:bg-gray-700 rounded-xl shadow-md flex items-center gap-4">
            {icon && (
                <div className="w-20 h-20 text-3xl text-amber-600 rounded-full p-4 bg-pink-100 flex items-center justify-center">
                    {icon}
                </div>
            )}
            <div>
                <h4 className="text-gray-600 dark:text-white text-sm">
                    {title}
                </h4>
                <p className="text-2xl font-bold dark:text-white">{value}</p>
            </div>
        </div>
    );
};

export default MetricsCard;
