import { useState } from "react";
import PageContainer from "@/components/container/page-container";
import CustomPagination from "@/components/ui/custom-pagination";
import SettlementFilter from "@/components/settlements/settlement-filter";
import SettlementsTable from "@/components/settlements/settlement-table";
import { useGetSettlementsQuery } from "@/hooks/query/settlement-query";

export default function SettlementsPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const queryObj = { ...filters, page };
  Object.keys(queryObj).forEach(
    (key) =>
      (queryObj[key] === "" || queryObj[key] == null) && delete queryObj[key]
  );

  const query = new URLSearchParams(queryObj).toString();
  const { data, isLoading } = useGetSettlementsQuery(query);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <PageContainer title="Settlements">
      <SettlementFilter onFilter={handleFilter} />
      <SettlementsTable
        isLoading={isLoading}
        settlements={data?.docs}
      />
      {data?.totalPages > 1 && (
        <CustomPagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </PageContainer>
  );
}
