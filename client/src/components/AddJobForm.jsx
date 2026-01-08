import { useState } from "react";

export default function AddJobForm({ onJobAdded }) {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "Applied",
    date: "",
    notes: "",
  });

  const [errors, setErrors] = useState({

  });

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.company.trim()){
      newErrors.company  = "Where we applying?";

    }
    if (!formData.position.trim()){
      newErrors.position = "Silly, what's the position?";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const res = await fetch("http://localhost:5000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ company: "", position: "", status: "applied", date: "", notes: "" });
      onJobAdded(); // notify parent to refresh list
    } else {
      console.error("Failed to add job");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-md mx-auto bg-white p-4 shadow rounded"
    >
      <input
        type = "text"
        name="company"
        placeholder="Company"
        value={formData.company}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {errors.company && (
        <p className="text-red-500 text-sm mt-1">{errors.company}</p>
      )}

      <input
        name="position"
        placeholder="Position"
        value={formData.position}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {errors.position && (
        <p className="text-red-500 text-sm mt-1">{errors.position}</p>
      )}
      
      <input
        name="status"
        placeholder="Status"
        value={formData.status}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <textarea
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Job
      </button>
    </form>
  );
}
