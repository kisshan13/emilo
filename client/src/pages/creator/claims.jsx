import PageContainer from "@/components/container/page-container";
import { useGetClaimsQuery } from "@/hooks/query/claim-query";
import ClaimList from "@/components/claims/claim-list";

export default function ClaimPage() {
  const { data, isLoading } = useGetClaimsQuery();

  return (
    <PageContainer title={"Claims"}>
      <div className=" mt-6">
        <ClaimList claims={data?.docs} isLoading={isLoading} />
      </div>
    </PageContainer>
  );
}
