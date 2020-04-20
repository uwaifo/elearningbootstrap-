import Course from '../../models/Course/Course';
import { authUser } from '../../services/auth';
import Module from '../../models/Course/Module';
import Project from '../../models/Course/Project';
import Material from '../../models/Course/Material';
import CompletedModule from '../../models/CompletedModule';
import LoggedUser from '../../models/LoggedUser';
import Tool from '../../models/Course/Tool';


export default {
    //creating a new course by admin
    create_course_admin: async (_, args, user) => {

      try {
         //course title check
        let course_check = await Course.findOne( { title: args.title });
        
        if(!course_check){
          //creating a new course
          await Course.create({ ...args });

          return {
            message: 'Course created successfully',
            action: 'add_modules',
            status: true
          }
  
        }

        //if course has been created 
        return {
          message: 'Course already created',
          action: 'create_another',
          status: false
        }

      } catch(error){

        throw error;

      }

    },

    //getting list of courses - web app wide
    course_list: async (_, args, user) => {

      try {

        return Course.find({});

      } catch (error){

        throw error;

      }

    },

    //creating a new course module
    create_module_admin: async (_, { project_title, project_instructions, project_hints, ...args }, user) => {

      try {
         //module title check
        let module_check = await Module.findOne({ title: args.title, course: args.course, week_no: args.week_no } );
        
        if(module_check){
          //updating the existig module
          await Module.updateOne({ title: args.title, course: args.course }, { $set: { ...args }});

          //updating existing project
          await Project.updateOne({ module: args.module }, { $set: { ...args }});

          //response
          return {
            message: 'Module updated and project updated',
            action: 'updated_possible',
            status: false
          }
  
        } 

        //creating course module
        let new_module = await Module.create({ ...args });

        //increasing the number of modules
        await Course.updateOne({ _id: args.course }, { $push: { modules: new_module._id} });
        
        // //checking if module exists in logged user collection
        // let logged_user_module_check = await LoggedUser.findOne({ course: args.course, all_modules: new_module._id });

        // //Adding module to loggedUser collection
        // if(!logged_user_module_check){
        //await LoggedUser.updateMany({ course: args.course }, { $push: { all_modules: new_module.modules }});
       // }

        //creating project for module
        let new_project = await Project.create({ module: new_module._id, title: project_title, instructions: project_instructions, hints: project_hints });

        //updating module with project
        await Module.updateOne({ _id: new_module._id }, { $set: { project: new_project._id }});

        return {
          message: 'Module and project created successfully',
          action: 'add_more',
          status: true
        }

      } catch(error){

        throw error;

      }

    },

    //getting list of module for specific course
    module_list: async (_, { course }, user) => {

      try {
         //authenticating user
        //let user_info = await authUser(user);

        if(course){
          return Module.find({ course: course });
        }

        //return Module.find({ course: course });

      } catch(error){

        throw error;

      }
      
    },

    //getting single module
    get_module: async (_, { module }, user) => {

      try {
         //authenticating user
        //let user_info = await authUser(user);

        return await Module.findById(module);

        //return Module.find({ course: course });

      } catch(error){

        throw error;

      }
      
    },

    //updating new project
    create_project_admin: async (_, args, user) => {

      try {
          //update project
          let project_check = await Project.findOne({ module: args.module, title: args.title });

          if(project_check != ''){
            await Project.updateOne({ module: args.module }, { $set: { ...args }});
            return {
              message: 'Module updated successfully',
              action: 'update_possible',
              status: true
            }
          }

          let create_project = await Project.create({ ...args });

          await Module.updateOne({ _id: args.module }, { $set: { project: create_project._id } });

          return {
            message: 'Module created successfully',
            action: 'update_possible',
            status: true
          }


      } catch(error){

        throw error;

      }
      
    },

    //creating new material
    create_material_admin: async (_, args, user) => {

      try {

          //checking if material already exist
          let material_check = await Material.findOne({ module: args.module, url: args.url });

          if(material_check){
            //updating material because it exist
            await Material.updateOne({ module: args.module, url: args.url }, { $set: { ...args }});

            //response
            return {
              message: 'Material updated successfully',
              action: 'update_possible',
              status: false
            }
          }

          //creating new material
          let new_material = await Material.create({ ...args });

          await Module.updateOne({ _id: args.module }, { $push: { materials: new_material._id }});

          //response
          return {
            message: 'Material created successfully',
            action: 'update_possible',
            status: true
          }


      } catch(error){

        throw error;

      }
      
    },

    //submitting project
    submit_project: async(_, args, user) => {

      try {
         //authenticating user
        let user_info = await authUser(user);

        let project_subm_check = await CompletedModule.findOne({ modules: args.module, projects: args.project });

        if(project_subm_check){

          //updating project
          await CompletedModule.updateOne({ modules: args.module, projects: args.project }, { $set: { user: user_info._id, url: args.url }, $push: { modules: args.module, projects: args.project }});

          //updating loggedUser collection
          await LoggedUser.updateOne({ user: user_info._id }, { $push: { completed_modules: args.modules }});

          return {
            message: 'Project Updated successfully',
            action: 'update_allowed',
            status: false
          }
        }

        //submitting new project
        await CompletedModule.create({ user: user_info._id, url: args.url, modules: args.module, projects: args.project });

        //updating loggedUser collection
        await LoggedUser.updateOne({ user: user_info._id }, { $push: { completed_modules: args.module }});

        return {
          message: 'Project submitted successfully',
          action: 'update_allowed',
          status: true
        }

      } catch(error){

        throw error;

      }
      
    },

    //specifying the current week module
    current_week_module: async (_, { week_no }, user) => {

      try {
        //authenticating user
       let user_info = await authUser(user);

       return await Module.findOne({ course: user_info.course, current_week: true });

     } catch(error){

       throw error;

     }
      
    },

    //gettting course by id
    get_course: async (_, args, user) => {
      try {

        let course_info = await Course.findById(args.course)

        if(course_info != ''){
          return course_info;
        }

        throw new Error('Invalid user id');

     } catch(error){

       throw error;

     }
      
    },

    //adding tools to the course
    add_tools_needed_admin: async (_, args, user) => {

      try {

        let tool_check = await Tool.findOne({ course: args.course, url: args.url });

        if(tool_check){
          //updating tools
          await Tool.updateOne({ course: args.course, url: args.url }, { $set: { ...args }});
          return {
            message:'tools updated successfully',
            action:'update_allowed',
            status: false
          }
        }

        //adding new tool
        let new_tool = await Tool.create({ ...args });

        //updating course by adding tool id
        await Course.updateOne({ _id: args.course }, { $push: { tools_needed: new_tool._id }});

        return {
          message:'tools created successfully',
          action:'update_allowed',
          status: false
        }

     } catch(error){

       throw error;

     }
      
    },

  
};