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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <div className="inline-flex items-center justify-center p-2 bg-red-50 text-red-500 rounded-lg">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Error loading departments
        </div>
      </div>
    );
  }

  const departments = data?.getDepartments?.departments || [];
  const totalPages = data?.getDepartments?.totalPages || 0;
  const currentPage = data?.getDepartments?.currentPage || 1;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {showCreateForm ? "Cancel" : "Create Department"}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-8 bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Create New Department
          </h2>
          <DepartmentForm
            onSubmit={handleCreateDepartment}
            isLoading={createLoading}
          />
        </div>
      )}

      {departments.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-100">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-gray-500 text-lg">No departments found</p>
            <p className="text-gray-400 mt-1">Create one to get started!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {departments.map((department) => (
            <div
              key={department.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 w-full"
            >
              <div className="flex justify-between items-start mb-4">
                <Link to={`/department/${department.id}`} className="group">
                  <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                    {department.name}
                  </h2>
                </Link>
                <button
                  onClick={() => handleDeleteDepartment(department.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-base font-medium text-gray-500 mb-3">
                  Sub-departments
                </h3>
                <div className="space-y-2">
                  {department.subDepartments?.length > 0 ? (
                    department.subDepartments.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center text-gray-600"
                      >
                        <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                        <span className="text-base">{sub.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-base italic">
                      No sub-departments
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {department.createdBy?.username || "Unknown"}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(department.createdAt).toLocaleDateString()}
                </div>
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
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>
          <span className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
            <svg
              className="w-5 h-5 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
