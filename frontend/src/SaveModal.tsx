import { useCallback, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


interface SaveModalProps {
  onClose: () => void;
  automatonData: object;
}

function SaveModal({ onClose, automatonData }: SaveModalProps) {

    const [modelName, setModelName] = useState<string>("");

    const saveAutomaton = useCallback(async () => {
        // Logic to save the automaton model
        console.log("Name:", modelName)
        const res = await fetch(`${API_BASE_URL}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name: modelName, 
                data: automatonData
            }),
        });

        const result = await res.json()
        console.log(result)
    }, [modelName, automatonData]);

    return (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
            ✕
            </button>
            <h1 className="text-2xl font-bold mb-4">Save Model</h1>
            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Model Name:</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter model name" value={modelName} onChange={(event) => setModelName(event.target.value)}/>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={() => saveAutomaton()}>
            Save
            </button>
        </div>
        </div>
    );
}

export default SaveModal;
