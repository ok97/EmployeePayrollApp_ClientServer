
let isUpdate=false; //defining global variables in order to update the details

let employeePayrollObj={}; //creating employeepayrollobj update the employee details in local storage


window.addEventListener('DOMContentLoaded',(event)=>{ // checking for update as soon as the content page of html gets loaded, if check for update is passed
    
    
    checkForUpdate();


    const name= document.querySelector('#name');     //getting the name and text error and trying to print error message if regex condition is not satisfied
    const textError= document.querySelector('.name-error');
    
    name.addEventListener('input',function(){ //adding event listener for name input and defining function for the same
      
        if(name.value.length==0)   //if name length is 0, then no error message is printed
        {
            textError.textContent="";
            return;
        }
        try{
            checkName(name.value);
            textError.textContent="";
        }
        catch(e)
        {
           
            textError.textContent=e;  //passing exception message to texterror const.
        }
        
    });
   

    
    const salary= document.querySelector('#salary'); //adding event listener for salary and changing salary output for every salary input made through scrolling
    const output= document.querySelector('.salary-output');

    output.textContent=salary.value;     //showing the output equal to salary initially.
    
    salary.addEventListener('input',function(){ //adding event listenr for salary and printing the salary for each input dynamically.
    output.textContent=salary.value;
    });
    
    dateError= document.querySelector(".date-error"); //method to validate date if, entered in correct range and do not represent future range
    var year= document.querySelector('#year');
    var month= document.querySelector('#month');
    var day=document.querySelector('#day');
 
    year.addEventListener('input',checkDate);
    month.addEventListener('input',checkDate);
    day.addEventListener('input',checkDate)
    
    function checkDate(){  //calling checkDate method from event listeners
    try
    {   
     

        let dates= getInputValueById("#day")+" "+getInputValueById("#month")+" "+getInputValueById("#year");    //converting value of dates from day id, month id and year id into date string
        
        dates=new Date(Date.parse(dates)); //dates is parsed to date and passed to object of employee payroll data class - start date
        checkStartDate(dates);
     
        dateError.textContent="";
    }
    catch(e)
    {
        dateError.textContent=e;
    }
    document.querySelector('#cancelButton').href= site_properties.home_page;
}

});

const save=(event)=>{ //calling save function to save values entered through form into obect and object into local storage
   
    event.preventDefault();
  
    event.stopPropagation();
    try
    {
    
   
        setEmployeePayrollObject();  // Refactoring of code is done here to to save updated employees
        if(site_properties.use_local_storage.match("true"))
        {
           
            createAndUpdateStorage();  //after adding values, create and update storage is called where values are added into local storage or updated
            resetForm();
          
            window.location.replace(site_properties.home_page);   //after resetting, moving back to home page.
        }
        else createOrUpdateEmployeePayroll();
    }
    catch(e)
    {
        return;
    }  
}

const createOrUpdateEmployeePayroll=()=>
{
    let postURL= site_properties.server_url;
    let methodCall="POST";
    if(isUpdate)
    {
        methodCall="PUT";
        postURL=postURL+employeePayrollObj.id.toString();
    }
    makeServiceCall(methodCall,postURL,true,employeePayrollObj)
        .then(responseText=>
            {
                resetForm();
                window.location.replace(site_properties.home_page);                
            })
        .catch(error=>
            {
                throw error;
            })
}


const setEmployeePayrollObject = () => {
    if(!isUpdate && site_properties.use_local_storage.match("true")){
        employeePayrollObj.id= createNewEmployeeId();
    }
    try{
    employeePayrollObj._name = getInputValueById('#name');
    checkName(employeePayrollObj._name);
    setTextValue(".name-error","");
    }
    catch(e){
        setTextValue(".name-error",e)
        throw(e);
    }
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._note = getInputValueById('#notes');
    let date = getInputValueById('#day')+" "+getInputValueById('#month')+" "+
               getInputValueById('#year') ;
    try{
    checkStartDate(employeePayrollObj.date)
    employeePayrollObj._startDate = date;
    }
    catch(e)
    {
        setTextValue(".date-error",e);
        throw e;
    }
}

