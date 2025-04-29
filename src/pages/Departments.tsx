import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { Department, DepartmentResponse } from "../types/department";
import {
  GET_DEPARTMENTS,
  CREATE_DEPARTMENT,
  DELETE_DEPARTMENT,
} from "../graphql/operations";
import DepartmentForm from "../components/DepartmentForm";
import toast from "react-hot-toast";

interface DepartmentResponse {
  departments: {
    id: number;
    name: string;
    subDepartments: {
      id: number;
      name: string;
    }[];
    createdBy: {
      username: string;
    };
    createdAt: string;
  }[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function Departments() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { loading, error, data, refetch } = useQuery<{
    getDepartments: DepartmentResponse;
  }>(GET_DEPARTMENTS, {
    variables: {
      page,
      limit,
    },
    fetchPolicy: "network-only",
  });

  const [createDepartment, { loading: createLoading }] = useMutation(
    CREATE_DEPARTMENT,
    {
      onCompleted: () => {
        setShowCreateForm(false);
        refetch();
        toast.success("Department created successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
    onCompleted: () => {
      refetch();
      toast.success("Department deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateDepartment = async (formData: {
    name: string;
    subDepartments?: { name: string }[];
  }) => {
    try {
      console.log("Creating department with data:", {
        name: formData.name,
        subDepartments: formData.subDepartments,
      });

      await createDepartment({
        variables: {
          createDepartmentInput: {
            name: formData.name,
            subDepartments: formData.subDepartments || [],
          },
        },
        refetchQueries: [
          {
            query: GET_DEPARTMENTS,
            variables: { page, limit },
          },
        ],
      });
    } catch (error) {
      console.error("Error creating department:", error);
      toast.error("Failed to create department. Please try again.");
    }
  };

  const handleDeleteDepartment = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment({
          variables: { id: parseInt(id.toString(), 10) },
        });
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) {
    console.error("GraphQL error:", error);
    return (
      <div className="text-center py-8 text-red-500">
        Error loading departments. Please try again later.
      </div>
    );
  }

  console.log("Departments data:", data?.getDepartments?.departments);

  const departments = data?.getDepartments?.departments || [];
  const totalPages = data?.getDepartments?.totalPages || 0;
  const currentPage = data?.getDepartments?.currentPage || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Departments</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            {showCreateForm ? "Cancel" : "Create Department"}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Create New Department
            </h2>
            <DepartmentForm
              onSubmit={handleCreateDepartment}
              isLoading={createLoading}
            />
          </div>
        )}

        {departments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No departments found. Create one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => (
              <div
                key={department.id}
                className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <Link
                    to={`/department/${parseInt(department.id.toString(), 10)}`}
                  >
                    <h2 className="text-xl font-semibold mb-2 text-white hover:text-indigo-400">
                      {department.name}
                    </h2>
                  </Link>
                  <button
                    onClick={() => handleDeleteDepartment(department.id)}
                    className="text-red-500 hover:text-red-400 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Sub-departments:
                  </h3>
                  <div className="space-y-1">
                    {department.subDepartments?.map((sub) => (
                      <div key={sub.id} className="text-gray-300 text-sm">
                        {sub.name}
                      </div>
                    )) || (
                      <div className="text-gray-500 text-sm">
                        No sub-departments
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p>
                    Created by: {department.createdBy?.username || "Unknown"}
                  </p>
                  <p>
                    Created:{" "}
                    {new Date(department.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors duration-200"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
