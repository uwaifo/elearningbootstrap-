//import { gql } from "apollo-server-express";
import { gql } from "apollo-server";

export default gql`
  scalar Date

  type Status {
    message: String
    action: String
    status: Boolean
    user: User
  }

  type User {
    _id: ID
    fname: String
    lname: String
    email: String
    phone: String
    onboarding_stage: String
    course: Course
    gender: String
    town: String
    state: String
    slot_reservation: Boolean
    balance: Boolean
    updatedAt: Date
    createdAt: Date
  }

  type Course {
    _id: ID
    users: [User]
    title: String
    description: String
    tools_needed: [Tool]
    duration: Int
    modules: [Module]
    group_link: String
    curriculum: String
    updatedAt: Date
    createdAt: Date
  }

  type Module {
    _id: ID
    course: Course
    title: String
    overview: String
    objectives: String
    guide: String
    video_url: String
    more_content: String
    locked: Boolean
    duration: Int
    project: Project
    week_no: Int
    submission_link: String
    materials: [Material]
    updatedAt: Date
    createdAt: Date
  }

  type Project {
    _id: ID
    module: Module
    title: String
    instructions: String
    hints: String
    updatedAt: Date
    createdAt: Date
  }

  type Material {
    _id: ID
    module: Module
    title: String
    description: String
    url: String
    updatedAt: Date
    createdAt: Date
  }

  type CompletedModule {
    _id: ID
    user: ID
    projects: [Project]
    modules: [Module]
    updatedAt: Date
    createdAt: Date
  }

  type LoggedUser {
    _id: ID
    user: User
    course: Course
    completed_modules: [CompletedModule]
    all_modules: [Module]
    current_week: Module
    updatedAt: Date
    createdAt: Date
  }

  type Tool {
    _id: ID
    title: String
    url: String
    course: ID
  }

  type Notifs {
    _id: ID
    title: String
    description: String
    url: String
    date: Date
    createdAt: Date
  }

  type Query {
    course_list: [Course]
    logged_user_details: LoggedUser
    module_list(course: ID): [Module]
    get_module(module: ID!): Module
    current_week_module: Module
    students_list: [User]
    logged_user_completed_modules: [CompletedModule]
    logged_user_notifs: [Notifs]
    send_email_to_users(
      email: String
      subject: String!
      htmlbody: String!
      course: ID
    ): Status
    get_user(user: ID!): User
    get_course(course: ID!): Course
  }

  type Mutation {
    create_account(
      fname: String!
      lname: String!
      email: String!
      phone: String
      balance: Boolean
    ): Status
    signup_stage_1(email: String!, password: String!): Status
    signup_stage_2(
      email: String!
      course: ID!
      gender: String
      town: String
      state: String
    ): Status
    student_login(email: String!, password: String!): Status
    forgot_password(email: String): Status
    submit_project(module: ID!, project: ID!, url: String!): Status
    update_user_balance(user: ID!, status: Boolean!): Status

    create_course_admin(
      title: String!
      description: String!
      curriculum: String
      group_link: String
    ): Status
    create_module_admin(
      course: ID!
      title: String!
      week_no: Int!
      overview: String!
      objectives: String!
      guide: String
      video_url: String
      more_content: String
      project_title: String
      project_instructions: String
      project_hints: String
    ): Status
    create_project_admin(
      module: ID!
      title: String
      instructions: String!
      hints: String
    ): Status
    create_material_admin(
      module: ID!
      title: String
      description: String!
      url: String
    ): Status
    set_current_week_module_admin(
      current_week_no: Int!
      locked: Boolean!
      prev_week_no: Int!
      current_week: Boolean!
    ): Status
    create_notifs_admin(
      title: String!
      course: [ID]!
      type: String!
      description: String!
      url: String
      date: Date
    ): Status
    add_tools_needed_admin(course: ID!, title: String!, url: String): Status
    reset_student_balance_admin: Status
  }
`;
