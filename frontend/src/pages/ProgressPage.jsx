import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../components/ChartCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useFitnessData } from "../context/FitnessDataContext.jsx";
import { useProgram } from "../context/ProgramContext.jsx";
import { getProgramVolumeTrend } from "../utils/fitness.js";

export default function ProgressPage() {
  const { program } = useProgram();
  const { bodyRecords } = useFitnessData();
  const bodyTrend = [...bodyRecords]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((record) => ({ date: record.date.slice(5), weight: record.weight, bodyFat: record.bodyFat }));

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Meaningful trends"
        title="Progress"
        description="High-signal trends from program versions and body composition records."
      />

      <ChartCard title="Program volume trend" description="Total planned load preserved across program versions.">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={getProgramVolumeTrend(program.versions)}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="version" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="volume" stroke="#e06b1a" strokeWidth={2.5} dot={{ r: 3, fill: "#e06b1a" }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="two-column">
        <ChartCard title="Body weight trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={bodyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#2d8a57" strokeWidth={2.5} dot={{ r: 3, fill: "#2d8a57" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Body fat trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={bodyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bodyFat" stroke="#5b8dd9" strokeWidth={2.5} dot={{ r: 3, fill: "#5b8dd9" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
