"use client";

import { SelectOption } from "@geckoui/geckoui";
import {
  RHFCheckbox,
  RHFInput,
  RHFInputGroup,
  RHFSelect,
  RHFTextarea,
} from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import type { Category } from "@/types/content";

interface AdminContentFormFieldsProps {
  categories: Category[];
}

const inputClassName =
  "w-full bg-white/5 border border-white/5 rounded-2xl px-4 focus-within:ring-1 focus-within:ring-accent/30 transition-all";
const inputInnerClassName = "font-bold placeholder:text-white/20";
const labelClassName =
  "text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-white/40 ml-1";
const errorClassName = "text-red-400 text-xs font-semibold";

export default function AdminContentFormFields({
  categories,
}: AdminContentFormFieldsProps) {
  return (
    <div className={classNames("space-y-6 lg:space-y-8")}>
      <div className={classNames("grid grid-cols-1 gap-4 lg:grid-cols-2")}>
        <Field label="Title" required>
          <RHFInput
            name="title"
            className={inputClassName}
            inputClassName={inputInnerClassName}
          />
        </Field>
        <Field label="Type" required>
          <RHFSelect name="type" className="rounded-2xl border-white/5 bg-white/5">
            <SelectOption value="movie" label="Movie" />
            <SelectOption value="series" label="Series" />
          </RHFSelect>
        </Field>
        <Field label="Rating (IMDb)" required>
          <RHFInput
            name="rating"
            type="number"
            step="0.1"
            className={inputClassName}
            inputClassName={inputInnerClassName}
          />
        </Field>
        <Field label="Year" required>
          <RHFInput
            name="year"
            type="number"
            className={inputClassName}
            inputClassName={inputInnerClassName}
          />
        </Field>
        <Field label="Duration">
          <RHFInput
            name="duration"
            placeholder="2h 15m"
            className={inputClassName}
            inputClassName={inputInnerClassName}
          />
        </Field>
        <Field label="Genre" required>
          <RHFInput
            name="genre"
            placeholder="Action, Drama"
            className={inputClassName}
            inputClassName={inputInnerClassName}
          />
        </Field>
      </div>

      <div className={classNames("grid grid-cols-1 gap-4 lg:grid-cols-2")}>
        <Field label="Poster URL" required>
          <RHFInput
            name="posterUrl"
            className={inputClassName}
            inputClassName={inputInnerClassName}
          />
        </Field>
        <Field label="Backdrop URL" required>
          <RHFInput
            name="backdropUrl"
            className={inputClassName}
            inputClassName={inputInnerClassName}
          />
        </Field>
        <Field label="Embed URL">
          <RHFInput
            name="embedUrl"
            className={inputClassName}
            inputClassName={inputInnerClassName}
          />
        </Field>
        <Field label="Telegram URL">
          <RHFInput
            name="telegramUrl"
            className={inputClassName}
            inputClassName={inputInnerClassName}
          />
        </Field>
      </div>

      <Field label="Description" required>
        <RHFTextarea
          name="description"
          rows={5}
          className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 font-bold focus:ring-1 focus:ring-accent/30"
        />
      </Field>

      <div className={classNames("space-y-4")}>
        <p className={labelClassName}>Display Categories</p>
        <div
          className={classNames(
            "grid grid-cols-2 gap-2 rounded-2xl border border-white/5",
            "bg-white/5 p-4 lg:grid-cols-3",
          )}
        >
          {categories.length ? (
            categories.map((category) => (
              <RHFCheckbox
                key={category.id}
                name="categoryIds"
                value={category.id}
                label={category.name}
                className="rounded-xl border border-transparent bg-white/[0.02] hover:border-white/5 hover:bg-white/[0.05]"
                labelClassName="truncate text-[10px] font-bold uppercase tracking-widest text-white/60"
              />
            ))
          ) : (
            <p className="col-span-2 text-center text-[10px] font-bold uppercase tracking-widest text-white/20 lg:col-span-3">
              မီနူးများ မရှိသေးပါ
            </p>
          )}
        </div>
      </div>

      <div className={classNames("grid grid-cols-1 gap-3 sm:grid-cols-2")}>
        <RHFCheckbox
          name="isTrending"
          value
          uncheckedValue={false}
          single
          label="Trending"
          className="rounded-2xl border border-white/5 bg-white/5"
          labelClassName="text-[10px] font-black uppercase tracking-widest text-white/40"
        />
        <RHFCheckbox
          name="isPopular"
          value
          uncheckedValue={false}
          single
          label="Popular"
          className="rounded-2xl border border-white/5 bg-white/5"
          labelClassName="text-[10px] font-black uppercase tracking-widest text-white/40"
        />
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <RHFInputGroup
      label={label}
      required={required}
      className="space-y-2"
      labelClassName={labelClassName}
      errorClassName={errorClassName}
    >
      {children}
    </RHFInputGroup>
  );
}
