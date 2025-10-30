import React from "react";
import type { IconType } from "../utils/types";
import { FaWalking, FaFireAlt, FaClock } from "react-icons/fa";

interface FitnessIconProps {
  type: IconType;
}

const FitnessIcon: React.FC<FitnessIconProps> = ({ type }) => {
  switch (type) {
    case "steps":
      return <FaWalking className="text-blue-500 w-6 h-6" />;
    case "calories":
      return <FaFireAlt className="text-orange-500 w-6 h-6" />;
    case "minutes":
      return <FaClock className="text-green-500 w-6 h-6" />;
    default:
      return null;
  }
};

export default FitnessIcon;
