export interface Question {
  _id: string;
  content: string;
  createdAt?: string; 
  updatedAt?: string; 
}

export interface Status {
  _id: string;
  question_id: string;
  count_a: number;
  count_b: number;
  createdAt?: string; 
  updatedAt?: string; 
}

export interface Result {
  percentage: number;
  choice: 'trust' | 'self';
}

export interface User {
  _id?: string;
  username: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}