import { CheckinStatus } from '../dto/create-checkin.dto';

export class Checkin {
  checkin_id: number;
  user_id: number;
  scheduled_time: Date | null;
  actual_time: Date | null;
  status: string | null;
}
