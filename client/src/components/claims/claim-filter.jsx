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

export default function ClaimsFilter({ onFilter }) {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [hasDeduction, setHasDeduction] = useState("");
  const [minEarnings, setMinEarnings] = useState("");
  const [maxEarnings, setMaxEarnings] = useState("");

  const handleApply = () => {
    onFilter({
      status,
      search,
      dateRange,
      hasDeduction,
      minEarnings,
      maxEarnings,
    });
  };

  const handleReset = () => {
    setStatus("");
    setSearch("");
    setDateRange("");
    setHasDeduction("");
    setMinEarnings("");
    setMaxEarnings("");
    onFilter({});
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Input
        placeholder="Search by post caption..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="deducted">Deducted</SelectItem>
          <SelectItem value="settlement_ok">Settlement OK</SelectItem>
          <SelectItem value="settlement_dispute">Settlement Dispute</SelectItem>
          <SelectItem value="accountant_approved">
            Accountant Approved
          </SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger>
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Today</SelectItem>
          <SelectItem value="week">Last 7 Days</SelectItem>
          <SelectItem value="month">Last Month</SelectItem>
        </SelectContent>
      </Select>

      <Select value={hasDeduction} onValueChange={setHasDeduction}>
        <SelectTrigger>
          <SelectValue placeholder="Has Deduction" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Yes</SelectItem>
          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="number"
        placeholder="Min Earnings"
        value={minEarnings}
        onChange={(e) => setMinEarnings(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Max Earnings"
        value={maxEarnings}
        onChange={(e) => setMaxEarnings(e.target.value)}
      />

      <Button onClick={handleApply}>Apply</Button>
      <Button variant="outline" onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
}
