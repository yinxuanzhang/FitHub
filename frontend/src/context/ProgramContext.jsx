import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { trainingPrograms } from "../data/mockData.js";
import { useAuth } from "./AuthContext.jsx";
import axios from "axios";
const ProgramContext = createContext(null);

function cloneProgramVersion(version) {
  return JSON.parse(JSON.stringify(version));
}

export function ProgramProvider({ children }) {
  const { currentUser } = useAuth();
  const [program, setProgram] = useState(createEmptyProgram());
  const userId = currentUser?.id;
  useEffect(() => {
    if (userId) {
      fetchProgramFromBackend();
    }
  }, [userId]);

  async function fetchProgramFromBackend() {
    try {
      const response = await axios.get('http://localhost:3000/api/program', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.status === 200) {
        setProgram(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch program:', error);
      setProgram(createEmptyProgram(currentUser?.id));
    }
  }

  function createProgramVersion(nextSnapshot, changeSummary) {
    if (!currentUser) return;
    const latestVersionNumber = Math.max(...program.versions.map((version) => version.versionNumber));
    const nextVersion = {
      ...nextSnapshot,
      id: crypto.randomUUID(),
      versionNumber: latestVersionNumber + 1,
      createdAt: new Date().toISOString().slice(0, 10),
      changeSummary: changeSummary || "Updated program structure."
    };

    const nextProgram = {
      ...program,
      versions: [nextVersion, ...program.versions]
    };

    setProgram(nextProgram);
  }

  const value = useMemo(() => {
    const currentVersion = program.versions[0];
    return {
      program,
      currentVersion,
      cloneCurrentVersion: () => cloneProgramVersion(currentVersion),
      createProgramVersion,
    };
  }, [program]);

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
