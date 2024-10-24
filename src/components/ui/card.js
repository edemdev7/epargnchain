import React from 'react';

export const Card = ({ children, className }) => {
    return (
        <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children }) => {
    return (
        <div className="p-4 border-b">
            {children}
        </div>
    );
};

export const CardContent = ({ children }) => {
    return (
        <div className="p-4">
            {children}
        </div>
    );
};

export const CardTitle = ({ children }) => {
    return (
        <h3 className="text-lg font-semibold text-gray-800">
            {children}
        </h3>
    );
};
