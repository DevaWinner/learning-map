import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import type { StudyWeek } from "@/domain/entities/study-week";
import { cn } from "@/lib/utils";
import { Button } from "@/presentation/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/presentation/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";

interface WeekPickerProps {
  weeks: StudyWeek[];
  selectedWeekNumber: number;
  onSelectWeek: (weekNumber: number) => void;
  className?: string;
}

export function WeekPicker({
  weeks,
  selectedWeekNumber,
  onSelectWeek,
  className,
}: WeekPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedWeek = useMemo(
    () => weeks.find((week) => week.weekNumber === selectedWeekNumber) ?? null,
    [selectedWeekNumber, weeks],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-10 w-full justify-between rounded-xl text-left text-foreground",
            className,
          )}
        >
          <span className="truncate">
            {selectedWeek
              ? `Week ${selectedWeek.weekNumber} · ${selectedWeek.section}`
              : "Select week"}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-40" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={10}
        className="w-[min(92vw,24rem)] p-0"
      >
        <Command>
          <CommandInput placeholder="Search week, month, or deliverable..." />
          <CommandList>
            <CommandEmpty>No week matched your search.</CommandEmpty>
            <CommandGroup>
              {weeks.map((week) => (
                <CommandItem
                  key={week.weekNumber}
                  value={`week ${week.weekNumber} ${week.section} ${week.deliverable} ${week.coursera} ${week.math}`}
                  onSelect={() => {
                    onSelectWeek(week.weekNumber);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "size-4",
                      selectedWeekNumber === week.weekNumber
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <div className="min-w-0">
                    <div className="font-medium">
                      Week {week.weekNumber} · {week.section}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {week.deliverable}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
