export interface SubmissionModel {
  _id: string;
  submission_name: string;
  context: string;
  start_date: Date;
  due_date: Date;
  assign_by: string;
  classroom_name: string;
  classroom_id: string;
  uploaded: [any];
}
