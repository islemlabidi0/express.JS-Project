const User = require('./models/UserModel');
const bcrypt = require('bcryptjs');


//create user
const createUser = async(req , res)=>{
    try{
        const {name , login, password, role} = req.body;

        //Vérifier si le login existe déjà
        const existing = await User.findOne({ login });
        if (existing) {
        return res.status(400).json({ message: "Login already used" });
        }
        //bch ywali l password hashed
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
        name,
        login,
        password: hashedPassword,
        role
        });
        //to save user in DB 
        await user.save();

        res.status(201).json({
            //ken t3adet s7i7a
            message: "User has been created successfully!",
            user:{
                id: user._id,
                name: user.name,
                login: user.login,
                role: user.role
            }
        });
        //ken fama 5alta 
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

//update user
const updateUser = async(req,res) => {
    try{
        const userId = req.params.id;
        const {login, password, role } = req.body;

        //nchoufou ken l user mawjoud 
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "user not found "});
        }

        //nchoufou ken badal login déjà utilisé
        if(login && login !== user.login){
            const existing = await User.findOne({login});
            if(existing){
                return res.status(400).json({message: "login already user"});
            }
        }

        //nbdlou les champs eli badalhom
        if (login) user.login = login;
        if (role) user.role = role;

        //ken badal l password donc lezm n3mlouh hashed
        if (password){
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.status(200).json({
            message: "user has been updated successfully!",
            user: {
                ID: user._id,
                name: user.name,
                login: user.login,
                role: user.role
            }
        });
    }catch(error){
        res.status(500).json({error: error.message});
    }
};
module.exports = { createUser, updateUser };