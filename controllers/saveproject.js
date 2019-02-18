const handleSaveProject = (req,res,postgres)=>{
	const {projname,projdesc,projform,reminder,username,symbol} = req.body;
	//if(!email || !password || !name){
	//	return res.status(400).json('Incorrect form submission... ');
	//}

	const school ="ABC";
	const description = "Sample data";
	const forms="test form";
	const formid = [1,2,3];
	const total = 2;
	const count = 4;
	const form_submitted = 7;
	const profileid = 1;
	let divid = "";
	postgres.transaction(trx => {
		trx.insert({
			project:projname,
			description:projdesc,
			formsubmitted:reminder,
			total:20,
			//lastupdated:,
			createdon:new Date(),
			count_:count
		})
		.into('projects')
		.returning('id')
		.then(id =>{
			divid = id;
			return trx('profilesmaster')				
				.select('*')
				.whereIn('id',[username])
				.then(userdata =>{
					let users = [];
					for(let i=0;i<userdata.length;i++){
						users.push({
							pid:parseInt(id),
							profileid:userdata[i].id
						})
					}
					return trx('profiles')	
						.insert(users)
					
				})
			})
		.then(() =>{
			return trx('formsmaster')				
				.select('*')
				.whereIn('id',[projform])
				.then(formids =>{
					let formsid = [];
					for(let i=0;i<formids.length;i++){
						formsid.push({
							formid:parseInt(formids[i].id),
							projectid:parseInt(divid),
							createdon:new Date(),
							shape:symbol,
							reminder:reminder
						})
					}
					return trx('forms')	
						.insert(formsid)					
				})
				.then(()=>{
					res.json("user[0]");
				})
					
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('Unable to register...'+err));
}

module.exports = {
	handleSaveProject: handleSaveProject
}