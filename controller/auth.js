const bcrypt =require('bcryptjs');
const { JsonWebTokenError } = require('jsonwebtoken');
const{User,Cart}=require('../models')
async function signUp(req,res){
    const username = req.body.username;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password,8);
    console.log('password',password)
    try{
        const user=await User.create({username,email,password})
        await Cart.create({id:user.id})
        if(req.body.roles){
            const roles= req.body.roles;
            const result=await user.setRoles(roles)
            console.log('user defined roles', result)
        }else{
            const result = await user.setRoles([1])
            console.log("default roles",result)
        }
        res.send({msg:'User has been created successfully'})
    }catch(err){
        res.status(400).send({msg:'Internal server error'})
    }


}
async function signIn(req,res){
    const username=req.body.username;
    const password= req.body.password;
    try{
        const user = await User.findOne({
            where:{
                username:username
            }
        })
        if(user){
            const validPassword=bcrypt.compareSync(password,user.password)
            if(!validpassword){
                res.status(400).send({msg:'Username/password is not correct'})
            }
            const token = await jwt.sign({id:user.id},helloIamsecetkey,{
                expiresIn:'1h'
            })
            const authorities=[];
            const roles = await user.getRoles();
            for(let i =0;i<roles.length;i++){
                authorities.push(roles[i].name)
            }
            const finalUser = {
				id: user.id,
				name: user.name, 
				email: user.email,
				username:user.username,
				token: token,
				authorities: authorities
			}
            res.send(finalUser)
        }else{
            res.status(400).send({msg:'Username/password is not correct'})
        }
    }catch(err){
        res.status(500).send({msg:'Internal server Error'})
    }
}
module.exports={signUp,signIn}



module.exports={
signUp,
signIn
}