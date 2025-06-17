const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface LoadModalProps {
  onClose: () => void;
}

function LoadModal({ onClose }: LoadModalProps) {

    const loadAutomaton = async () => {
        console.log("Loading Automaton...1");
        
        const res = await fetch(`${API_BASE_URL}/load`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();
        console.log("Loaded Automaton:");
        console.log(result);
    }

    return (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
            ✕
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={() => loadAutomaton()}>
            Load Models
            </button>
        </div>
        </div>
    );
}

export default LoadModal;
