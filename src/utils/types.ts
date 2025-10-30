export interface User {
  username: string;
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
