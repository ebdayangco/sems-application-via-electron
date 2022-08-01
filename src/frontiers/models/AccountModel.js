const md5 = require("md5");
const Model = require("./Model");
class AccountModel extends Model{
    constructor(){
        super();
    }

    statements(){

        function login(data){
            return `SELECT * FROM user a WHERE a.email="${data['email']}" 
            AND a.password="${md5(data['password'])}" AND a.active=true`;
    
        }
    
        function register(data){
            return `INSERT INTO user (
                firstname,
                lastname,
                email,
                contactnumber,
                password
            ) 
            SELECT * FROM (SELECT 
                '${data["firstname"]}' AS f,
                '${data["lastname"]}' AS l,
                '${data["email"]}' AS e,
                '${data["contact_number"]}' AS c,
                '${md5(data["password"])}' AS p
                ) entry  
            WHERE entry.e NOT IN (SELECT email FROM user)`;
        }
    
        function update(data){
    
            let sub_statement = '';
            if(data['firstname']){
                sub_statement += `${sub_statement == ''?'':','}a.firstname='${data['firstname']}'`;
            }
            if(data['lastname']){
                sub_statement += `${sub_statement == ''?'':','}a.lastname='${data['lastname']}'`;
            }
            if(data['email']){
                sub_statement += `${sub_statement == ''?'':','}a.email='${data['email']}'`;
            }
            if(data['contactnumber']){
                sub_statement += `${sub_statement == ''?'':','}a.contactnumber='${data['contactnumber']}'`;
            }
            if(data['password']){
                sub_statement += `${sub_statement == ''?'':','}a.password='${data['password']}'`;
            }
            if(data['active']){
                sub_statement += `${sub_statement == ''?'':','}a.active='${data['active']}'`;
            }
           
            return `UPDATE user a SET ${sub_statement} WHERE a.userID = ${data['userID']}`;
        }
        function emailExist(email){
            return `SELECT userID FROM user WHERE email="${email}"`;
        }

        function changePassword(data){
            return `UPDATE user a SET a.password="${md5(data["new-password"])}" 
            WHERE a.userID=${data["userID"]}`;
        }

        function insertUserForgotPassword(email,code){
            return `INSERT INTO forgot_password(email,code) VALUES("${email}"
            ,"${code}")`;
        }

        function changePasswordOnCodeBased(email,newpassword){
            return `UPDATE user SET password="${md5(newpassword)}" WHERE email="${email}"`;
        }

        function deleteCodeFromForgotPassword(email){
            return `DELETE FROM forgot_password WHERE email="${email}"`;
        }

        function checkUserRetrievePassword(email){
            return `SELECT email FROM forgot_password WHERE email="${email}" AND active=true`;
        }

        function checkIfCodeExist(email,code){
            return `SELECT fp_id FROM forgot_password WHERE email="${email}" AND code="${code}" AND active=true`;
        }

        return {login,register,update,emailExist,changePassword,insertUserForgotPassword,
            checkUserRetrievePassword,changePasswordOnCodeBased,deleteCodeFromForgotPassword,
            checkIfCodeExist};
    }

    process(option){

        let statements = this.statements();
        var self = this;
        function login(){
           
            self.inquireDatabase({
                "statement":statements.login(option['data']),
                "results":function(res){
                    const results = JSON.parse(JSON.stringify(res));
                
                    results.length == 0 ? option['negative'](): option['positive'](results);
                }
            });
        }

        function register(){

            self.inquireDatabase({
                "statement":statements.register(option['data']),
                "results":function(res){
                    if(res.insertId == 0){
                        option['email-exist']();
                    }else{
                        option['proceed']();
                    }
                    
                }
            });
        }

        function emailExist(option){

            self.inquireDatabase({
                "statement":statements.emailExist(option['email']),
                "results":function(res){
                    if(res.length == 0){
                        option['not-exist']();
                    }else{
                        option['exist']();
                    }
                    
                }
            });
        }
        function insertUserForgotPassword(email,code,callback){
            
            self.inquireDatabase({
                "statement":statements.insertUserForgotPassword(email,code)
            },callback);

        }

        function checkUserRetrievePassword(email,notfound,found){

            self.inquireDatabase({
                "statement":statements.checkUserRetrievePassword(email),
                "results":function(res){
                    if(res.length == 0){
                        notfound();
                    }else{
                        found();
                    }
                    
                }
            });
        }

        function changePasswordOnCodeBased(email,newpassword,callback){
            
            self.inquireDatabase({
                "statement":statements.changePasswordOnCodeBased(email,newpassword)
            },callback);
        }

        function deleteCodeFromForgotPassword(email,callback){
            self.inquireDatabase({
                "statement":statements.deleteCodeFromForgotPassword(email)
            },callback);
        }

        function checkIfCodeExist(email,code,found,notfound){
            self.inquireDatabase({
                "statement":statements.checkIfCodeExist(email,code),
                "results":function(res){
                    if(res.length == 0){
                        notfound();
                    }else{
                        found();
                    }
                    
                }
            });
        }


        return {login,register,emailExist,insertUserForgotPassword,checkUserRetrievePassword,
            changePasswordOnCodeBased,deleteCodeFromForgotPassword,checkIfCodeExist};


    }
}
const accountModel = new AccountModel();
module.exports = accountModel;