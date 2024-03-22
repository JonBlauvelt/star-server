import React, { useEffect, useMemo } from "react";
import { useGetElections } from "../../hooks/useAPI";
import { useNavigate } from "react-router";
import EnhancedTable from "../EnhancedTable";

export default function OpenElections() {
  const navigate = useNavigate();

  const { data, isPending, makeRequest: fetchElections } = useGetElections();

  useEffect(() => {
    fetchElections();
  }, []);

  const openElectionsData = useMemo(
    () => (data?.open_elections ? [...data.open_elections] : []),
    [data],
  );

  return (
    <EnhancedTable
      title="Open Elections"
      headKeys={["title", "start_time", "end_time", "description"]}
      data={openElectionsData}
      isPending={isPending}
      pendingMessage="Loading Elections..."
      handleOnClick={(election) => navigate(`/${String(election.election_id)}`)}
      defaultSortBy="title"
      emptyContent="No Election Invitations"
    />
  );
}
