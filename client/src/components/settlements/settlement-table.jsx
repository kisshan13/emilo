import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettlementsTable({ settlements, isLoading }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Post Caption</TableHead>
            <TableHead>Approved Amount</TableHead>
            <TableHead>Approved At</TableHead>
            <TableHead>Approved By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))
          ) : settlements?.length > 0 ? (
            settlements.map((settlement) => (
              <TableRow key={settlement._id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{settlement.user?.name}</div>
                    <div className="text-xs text-gray-500">
                      {settlement.user?.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {settlement.post?.caption}
                </TableCell>
                <TableCell>${settlement.approvedAmount}</TableCell>
                <TableCell>
                  {new Date(settlement.approvedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {settlement.approvedBy?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {settlement.approvedBy?.email}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-gray-500 py-4"
              >
                No settlements found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
