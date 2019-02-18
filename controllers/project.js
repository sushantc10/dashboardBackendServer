const handleProjectGet = (req,res,postgres)=>{
	const { name } = req.params;
	postgres.raw(`select 
  array_agg(
    row_to_json(t)
  ) as data, 
  (
    select 
      array_to_json(
        array_agg(
          row_to_json(t)
        )
      ) 
    from 
      (
        select 
          * 
        from 
          forms
      ) as t
  ) as forms 
from 
  (
    select 
      id, 
      project, 
      formsubmitted, 
      total, 
      lastupdated, 
      createdon, 
      description, 
      count_, 
      (
        select 
          array_to_json(
            array_agg(
              row_to_json(jd)
            )
          ) 
        from 
          (
            select 
              profiles.id, 
              pm.firstname, 
              pm.lastname, 
              pm.age, 
              pm.imagerrl 
            from 
              profiles 
              INNER JOIN profilesmaster pm on profiles.profileid = pm.id 
            where 
              j.id = pid 
            group by 
              profiles.id, 
              pm.firstname, 
              pm.lastname, 
              pm.age, 
              pm.imagerrl
          ) jd
      ) as profiles 
    from 
      projects j 
    where 
      j.project ILIKE ?
  ) as t;
 `,'%'+name+'%')
		.then(data => {
			res.send(data.rows);
		})
		.catch(err => res.status(400).json(err))
}

module.exports = {
	handleProjectGet:handleProjectGet
}