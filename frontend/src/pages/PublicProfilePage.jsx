import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import ProfileSummary from "../components/ProfileSummary.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFitnessData } from "../context/FitnessDataContext.jsx";
import { useProgram } from "../context/ProgramContext.jsx";

export default function PublicProfilePage() {
  const { userId } = useParams();
  const { getUserById } = useAuth();
  const { getProgramByUserId } = useProgram();
  const { getLatestBodyRecord, getPublicPosts } = useFitnessData();
  const user = getUserById(userId);

  if (!user) {
    return (
      <div className="page-stack">
        <PageHeader eyebrow="Profile" title="User not found" description="This public profile does not exist." />
      </div>
    );
  }

  const latestBodyRecord = user.privacy?.showLatestBodyRecord ? getLatestBodyRecord(user.id) : null;

  return (
    <ProfileSummary
      user={user}
      program={getProgramByUserId(user.id)}
      latestBodyRecord={latestBodyRecord}
      posts={getPublicPosts(user.id)}
    />
  );
}
