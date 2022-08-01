export interface UserRoot {
  users: User[]
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
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
  UserJob: UserJob
  JobFunction: JobFunction
}

export interface UserJob {
  status: string
  code: any
  language: any
  githubLink: any
  screenshot: any
  justification: any
  adminApproval: number
  UserId: number
  SubFunctionId: number
}

export interface JobFunction {
  title: string
  description: string
  id: number
}


export class User {
  email!: string
  password!: string
}
