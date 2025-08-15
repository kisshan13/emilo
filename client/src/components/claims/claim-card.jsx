import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Modal from "@/components/ui/modal";
import DeductionForm from "./deduction-form";

export function ClaimCard({
  claim,
  onAcceptDeduction,
  onChallengeDeduction,
  onDeduct,
  onAccountantApprove,
  onAdminApprove,
  onAdminReject,
  forUser,
  forAccountant,
  forAdmin,
}) {
  const [isDeductModalOpen, setIsDeductModalOpen] = useState(false);
  const statusColors = {
    pending: "bg-yellow-500",
    deducted: "bg-orange-500",
    settlement_ok: "bg-green-500",
    settlement_dispute: "bg-red-500",
    accountant_approved: "bg-blue-500",
    approved: "bg-emerald-600",
    rejected: "bg-gray-500",
  };

  const handleDeductSubmit = (data) => {
    onDeduct(claim._id, data);
  };

  return (
    <>
      <Card className="w-full shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">
              {claim?.post?.title || "Untitled Post"}
            </CardTitle>
            <Badge
              className={`${statusColors[claim?.status] || "bg-gray-400"}`}
            >
              {claim?.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Created by {claim?.creator?.name || "Unknown"}
          </p>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Views:</span>
            <span>{claim?.views}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Likes:</span>
            <span>{claim?.likes}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Expected Earnings:</span>
            <span>${claim?.expectedEarnings.toFixed(2)}</span>
          </div>
          {claim?.approvedEarnings !== undefined && (
            <div className="flex justify-between text-sm">
              <span>Approved Earnings:</span>
              <span>${claim?.approvedEarnings.toFixed(2)}</span>
            </div>
          )}

          {claim?.deductions && claim?.deductions.length > 0 && (
            <div className="mt-4 border-t pt-2">
              <h4 className="font-semibold text-sm mb-2">Deductions</h4>
              {claim?.deductions?.map((d, i) => (
                <div key={i} className="mb-2">
                  <p className="text-sm">Amount: ${d.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    Reason: {d.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {forUser && claim?.status === "deducted" && (
          <CardFooter className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onAcceptDeduction && onAcceptDeduction(claim?._id)}
            >
              Accept Deduction
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
                onChallengeDeduction && onChallengeDeduction(claim?._id)
              }
            >
              Challenge Deduction
            </Button>
          </CardFooter>
        )}

        {forAccountant &&
          ["pending", "settlement_ok", "settlement_dispute"].includes(
            claim?.status
          ) && (
            <CardFooter className="flex gap-2">
              <Button
                size="sm"
                onClick={() =>
                  onAccountantApprove && onAccountantApprove(claim?._id)
                }
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setIsDeductModalOpen(true)}
              >
                Deduct
              </Button>
            </CardFooter>
          )}

        {forAdmin && claim?.status === "accountant_approved" && (
          <CardFooter className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm">Approve</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will approve the claim.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onAdminApprove && onAdminApprove(claim._id)}
                  >
                    Approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to reject?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone and will reject the claim.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onAdminReject && onAdminReject(claim._id)}
                  >
                    Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        )}
      </Card>
      <Modal
        isOpen={isDeductModalOpen}
        onOpenChange={() => setIsDeductModalOpen(false)}
        title="Add Deduction"
      >
        <DeductionForm onSubmit={handleDeductSubmit} isLoading={false} />
      </Modal>
    </>
  );
}
