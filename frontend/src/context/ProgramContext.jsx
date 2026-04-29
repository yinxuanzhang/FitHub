import { createContext, useContext, useMemo, useState } from "react";
import { trainingPrograms } from "../data/mockData.js";
import { useAuth } from "./AuthContext.jsx";

const ProgramContext = createContext(null);

function cloneProgramVersion(version) {
  return JSON.parse(JSON.stringify(version));
}

export function ProgramProvider({ children }) {
  const { currentUser } = useAuth();
  const [programs, setPrograms] = useState(trainingPrograms);
  const userId = currentUser?.id;
  const program = programs.find((item) => item.userId === userId) || createEmptyProgram(userId);

  function createProgramVersion(nextSnapshot, changeSummary) {
    if (!userId) return;
    setPrograms((current) => {
      const existingProgram = current.find((item) => item.userId === userId) || createEmptyProgram(userId);
      const latestVersionNumber = Math.max(...existingProgram.versions.map((version) => version.versionNumber));
      const nextVersion = {
        ...nextSnapshot,
        id: crypto.randomUUID(),
        versionNumber: latestVersionNumber + 1,
        createdAt: new Date().toISOString().slice(0, 10),
        changeSummary: changeSummary || "Updated program structure."
      };

      const nextProgram = {
        ...existingProgram,
        versions: [nextVersion, ...existingProgram.versions]
      };

      return current.some((item) => item.userId === userId)
        ? current.map((item) => (item.userId === userId ? nextProgram : item))
        : [...current, nextProgram];
    });
  }

  const value = useMemo(() => {
    const currentVersion = program.versions[0];
    return {
      program,
      currentVersion,
      cloneCurrentVersion: () => cloneProgramVersion(currentVersion),
      createProgramVersion,
      getProgramByUserId: (profileUserId) => programs.find((item) => item.userId === profileUserId)
    };
  }, [program, programs, userId]);

  return <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>;
}

function createEmptyProgram(userId) {
  return {
    id: userId ? `program-${userId}` : "program-guest",
    userId,
    name: "My Training Program",
    goal: "Build a stable program and preserve every revision as it evolves.",
    versions: [
      {
        id: "program-empty-version",
        versionNumber: 1,
        createdAt: new Date().toISOString().slice(0, 10),
        changeSummary: "Initial empty program.",
        categories: [
          { id: "cat-chest", name: "Chest", exercises: [] },
          { id: "cat-shoulders", name: "Shoulders", exercises: [] },
          { id: "cat-back", name: "Back", exercises: [] },
          { id: "cat-legs", name: "Glutes & Legs", exercises: [] },
          { id: "cat-arms", name: "Arms", exercises: [] }
        ]
      }
    ]
  };
}

export function useProgram() {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("useProgram must be used inside ProgramProvider");
  }
  return context;
}
