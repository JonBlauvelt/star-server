import { useEffect, useState } from "react";
import React from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import EditElectionRoll from "./EditElectionRoll";
import AddElectionRoll from "./AddElectionRoll";
import PermissionHandler from "../../PermissionHandler";
import { Typography } from "@mui/material";
import EnhancedTable, { HeadKey } from "./../../EnhancedTable";
import { useGetRolls, useSendInvites } from "../../../hooks/useAPI";
import useElection from "../../ElectionContextProvider";
import useFeatureFlags from "../../FeatureFlagContextProvider";
import { ElectionRoll } from "@equal-vote/star-vote-shared/domain_model/ElectionRoll";

const ViewElectionRolls = () => {
  const { election, permissions } = useElection();
  const {
    data,
    isPending,
    makeRequest: fetchRolls,
  } = useGetRolls(election.election_id);
  const sendInvites = useSendInvites(election.election_id);
  useEffect(() => {
    fetchRolls();
  }, []);
  const [isEditing, setIsEditing] = useState(false);
  const [addRollPage, setAddRollPage] = useState(false);
  const [editedRoll, setEditedRoll] = useState<ElectionRoll | null>(null);
  const flags = useFeatureFlags();

  const onOpen = (voter) => {
    setIsEditing(true);
    setEditedRoll(
      data.electionRoll.find((roll) => roll.voter_id === voter.voter_id),
    );
  };
  const onClose = () => {
    setIsEditing(false);
    setAddRollPage(false);
    setEditedRoll(null);
    fetchRolls();
  };

  const onSendInvites = () => {
    // NOTE: since we don't have await here, it
    sendInvites.makeRequest();
  };

  const onUpdate = async () => {
    const results = await fetchRolls();
    if (!results) return;
    setEditedRoll((currentRoll) =>
      results.electionRoll.find(
        (roll) => roll.voter_id === currentRoll.voter_id,
      ),
    );
  };

  const headKeys: HeadKey[] =
    election.settings.invitation === "email"
      ? ["voter_id", "email", "invite_status", "has_voted"]
      : ["voter_id", "email", "has_voted"];

  if (flags.isSet("PRECINCTS")) headKeys.push("precinct");

  const electionRollData = React.useMemo(
    () => (data?.electionRoll ? [...data.electionRoll] : []),
    [data],
  );

  return (
    <Container>
      <Typography align="center" gutterBottom variant="h4" component="h4">
        {election.title}
      </Typography>
      {!isEditing && !addRollPage && (
        <>
          {election.settings.voter_access === "closed" && (
            <PermissionHandler
              permissions={permissions}
              requiredPermission={"canAddToElectionRoll"}
            >
              <Button variant="outlined" onClick={() => setAddRollPage(true)}>
                {" "}
                Add Voters{" "}
              </Button>
            </PermissionHandler>
          )}
          {election.settings.invitation === "email" && (
            <Button variant="outlined" onClick={() => onSendInvites()}>
              {" "}
              Send Invites{" "}
            </Button>
          )}
          <EnhancedTable
            headKeys={headKeys}
            data={electionRollData}
            isPending={isPending && data?.electionRoll !== undefined}
            pendingMessage="Loading Voters..."
            defaultSortBy="voter_id"
            title="Voters"
            handleOnClick={(voter) => onOpen(voter)}
            emptyContent={<p>This election doesn&apos;t have any voters yet</p>}
          />
        </>
      )}
      {isEditing && editedRoll && (
        <EditElectionRoll
          roll={editedRoll}
          onClose={onClose}
          fetchRolls={onUpdate}
        />
      )}
      {addRollPage && <AddElectionRoll onClose={onClose} />}
    </Container>
  );
};

export default ViewElectionRolls;
