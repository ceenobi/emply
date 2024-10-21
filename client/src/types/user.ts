export type UserAuthFormProps = {
  email: string;
  password: string;
};

export type UpdateProfileProps = {
  firstName: string;
  lastName: string;
  phone: string;
  dept: string;
  photo?: string;
  jobTitle?: string | undefined;
  bio?: string;
  address?: {
    homeAddress: string;
    state: string;
    country: string;
  };
  isVisible?: boolean;
};

export type Userinfo = {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dept: string;
  role: string;
  photo?: string;
  isVerified?: boolean;
  isVisible?: boolean;
  createdAt?: string;
  jobTitle?: string | undefined;
  status: string;
  employeeId?: string;
  leaveCount?: number;
  bio?: string;
  gender?: string;
  jobType?: string;
  maritalStatus?: string;
  dateOfBirth?: string;
  address?: {
    homeAddress?: string;
    state?: string;
    country?: string;
  };
};
