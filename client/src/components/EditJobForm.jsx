import { useState } from "react";

export default function EditJobForm({ job, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    company: job.company || "",
    position: job.position || "",
    status: job.status || "",
    notes: job.notes || "",
    date: job.date ? job.date.split("T")[0] : ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      const updatedJob = await response.json();
      onSave(updatedJob);
    } catch (error) {
      console.error("Error updating job:", error);
      // optionally show error to user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 border rounded bg-gray-50">
      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Company"
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        name="position"
        value={formData.position}
        onChange={handleChange}
        placeholder="Position"
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        name="status"
        value={formData.status}
        onChange={handleChange}
        placeholder="Status"
        className="border p-2 w-full rounded"
      />
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Notes"
        className="border p-2 w-full rounded"
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1 bg-gray-300 rounded">
          Cancel
        </button>
        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">
          Save
        </button>
      </div>
    </form>
  );
}
