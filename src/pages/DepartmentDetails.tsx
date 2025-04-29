import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_DEPARTMENT,
  UPDATE_DEPARTMENT,
  GET_SUB_DEPARTMENTS,
  CREATE_SUB_DEPARTMENT,
  DELETE_SUB_DEPARTMENT,
  UPDATE_SUB_DEPARTMENT,
} from "../graphql/operations";
import {
  Department,
  SubDepartment,
  PaginatedResponse,
} from "../types/department";
import DepartmentForm from "../components/DepartmentForm";
import { toast } from "react-hot-toast";

interface SubDepartmentResponse {
  getSubDepartments: {
    subDepartments: SubDepartment[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

export default function DepartmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubDepartment, setEditingSubDepartment] =
    useState<SubDepartment | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { loading, error, data } = useQuery<{ getDepartment: Department }>(
    GET_DEPARTMENT,
    {
      variables: { id: parseInt(id!, 10) },
    }
  );

  const { data: subDepartmentsData, refetch: refetchSubDepartments } =
    useQuery<SubDepartmentResponse>(GET_SUB_DEPARTMENTS, {
      variables: {
        departmentId: parseInt(id!, 10),
        paginationInput: { page, limit },
      },
    });

  const [updateDepartment, { loading: updateLoading }] = useMutation(
    UPDATE_DEPARTMENT,
    {
      onCompleted: () => {
        setIsEditing(false);
        toast.success("Department updated successfully!");
      },
      onError: (error) => {
        toast.error("Failed to update department: " + error.message);
      },
    }
  );

  const [updateSubDepartment, { loading: updateSubLoading }] = useMutation(
    UPDATE_SUB_DEPARTMENT,
    {
      onCompleted: () => {
        setEditingSubDepartment(null);
        refetchSubDepartments();
        toast.success("Sub-department updated successfully!");
      },
      onError: (error) => {
        toast.error("Failed to update sub-department: " + error.message);
      },
    }
  );

  const [createSubDepartment, { loading: createSubLoading }] = useMutation(
    CREATE_SUB_DEPARTMENT,
    {
      onCompleted: () => {
        refetchSubDepartments();
        toast.success("Sub-department created successfully!");
      },
      onError: (error) => {
        console.error("Error creating sub-department:", error);
        toast.error("Failed to create sub-department. Please try again.");
      },
    }
  );

  const [deleteSubDepartment] = useMutation(DELETE_SUB_DEPARTMENT, {
    onCompleted: () => refetchSubDepartments(),
  });

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Loading department details...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );

  const department = data?.getDepartment;
  if (!department) {
    return (
      <div className="text-center py-8 text-red-500">Department not found</div>
    );
  }

  const handleUpdateDepartment = async (formData: { name: string }) => {
    try {
      await updateDepartment({
        variables: {
          id: parseInt(id!, 10),
          updateDepartmentInput: {
            name: formData.name,
          },
        },
      });
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const handleUpdateSubDepartment = async (formData: { name: string }) => {
    if (!editingSubDepartment) return;

    try {
      await updateSubDepartment({
        variables: {
          id: parseInt(editingSubDepartment.id.toString(), 10),
          updateSubDepartmentInput: {
            name: formData.name,
          },
        },
      });
    } catch (error) {
      console.error("Error updating sub-department:", error);
      toast.error("Failed to update sub-department. Please try again.");
    }
  };

  const handleCreateSubDepartment = async (formData: { name: string }) => {
    try {
      await createSubDepartment({
        variables: {
          departmentId: parseInt(id!, 10),
          createSubDepartmentInput: {
            name: formData.name,
          },
        },
        refetchQueries: [
          {
            query: GET_SUB_DEPARTMENTS,
            variables: {
              departmentId: parseInt(id!, 10),
              paginationInput: { page, limit },
            },
          },
        ],
      });
    } catch (error) {
      console.error("Error creating sub-department:", error);
    }
  };

  const handleDeleteSubDepartment = async (subDepartmentId: number) => {
    if (
      window.confirm("Are you sure you want to delete this sub-department?")
    ) {
      try {
        await deleteSubDepartment({
          variables: { id: parseInt(subDepartmentId.toString(), 10) },
        });
        toast.success("Sub-department deleted successfully!");
      } catch (error) {
        console.error("Error deleting sub-department:", error);
        toast.error("Failed to delete sub-department. Please try again.");
      }
    }
  };

  const subDepartments =
    subDepartmentsData?.getSubDepartments.subDepartments || [];
  const totalPages = subDepartmentsData?.getSubDepartments.totalPages || 0;
  const currentPage = subDepartmentsData?.getSubDepartments.currentPage || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-4 py-2 mb-8 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
        >
          <span className="mr-2">←</span> Back to Departments
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Main Department Card */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex justify-between items-start mb-8">
                {!isEditing ? (
                  <>
                    <div>
                      <h1 className="text-3xl font-bold mb-3 text-gray-800">
                        {department.name}
                      </h1>
                      <div className="mt-4 text-sm text-gray-500">
                        <p className="flex items-center">
                          <span className="mr-2">👤</span>
                          Created by:{" "}
                          {department.createdBy?.username || "Unknown"}
                        </p>
                        <p className="flex items-center">
                          <span className="mr-2">📅</span>
                          Created:{" "}
                          {new Date(department.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                    >
                      <span className="mr-2">✏️</span>
                      Edit Department
                    </button>
                  </>
                ) : (
                  <div className="w-full">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                      Edit Department
                    </h2>
                    <DepartmentForm
                      onSubmit={handleUpdateDepartment}
                      initialData={department}
                      isLoading={updateLoading}
                      submitButtonText="Update Department"
                    />
                    <button
                      onClick={() => setIsEditing(false)}
                      className="mt-4 text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Sub-departments List */}
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="mr-2">📁</span>
                  Current Sub-Departments
                </h2>
                {department.subDepartments.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {department.subDepartments.map((subDept) => (
                      <div
                        key={subDept.id}
                        className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors duration-200"
                      >
                        {editingSubDepartment?.id === subDept.id ? (
                          <div className="w-full">
                            <DepartmentForm
                              onSubmit={handleUpdateSubDepartment}
                              initialData={subDept}
                              isLoading={updateSubLoading}
                              formType="subDepartment"
                              submitButtonText="Update Sub-department"
                            />
                            <button
                              onClick={() => setEditingSubDepartment(null)}
                              className="mt-2 text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-gray-700 font-medium">
                              {subDept.name}
                            </span>
                            <div className="flex gap-3">
                              <button
                                onClick={() => setEditingSubDepartment(subDept)}
                                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteSubDepartment(subDept.id)
                                }
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 bg-gray-50 rounded-lg p-4">
                    No sub-departments found. Add one to get started!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sub-department Creation Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">➕</span>
                Add Sub-Department
              </h2>
              <DepartmentForm
                onSubmit={handleCreateSubDepartment}
                isLoading={createSubLoading}
                formType="subDepartment"
                submitButtonText="Create Sub-department"
              />
            </div>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
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
