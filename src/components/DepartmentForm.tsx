import { useState } from "react";

interface DepartmentFormProps {
  onSubmit: (data: {
    name: string;
    subDepartments?: { name: string }[];
  }) => void;
  isLoading?: boolean;
  initialData?: {
    name: string;
    subDepartments?: { name: string }[];
  };
  formType?: "department" | "subDepartment";
}

export default function DepartmentForm({
  onSubmit,
  isLoading = false,
  initialData,
  formType = "department",
}: DepartmentFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [subDepartments, setSubDepartments] = useState<string[]>(
    initialData?.subDepartments?.map((sub) => sub.name) || []
  );
  const [newSubDepartment, setNewSubDepartment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formType === "subDepartment") {
      onSubmit({ name });
    } else {
      onSubmit({
        name,
        subDepartments: subDepartments.map((name) => ({ name })),
      });
    }
  };

  const handleAddSubDepartment = () => {
    if (newSubDepartment.trim()) {
      setSubDepartments([...subDepartments, newSubDepartment.trim()]);
      setNewSubDepartment("");
    }
  };

  const handleRemoveSubDepartment = (index: number) => {
    setSubDepartments(subDepartments.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubDepartment();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {formType === "subDepartment"
            ? "Sub-Department Name"
            : "Department Name"}
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder={
            formType === "subDepartment"
              ? "Enter sub-department name"
              : "Enter department name"
          }
          required
          minLength={3}
        />
      </div>

      {formType === "department" && (
        <div>
          <label
            htmlFor="subDepartment"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Sub-departments (Optional)
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                id="subDepartment"
                value={newSubDepartment}
                onChange={(e) => setNewSubDepartment(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter sub-department name"
              />
              <button
                type="button"
                onClick={handleAddSubDepartment}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors duration-200"
              >
                Add
              </button>
            </div>
            {subDepartments.length > 0 && (
              <div className="mt-3 space-y-2">
                {subDepartments.map((subDept, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-700/50 px-3 py-2 rounded-md border border-gray-600"
                  >
                    <span className="text-white">{subDept}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubDepartment(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading
          ? "Creating..."
          : formType === "subDepartment"
          ? "Create Sub-Department"
          : "Create Department"}
      </button>
    </form>
  );
}
