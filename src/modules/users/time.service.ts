import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class TimeService {
    /**
     * Chuyển đổi Date hoặc timestamp sang chuỗi giờ định dạng "hh:mm A" theo múi giờ Việt Nam (UTC+7)
     * Ví dụ: Date -> "08:00 PM"
     */
    formatToTimeString(date: Date | number | string): string {
        if (!date) return null;
        return dayjs(date).tz('Asia/Ho_Chi_Minh').format('hh:mm A');
    }

    /**
     * Từ chuỗi giờ "08:00 PM" (giờ VN), trả về Date gần nhất theo múi giờ Việt Nam.
     * Nếu thời điểm này đã qua so với hiện tại, tự động chuyển sang ngày mai.
     */
    getNextOccurrence(timeString: string): string {
        if (!timeString) return null;

        const now = dayjs().tz('Asia/Ho_Chi_Minh');

        let targetDate = dayjs.tz(timeString, 'hh:mm A', 'Asia/Ho_Chi_Minh')
            .second(0)
            .millisecond(0);

        if (!targetDate.isValid()) {
            throw new Error(`Định dạng thời gian không hợp lệ: ${timeString}. Định dạng yêu cầu: "HH:MM AM/PM"`);
        }

        if (targetDate.isBefore(now)) {
            targetDate = targetDate.add(1, 'day');
        }

        return targetDate.toISOString();
    }
}