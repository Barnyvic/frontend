import { gql } from "@apollo/client";

// User Mutations
export const REGISTER_USER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      id
      username
      createdAt
      updatedAt
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
    }
  }
`;

// Department Queries
export const GET_DEPARTMENTS = gql`
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
          id
          username
        }
        createdAt
      }
      total
      totalPages
      currentPage
    }
  }
`;

export const GET_DEPARTMENT = gql`
  query GetDepartment($id: Int!) {
    getDepartment(id: $id) {
      id
      name
      createdAt
      createdBy {
        id
        username
      }
      subDepartments {
        id
        name
      }
    }
  }
`;

export const GET_SUB_DEPARTMENTS = gql`
  query GetSubDepartments(
    $departmentId: Int!
    $paginationInput: PaginationInput!
  ) {
    getSubDepartments(
      departmentId: $departmentId
      paginationInput: $paginationInput
    ) {
      subDepartments {
        id
        name
        createdAt
      }
      total
      totalPages
      currentPage
    }
  }
`;

// Department Mutations
export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($createDepartmentInput: CreateDepartmentInput!) {
    createDepartment(createDepartmentInput: $createDepartmentInput) {
      id
      name
      createdAt
      createdBy {
        id
        username
      }
      subDepartments {
        id
        name
      }
    }
  }
`;

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment(
    $id: Int!
    $updateDepartmentInput: UpdateDepartmentInput!
  ) {
    updateDepartment(id: $id, updateDepartmentInput: $updateDepartmentInput) {
      id
      name
      updatedAt
    }
  }
`;

export const DELETE_DEPARTMENT = gql`
  mutation RemoveDepartment($id: Int!) {
    removeDepartment(id: $id) {
      id
      name
    }
  }
`;

// Sub-Department Mutations
export const CREATE_SUB_DEPARTMENT = gql`
  mutation CreateSubDepartment(
    $departmentId: Int!
    $createSubDepartmentInput: SubDepartmentInput!
  ) {
    createSubDepartment(
      departmentId: $departmentId
      createSubDepartmentInput: $createSubDepartmentInput
    ) {
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

export const UPDATE_SUB_DEPARTMENT = gql`
  mutation UpdateSubDepartment(
    $id: Int!
    $updateSubDepartmentInput: UpdateSubDepartmentInput!
  ) {
    updateSubDepartment(
      id: $id
      updateSubDepartmentInput: $updateSubDepartmentInput
    ) {
      id
      name
      updatedAt
    }
  }
`;

export const DELETE_SUB_DEPARTMENT = gql`
  mutation RemoveSubDepartment($id: Int!) {
    removeSubDepartment(id: $id) {
      id
      name
    }
  }
`;
