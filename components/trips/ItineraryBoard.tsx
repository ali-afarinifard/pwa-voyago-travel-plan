"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import dayjs from "dayjs";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  addActivity,
  removeActivity,
  setTripDays,
  updateActivity,
} from "@/lib/redux/slices/tripsSlice";
import { ActivityList } from "./ActivityList";
import { ActivityModal } from "./ActivityModal";
import { BudgetBar } from "./BudgetBar";
import type { Trip, TripActivity, TripDay } from "@/lib/types/travel";

interface ItineraryBoardProps {
  trip: Trip;
}

interface EditState {
  dayId: string;
  activity: TripActivity;
}

export function ItineraryBoard({ trip }: ItineraryBoardProps) {
  const dispatch = useAppDispatch();
  const [addingDayId, setAddingDayId] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);

  function handleReorder(day: TripDay, reordered: TripActivity[]) {
    const newDays = trip.days.map((d) =>
      d.id === day.id ? { ...d, activities: reordered } : d,
    );
    dispatch(setTripDays({ tripId: trip.id, days: newDays }));
  }

  function handleAdd(dayId: string, values: Omit<TripActivity, "id">) {
    dispatch(addActivity({ tripId: trip.id, dayId, activity: values }));
    setAddingDayId(null);
  }

  function handleEdit(dayId: string, values: Omit<TripActivity, "id">) {
    if (!editing) return;
    dispatch(
      updateActivity({
        tripId: trip.id,
        dayId,
        activityId: editing.activity.id,
        changes: values,
      }),
    );
    setEditing(null);
  }

  function handleDelete(dayId: string, activityId: string) {
    dispatch(removeActivity({ tripId: trip.id, dayId, activityId }));
  }

  return (
    <div className="flex flex-col gap-6">
      <BudgetBar trip={trip} />

      <div className="flex flex-col gap-4">
        {trip.days.map((day, index) => (
          <section
            key={day.id}
            aria-labelledby={`day-${day.id}`}
            className="boarding-pass overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
              <h3
                id={`day-${day.id}`}
                className="font-display font-semibold text-(--color-foreground)"
              >
                Day {index + 1}{" "}
                <span className="font-tabular font-normal text-(--color-foreground)/50">
                  · {dayjs(day.date).format("ddd, MMM D")}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setAddingDayId(day.id)}
                className="inline-flex items-center gap-1 text-xs font-medium text-(--color-primary) hover:underline cursor-pointer"
              >
                <PlusCircle size={13} aria-hidden="true" />
                Add
              </button>
            </div>

            <div className="p-5">
              <ActivityList
                activities={day.activities}
                onReorder={(reordered) => handleReorder(day, reordered)}
                onEdit={(activity) => setEditing({ dayId: day.id, activity })}
                onDelete={(activityId) => handleDelete(day.id, activityId)}
              />
            </div>
          </section>
        ))}
      </div>

      {/* Add activity modal */}
      <ActivityModal
        open={addingDayId !== null}
        onClose={() => setAddingDayId(null)}
        onSave={(values) => addingDayId && handleAdd(addingDayId, values)}
      />

      {/* Edit activity modal */}
      <ActivityModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSave={(values) => editing && handleEdit(editing.dayId, values)}
        initial={editing?.activity}
      />
    </div>
  );
}
