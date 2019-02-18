const Clarifai = require('clarifai');


const app = new Clarifai.App({
 apiKey: '45a275631ca74044a3e5d57c4086e151'
});

const handleApiCall = (req,res) =>{
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
		.then(data => {
			res.json(data)
		})
		.catch(err =>res.status(400).json(err))
}



const handleImage = (req,res,postgres)=>{
	const { id } = req.body;
	postgres('users').where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries =>{
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = {
	handleImage,
	handleApiCall
}