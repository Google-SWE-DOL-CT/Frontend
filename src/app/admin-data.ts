export type AdminRoot = AdminUser[]

export interface AdminUser {
  id: number
  firstName: string
  lastName: string
  email: string
  password: string
  githubPic: string
  isAdmin: number
  SubFunctions: SubFunction[]
}

export interface SubFunction {
  id: number
  subId: number
  papperId: string
  outcomes: string
  job_subFunction: number
  JobFunctionId: number
}

export interface AdminInputRoot {
  adminInput: AdminInput
}

export interface AdminInput {
  id: number
  meetsExpectations: any
  comments: any
  onJobPractice: any
  mvPractice: any
}