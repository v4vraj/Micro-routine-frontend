import React, { useEffect, useState } from "react";
import {
  fetchDailyWellnessScore,
  fetchOverallWellnessScore,
} from "../../api/dashboardAPI";

interface WellnessScoreCardProps {
  userId: string;
}

const WellnessScoreCard: React.FC<WellnessScoreCardProps> = ({ userId }) => {
  const [dailyScore, setDailyScore] = useState<number | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScores = async () => {
      try {
        setLoading(true);
        const dailyRes = await fetchDailyWellnessScore(userId);
        const overallRes = await fetchOverallWellnessScore(userId);

        setDailyScore(dailyRes.data?.total_score ?? null);
        setOverallScore(overallRes.data?.overall_wellness_score ?? null);
      } catch (err) {
        console.error("Error fetching wellness scores:", err);
      } finally {
        setLoading(false);
      }
    };

    loadScores();

    // Optional auto refresh every 6 hours
    const interval = setInterval(loadScores, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-gray-500 text-sm animate-pulse">
          Loading wellness scores...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {/* Daily Wellness */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Daily Wellness Score
        </h3>
        <p className="text-4xl font-bold text-green-600">
          {dailyScore !== null ? dailyScore.toFixed(1) : "--"}
        </p>
        <p className="text-sm text-gray-500 mt-1">Today’s overall wellness</p>
      </div>

      {/* Overall Wellness */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Overall Wellness Score
        </h3>
        <p className="text-4xl font-bold text-blue-600">
          {overallScore !== null ? overallScore.toFixed(1) : "--"}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Average of all recorded days
        </p>
      </div>
    </div>
  );
};

export default WellnessScoreCard;
