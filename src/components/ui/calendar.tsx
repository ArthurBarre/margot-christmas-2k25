import * as React from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";

import { cn } from "../../lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={fr}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-white",
        nav: "space-x-1 flex items-center",
        button_previous: "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white rounded-md hover:bg-white/20 flex items-center justify-center",
        button_next: "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white rounded-md hover:bg-white/20 flex items-center justify-center",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-white/60 rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 rounded-md",
        day_button: "h-9 w-9 p-0 font-normal rounded-md hover:bg-white hover:text-red-600 text-white transition-colors",
        selected: "[&>button]:bg-white [&>button]:text-red-600 [&>button]:hover:bg-white [&>button]:hover:text-red-600 [&>button]:rounded-md",
        today: "bg-white/20 text-white rounded-md",
        outside: "text-white/30 opacity-50 [&>button]:text-white/30",
        disabled: "text-white/30 opacity-50 [&>button]:text-white/30 [&>button]:hover:bg-transparent [&>button]:hover:text-white/30",
        range_middle: "[&>button]:bg-white/20 [&>button]:text-white [&>button]:!rounded-none [&>button]:hover:bg-white/30",
        range_start: "[&>button]:bg-white [&>button]:text-red-600 [&>button]:!rounded-l-md [&>button]:!rounded-r-none",
        range_end: "[&>button]:bg-white [&>button]:text-red-600 [&>button]:!rounded-r-md [&>button]:!rounded-l-none",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

