import { Class } from "./class.model";

export interface Student {
    _id: string;
    name: string;
    classId: Class | string;  // Class reference
    points: number;
  }
  