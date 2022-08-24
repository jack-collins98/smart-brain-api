const handleRegister = (req, res, db, bcrypt)=>{
   const {email, name, password} = req.body;
   if(!email || !name || !password){ //if any of these fields are empty
    return res.status(400).json('incorrect form submission');
   }
   const hash = bcrypt.hashSync(password);

   //We create a transaction when we need to do 2 diff things in our database at once
   //We use trx instead of db to do these operations
   db.transaction(trx => {
    trx.insert({
        hash: hash,
        email: email
    })
    .into('login')
    .returning('email') //we inserted into login and returned the email



    //.then loginEmail because we are returning the email
    //we are using the loginEmail to return another transaction - insert into the users
    .then(loginEmail =>{
        return trx('users')
            .returning('*')
            .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date()
            })
            .then(user => {
                res.json(user[0]);    //always need to send a reponse
            })
        })
        .then(trx.commit) // commit the changes 
        .catch(trx.rollback) //rollback incase any thing fails
   })
   .catch(err => res.status(400).json('unable to register'));
}

module.exports = {
    handleRegister: handleRegister
}