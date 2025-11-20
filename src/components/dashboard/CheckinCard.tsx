import { useEffect, useState } from "react";

const CheckinCard = ({ attendance, onCheckout }: any) => {
  const [timeWorked, setTimeWorked] = useState("00:00:00");

  useEffect(() => {
    if (!attendance?.checkin_time) return;

    const checkin = new Date(attendance.checkin_time).getTime();

    if (attendance.checkout_time) {
      // Already checked out → show total duration only once
      const checkout = new Date(attendance.checkout_time).getTime();
      const diff = checkout - checkin;

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeWorked(
        `${hrs.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
      return;
    }

    // Checked in → live timer until checkout
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = now - checkin;

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeWorked(
        `${hrs.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [attendance]);

  // ---------------------------
  // UI CONDITIONS
  // ---------------------------

  if (!attendance?.checkin_time) {
    // Not checked in at all
    return (
      <div className="bg-white shadow-md rounded-xl p-5 mb-6 border">
        <h2 className="text-xl font-semibold">Today's Attendance</h2>
        <p className="mt-3 text-gray-500">Not checked in today</p>
      </div>
    );
  }

  if (attendance.checkout_time) {
    // Checked out already
    return (
      <div className="bg-white shadow-md rounded-xl p-5 mb-6 border">
        <h2 className="text-xl font-semibold text-gray-800">
          Today's Attendance
        </h2>

        <p className="mt-3 text-gray-700">
          <strong>Status:</strong> Checked Out
        </p>

        <p className="mt-1 text-gray-700">
          <strong>Total Time Worked:</strong> {timeWorked}
        </p>
      </div>
    );
  }

  // Currently checked in
  return (
    <div className="bg-white shadow-md rounded-xl p-5 mb-6 border">
      <h2 className="text-xl font-semibold text-gray-800">
        Today's Attendance
      </h2>

      <p className="mt-3 text-gray-700">
        <strong>Status:</strong> Checked In
      </p>
      <p className="mt-1 text-gray-700">
        <strong>Time Worked:</strong> {timeWorked}
      </p>

      <button
        onClick={onCheckout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
      >
        Checkout
      </button>
    </div>
  );
};

export default CheckinCard;
