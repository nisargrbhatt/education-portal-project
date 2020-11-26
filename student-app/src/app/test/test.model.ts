export interface TestModel {
  _id: string;
  test_name: string;
  start_date: Date;
  due_date: Date;
  assign_by: string;
  classroom_name: string;
  classroom_id: string;
  test_questions: Array<{
    question: string;
    options: string[];
    answer: string;
  }>;
  test_responses: Array<{
    s_id: string;
    name: string;
    enrollment_no: number;
    answers: string[];
    marks: number;
    submit_time: Date;
  }>;
}
