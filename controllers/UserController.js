const User = require('../models/UserModel');
const bcrypt = require('bcrypt');


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

//delete user 
const deleteUser = async(req, res)=>{
    try{
        const userId = req.params.id;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({message: "User delete successfully! "});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

//get all users
const getAllUsers = async (req,res) =>{
    try{
        //njibou les infos mta3 les users lkol ken password
        const users = await User.find().select("-password");

        res.status(200).json(users);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}
// USER : les fonctions lel user bch ykoun 3andou accès l profil mte3ou bark

// Get own profile
//req.user._id jey men middleware JWT
//Nna7iw el password
//naatiweh el profile mte3ou
const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

// Update own profile
//nekhet les champs eli bch ybadelhoum


const updateMyProfile = async (req, res) => {
  const updates = req.body;
  //ken bdel l password n3mlouh hashed
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  //naatiweh el profile mte3ou el jdid
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
  res.json(user);
};

// Delete own account
const deleteMyAccount = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.json({ message: 'Account deleted successfully' });
};

module.exports = { createUser, updateUser , deleteUser, getAllUsers , getMyProfile, updateMyProfile, deleteMyAccount };