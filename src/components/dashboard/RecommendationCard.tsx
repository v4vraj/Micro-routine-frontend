import React, { useEffect, useState } from "react";
import { fetchAIRecommendation } from "../../api/dashboardAPI";

interface Recommendation {
  priority: number;
  type: string;
  message: string;
}

interface RecommendationCardProps {
  userId: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ userId }) => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendation = async () => {
      try {
        setLoading(true);
        const data = await fetchAIRecommendation(userId);

        // ✅ Updated to handle the new backend shape
        if (data && data.recommendation) {
          setRecommendation(data.recommendation);
        } else {
          setRecommendation(null);
        }
      } catch (err) {
        console.error("Error fetching AI recommendation:", err);
        setError("Failed to load recommendation.");
      } finally {
        setLoading(false);
      }
    };

    loadRecommendation();

    // Auto refresh every 3 hours
    const interval = setInterval(loadRecommendation, 3 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 animate-pulse text-gray-500 text-sm text-center">
        Loading your daily recommendation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-center">
        {error}
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 text-center text-gray-500">
        🎉 You're all caught up! No recommendations for now.
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-100 via-purple-50 to-white shadow-md rounded-2xl p-6 border border-gray-100 mb-6 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        🧠 Smart Recommendation
      </h3>
      <p className="text-gray-800 text-md font-medium">
        {recommendation.message}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Priority: {recommendation.priority} | Type: {recommendation.type}
      </p>
    </div>
  );
};

export default RecommendationCard;
