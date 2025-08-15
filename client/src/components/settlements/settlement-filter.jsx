import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function SettlementFilter({ onFilter }) {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [minApprovedAmount, setMinApprovedAmount] = useState("");
  const [maxApprovedAmount, setMaxApprovedAmount] = useState("");

  const handleApply = () => {
    onFilter({
      search,
      dateRange,
      minApprovedAmount,
      maxApprovedAmount,
    });
  };

  const handleReset = () => {
    setSearch("");
    setDateRange("");
    setMinApprovedAmount("");
    setMaxApprovedAmount("");
    onFilter({});
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Input
        placeholder="Search by post caption..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Today</SelectItem>
          <SelectItem value="week">Last 7 Days</SelectItem>
          <SelectItem value="month">Last Month</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="number"
        placeholder="Min Approved Amount"
        value={minApprovedAmount}
        onChange={(e) => setMinApprovedAmount(e.target.value)}
        className="w-[200px]"
      />
      <Input
        type="number"
        placeholder="Max Approved Amount"
        value={maxApprovedAmount}
        onChange={(e) => setMaxApprovedAmount(e.target.value)}
        className="w-[200px]"
      />

      <Button onClick={handleApply}>Apply</Button>
      <Button variant="outline" onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
}
