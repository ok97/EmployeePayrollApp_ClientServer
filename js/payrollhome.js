
let empPayrollList; //creating event listener which will be  once all the content is loaded on webpage

window.addEventListener('DOMContentLoaded',(event)=>
{
    if(site_properties.use_local_storage.match("true"))
    {
        getEmployeePayrollDataFromStorage();
    }
    else
        getEmployeePayrollDataFromServer();
});

const getEmployeePayrollDataFromStorage= ()=>{
    empPayrollList= localStorage.getItem('EmployeePayrollList')?JSON.parse(localStorage.getItem('EmployeePayrollList')):[];
    processEmployeePayrollDataResponse();
}
const processEmployeePayrollDataResponse=()=>{
    document.querySelector(".emp-count").textContent=empPayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
}

const getEmployeePayrollDataFromServer=()=>
{
    makeServiceCall("GET",site_properties.server_url,true)
        .then(responseText=>{
            empPayrollList= JSON.parse(responseText);
            processEmployeePayrollDataResponse();
        })
        .catch(error=>{
            console.log("GET Error Status: "+JSON.stringify(error));
            empPayrollList=[];
            processEmployeePayrollDataResponse();
        })
}


const createInnerHtml=()=> // add data into inner html  adds data into the table
{
    
    if(empPayrollList.length==0) return; // emppayroll list is empty then there is no data in localstorage

    //creating a header tag of html which will be used with template literals and placeholders to populate the table.
    
    const headerHtml= "<tr><th></th><th>Name</th><th>Gender</th><th>Department</th><th> Salary</th><th>Start Date</th><th>Actions</th></tr>"
    
    let innerHtml= `${headerHtml}`;
    // before local storage, method createEmployeePayrollJSON was created which have details of employee payroll in json format.
   
    for(const empPayrollData of empPayrollList){ //adding data of empPayrollData into innerHtml using literals and placeholders, as loop iterates,  more data is added in inner html. 
        
        innerHtml= `${innerHtml}
        <tr>
            <td><img class="profile" alt="" src="${empPayrollData._profilePic}"></td>
            <td>${empPayrollData._name}</td>
            <td>${empPayrollData._gender}</td>
            <td>${getDeptHtml(empPayrollData._department)}
            </td>
            <td>&#x20b9 ${empPayrollData._salary}</td>
            <td>${stringifyDate(empPayrollData._startDate)}</td>
            <td><img id="${empPayrollData.id}" onclick= "remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
            <img id="${empPayrollData.id}" onclick= "update(this)" alt="edit" src="../assets/icons/create-black-18dp.svg"></td>
        </tr>`;
    }  
    
    document.querySelector('#table-display').innerHTML=innerHtml;  //displaying the data using innerHTML
}

//creating dummy data for testing and adding data in table on webpage
const createEmployeePayrollJSON = () => {
    let empPayrollListLocal = [
      {       
        _name: 'Om',
        _gender: 'Male',
        _department: [
            
            'Finance'
        ],
        _salary: '30000',
        _startDate: '11 June 2021',
        _note: 'CSI Engineer',
        id: new Date().getTime(),
        _profilePic: '../assets/profile-images/Ellipse -3.png'
      }
    ];
    return empPayrollListLocal;
  }

  const getDeptHtml= (deptList)=> //function is added differently, because there can more than one department associated to employee
  {
      let deptHtml='';
      for(const dept of deptList)
      {
          deptHtml= `${deptHtml}<div class="dept-label">${dept}</div>`
      }
      return deptHtml;
  }

 
  const remove= (node)=>{  // Adding function to delete elements when click on delete icon in actions
     
      let empPayrollData= empPayrollList.find(empData=>empData.id==node.id);  //empPayrollList is array of data which is once all the content of webpage gets loaded
      
      if(!empPayrollData) return;     
      
      const index= empPayrollList.map(empData=>empData.id).indexOf(empPayrollData.id);  //for finding out index, emppayroll list is converted to array only of id by mapping and then
      
      empPayrollList.splice(index,1); // using splice to remove element from array
      if(site_properties.use_local_storage.match("true"))
      {
     
      localStorage.setItem("EmployeePayrollList",JSON.stringify(empPayrollList));  //updating the data into local storage
     

      document.querySelector(".emp-count").textContent= empPayrollList.length;  //updating the count of employees here, otherwise refresh will be required to update count
      }       // refresh slows the code, hence update of count is done here only.
      else
      {
          const deleteURL= site_properties.server_url+empPayrollData.id.toString();
          makeServiceCall("DELETE",deleteURL,false)
          .then(responseText=>
            {
                document.querySelector(".emp-count").textContent= empPayrollList.length;
                createInnerHtml();
            })
            .catch(error=>{
                console.log("DELETE Error status: "+JSON.stringify(error));
            })
      }     
      createInnerHtml();  //showing updated data of local storage
  }

  
  const update= (node)=>{    //update method to edit the details of employee payroll      
      let empPayrollData= empPayrollList.find(empData=>empData.id== node.id); // from the array empPayrollList populated while laoding content of page
      
      if(!empPayrollData) return; //if emplPayrollData is null, return is applied here and nothing changes
        
      localStorage.setItem('editEmp',JSON.stringify(empPayrollData)); //in order to edit details, employee will be redirected to populated employee payroll form  
      
      window.location.replace(site_properties.emp_payroll_page); //calling employee payroll form
  }