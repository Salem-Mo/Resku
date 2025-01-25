import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemp.js"
import {mailtrapClient,sender} from "./mail.config.js"
export const sendVerEmail =async (email,verificationCode)=> {
    const recipient =[{email}]
    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}",verificationCode),
            category: "Email Verification"
        })
        console.log(`Email Send Successfully to ${email}`,response)
    }catch (err) {
        throw new Error(`Couldn't send Verification Code to ${email} : ${err.message}`)
    }
}
export const sendWelcomeEmail =async (email,name)=> {
    const recipient =[{email}]
    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            template_uuid: "9a4651f1-f38d-4b79-9bd0-49064b661d2f",
            template_variables: {
              name: name,
              company_info_name: "ReskU",
        }})
        console.log(`Email Send Successfully to ${email}`,response)
    }catch (err) {
        console.log(`Error sending email ${err}`)
        throw new Error(`Couldn't send Welcome Email to ${email} : ${err.message}`)
    }
}
export const sendResetPasswordEmail =async(email,name,url) =>{
    const recipient =[{email}]
    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Reset your Password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",`${url}`).replace("{name}",name),
            category: "Reset Password"
            })
        console.log(`Email Send Successfully to ${email}`,response)
    }catch (err) {
        console.log(`Error sending Reset Email ${err}`)
        throw new Error(`Couldn't send Reset Password Email to ${email} : ${err.message}`)
    }
}
export const sendResetSuccessPasswordEmail =async (email,name)=>{
    const recipient =[{email}]
    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Password Reset Successfully",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{name}",name),
            category: "Successful Password Reset "
            })
        console.log(`Email Send Successfully to ${email}`,response)
    }catch (err) {
        console.log(`Error sending Email ${err}`)
        throw new Error(`Couldn't send Email to ${email} : ${err.message}`)
    }
}