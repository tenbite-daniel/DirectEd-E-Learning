import React from "react";

interface QuickActionsProps {
    onSelect: (text: string) => void;
}

const actions = ["Course recommendation for ui/ux", "Need mentor's help"];

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelect }) => {
    return (
        <div className="p-6 pb-4 mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {actions.map((action) => (
                    <button
                        key={action}
                        onClick={() => onSelect(action)}
                        className="p-2 bg-white border border-gray-300 rounded-xl text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        {action}
                    </button>
                ))}
            </div>
        </div>
    );
};
