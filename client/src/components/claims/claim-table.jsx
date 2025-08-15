import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ClaimsTable({ claims, onView, locks, userId }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creator</TableHead>
            <TableHead>Post Text</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Earnings (Expected)</TableHead>
            <TableHead>Earnings (Approved)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims?.length > 0 ? (
            claims.map((claim) => {
              const isLocked = locks?.some((lock) => lock === claim._id);
              return (
                <TableRow key={claim._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{claim.creator?.name}</div>
                      <div className="text-xs text-gray-500">
                        {claim.creator?.email}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-[200px] truncate">
                    {claim.post?.text}
                  </TableCell>

                  <TableCell>{claim.views}</TableCell>
                  <TableCell>{claim.likes}</TableCell>
                  <TableCell>${claim.expectedEarnings}</TableCell>
                  <TableCell>${claim.approvedEarnings || 0}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        claim.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : claim.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </TableCell>


                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(claim)}
                      disabled={isLocked}
                    >
                      {isLocked ? "Locked" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                No claims found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
