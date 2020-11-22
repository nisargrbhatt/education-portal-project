export interface AuthModel {
  name: string;
  utype: string;
  department: string;
  enrollment_no: number;
  subjects: [string];
  email: string;
  semester: number;
  photo: string;
  contact_no: number;
  dateofjoining: Date;
  profile_setup: Date;
}
