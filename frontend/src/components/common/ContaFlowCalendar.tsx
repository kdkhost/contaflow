import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { calendarConfig, calendarTimezone } from '../../utils/calendarConfig';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color?: string;
  extendedProps?: Record<string, unknown>;
}

interface ContaFlowCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: { date: Date; allDay: boolean }) => void;
  onEventDrop?: (event: CalendarEvent) => void;
  onEventResize?: (event: CalendarEvent) => void;
  selectable?: boolean;
  editable?: boolean;
  height?: string;
}

export default function ContaFlowCalendar({
  events,
  onEventClick,
  onDateClick,
  onEventDrop,
  onEventResize,
  selectable = true,
  editable = true,
  height = 'auto',
}: ContaFlowCalendarProps) {
  const handleEventClick = (info: { event: { id: string; title: string; startStr: string; endStr: string; allDay: boolean; extendedProps: Record<string, unknown> } }) => {
    onEventClick?.({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      allDay: info.event.allDay,
      extendedProps: info.event.extendedProps,
    });
  };

  const handleDateClick = (info: { date: Date; allDay: boolean }) => {
    onDateClick?.({ date: info.date, allDay: info.allDay });
  };

  const handleEventDrop = (info: { event: { id: string; title: string; startStr: string; endStr: string; allDay: boolean; extendedProps: Record<string, unknown> } }) => {
    onEventDrop?.({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      allDay: info.event.allDay,
      extendedProps: info.event.extendedProps,
    });
  };

  const handleEventResize = (info: { event: { id: string; title: string; startStr: string; endStr: string; allDay: boolean; extendedProps: Record<string, unknown> } }) => {
    onEventResize?.({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      allDay: info.event.allDay,
      extendedProps: info.event.extendedProps,
    });
  };

  return (
    <div className="fc-theme-standard">
      <style>{`
        .fc {
          font-family: 'Inter', system-ui, sans-serif !important;
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
        }
        .fc .fc-button-primary {
          background-color: #6366f1 !important;
          border-color: #6366f1 !important;
        }
        .fc .fc-button-primary:hover {
          background-color: #4f46e5 !important;
          border-color: #4f46e5 !important;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active {
          background-color: #4338ca !important;
          border-color: #4338ca !important;
        }
        .fc .fc-daygrid-event {
          border-radius: 6px !important;
          padding: 2px 6px !important;
          font-size: 12px !important;
        }
        .fc .fc-col-header-cell {
          padding: 8px 0 !important;
          font-weight: 600 !important;
        }
        .fc td, .fc th {
          border-color: #e5e7eb !important;
        }
        .dark .fc td, .dark .fc th {
          border-color: #374151 !important;
        }
        .dark .fc-col-header-cell {
          background-color: #1e1e2e !important;
          color: #e2e8f0 !important;
        }
        .dark .fc-daygrid-day {
          background-color: #1e1e2e !important;
        }
        .dark .fc-daygrid-day:hover {
          background-color: #2a2a3e !important;
        }
        .dark .fc-toolbar-title {
          color: #e2e8f0 !important;
        }
        .dark .fc-button {
          background-color: #6366f1 !important;
          border-color: #6366f1 !important;
          color: white !important;
        }
        .dark .fc-timegrid-slot {
          background-color: #1e1e2e !important;
        }
        .dark .fc-list-event:hover td {
          background-color: #2a2a3e !important;
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={calendarConfig.initialView}
        headerToolbar={calendarConfig.headerToolbar}
        buttonText={calendarConfig.buttonText}
        allDayText={calendarConfig.allDayText}
        noEventsText={calendarConfig.noEventsText}
        dayMaxEvents={calendarConfig.dayMaxEvents}
        weekends={calendarConfig.weekends}
        selectable={selectable}
        editable={editable}
        droppable={calendarConfig.droppable}
        nowIndicator={calendarConfig.nowIndicator}
        businessHours={calendarConfig.businessHours}
        slotMinTime={calendarConfig.slotMinTime}
        slotMaxTime={calendarConfig.slotMaxTime}
        slotDuration={calendarConfig.slotDuration}
        height={height}
        navLinks={calendarConfig.navLinks}
        dayHeaderFormat={calendarConfig.dayHeaderFormat}
        titleFormat={calendarConfig.titleFormat}
        eventTimeFormat={calendarConfig.eventTimeFormat}
        events={events.map((e) => ({
          ...e,
          timeZone: calendarTimezone,
        }))}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        locale="pt-br"
      />
    </div>
  );
}
