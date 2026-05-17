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
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
      <select name={name} defaultValue={value ?? ""} className="premium-select h-12 rounded-xl px-3 text-sm">
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
    <form className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-5" action="/jobs">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Search command</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">Find the right AI signal</h2>
        </div>
        {hasFilters ? (
          <Link href="/jobs" className="text-sm font-semibold text-slate-400 transition hover:text-white">
            Reset filters
          </Link>
        ) : null}
      </div>

      <div className="grid gap-4">
        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Keyword
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="LLM, Python, Remote, Berlin, SAP..."
            className="premium-input h-14 rounded-2xl px-4 text-base"
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Select label="Role" name="roleType" value={filters.roleType} options={roleTypes} />
          <Select label="City" name="city" value={filters.city} options={dachCities} />
          <Select label="Mode" name="workMode" value={filters.workMode} options={workModes} />
          <Select label="Level" name="seniority" value={filters.seniority} options={seniorities} />
          <div className="flex items-end gap-2">
            <button className="glow-button h-12 w-full rounded-xl px-4 text-sm font-semibold text-white transition focus:outline-none focus:ring-4 focus:ring-violet-300/20">
              Filter jobs
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
