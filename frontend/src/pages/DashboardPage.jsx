import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../components/ChartCard.jsx";
import MetricCard from "../components/MetricCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useFitnessData } from "../context/FitnessDataContext.jsx";
import { useProgram } from "../context/ProgramContext.jsx";
import { countProgramExercises, formatDate, getProgramVolumeTrend } from "../utils/fitness.js";

export default function DashboardPage() {
  const { currentVersion, program } = useProgram();
  const { bodyRecords, dietPlans } = useFitnessData();
  const sortedBodyRecords = [...bodyRecords].sort((a, b) => new Date(a.date) - new Date(b.date));
  const latestBody = sortedBodyRecords[sortedBodyRecords.length - 1];
  const currentDiet = dietPlans[0];
  const bodyTrend = sortedBodyRecords.map((record) => ({
    date: record.date.slice(5),
    weight: record.weight,
    bodyFat: record.bodyFat
  }));

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Overview"
        title="Fitness data dashboard"
        description="A snapshot of the latest records and long-term indicators that matter."
      />

      <section className="dashboard-grid">
        <MetricCard
          label="Current program"
          value={`Version ${currentVersion.versionNumber}`}
          detail={`${formatDate(currentVersion.createdAt)} · ${countProgramExercises(currentVersion)} exercises`}
        />
        <MetricCard
          label="Latest body record"
          value={latestBody ? `${latestBody.weight} lb` : "No records"}
          detail={latestBody ? `${latestBody.bodyFat}% body fat · ${formatDate(latestBody.date)}` : "Body records are private to your account"}
        />
        <MetricCard
          label="Current diet plan"
          value={currentDiet ? `${currentDiet.calories} kcal` : "No plan"}
          detail={currentDiet ? `${currentDiet.protein}P / ${currentDiet.carbs}C / ${currentDiet.fat}F grams` : "Diet plans are private by default"}
        />
      </section>

      <div className="two-column">
        <ChartCard title="Program volume preview" description="Total planned load across program versions.">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={getProgramVolumeTrend(program.versions)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="version" />
              <YAxis />
              <Tooltip />
              <Area dataKey="volume" stroke="#e06b1a" fill="#fff4ec" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Body composition preview" description="Weight and body fat over recorded check points.">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={bodyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area dataKey="weight" stroke="#2d8a57" fill="#e8f5ee" strokeWidth={2} />
              <Area dataKey="bodyFat" stroke="#5b8dd9" fill="#e8effe" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
