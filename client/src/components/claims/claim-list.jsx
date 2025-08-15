import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { ClaimCard } from "./claim-card";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useMClaimSettle } from "@/hooks/query/claim-query";

export default function ClaimList({ claims, isLoading }) {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);

  const { mutate: settleClaim, isLoading: isSettling } = useMClaimSettle({
    onSuccess: () => {
      setSelectedClaim(null);
      setAcceptModalOpen(false);
      setChallengeModalOpen(false);
    },
  });

  const handleAcceptClick = (claimId) => {
    setSelectedClaim(claimId);
    setAcceptModalOpen(true);
  };

  const handleChallengeClick = (claimId) => {
    setSelectedClaim(claimId);
    setChallengeModalOpen(true);
  };

  const handleAcceptConfirm = () => {
    settleClaim({ claimId: selectedClaim, status: "settlement_ok" });
  };

  const handleChallengeConfirm = () => {
    settleClaim({ claimId: selectedClaim, status: "settlement_dispute" });
  };

  if (isLoading) {
    return (
      <div className=" space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className={"h-14"} />
        ))}
      </div>
    );
  }

  return (
    <>
      <ul className=" space-y-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {claims?.map((c) => (
          <li key={c?._id}>
            <ClaimCard
              forUser={true}
              claim={c}
              onAcceptDeduction={handleAcceptClick}
              onChallengeDeduction={handleChallengeClick}
              isSettling={isSettling}
            />
          </li>
        ))}
      </ul>

      <Modal
        isOpen={acceptModalOpen}
        onOpenChange={setAcceptModalOpen}
        title="Accept Deduction"
      >
        <div>
          <p>Are you sure you want to accept this deduction?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setAcceptModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAcceptConfirm} disabled={isSettling}>
              {isSettling ? "Accepting..." : "Accept"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={challengeModalOpen}
        onOpenChange={setChallengeModalOpen}
        title="Challenge Deduction"
      >
        <div>
          <p>Are you sure you want to challenge this deduction?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setChallengeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleChallengeConfirm}
              disabled={isSettling}
            >
              {isSettling ? "Challenging..." : "Challenge"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
