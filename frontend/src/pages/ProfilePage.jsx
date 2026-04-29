import ProfileSummary from "../components/ProfileSummary.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFitnessData } from "../context/FitnessDataContext.jsx";
import { useProgram } from "../context/ProgramContext.jsx";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { program } = useProgram();
  const { getLatestBodyRecord, getPublicPosts } = useFitnessData();
  const latestBodyRecord = currentUser.privacy?.showLatestBodyRecord ? getLatestBodyRecord(currentUser.id) : null;

  return (
    <ProfileSummary
      user={currentUser}
      program={program}
      latestBodyRecord={latestBodyRecord}
      posts={getPublicPosts(currentUser.id)}
      isOwnProfile
    />
  );
}
