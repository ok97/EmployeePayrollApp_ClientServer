// defined to put the common code of two html files here
const stringifyDate=(date)=>{
    const options={day:'numeric', month: 'long',year:'numeric'};
    const newDate= date===undefined?"undefined":new Date(Date.parse(date)).toLocaleDateString('en-GB',options);
    return newDate;
}

const checkName= (name)=>{
    let nameRegex= RegExp('^[A-Z]{1}[a-zA-Z ]{2,}$');
        if(!nameRegex.test(name))
         throw "Name is Incorrect";
}
const checkStartDate=(startDate)=>{
    let currentDate= new Date();
   
    if(currentDate- startDate<0)  // checking if start date is not a future date
        throw "Invalid Start Date"; //print
}