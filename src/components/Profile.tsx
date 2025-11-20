import React from "react";
import { useAuth } from "../hooks/useAuth";
import { User as UserIcon } from "lucide-react";

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  // Build profile data from backend user object
  const profileData = {
    name:
      `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
      user.username,
    email: user.email ?? "-",
    age: user.age ?? "-",
    employeeId: user.employee_id ?? "-",
    departmentId: user.department_id ?? "-",
    role: user.role ?? "-",
    hireDate: user.hire_date ? new Date(user.hire_date).toDateString() : "-",
    location: user.location ?? "-",
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-md">
              <UserIcon size={32} className="text-indigo-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                Employee Profile
              </h2>
              <p className="text-indigo-100 text-sm">
                Personal & Work Information
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <ProfileField label="Name" value={profileData.name} />
          <ProfileField label="Email" value={profileData.email} />
          <ProfileField label="Age" value={profileData.age} />
          <ProfileField label="Employee ID" value={profileData.employeeId} />
          <ProfileField
            label="Department ID"
            value={profileData.departmentId}
          />
          <ProfileField label="Role" value={profileData.role} />
          <ProfileField label="Hire Date" value={profileData.hireDate} />
          <ProfileField label="Location" value={profileData.location} />
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm font-medium">{label}</span>
    <span className="text-gray-900 text-lg font-semibold mt-1">{value}</span>
    <div className="mt-2 w-full h-[1px] bg-gray-100" />
  </div>
);

export default Profile;
