import { RHFInput, RHFError } from "@geckoui/geckoui";

interface SlugInputProps {
  placeholder?: string;
}

export function SlugInput({ placeholder }: SlugInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">Slug</label>
      <RHFInput name="slug" placeholder={placeholder} />
      <RHFError name="slug" />
    </div>
  );
}
