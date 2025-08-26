import React from "react";

interface MetricsCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition p-6 flex items-center gap-4">
            {icon && (
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#e0f2f1] text-[#395241] text-3xl shadow-inner">
                    {icon}
                </div>
            )}
            <div>
                <h4 className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">
                    {title}
                </h4>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    {value}
                </p>
            </div>
        </div>
    );
};

export default MetricsCard;
