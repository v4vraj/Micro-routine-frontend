import React from "react";

/**
 * Renders a smooth, centered, and large circular progress bar with Tailwind colors.
 */
interface CircularProgressProps {
  percentage: number;
  color: string; // Tailwind color class, e.g. "text-blue-500"
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  color,
}) => {
  const radius = 45; // larger circle radius
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  // Clamp between 0–100
  const validPercentage = Math.max(0, Math.min(percentage, 100));
  const offset = circumference - (validPercentage / 100) * circumference;

  return (
    <svg width="160" height="160" viewBox="0 0 120 120" className="-rotate-90">
      {/* Background ring */}
      <circle
        cx="60"
        cy="60"
        r={normalizedRadius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-200"
        fill="none"
      />

      {/* Progress ring */}
      <circle
        cx="60"
        cy="60"
        r={normalizedRadius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        className={color}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          transition: "stroke-dashoffset 0.6s ease-in-out, stroke 0.3s ease",
        }}
      />
    </svg>
  );
};

export default CircularProgress;
