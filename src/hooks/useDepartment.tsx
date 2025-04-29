import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import {
  Department,
  DepartmentResponse,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  PaginationInput,
  SubDepartment,
  SubDepartmentResponse,
  SubDepartmentInput,
  UpdateSubDepartmentInput,
} from "../types/department";

// Department Queries
const GET_DEPARTMENTS = gql`
  query GetDepartments($paginationInput: PaginationInput!) {
    getDepartments(paginationInput: $paginationInput) {
      departments {
        id
        name
        subDepartments {
          id
          name
        }
        createdBy {
          username
        }
      }
      total
      totalPages
      currentPage
    }
  }
`;

const GET_DEPARTMENT = gql`
  query GetDepartment($id: Int!) {
    getDepartment(id: $id) {
      id
      name
      subDepartments {
        id
        name
      }
      createdBy {
        username
      }
      createdAt
      updatedAt
    }
  }
`;

// Department Mutations
const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      subDepartments {
        id
        name
      }
      createdBy {
        username
      }
      createdAt
    }
  }
`;

const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($id: Int!, $input: UpdateDepartmentInput!) {
    updateDepartment(id: $id, input: $input) {
      id
      name
      updatedAt
    }
  }
`;

const REMOVE_DEPARTMENT = gql`
  mutation RemoveDepartment($id: Int!) {
    removeDepartment(id: $id) {
      id
      name
    }
  }
`;

// Sub-department Mutations
const CREATE_SUB_DEPARTMENT = gql`
  mutation CreateSubDepartment(
    $departmentId: Int!
    $input: SubDepartmentInput!
  ) {
    createSubDepartment(departmentId: $departmentId, input: $input) {
      id
      name
      department {
        id
        name
      }
      createdAt
    }
  }
`;

const GET_SUB_DEPARTMENTS = gql`
  query GetSubDepartments(
    $paginationInput: PaginationInput!
    $departmentId: Int!
  ) {
    getSubDepartments(
      paginationInput: $paginationInput
      departmentId: $departmentId
    ) {
      subDepartments {
        id
        name
        department {
          name
        }
        createdAt
        updatedAt
      }
      total
      totalPages
      currentPage
    }
  }
`;

const UPDATE_SUB_DEPARTMENT = gql`
  mutation UpdateSubDepartment($id: Int!, $input: UpdateSubDepartmentInput!) {
    updateSubDepartment(id: $id, input: $input) {
      id
      name
      updatedAt
    }
  }
`;

const REMOVE_SUB_DEPARTMENT = gql`
  mutation RemoveSubDepartment($id: Int!) {
    removeSubDepartment(id: $id) {
      id
      name
    }
  }
`;

export function useDepartments(
  paginationInput: PaginationInput = { page: 1, limit: 10 }
) {
  const { data, loading, error, refetch } = useQuery<{
    getDepartments: DepartmentResponse;
  }>(GET_DEPARTMENTS, {
    variables: { paginationInput },
  });

  const [createDepartment] = useMutation<
    { createDepartment: Department },
    { input: CreateDepartmentInput }
  >(CREATE_DEPARTMENT);

  const [updateDepartment] = useMutation<
    { updateDepartment: Department },
    { id: number; input: UpdateDepartmentInput }
  >(UPDATE_DEPARTMENT);

  const [removeDepartment] = useMutation<
    { removeDepartment: Department },
    { id: number }
  >(REMOVE_DEPARTMENT);

  const [createSubDepartment] = useMutation<
    { createSubDepartment: SubDepartment },
    { departmentId: number; input: SubDepartmentInput }
  >(CREATE_SUB_DEPARTMENT);

  const [updateSubDepartment] = useMutation<
    { updateSubDepartment: SubDepartment },
    { id: number; input: UpdateSubDepartmentInput }
  >(UPDATE_SUB_DEPARTMENT);

  const [removeSubDepartment] = useMutation<
    { removeSubDepartment: SubDepartment },
    { id: number }
  >(REMOVE_SUB_DEPARTMENT);

  return {
    departments: data?.getDepartments.departments || [],
    pagination: data?.getDepartments
      ? {
          total: data.getDepartments.total,
          totalPages: data.getDepartments.totalPages,
          currentPage: data.getDepartments.currentPage,
        }
      : null,
    loading,
    error,
    refetch,
    createDepartment: (input: CreateDepartmentInput) =>
      createDepartment({ variables: { input } }),
    updateDepartment: (id: number, input: UpdateDepartmentInput) =>
      updateDepartment({ variables: { id, input } }),
    removeDepartment: (id: number) => removeDepartment({ variables: { id } }),
    createSubDepartment: (departmentId: number, input: SubDepartmentInput) =>
      createSubDepartment({
        variables: { departmentId, input },
      }),
    updateSubDepartment: (id: number, input: UpdateSubDepartmentInput) =>
      updateSubDepartment({ variables: { id, input } }),
    removeSubDepartment: (id: number) =>
      removeSubDepartment({ variables: { id } }),
  };
}

export function useDepartment(id: number) {
  const { data, loading, error } = useQuery<{ getDepartment: Department }>(
    GET_DEPARTMENT,
    {
      variables: { id },
    }
  );

  return {
    department: data?.getDepartment,
    loading,
    error,
  };
}

export function useSubDepartments(
  departmentId: number,
  paginationInput: PaginationInput = { page: 1, limit: 10 }
) {
  const { data, loading, error, refetch } = useQuery<{
    getSubDepartments: SubDepartmentResponse;
  }>(GET_SUB_DEPARTMENTS, {
    variables: { departmentId, paginationInput },
  });

  return {
    subDepartments: data?.getSubDepartments.subDepartments || [],
    pagination: data?.getSubDepartments
      ? {
          total: data.getSubDepartments.total,
          totalPages: data.getSubDepartments.totalPages,
          currentPage: data.getSubDepartments.currentPage,
        }
      : null,
    loading,
    error,
    refetch,
  };
}
