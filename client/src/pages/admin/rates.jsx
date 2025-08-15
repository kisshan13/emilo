import PageContainer from "@/components/container/page-container";
import RatesForm from "@/components/dashboard/rates/rates-form";
import RatesTable from "@/components/dashboard/rates/rates-table";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import {
  useGetActiveRateQuery,
  useGetRateHistoryQuery,
} from "@/hooks/query/rates-query";
import { useState } from "react";

export default function RatePage() {
  const [create, setCreate] = useState();

  const { data, isLoading } = useGetRateHistoryQuery();
  const { data: activeRate, isLoading: activeLoading } =
    useGetActiveRateQuery();


  return (
    <>
      <PageContainer
        title={""}
        action={<Button onClick={() => setCreate(true)}>Create Rate</Button>}
      >
        <div>
          <RatesTable data={data} />
        </div>

        <Modal title={"Create rate"} isOpen={create}>
          <RatesForm onClose={() => setCreate(false)} />
        </Modal>
      </PageContainer>
    </>
  );
}
