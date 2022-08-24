const handleSignin = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
   if(!email || !password){ //if any of these fields are empty
    return res.status(400).json('incorrect form submission');
   }
   db.select('email','hash').from('login').where('email','=',email)
   .then(data => {
    //comparing what the user entered into the password with the hash
    const isValid = bcrypt.compareSync(password, data[0].hash);
    if(isValid){
       return db.select('*').from('users').where('email','=',email)
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('unable to get user'))
    } else{
            res.status(400).json('wrong Credentials')
        }
   })
   .catch(err => res.status(400).json('Wrong Credentials'))
}

module.exports = {
    handleSignin: handleSignin
}