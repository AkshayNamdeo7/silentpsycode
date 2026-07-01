"use client";

import { useMemo } from "react";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import type { BookFilters } from "@/lib/books";

const categoryOptions = ["", "Engineering", "Medical", "UPSC", "JEE", "NEET", "School", "Novels"];
const conditionOptions = ["", "New", "Like New", "Good", "Fair"];
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "lowest", label: "Lowest Price" },
  { value: "highest", label: "Highest Price" },
];

interface BookFiltersProps {
  filters: BookFilters;
  onChange: (filters: BookFilters) => void;
  onReset: () => void;
}

export default function BookFilters({ filters, onChange, onReset }: BookFiltersProps) {
  const activeFilterCount = useMemo(() => {
    return [filters.search, filters.category, filters.condition, filters.minPrice, filters.maxPrice, filters.college, filters.city]
      .filter((value) => value !== undefined && value !== "")
      .length;
  }, [filters]);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.9)]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Filters</p>
          <p className="mt-2 text-2xl font-semibold text-white">Refine your search</p>
          <p className="mt-2 text-sm text-slate-400">{activeFilterCount > 0 ? `${activeFilterCount} active filter${activeFilterCount > 1 ? "s" : ""}` : "Use filters to narrow your next find"}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onReset}>
          Clear filters
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Search</label>
          <Input
            type="search"
            value={filters.search ?? ""}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Title, author or category"
            aria-label="Search books"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Sort</label>
          <Select
            value={filters.sort ?? "newest"}
            onChange={(event) => onChange({ ...filters, sort: event.target.value as BookFilters["sort"] })}
            aria-label="Sort books"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Category</label>
          <Select
            value={filters.category ?? ""}
            onChange={(event) => onChange({ ...filters, category: event.target.value || undefined })}
            aria-label="Filter by category"
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option || "All categories"}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Condition</label>
          <Select
            value={filters.condition ?? ""}
            onChange={(event) => onChange({ ...filters, condition: event.target.value || undefined })}
            aria-label="Filter by condition"
          >
            {conditionOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Any condition"}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Min price</label>
            <Input
              type="number"
              value={filters.minPrice ?? ""}
              onChange={(event) => onChange({ ...filters, minPrice: event.target.value ? Number(event.target.value) : undefined })}
              placeholder="₹0"
              aria-label="Minimum price"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Max price</label>
            <Input
              type="number"
              value={filters.maxPrice ?? ""}
              onChange={(event) => onChange({ ...filters, maxPrice: event.target.value ? Number(event.target.value) : undefined })}
              placeholder="₹9999"
              aria-label="Maximum price"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">College</label>
          <Input
            value={filters.college ?? ""}
            onChange={(event) => onChange({ ...filters, college: event.target.value || undefined })}
            placeholder="College name"
            aria-label="Filter by college"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">City</label>
          <Input
            value={filters.city ?? ""}
            onChange={(event) => onChange({ ...filters, city: event.target.value || undefined })}
            placeholder="City"
            aria-label="Filter by city"
          />
        </div>
      </div>
    </div>
  );
}
