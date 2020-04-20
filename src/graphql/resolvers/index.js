import UserResolvers from "./user-resolvers";
import CourseResolvers from "./course-resolvers";
import Course from "../../models/Course/Course";
import Module from "../../models/Course/Module";
import Project from "../../models/Course/Project";
import User from "../../models/User";
import Material from "../../models/Course/Material";
import CompletedModule from "../../models/CompletedModule";
import Tool from "../../models/Course/Tool";

export default {
  User: {
    course: (_, args, { user }) => Course.findById(_.course)
  },
  Course: {
    users: (_, args, { user }) => User.find({ _id: _.users }),
    modules: (_, args, { user }) => Module.find({ _id: _.modules }),
    tools_needed: (_, args, user) => Tool.find({ _id: _.tools_needed })
  },

  Module: {
    course: (_, args, { user }) => Course.findById(_.course),
    project: (_, args, { user }) => Project.findById(_.project),
    materials: (_, args, { user }) => Material.find({ _id: _.materials })
  },

  CompletedModule: {
    projects: (_, args, user) => Project.find({ _id: _.projects }),
    modules: (_, args, { user }) => Module.find({ _id: _.modules })
  },

  LoggedUser: {
    user: (_, args, { user }) => User.findById(_.user),
    course: (_, args, user) => Course.findById(_.course),
    completed_modules: (_, args, { user }) =>
      CompletedModule.find({ completed_modules: _.completed_modules }),
    all_modules: (_, args, { user }) => Module.find({ course: _.course }),
    current_week: (_, args, { user }) =>
      Module.findOne({ course: _.course, current_week: true })
  },

  Query: {
    course_list: CourseResolvers.course_list,
    logged_user_details: UserResolvers.logged_user_details,
    module_list: CourseResolvers.module_list,
    get_module: CourseResolvers.get_module,
    logged_user_completed_modules: UserResolvers.logged_user_completed_modules,
    students_list: UserResolvers.students_list,
    current_week_module: CourseResolvers.current_week_module,
    logged_user_notifs: UserResolvers.logged_user_notifs,
    send_email_to_users: UserResolvers.send_email_to_users,
    get_user: UserResolvers.get_user,
    get_course: CourseResolvers.get_course
  },

  Mutation: {
    create_account: UserResolvers.create_account,
    signup_stage_1: UserResolvers.signup_stage_1,
    signup_stage_2: UserResolvers.signup_stage_2,
    student_login: UserResolvers.student_login,
    forgot_password: UserResolvers.forgot_password,
    submit_project: CourseResolvers.submit_project,
    set_current_week_module_admin: UserResolvers.set_current_week_module_admin,
    add_tools_needed_admin: CourseResolvers.add_tools_needed_admin,
    update_user_balance: UserResolvers.update_user_balance,

    create_course_admin: CourseResolvers.create_course_admin,
    create_module_admin: CourseResolvers.create_module_admin,
    create_project_admin: CourseResolvers.create_project_admin,
    create_material_admin: CourseResolvers.create_material_admin,
    create_notifs_admin: UserResolvers.create_notifs_admin,
    reset_student_balance_admin: UserResolvers.reset_student_balance_admin
  }
};
