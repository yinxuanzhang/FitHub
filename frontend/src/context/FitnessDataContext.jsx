import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { bodyRecords as initialBodyRecords, dietPlans as initialDietPlans, socialPosts as initialPosts } from "../data/mockData.js";
import { useAuth } from "./AuthContext.jsx";
import axios from "axios";
const FitnessDataContext = createContext(null);

export function FitnessDataProvider({ children }) {
  const {currentUser} = useAuth();
  const [bodyRecords, setBodyRecords] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [posts, setPosts] = useState([]);

  const userId = currentUser?.id;
  //optimize：Fetch again only when the authenticated user changes.
  useEffect(()=>{
    async function fetchFitnessData() {
      if (!userId) return;
      try {
        const response = await axios.get('http://localhost:3000/api/fitness-data', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (response.status === 200) {
          const { BodyRecords, DietRecords, Posts } = response.data;
          setBodyRecords(BodyRecords);
          setDietPlans(DietRecords);
          setPosts(Posts);
        }
      } catch (error) {
        console.error('Failed to fetch fitness data:', error);
      }
    }
    fetchFitnessData();
  },[userId]);

 
  const currentUserBodyRecords = bodyRecords.filter((record) => record.userId === userId);
  const currentUserDietPlans = dietPlans.filter((plan) => plan.userId === userId);
  const currentUserPosts = posts.filter((post) => post.userId === userId);

  function addBodyRecord(record) {
    if (!userId) return;
    setBodyRecords((current) => [...current, { id: crypto.randomUUID(), userId, isPrivate: true, ...record }]);
  }

  function addDietPlan(plan) {
    if (!userId) return;
    setDietPlans((current) => [{ id: crypto.randomUUID(), userId, isPrivate: true, ...plan }, ...current]);
  }

  function addPost(post) {
    if (!userId) return;
    setPosts((current) => [{ id: crypto.randomUUID(), userId, ...post }, ...current]);
  }

  function getLatestBodyRecord(userIdToRead) {
    return bodyRecords
      .filter((record) => record.userId === userIdToRead)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }

  function getPosts(userIdToRead) {
    return posts.filter((post) => post.userId === userIdToRead);
  }

  const value = useMemo(
    () => ({
      bodyRecords: currentUserBodyRecords,
      dietPlans: currentUserDietPlans,
      posts: currentUserPosts,
      allPosts: posts,
      addBodyRecord,
      addDietPlan,
      addPost,
      getLatestBodyRecord,
      getPosts,
      setPosts
    }),
    [bodyRecords, dietPlans, posts, userId]
  );

  return <FitnessDataContext.Provider value={value}>{children}</FitnessDataContext.Provider>;
}

export function useFitnessData() {
  const context = useContext(FitnessDataContext);
  if (!context) {
    throw new Error("useFitnessData must be used inside FitnessDataProvider");
  }
  return context;
}
