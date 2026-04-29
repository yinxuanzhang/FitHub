import { Link } from "react-router-dom";
import MetricCard from "../components/MetricCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ProgramCategoryCard from "../components/ProgramCategoryCard.jsx";
import { useProgram } from "../context/ProgramContext.jsx";
import { calculateProgramVersionVolume, countProgramExercises, formatDate, formatNumber } from "../utils/fitness.js";

export default function ProgramPage() {
  const { program, currentVersion } = useProgram();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Current program"
        title={program.name}
        description={program.goal}
        actions={<Link className="button primary" to="/program/edit">Edit Program</Link>}
      />

      <section className="dashboard-grid">
        <MetricCard
          label="Current version"
          value={`Version ${currentVersion.versionNumber}`}
          detail={`${formatDate(currentVersion.createdAt)} · ${currentVersion.changeSummary}`}
        />
        <MetricCard label="Training categories" value={currentVersion.categories.length} detail="Fixed training flow with expandable categories" />
        <MetricCard
          label="Program volume"
          value={`${formatNumber(calculateProgramVersionVolume(currentVersion))} lb`}
          detail={`${countProgramExercises(currentVersion)} exercises across the current version`}
        />
      </section>

      <section className="program-grid">
        {currentVersion.categories.map((category) => (
          <ProgramCategoryCard key={category.id} category={category} />
        ))}
      </section>

      <section className="history-panel">
        <h2>Version history</h2>
        {program.versions.map((version) => (
          <article className="history-row" key={version.id}>
            <span>{formatDate(version.createdAt)}</span>
            <strong>Version {version.versionNumber}</strong>
            <p>
              {formatNumber(calculateProgramVersionVolume(version))} lb · {version.changeSummary}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
