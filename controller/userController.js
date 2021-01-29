const User = require('./../model/userModel');

exports.addUser = async (req, res) =>{
    try{
        console.log(req.body);
        const newUser = await User.create(req.body);
        res.status(201).json({
            status: 'Success',
            data : newUser
        })
    }catch (err){
        console.log(err);
        res.status(404).json({
            status: 'failure',
            data : err
        })
    }
}

exports.getUsers = async (req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json({
            status : 'success',
            length: users.length,
            data: users
        })
    }catch (e) {
        res.status(404).json({
            status: 'failure',
            message: e
        })
    }
}
