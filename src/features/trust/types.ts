export interface Question {
  _id: string;
  content: string;
}

export interface Status {
  _id: string;
  question_id: string;
  count_a: number;
  count_b: number;
}

export interface Result {
  percentage: number;
  choice: string;
}