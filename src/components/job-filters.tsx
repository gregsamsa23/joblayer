import Link from "next/link";
import { dachCities, roleTypes, seniorities, workModes } from "@/lib/taxonomy";
import type { JobFilters } from "@/lib/types";

function Select({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value?: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
      {label}
      <select
        name={name}
        defaultValue={value ?? ""}
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">Alle</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function JobFiltersForm({ filters }: { filters: JobFilters }) {
  const hasFilters = Boolean(filters.roleType || filters.city || filters.workMode || filters.seniority);

  return (
    <form className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" action="/jobs">
      <div className="grid gap-3 md:grid-cols-5">
        <Select label="Rolle" name="roleType" value={filters.roleType} options={roleTypes} />
        <Select label="Stadt" name="city" value={filters.city} options={dachCities} />
        <Select label="Arbeitsmodell" name="workMode" value={filters.workMode} options={workModes} />
        <Select label="Level" name="seniority" value={filters.seniority} options={seniorities} />
        <div className="flex items-end gap-2">
          <button className="h-11 w-full rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
            Filtern
          </button>
        </div>
      </div>
      {hasFilters ? (
        <Link href="/jobs" className="mt-3 inline-flex text-sm font-semibold text-slate-500 hover:text-slate-900">
          Filter zurücksetzen
        </Link>
      ) : null}
    </form>
  );
}
