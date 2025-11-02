import React from "react";
import GoalModal from "../GoalModal";

interface GoalModalsProps {
  activeModal: "steps" | "calories" | "minutes" | null;
  onClose: () => void;
  onSuccess: (type: "steps" | "calories" | "minutes", goal: number) => void;
}

const GoalModals: React.FC<GoalModalsProps> = ({
  activeModal,
  onClose,
  onSuccess,
}) => (
  <>
    {["steps", "calories", "minutes"].map((type) => (
      <GoalModal
        key={type}
        type={type as "steps" | "calories" | "minutes"}
        isOpen={activeModal === type}
        onClose={onClose}
        onSuccess={(goal) => onSuccess(type as any, goal)}
      />
    ))}
  </>
);

export default GoalModals;
