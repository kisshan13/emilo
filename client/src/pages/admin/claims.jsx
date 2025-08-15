import ClaimsFilter from "@/components/claims/claim-filter";
import PageContainer from "@/components/container/page-container";
import Modal from "@/components/ui/modal";
import { ClaimCard } from "@/components/claims/claim-card";
import ClaimsTable from "@/components/claims/claim-table";
import CustomPagination from "@/components/ui/custom-pagination";
import {
  useGetClaimsQuery,
  useMClaimApproval,
  useMClaimAccountantApprove,
  useMClaimDeduct,
} from "@/hooks/query/claim-query";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { useGetSocketTokenQuery } from "@/hooks/query/token-query";
import { useLocksSocket } from "@/hooks/use-socket";
import { useGetMeQuery } from "@/hooks/query/me-query";

export default function Claims() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const { pathname } = useLocation();

  const isAccountant = pathname.startsWith("/accountant");

  const queryObj = { ...filters, page };
  Object.keys(queryObj).forEach(
    (key) =>
      (queryObj[key] === "" || queryObj[key] == null) && delete queryObj[key]
  );

  const query = new URLSearchParams(queryObj).toString();
  const { data, isLoading } = useGetClaimsQuery(query);

  const [claim, setClaim] = useState();

  const { data: tokenData } = useGetSocketTokenQuery();
  const serverUrl = import.meta.env.VITE_API_URL?.split("/api")[0];
  const { data: me } = useGetMeQuery();

  const { locks, addLock, removeLock } = useLocksSocket({
    token: tokenData?.token,
    serverUrl,
  });

  useEffect(() => {
    if (claim?._id) {
      addLock(claim._id);
    }
    return () => {
      if (claim?._id) {
        removeLock(claim._id);
      }
    };
  }, [claim, addLock, removeLock]);

  const isClaimLockedByOther =
    claim &&
    locks.some((lock) => lock.claimId === claim._id && lock.userId !== me?._id);

  const { mutate: approveOrReject, isLoading: isApprovingOrRejecting } =
    useMClaimApproval({
      onSuccess: () => {
        removeLock(claim?._id);
        setClaim(null);
      },
    });

  const { mutate: accountantApprove, isLoading: isAccountantApproving } =
    useMClaimAccountantApprove({
      onSuccess: () => {
        removeLock(claim?._id);
        setClaim(null);
      },
    });

  const { mutate: deduct, isLoading: isDeducting } = useMClaimDeduct({
    onSuccess: () => {
      removeLock(claim?._id);
      setClaim(null);
    },
  });

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleApprove = (claimId) => {
    approveOrReject({ claimId, status: "approved" });
  };

  const handleReject = (claimId) => {
    approveOrReject({ claimId, status: "rejected" });
  };

  const handleAccountantApprove = (claimId) => {
    accountantApprove({ claimId });
  };

  const handleDeduct = (claimId, data) => {
    deduct({ claimId, ...data });
  };

  console.log(locks);

  return (
    <>
      <PageContainer title={"Claims"}>
        <ClaimsFilter onFilter={handleFilter} />
        <ClaimsTable
          isLoading={isLoading}
          claims={data?.docs}
          onView={(claim) => setClaim(claim)}
          locks={locks}
          userId={me?._id}
        />
        {data?.totalPages > 1 && (
          <CustomPagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <Modal isOpen={claim} onOpenChange={() => setClaim(null)}>
          {isClaimLockedByOther ? (
            <div className="p-4 text-center">
              <p className="mb-4">
                This claim is currently locked by another user. Please try again
                later.
              </p>
              <Button onClick={() => setClaim(null)}>Close</Button>
            </div>
          ) : (
            <>
              <ClaimCard
                claim={claim}
                forAdmin={!isAccountant}
                forAccountant={isAccountant}
                onAdminApprove={handleApprove}
                onAdminReject={handleReject}
                onAccountantApprove={handleAccountantApprove}
                onDeduct={handleDeduct}
                isDeducting={isDeducting}
                isApprovingOrRejecting={isApprovingOrRejecting}
                isAccountantApproving={isAccountantApproving}
              />

              <div className=" flex items-center justify-center ">
                <Button onClick={() => setClaim(null)}>Close</Button>
              </div>
            </>
          )}
        </Modal>
      </PageContainer>
    </>
  );
}
