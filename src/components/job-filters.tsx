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
    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
      <select name={name} defaultValue={value ?? ""} className="premium-select h-11 rounded-xl px-3 text-sm">
        <option value="">All</option>
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
  const hasFilters = Boolean(filters.q || filters.roleType || filters.city || filters.workMode || filters.seniority);

  return (
    <form className="glass-card rounded-2xl p-4 sm:p-5" action="/jobs">
      <div className="grid gap-4">
        <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Search the career layer
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Search LLM, Python, Remote, Berlin..."
            className="premium-input h-12 rounded-xl px-4 text-base"
          />
        </label>

        <div className="grid gap-3 md:grid-cols-5">
          <Select label="Role" name="roleType" value={filters.roleType} options={roleTypes} />
          <Select label="City" name="city" value={filters.city} options={dachCities} />
          <Select label="Mode" name="workMode" value={filters.workMode} options={workModes} />
          <Select label="Level" name="seniority" value={filters.seniority} options={seniorities} />
          <div className="flex items-end gap-2">
            <button className="glow-button h-11 w-full rounded-xl px-4 text-sm font-semibold text-white transition">
              Filter jobs
            </button>
          </div>
        </div>
      </div>

      {hasFilters ? (
        <Link href="/jobs" className="mt-4 inline-flex text-sm font-semibold text-slate-400 hover:text-white">
          Reset filters
        </Link>
      ) : null}
    </form>
  );
}
