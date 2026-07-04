"use client";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { TripActivity } from "@/lib/types/travel";
import { cn } from "@/lib/utils/cn";

const CATEGORY_EMOJI: Record<string, string> = {
  sightseeing: "🏛️",
  food: "🍽️",
  transport: "✈️",
  lodging: "🛏️",
  activity: "🎯",
  other: "📌",
};

function SortableActivity({
  activity,
  onEdit,
  onDelete,
}: {
  activity: TripActivity;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm",
        isDragging && "opacity-50 shadow-lg",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="cursor-grab text-(--color-foreground)/30 hover:text-(--color-foreground)/60 active:cursor-grabbing"
      >
        <GripVertical size={16} aria-hidden="true" />
      </button>

      <span className="text-base" aria-hidden="true">
        {CATEGORY_EMOJI[activity.category] ?? ""}
      </span>

      <div className="flex-1 overflow-hidden">
        <p className="truncate font-medium text-(--color-foreground)">{activity.title}</p>
        <div className="flex items-center gap-2 text-xs text-(--color-foreground)/50">
          {activity.time && <span className="font-tabular">{activity.time}</span>}
          {activity.cost != null && (
            <span className="font-tabular">
              {activity.cost.toLocaleString()}
            </span>
          )}
          {activity.note && <span className="truncate">{activity.note}</span>}
        </div>
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${activity.title}`}
          className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-foreground)/40 hover:bg-(--color-surface-muted) hover:text-(--color-foreground)"
        >
          <Pencil size={13} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${activity.title}`}
          className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-foreground)/40 hover:bg-(--color-terracotta)/10 hover:text-(--color-terracotta)"
        >
          <Trash2 size={13} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

interface ActivityListProps {
  activities: TripActivity[];
  onReorder: (activities: TripActivity[]) => void;
  onEdit: (activity: TripActivity) => void;
  onDelete: (activityId: string) => void;
}

export function ActivityList({
  activities,
  onReorder,
  onEdit,
  onDelete,
}: ActivityListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = activities.findIndex((a) => a.id === active.id);
    const newIndex = activities.findIndex((a) => a.id === over.id);
    onReorder(arrayMove(activities, oldIndex, newIndex));
  }

  if (activities.length === 0) {
    return (
      <p className="py-2 text-sm text-(--color-foreground)/40 italic">
        No activities yet — add one below.
      </p>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={activities.map((a) => a.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {activities.map((activity) => (
            <SortableActivity
              key={activity.id}
              activity={activity}
              onEdit={() => onEdit(activity)}
              onDelete={() => onDelete(activity.id)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
