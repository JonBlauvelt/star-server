import React, { useEffect, useMemo } from "react";
import { Election } from "@equal-vote/star-vote-shared/domain_model/Election";
import useAuthSession from "../AuthSessionContextProvider";
import { useGetElections } from "../../hooks/useAPI";
import { useNavigate } from "react-router";
import EnhancedTable from "../EnhancedTable";

export default function ElectionsYouManage() {
  const navigate = useNavigate();
  const authSession = useAuthSession();

  const { data, isPending, makeRequest: fetchElections } = useGetElections();

  useEffect(() => {
    fetchElections();
  }, [authSession.isLoggedIn()]);

  const userEmail = authSession.getIdField("email");
  const id = authSession.getIdField("sub");
  const getRoles = (election: Election) => {
    const roles = [];
    if (election.owner_id === id) {
      roles.push("Owner");
    }
    if (election.admin_ids?.includes(userEmail)) {
      roles.push("Admin");
    }
    if (election.audit_ids?.includes(userEmail)) {
      roles.push("Auditor");
    }
    if (election.credential_ids?.includes(userEmail)) {
      roles.push("Credentialer");
    }
    return roles.join(", ");
  };

  const managedElectionsData = useMemo(() => {
    if (data?.elections_as_official) {
      return data.elections_as_official.map((election) => ({
        ...election,
        roles: getRoles(election),
      }));
    } else {
      return [];
    }
  }, [data]);

  return (
    <EnhancedTable
      title="Elections You Manage"
      headKeys={[
        "title",
        "roles",
        "election_state",
        "start_time",
        "end_time",
        "description",
      ]}
      isPending={isPending}
      pendingMessage="Loading Elections..."
      data={managedElectionsData}
      handleOnClick={(row) => navigate(`/${String(row.raw.election_id)}`)}
      defaultSortBy="title"
      emptyContent={
        <>
          &ldquo;You don&apos;t have any elections yet&rdquo;
          <button>Create Election</button>
        </>
      }
    />
  );
}
