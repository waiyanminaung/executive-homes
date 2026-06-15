import { useFormContext } from "react-hook-form";
import { generateSlug } from "./generateSlug";

export function useSlugAutoFill(sourceField: string, slugField = "slug") {
  const { getValues, setValue } = useFormContext();

  const onBlur = () => {
    if (!getValues(slugField)) {
      setValue(slugField, generateSlug(getValues(sourceField)));
    }
  };

  return { onBlur };
}
