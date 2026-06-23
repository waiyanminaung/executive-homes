import { RHFInput, RHFError, Label } from "@geckoui/geckoui";

interface SlugInputProps {
  placeholder?: string;
}

export function SlugInput({ placeholder }: SlugInputProps) {
  return (
    <div className="space-y-1.5">
      <Label required>Slug</Label>
      <RHFInput name="slug" placeholder={placeholder} />
      <RHFError name="slug" />
    </div>
  );
}
