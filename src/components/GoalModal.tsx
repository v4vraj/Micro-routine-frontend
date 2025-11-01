// src/components/GoalModal.tsx
import React, { useState } from "react";
import axios from "axios";

interface GoalModalProps {
  type: "steps" | "calories" | "minutes";
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newGoal: number) => void;
}

const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const GoalModal: React.FC<GoalModalProps> = ({
  type,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [goal, setGoal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const endpointMap = {
    steps: "steps/goal",
    calories: "calories/goal",
    minutes: "active_minutes/goal",
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        `${API_BASE_URL}/google/fitness/${endpointMap[type]}`,
        { goal },
        getAuthHeaders()
      );

      onSuccess(goal);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to update goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Set{" "}
          {type === "steps"
            ? "Step"
            : type === "calories"
            ? "Calorie"
            : "Active Minutes"}{" "}
          Goal
        </h2>

        <input
          type="number"
          min="1"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={`Enter new ${type} goal`}
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || goal <= 0}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;
