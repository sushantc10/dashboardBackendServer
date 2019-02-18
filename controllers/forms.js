const handleFormsData = (req,res,postgres)=>{
	const { id } = req.params;
	postgres.raw(`select array_to_json(array_agg(row_to_json(tt))) as form
              from (
              select forms.id,fm.name,fm.shape,fm.updateddate,fm.createdon,forms.reminder from forms
              left JOIN formsmaster fm on fm.id = forms.formid
              LEFT JOIN projects on projects.id = forms.projectid
              where forms.projectid = ?
  
              ) as tt`,id)
		.then(data => {
			res.send(data.rows);
		})
		.catch(err => res.status(400).json(err))
}

module.exports = {
	handleFormsData:handleFormsData
}