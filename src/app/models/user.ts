import { Timesheet } from "./timesheet";


export class User {
    id: number;
    username: string;
    password: string;
    name: string;
    isManager: boolean;
    timesheet: Array<Timesheet>;
    isFullTime: boolean;
    reportingManager: string;
    designation: string;

  constructor(user: Partial<User>) {
    if (user) {
      Object.assign(this, user);
    }
  }}
