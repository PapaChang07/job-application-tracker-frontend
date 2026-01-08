import { createContext, useState, useEffect } from 'react';
import { getJobs } from '../api/jobs';

export const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const data = await getJobs();
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <JobsContext.Provider value={{ jobs, setJobs, fetchJobs }}>
      {children}
    </JobsContext.Provider>
  );
};
