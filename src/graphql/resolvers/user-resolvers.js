import User from "../../models/User";
//import { authUser ../../models/Userrvices/auth";
import { authUser } from "../../services/auth";

import Course from "../../models/Course/Course";
import { rsGen } from "../../services/randomGen";
import { sendEmail } from "../../services/sendEmail";
import LoggedUser from "../../models/LoggedUser";
import Module from "../../models/Course/Module";
import CompletedModule from "../../models/CompletedModule";
import Notifs from "../../models/Notifs";

export default {
  //creating user account
  create_account: async (_, args, user) => {
    try {
      let user_check = await User.findOne({ email: args.email });

      if (user_check) {
        return {
          message: "User account exists",
          action: user_check.onboarding_stage,
          status: false
        };
      }

      let new_user = await User.create({ ...args, onboarding_stage: 1 });

      return {
        message: "Account created successfully",
        action: new_user.onboarding_stage,
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  //onboarding step I
  signup_stage_1: async (_, { email, password }, user) => {
    try {
      let user_check = await User.findOne({ email: email });

      if (user_check.onboarding_stage == 1) {
        //adding password to user account
        let update_user = await User.findOneAndUpdate(
          { email: email },
          {
            $set: {
              password: user_check._hashPassword(password),
              onboarding_stage: 2
            }
          },
          { new: true }
        );

        return {
          message: "Password created successfully",
          action: user_check.onboarding_stage,
          status: true
        };
      } else if (user_check.onboarding_stage == 2) {
        return {
          message: "You are done with stage 1",
          action: user_check.onboarding_stage,
          status: false
        };
      } else if (user_check.onboarding_stage == 3) {
        return {
          message: "You are done with onboarding",
          action: user_check.onboarding_stage,
          status: false
        };
      } else if (!user_check.email) {
        return {
          message: "You haven't signup or paid for our course",
          action: "goto_dashboard",
          status: false
        };
      }
    } catch (error) {
      throw error;
    }
  },

  //onboarding step II
  signup_stage_2: async (_, args, user) => {
    try {
      //updating user information
      let user_check = await User.findOne({ email: args.email });

      //checking if user id has been added to list of student for that course
      let user_course_check = await Course.findOne({
        course: args.course,
        users: user_check._id
      });

      //console.log(JSON.stringify(user_course_check));

      if (!user_course_check) {
        if (user_check.onboarding_stage == 1) {
          return {
            message: "You haven't completed stage 1",
            action: "1",
            status: false
          };
        } else if (user_check.onboarding_stage == 3) {
          return {
            message: user_check.createToken(),
            action: "3",
            user: user_check,
            status: false
          };
        } else if (user_check.onboarding_stage == 2) {
          await User.findOneAndUpdate(
            { email: args.email },
            { $set: { ...args, onboarding_stage: 3 } },
            { new: true }
          );
          //increasing the number of users taking course by +1
          let user_course = await Course.findByIdAndUpdate(
            args.course,
            { $push: { users: user_check._id } },
            { new: true }
          );

          //creating loggedUser collection
          await LoggedUser.create({
            user: user_check._id,
            course: user_course._id
          });

          //sending email to user
          sendEmail(
            args.email,
            "2020 MDS Cohort 1 - Student successful onboarding",
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/> <title>Successful Onboarding</title></head><style type="text/css"> body{margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif;}.content{max-width: 600px; width: 100%;}.header{padding: 40px 30px 20px 30px;}.footer{padding: 20px 30px 15px 30px;}.footercopy{font-size: 14px; color: #ffffff;}.footercopy a{color: #ffffff; text-decoration: underline;}</style><body style="background-color: #f7f7f7;"> <table width="100%" bgcolor="#f7f7f7" border="0" cellpadding="0" cellspacing="0"> <tr> <td> <table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td bgcolor="#ffffff" class="header" style="border-top:4px solid #ff3c3c"> <table width="250" border="0" cellpadding="0" cellspacing="0" style="padding: 30px 0 0 30px"> <tr> <td height="60"> <img src="https://motionwares.com/assets/icons/logo.png" height="40" border="0" alt="Motionwares logo"/> </td></tr></table> </td></tr><tr> <td style="padding: 20px 30px 20px 30px"> <table width="100%" border="0" cellpadding="0" cellspacing="0"> <tr> <td style="font-weight: bold; padding-bottom: 20px; font-size: 20px;"> Hello ' +
              user_check.fname +
              ', </td></tr><tr> <td style="padding-bottom: 40px;"> You have been successfully onboarded. </td></tr><tr> <td style="padding: 10px 0px 20px 0px;"> <table border="0" cellpadding="0" cellspacing="0" style="background-color:#f04839;; border:1px solid #f04839;; border-radius:5px;width:100%"> <tr> <td align="center" valign="middle" style="color:#FFFFFF; font-size:16px; font-weight:bold;padding-top:15px; padding-right:30px; padding-bottom:15px; padding-left:30px;"> <a href="https:learn.motionwares.com/login" target="_blank" style="color:#FFFFFF; text-decoration:none;">Go to dashboard</a> </td></tr></table> </td></tr></table> </td></tr><tr> <td class="footer" bgcolor="#353535"> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td style="padding-top:30px;text-align: center;"> <img src="https://motionwares.com/assets/icons/mail/logo.png" width="50" border="0" alt="Motionwares"/> </td></tr><tr> <td align="center" class="footercopy" style="padding-top:30px"> &reg;Motionwares. All rights reserved.<br><br><span>Plot 260, Adamu Ciroma Crescent,<br>Jabi, Abuja, Nigeria.</span> </td></tr><tr> <td align="center" style="padding: 20px 0 20px 0;"> <table border="0" cellspacing="0" cellpadding="0"> <tr> <td style="text-align: center; padding: 0 10px 0 10px;"> <a href="mailto:hello@motionwares.com" style="color:#fff"> Email Us </a> </td><td style="text-align: center; padding: 0 10px 0 10px;"> <a href="http://www.twitter.com/" style="color:#fff"> Call Us </a> </td></tr></table> </td></tr></table> </td></tr></table> </td></tr></table></body></html>'
          );

          return {
            message: user_check.createToken(),
            action: "goto_dashboard",
            user: user_check,
            status: true
          };
        }
      }
    } catch (error) {
      throw error;
    }
  },

  //login students in
  student_login: async (_, { email, password }, user) => {
    try {
      email.toLowerCase();

      let user_check = await User.findOne({ email: email });
      //checking if student has completed stage 1
      if (user_check != "") {
        if (user_check.onboarding_stage == 1) {
          return {
            message: "Go to onboarding stage 1",
            action: "1",
            status: false,
            user: user_check
          };
        } else if (user_check.onboarding_stage == 2) {
          return {
            message: "Go to onboarding stage 2",
            action: "2",
            status: false,
            user: user_check
          };
        } else if (user_check.onboarding_stage == 3) {
          if (user_check.verifyPass(password)) {
            return {
              message: user_check.createToken(),
              action: "goto_dashboard",
              status: true,
              user: user_check
            };
          }

          //password does not match response
          return {
            message: "Password or Email is Incorrect",
            action: "try_again",
            status: false,
            user: user_check
          };
        }

        //returning that the stage to go
        return {
          message: "Go to onboarding stage 1",
          action: "1",
          status: false,
          user: user_check
        };
      } else {
        return {
          message: "You haven't signup or paid for our course",
          action: "course_signup",
          status: false,
          user: user_check
        };
      }
    } catch (error) {
      console.log("Run error block");

      throw error;
    }
  },

  //user forgot password
  forgot_password: async (_, { email }, user) => {
    try {
      let new_pass = await rsGen();
      email.toLowerCase();

      let user_check = await User.findOne({ email: email });

      if (user_check) {
        await User.updateOne(
          { email: email },
          { $set: { password: user_check._hashPassword(new_pass) } }
        );

        //Sending new password to the user
        sendEmail(
          email,
          "MDS Cohort 1 - Password reset request",
          '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/> <title>Reset Password</title></head><style type="text/css"> body{margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif;}.content{max-width: 600px; width: 100%;}.header{padding: 40px 30px 20px 30px;}.footer{padding: 20px 30px 15px 30px;}.footercopy{font-size: 14px; color: #ffffff;}.footercopy a{color: #ffffff; text-decoration: underline;}</style><body style="background-color: #f7f7f7;"> <table width="100%" bgcolor="#f7f7f7" border="0" cellpadding="0" cellspacing="0"> <tr> <td> <table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td bgcolor="#ffffff" class="header" style="border-top:4px solid #ff3c3c;""> <table width="250" border="0" cellpadding="0" cellspacing="0" style="padding: 30px 0 0 30px"> <tr> <td height="60"> <img src="https://motionwares.com/assets/icons/logo.png" height="40" border="0" alt="Motionwares logo"/>  </td></tr></table> </td></tr><tr> <td style="padding: 20px 30px 20px 30px"> <table width="100%" border="0" cellpadding="0" cellspacing="0"> <tr> <td style="font-weight: bold; padding-bottom: 20px; font-size: 20px;"> Hello ' +
            user_check.fname +
            ', </td></tr><tr> <td style="padding-bottom: 24px; line-height: 1.5;"> Your request to reset your password was successful, your new password is <span style="font-weight: bold;">' +
            new_pass +
            '</span> </td></tr><tr> <td style="padding-bottom: 40px; line-height: 1.5;"> If you didn\'t make this request, contact <a href="mailto: hello@motionwares.com">hello@motionwares.com</a> </td></tr><tr> <td style="padding: 0px 0px 20px 0px;"> <table border="0" cellpadding="0" cellspacing="0" style="background-color:#f04839; border:1px solid #f04839;; border-radius:5px;width:100%"> <tr> <td align="center" valign="middle" style="color:#FFFFFF; font-size:16px; font-weight:bold;padding-top:15px; padding-right:30px; padding-bottom:15px; padding-left:30px;"> <a href="https:learn.motionwares.com/login" target="_blank" style="color:#FFFFFF; text-decoration:none;">Go to login</a> </td></tr></table> </td></tr></table> </td></tr><tr> <td class="footer" bgcolor="#353535"> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td style="padding-top:30px;text-align: center;"> <img class="" src="https://motionwares.com/assets/icons/mail/logo.png" width="50" border="0" alt=""/> </td></tr><tr> <td align="center" class="footercopy" style="padding-top:30px"> &reg;Motionwares. All rights reserved.<br><br><span class="">Plot 260, Adamu Ciroma Crescent,<br>Jabi, Abuja, Nigeria.</span> </td></tr><tr> <td align="center" style="padding: 20px 0 20px 0;"> <table border="0" cellspacing="0" cellpadding="0"> <tr> <td style="text-align: center; padding: 0 10px 0 10px;"> <a href="mailto:hello@motionwares.com" style="color:#fff"> Email Us </a> </td><td style="text-align: center; padding: 0 10px 0 10px;"> <a href="http://www.twitter.com/" style="color:#fff"> Call Us </a> </td></tr></table> </td></tr></table> </td></tr></table> </td></tr></table></body></html>'
        );

        return {
          message: "Request successful, check your email for new password !",
          action: "goto_login",
          status: true
        };
      }

      throw new Error("Email address does not exist !");
    } catch (error) {
      throw error;
    }
  },

  //getting students list
  students_list: async (_, args, user) => {
    try {
      return await User.find({});
    } catch (error) {
      throw error;
    }
  },

  //getting logged user's completed module and project list
  logged_user_completed_modules: async (_, args, user) => {
    try {
      //authenticating user
      let user_info = await authUser(user);

      //getting user's completed modules
      return await CompletedModule.find({ user: user_info._id });
    } catch (error) {
      throw error;
    }
  },

  //getting course for logged student
  logged_user_details: async (_, args, user) => {
    try {
      //authenticating user
      let user_info = await authUser(user);

      let logged_user = await LoggedUser.findOne({ user: user_info._id });

      return logged_user;
    } catch (error) {
      throw error;
    }
  },

  //updating current week
  set_current_week_module_admin: async (_, args, user) => {
    try {
      await Module.updateMany(
        { week_no: args.prev_week_no },
        { $set: { current_week: false } }
      );

      //setting current week and unlocking the module
      await Module.updateMany(
        { week_no: args.current_week_no },
        { $set: { locked: args.locked, current_week: args.current_week } }
      );
      //sending email to user

      sendEmail(
        args.email,
        "2020 MDS Cohort 1 - This week module un-locked",
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/> <title>Module</title></head><style type="text/css"> body{margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif;}.content{max-width: 600px; width: 100%;}.header{padding: 40px 30px 20px 30px;}.footer{padding: 20px 30px 15px 30px;}.footercopy{font-size: 14px; color: #ffffff;}.footercopy a{color: #ffffff; text-decoration: underline;}</style><body style="background-color: #f7f7f7;"> <table width="100%" bgcolor="#f7f7f7" border="0" cellpadding="0" cellspacing="0"> <tr> <td> <table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td bgcolor="#ffffff" class="header" style="border-top:4px solid #ff3c3c"><table width="250" border="0" cellpadding="0" cellspacing="0" style="padding: 30px 0 0 30px"> <tr> <td height="60"> <img src="https://motionwares.com/assets/icons/logo.png" height="40" border="0" alt="Motionwares logo"/> </td></tr></table> </td></tr><tr> <td style="padding: 20px 30px 20px 30px"> <table width="100%" border="0" cellpadding="0" cellspacing="0"> <tr> <td style="font-weight: bold; padding-bottom: 20px; font-size: 20px;"> Hello there, </td></tr><tr> <td style="padding-bottom: 20px; line-height: 1.5;"> You can now access the <span style="font-weight: bold;">week ' +
          current_week_no +
          '</span> module from your dashboard </td></tr><tr> <td style="padding-bottom: 40px; line-height: 1.5;"> Happy learning 🙂 </td></tr><tr> <td style="padding: 10px 0px 20px 0px;"> <table border="0" cellpadding="0" cellspacing="0" style="background-color:#f04839;; border:1px solid #f04839;; border-radius:5px;width:100%"> <tr> <td align="center" valign="middle" style="color:#FFFFFF; font-size:16px; font-weight:bold;padding-top:15px; padding-right:30px; padding-bottom:15px; padding-left:30px;"> <a href="https:learn.motionwares.com/login" target="_blank" style="color:#FFFFFF; text-decoration:none;">Go to dashboard</a> </td></tr></table> </td></tr></table> </td></tr><tr> <td class="footer" bgcolor="#353535"> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td style="padding-top:30px;text-align: center;"> <img src="https://motionwares.com/assets/icons/mail/logo.png" width="50" border="0" alt="Motionwares"/> </td></tr><tr> <td align="center" class="footercopy" style="padding-top:30px"> &reg;Motionwares. All rights reserved.<br><br><span>Plot 260, Adamu Ciroma Crescent,<br>Jabi, Abuja, Nigeria.</span> </td></tr><tr> <td align="center" style="padding: 20px 0 20px 0;"> <table border="0" cellspacing="0" cellpadding="0"> <tr> <td style="text-align: center; padding: 0 10px 0 10px;"> <a href="mailto:hello@motionwares.com" style="color:#fff"> Email Us </a> </td><td style="text-align: center; padding: 0 10px 0 10px;"> <a href="http://www.twitter.com/" style="color:#fff"> Call Us </a> </td></tr></table> </td></tr></table> </td></tr></table> </td></tr></table></body></html>'
      );

      return {
        message: "Current week module updated successfully",
        action: "wait_till_next_week",
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  //creating new notification for students
  create_notifs_admin: async (_, args, user) => {
    try {
      // //checking notification exists
      // let notifs_check = await Notifs.find({ title: args.title });

      // if(notifs_check != ''){
      //   await Notifs.updateOne({ title: args.title },{ $set:  { ...args } })
      //   return {
      //     message: 'Notification updated',
      //     action: 'update_possible',
      //     status: false
      //   }
      // }

      await Notifs.create({ ...args });

      let user_lists = await User.find({}).select({ _id: 0, email: 1 });

      //getting list of students
      var student_list = [];
      for (var user in user_lists) {
        student_list.push(user_lists[user].email);
      }
      //console.log(student_list);
      //sending email to user
      sendEmail(
        student_list,
        "2020 MDS Cohort 1 - New notifcation post",
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/> <title>Onboarding</title></head><style type="text/css"> body{margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif;}.content{max-width: 600px; width: 100%;}.header{padding: 40px 30px 20px 30px;}.footer{padding: 20px 30px 15px 30px;}.footercopy{font-size: 14px; color: #ffffff;}.footercopy a{color: #ffffff; text-decoration: underline;}</style><body style="background-color: #f7f7f7;"> <table width="100%" bgcolor="#f7f7f7" border="0" cellpadding="0" cellspacing="0"> <tr> <td> <table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td bgcolor="#ffffff" class="header" style="border-top:4px solid #ff3c3c;"> <table width="250" border="0" cellpadding="0" cellspacing="0" style="padding: 30px 0 0 30px"> <tr> <td height="60"> <img src="https://motionwares.com/assets/icons/logo.png" height="40" border="0" alt="Motionwares logo"/> </td></tr></table> </td></tr><tr> <td style="padding: 30px 30px 20px 40px;"> <table width="100%" border="0" cellpadding="0" cellspacing="0"> <tr> <td style="font-weight: bold; padding-bottom: 20px; font-size: 20px;"> Hello there, </td></tr><tr> <td style="padding-bottom: 24px; line-height:1.5"> We have new notification for you, access your dashboard to view learn.motionwares.com/login</td></tr> <td class="footer" bgcolor="#353535"> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td style="padding-top:30px;text-align: center;"> <img class="" src="https://motionwares.com/assets/icons/mail/logo.png" width="50" border="0" alt=""/> </td></tr><tr> <td align="center" class="footercopy" style="padding-top:30px"> &reg;Motionwares. All rights reserved.<br><br><span class="">Plot 260, Adamu Ciroma Crescent,<br>Jabi, Abuja, Nigeria.</span> </td></tr><tr> <td align="center" style="padding: 20px 0 20px 0;"> <table border="0" cellspacing="0" cellpadding="0"> <tr> <td style="text-align: center; padding: 0 10px 0 10px;"> <a href="mailto:hello@motionwares.com" style="color:#fff"> Email Us </a> </td><td style="text-align: center; padding: 0 10px 0 10px;"> <a href="http://www.twitter.com/" style="color:#fff"> Call Us </a> </td></tr></table> </td></tr></table> </td></tr></table> </td></tr></table></body></html>'
      );

      return {
        message: "Notification created",
        action: "update_possible",
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  //getting list of users
  logged_user_notifs: async (_, args, user) => {
    try {
      //authenticating user
      let user_info = await authUser(user);

      return await Notifs.find({ course: user_info.course });
    } catch (error) {
      throw error;
    }
  },

  //resetting student balance to false
  reset_student_balance_admin: async (_, args, user) => {
    try {
      await User.updateMany({ $set: { balance: false } });

      return {
        message: "All students balance resetted to false",
        action: "update_possible",
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  //updating user balance from admin or students end
  send_email_to_users: async (
    _,
    { email, subject, htmlbody, course },
    user
  ) => {
    try {
      if (email) {
        //Sending email to users
        sendEmail(email, subject, htmlbody);
        return {
          message: "Email successfully sent to user",
          action: "send_another",
          status: true
        };
      }

      if (course) {
        let users_list_1 = await User.find({ course: course }).select({
          _id: 0,
          email: 1
        });
        //getting list of students
        var student_list_1 = [];
        for (var user_1 in users_list_1) {
          student_list_1.push(users_list_1[user_1].email);
        }
        console.log(JSON.stringify(student_list_1));

        //Sending email to users
        sendEmail(student_list_1, subject, htmlbody);
        console.log("***Email sent****");
        return {
          message: "Emails sent to " + student_list_1.length + " course users",
          action: "send_another",
          status: true
        };
      }

      //'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=Edge"><title>Email</title></head><style type="text/css">body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Oxygen,Ubuntu,Cantarell,\'Open Sans\',\'Helvetica Neue\',sans-serif}.content{max-width:600px;width:100%}.header{padding:40px 30px 20px 30px}.footer{padding:30px 30px 30px 30px}.footercopy{font-size:14px;color:#fff}.footercopy a{color:#fff;text-decoration:underline}</style><body style="background-color:#f7f7f7"><table width="100%" bgcolor="#f7f7f7" border="0" cellpadding="0" cellspacing="0"><tr><td><table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#ffffff" class="header" style="border-top:4px solid #ff3c3c"><table width="250" border="0" cellpadding="0" cellspacing="0" style="padding:30px 0 0 30px"><tr><td height="60"><img src="https://motionwares.com/assets/icons/logo.png" height="40" border="0" alt="Motionwares logo"></td></tr></table></td></tr><tr><td style="padding:30px 30px 20px 40px"><table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td style="font-weight:700;padding-bottom:20px;font-size:20px">Hello!</td></tr><tr><td style="padding-bottom:24px;line-height:1.5">Trust you had an amazing weekend.</td></tr><tr><td style="padding-bottom:24px;line-height:1.5;font-weight:600">Friendly reminder: there will be Zoom Webinar today by 7:00PM</td></tr><tr><td style="padding-bottom:24px;line-height:1.5">Tap this link <a href="https://zoom.us/j/157611435?pwd=U3ZiQm9FU3lPK0o1SGhMNmNFQkZjZz09">here</a> to join in.</td></tr><tr><td style="padding-bottom:24px;line-height:1.5">Or use the following to join in directly from the zoom app <span style="font-weight:600"><br>Meeting ID: 157 611 435<br>Password: 168452</span></td></tr><tr><td style="padding-bottom:24px;line-height:1.5">We advise you to download the Zoom app (if you havent already) at <a href="https://zoom.us">https://zoom.us</a> to your laptop and create an account in order to seamlessly connect during the webinar session.</td></tr></table></td></tr><tr><td class="footer" bgcolor="#353535"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td style="padding-top:30px;text-align:center"><img class="" src="https://motionwares.com/assets/icons/mail/logo.png" width="50" border="0" alt=""></td></tr><tr><td align="center" class="footercopy" style="padding-top:30px">&reg;Motionwares. All rights reserved.<br><br><span class="">Plot 260, Adamu Ciroma Crescent,<br>Jabi, Abuja, Nigeria.</span></td></tr><tr><td align="center" style="padding:20px 0 20px 0"><table border="0" cellspacing="0" cellpadding="0"><tr><td style="text-align:center;padding:0 10px 0 10px"><a href="mailto:hello@motionwares.com" style="color:#fff">Email Us</a></td><td style="text-align:center;padding:0 10px 0 10px"><a href="http://www.twitter.com/" style="color:#fff">Call Us</a></td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>'

      let users_list = await User.find({}).select({ _id: 0, email: 1 });

      //getting list of students
      var student_list = [];
      for (var user in users_list) {
        student_list.push(users_list[user].email);
      }

      console.log(JSON.stringify(student_list));

      //Sending email to users
      sendEmail(student_list, subject, htmlbody);

      return {
        message: "Email successfully sent to users",
        action: "send_another",
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  //updating user balance from admin or students end
  update_user_balance: async (_, args, user) => {
    try {
      //authenticating user
      //let user_info = await authUser(user);

      let user_payment = await User.findOneAndUpdate(
        { _id: args.user },
        { $set: { balance: args.status } }
      );

      if (user._id == args.user) {
        //sending email to user
        sendEmail(
          args.email,
          "2020 MDS Cohort 1 - Balance payment acknowledged",
          "Hello " +
            user_payment.fname +
            ", <br> we have received your balance payment.  <p>The Motionwares Team.</p>"
        );
      }

      return {
        message: "Balance paid",
        action: "update_possible_no",
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  //get user by id
  get_user: async (_, args, user) => {
    try {
      let user_info = await User.findById(args.user);

      if (user_info != "") {
        return user_info;
      }

      throw new Error("Invalid user id");
    } catch (error) {
      throw error;
    }
  }
};
