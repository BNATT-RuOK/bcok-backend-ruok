import { CheckinStatus } from '../dto/create-checkin.dto';

export interface Checkin {
  id: number;
  userId: number;
  location: string;
  status: CheckinStatus;
  timestamp: string;
  createdAt: string;
}
