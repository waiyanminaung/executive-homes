"use client";

import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Images, Trash2, GripVertical } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { openMediaPicker } from "@/components/@shared/MediaPickerDialog";
import type { PropertyCreateInput } from "@/validation/propertySchema";

interface SortableImageProps {
  url: string;
  index: number;
  onRemove: () => void;
}

function SortableImage({ url, index, onRemove }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100"
    >
      <Image src={url} alt="" fill className="object-cover" unoptimized />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
        <div
          {...attributes}
          {...listeners}
          className="absolute top-1 left-1 p-1 bg-white rounded-full text-gray-600 shadow-sm cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50 shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {index === 0 && (
          <div className="absolute bottom-1 left-1">
            <span className="text-[10px] font-medium bg-primary-600 text-white px-1.5 py-0.5 rounded">
              Cover
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertyFormMediaSection() {
  const { watch, setValue } = useFormContext<PropertyCreateInput>();
  const imageUrls = watch("imageUrls") ?? [];

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleAddImages = () => {
    openMediaPicker({
      multiple: true,
      initialSelected: imageUrls,
      onSelect: (urls) => {
        setValue("imageUrls", urls);
      },
    });
  };

  const removeUrl = (index: number) => {
    setValue("imageUrls", imageUrls.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = imageUrls.indexOf(active.id as string);
      const newIndex = imageUrls.indexOf(over.id as string);
      setValue("imageUrls", arrayMove(imageUrls, oldIndex, newIndex));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Images</h2>
        <Button type="button" variant="outlined" size="sm" onClick={handleAddImages}>
          <Images className="w-4 h-4 mr-1.5" />
          Add Images
        </Button>
      </div>

      {imageUrls.length > 0 ? (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={imageUrls} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {imageUrls.map((url, index) => (
                <SortableImage
                  key={url}
                  url={url}
                  index={index}
                  onRemove={() => removeUrl(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="text-xs text-gray-400">No images added yet. Click &ldquo;Add Images&rdquo; to pick from the library.</p>
      )}
    </div>
  );
}
