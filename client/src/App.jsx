import { useState, useEffect } from 'react'
import JobList from './components/JobList.jsx';
import AddJobForm from "./components/AddJobForm";
import EditJobForm from './components/EditJobForm.jsx';

function App() {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    search: "", 
    sort: "date-desc"
  });

  // Fetch jobs once on load
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await fetch("http://localhost:5000/jobs");
    const data = await res.json();
    setJobs(data);
  };

  const filteredJobs = jobs.filter((job) => {
    // Hide rejected jobs by default
    if (job.status?.toLowerCase() === "rejected") return false;

    // Status filter
    if (filters.status !== "all" && job.status !== filters.status) {
      return false;
    }

    // Name filter (company or position)
    if (filters.search) {
      const text = filters.search.toLowerCase();
      const company = job.company?.toLowerCase() || "";
      const position = job.position?.toLowerCase() || "";

      if (!company.includes(text) && !position.includes(text)) {
        return false;
      }
    }

    return true;
  })
  .sort((a, b) => {
    if (filters.sort === "date-asc") {
      return new Date(a.date) - new Date(b.date);
    } else {
      return new Date(b.date) - new Date(a.date);
    }
  });


  const handleJobAdded = () => {
    fetchJobs(); // refresh list when a new job is added
  };

  const handleDelete = async (jobId) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    try {
      const res = await fetch(`http://localhost:5000/jobs/${jobId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      // rollback if delete failed – re-fetch or restore
      console.error(err);
      await fetchJobs(); // simplest rollback
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Title + Add Job form */}
        <aside className="md:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Title aligned to left */}
            <h1 className="text-2xl font-bold text-left">Job Tracker</h1>

            {/* AddJobForm container (full width of left column) */}
            <div className="mt-2">
              <AddJobForm onJobAdded={handleJobAdded} />
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Filters + Job list (spans 2 columns on md+) */}
        <main className="md:col-span-2 space-y-6">
          {/* Filters area */}
          <div className="bg-white p-4 rounded shadow">
            {/* Put your filter controls here (search, status select, sort) */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <input
                type="text"
                placeholder="Search by company or position..."
                className="flex-1 border p-2 rounded"
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
              <select
                className="border p-2 rounded"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="all">All</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
              </select>

              <select
                className="border p-2 rounded"
                value={filters.sort}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sort: e.target.value }))
                }
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
              </select>
            </div>
          </div>

          {/* Job list */}
          <JobList jobs={filteredJobs} onEdit={(job) => setEditingJob(job)} onDelete={handleDelete} />

          {/* Edit form modal/slot (if needed) */}
          {editingJob && (
            <EditJobForm
              job={editingJob}
              onSave={(updatedJob) => {
                setJobs((prevJobs) =>
                  prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
                );
                setEditingJob(null);
              }}
              onCancel={() => setEditingJob(null)}
            />
          )}
        </main>
      </div>
    </div>
  );

}

export default App;
