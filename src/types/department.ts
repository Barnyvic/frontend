import { User } from "./auth";

export interface Department {
  id: number;
  name: string;
  subDepartments: SubDepartment[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentInput {
  name: string;
  subDepartments?: SubDepartmentInput[];
}

export interface UpdateDepartmentInput {
  name: string;
}

export interface SubDepartment {
  id: number;
  name: string;
  department: Department;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubDepartmentInput {
  name: string;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface DepartmentResponse {
  departments: Department[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface SubDepartmentResponse {
  subDepartments: SubDepartment[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface SubDepartmentInput {
  name: string;
}

export interface UpdateSubDepartmentInput {
  name: string;
}
