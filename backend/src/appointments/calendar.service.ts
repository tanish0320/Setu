import { Injectable } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { GetCalendarDto } from './dto/get-calendar.dto';

@Injectable()
export class CalendarService {
  constructor(private readonly repo: AppointmentsRepository) {}

  async getCalendar(query: GetCalendarDto) {
    const { view, date, doctorId, hospitalId, status } = query;

    const refDate = date ? new Date(date) : new Date();

    let start: Date;
    let end: Date;

    if (view === 'day') {
      start = new Date(refDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(refDate);
      end.setHours(23, 59, 59, 999);
    } else if (view === 'week') {
      start = new Date(refDate);
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else {
      // month
      start = new Date(refDate.getFullYear(), refDate.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    const appointments = await this.repo.findCalendarAppointments({
      start,
      end,
      doctorId,
      hospitalId,
      status,
    });

    return {
      view,
      rangeStart: start.toISOString(),
      rangeEnd: end.toISOString(),
      appointments,
    };
  }
}
