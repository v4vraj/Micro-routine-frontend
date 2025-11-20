export interface User {
  id: string;
  username: string;
  email: string;

  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: string;
  date_of_birth?: string;

  employee_id: string;
  department_id?: string;
  role?: string;
  employment_type?: string;
  location?: string;
  hire_date?: string;

  status?: string;

  step_goal?: number;
  calorie_goal?: number;
  active_minute_goal?: number;

  created_at?: string;
  updated_at?: string;
}

export interface EventItem {
  id: string;
  title: string;
  start: string;
  end: string;
  calendar: string;
}

export interface StepsData {
  steps_completed: number;
  step_goal: number;
  date: string;
}

export interface CaloriesData {
  calories_burned: number;
  calorie_goal: number;
  date: string;
}

export interface MinutesData {
  active_minutes: number;
  active_minute_goal: number;
  date: string;
}

export type IconType = "steps" | "calories" | "minutes";

export interface Attendance {
  employee_id: string;
  date: string | null;
  checkin_time: string | null;
  checkout_time: string | null;
  mood: number | null;
}
