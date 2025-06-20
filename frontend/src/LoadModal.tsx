import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface LoadModalProps {
  onClose: () => void;
  onLoad: (model: any) => void; 
}

interface modelData {
    data: string;
    name: string;
    id: number
}

function LoadModal({ onClose, onLoad }: LoadModalProps) {
  const [models, setModels] = useState<modelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<modelData | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/load`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch models");

        const result: modelData[] = await res.json();
        setModels(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleLoadClick = () => {
    if (selectedModel) {
      onLoad(selectedModel); 
      onClose(); 
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center">Select a Model</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
            {models.map((model, index) => (
                <div
                    key={index}
                    onClick={() => setSelectedModel(model)}
                    className={`p-3 rounded cursor-pointer border ${
                    selectedModel?.id === model.id
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                    <span className="text-sm font-medium">{model.name}</span>
                </div>
                ))}
          </div>
        )}

        <button
          onClick={handleLoadClick}
          disabled={!selectedModel}
          className={`w-full py-2 px-4 rounded font-bold text-white ${
            selectedModel
              ? "bg-blue-500 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Load Selected Model
        </button>
      </div>
    </div>
  );
}

export default LoadModal;
