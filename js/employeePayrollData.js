/* UC10:- Perform Validation Employee Payroll Data setter methods.
          - Name must starts with Cap and has minimum 3 characters.
          - Start Date
          - Must not be future date. As well as should be within 30 days of joining. 
*/
class EmployeePayrollData // creating employee payroll data class, which has geter and setter for different properties
{
     
    get name(){ return this._name;}
    set name(name)
    {        
        let nameRegex= RegExp('^[A-Z]{1}[a-zA-Z ]{2,}$'); //regular expression for name
        if(nameRegex.test(name))
            this._name=name;
        else throw 'Name is Incorrect';
    }    
    
    id; //geter and setter for id 
    get profilePic() { return this._profilePic; }    //getter and setter fr profilepic
    set profilePic(profilePic) 
    { 
     this._profilePic = profilePic; 
    }    
   get gender() { return this._gender; } //getter and setter for gender
   set gender(gender)
    { 
     this._gender = gender; 
    }
   
   get department() { return this._department; }  //getter and setter for department
   set department(department)
    { 
     this._department = department; 
    }
   
   get salary() { return this._salary; }  //getter and setter for salary
   set salary(salary) 
   { 
     this._salary = salary; 
   }

   get note() { return this._note; } //getter and setter for note
   set note(note) 
   { 
     this._note = note; 
   }
  
   get startDate(){return this._startDate;}  //getter and setter for startdate
    set startDate(startDate)
    {
        let currentDate= new Date();       
        if(currentDate- startDate>=0)  //checking if start date is not a future date
            this._startDate= startDate;
        else throw  'invalid date';
    }

    get startDate() { return this._startDate; }
    set startDate(startDate) {
        let now = new Date();
        if (startDate > now) throw 'Start Date is a Future Date!';
        var diff = Math.abs(now.getTime() - startDate.getTime());
        if (diff / (1000 * 60 * 60 * 24) > 30) 
          throw 'Start Date is beyond 30 Days!';
        this._startDate = startDate; 
    }    
    
    toString() // adding toString() method to contain gender as well as date also
    {
         const options= {year:'numeric',month:'long',day:'numeric'};
         // 3 Equals are used and return true when both datatype and value matches
         const empDate= this.startDate===undefined ? "undefined": this.startDate.toLocaleDateString("en-US",options); 
       return "id: " + this.id + ", name: " + this.name + ", gender: " + this.gender + 
         ", profilePic: " + this.profilePic + ", department: " + this.department +
         ", salary: " + this.salary + ", startDate: " + empDate + ", note: " + this.note;
    }
   
}