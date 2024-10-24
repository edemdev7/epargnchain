import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.get('/api/history')
            .then(response => setHistory(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">Historique des Épargnes</h2>
            <ul className="mt-4">
                {history.map((item, index) => (
                    <li key={index} className="border-b py-2">{item.date}: {item.amount} FCFA</li>
                ))}
            </ul>
        </div>
    );
};

export default History;