function createAndUpdateStorage() //creating and updating storage
{    
    let employeePayrollList= JSON.parse(localStorage.getItem("EmployeePayrollList")); // from local storage with key EmployeePayrollList
    //if list is already defined, then element being added is not the first and EmployeePayrollList is already created in local storage
    if(employeePayrollList)
    {      
   
        let empPayrollData= employeePayrollList.find(empData=>empData.id==employeePayrollObj.id)  //checking if list obtained from local storage have emp payroll object to be added id already
      
        if(!empPayrollData) //not defined, then id is not present initially
        {          
            
            employeePayrollList.push(employeePayrollObj);  //pushing the employee payroll object from create employee payroll data to array

        }  
        else       // element it needs to be updated
        {
            
            const index= employeePayrollList.map(empData=>empData.id).indexOf(empPayrollData.id); //finding out the index for particular employee id 
           
            employeePayrollList.splice(index,1,employeePayrollObj);  //after finding out index, element is deleted and new object is added with same employee id
        }
    }
   
    else
    {
        employeePayrollList=[employeePayrollObj]
    }
  
    localStorage.setItem("EmployeePayrollList",JSON.stringify(employeePayrollList));      //json file is converted to string to add into local storage
}

const createNewEmployeeId = () => { //creating new employee id for adding of new data
    
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID",empID);  
    return empID;   //returning empID after incrementing previous one 
}


const getSelectedValues=(propertyValue)=>{ //defining method for selecting values and adding into array
    
    let allItems= document.querySelectorAll(propertyValue);
   
    let selItems=[];  // Define empty array
 
    allItems.forEach(item=>{
        if(item.checked) selItems.push(item.value);
    });
    return selItems;
}
// getting input value by id using query selector
const getInputValueById=(id)=>
{
    let value= document.querySelector(id).value;
    return value;
}
// getting input element value using getelementbyid method
const getInputElementValue=(id)=>{
    let value= document.getElementById(id).value;
    return value;
}

const resetForm=()=>{ //reset form
    
    setValue('#name',''); //calling set values for defining field into empty string

    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary','');
    setValue('#notes','');
    setValue('#day',1);
    setValue('#month','January');
    setValue('#year','2021');
}
// for all the selected value for name (propertyvalue) passed in html, all the elements for name is queried 
const unsetSelectedValues= (propertyValue)=>{
    let allItems= document.querySelectorAll(propertyValue);
    //iterating through loop and converting items.checked=false for unchecking
    allItems.forEach(items=>{
        items.checked=false;
    });
}
//settext value method sets value for particular class in between opening and closing tags 
//for ex error tags
const setTextValue=(id,value)=>
{
    const element= document.querySelector(id);
    element.textContent=value;
}

const setValue=(id,value)=>
{
    const element= document.querySelector(id);
    element.value=value;
}


const checkForUpdate=()=>{ //checking for update
  
    const employeePayrollJson= localStorage.getItem('editEmp');   //getting values from local storage for editEmp key
   
    isUpdate= employeePayrollJson?true:false;
    if(!isUpdate) return;
    employeePayrollObj= JSON.parse(employeePayrollJson);
    
    setForm();
}

const setForm = () => { //setting the values
   
    setValue('#name', employeePayrollObj._name);  //calling set value function to set text fields and date
 
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary',employeePayrollObj._salary);
    
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes',employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month',date[1]);
    setValue('#year',date[2]);
}

const setSelectedValues = (propertyValue, value) => { //set selected values function to set checked values for gender, department and profile pic
    
    let allItems = document.querySelectorAll(propertyValue);
   
    allItems.forEach(item => {
       
        if(Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        }
        //if value is not array, then foreach item (properties) from allitems,item is compared to value and then checked if true. 
        else if (item.value === value)
            item.checked = true;
    });    
}