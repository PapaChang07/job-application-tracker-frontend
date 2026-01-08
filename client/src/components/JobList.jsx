import { useEffect, useState } from "react";


export default function JobList({ jobs, onEdit , onDelete}) {
  const [expanded,setExpanded] = useState({});

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Your Job Applications</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs yet — add one above!</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <li key={job.id} className="py-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{job.company}</h3>
                  <p className="text-sm text-gray-600">
                    {job.position} — {job.status}
                  </p>
                  {job.notes && (
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">
                        {expanded[job.id]
                          ? job.notes
                          : job.notes.slice(0, 100) + (job.notes.length > 120 ? "..." : "")
                        }
                      </p>

                      {job.notes.length > 100 && (
                        <button
                          onClick={() =>
                            setExpanded((prev) => ({
                              ...prev,
                              [job.id]: !prev[job.id],
                            }))
                          }
                          className="text-xs text-blue-500 hover:underline mt-1"
                        >
                          {expanded[job.id] ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end text-right">
                  <span className="text-xs text-gray-400">
                    Applied on: {new Date(job.date).toLocaleDateString("en-US")}
                  </span>
                  <button
                    onClick={() => onEdit(job)}
                    className="mt-1 text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (!confirm(`Delete ${job.position} @ ${job.company}?`)) return;
                      onDelete(job.id)
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
