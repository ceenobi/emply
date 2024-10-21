export type EventProps = {
  length: number;
  photo?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  time: string;
  location?: string;
  _id?: string;
  status?: string;
  count?: number;
  totalPages?: number;
  userId?: {
    _id?: string;
    firstName: string;
    lastName: string;
    photo?: string;
  };
};

export type EventData = {
  count: number;
  totalPages: number;
  currentPage: number;
  events: EventProps[];
};
