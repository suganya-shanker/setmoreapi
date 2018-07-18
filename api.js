$(document).ready(function(){
getaccesstoken();
gettingstafflist(0);
gettingservicelist(0);
});
var accesstoken;
var customerkey;
var servicekey;
var staffkey;
var slotsize=60;
var starttime;
var date;

	function gettingcustomerkey(){
	var name=$('#name').val();
	var customerdetails={"first_name":name};
	$.ajax({
url: "https://developer.setmore.com/api/v1/bookingapi/customer/create",
type: "POST",
data:JSON.stringify(customerdetails),
beforeSend : function( customer ) {
    		customer.setRequestHeader("Content-Type", "application/json");
        	customer.setRequestHeader( 'Authorization', 'BEARER ' + accesstoken );
    	},
async: false,
success: function(response) {
        console.log(response);
        customerkey=response.data.customer.key;
        console.log("customerkey: "+customerkey);

                            },
error: function(response) {
            console.log(response);
        }
});
}
//getting service list and service key
	function gettingservicelist(value){
		$.ajax({
url: "https://developer.setmore.com/api/v1/bookingapi/services",
type: "GET",
beforeSend : function( service ) {
    		service.setRequestHeader("Content-Type", "application/json");
        	service.setRequestHeader( 'Authorization', 'BEARER ' + accesstoken );
    	},
async: false,
success: function(response) {
        console.log(response);
        if(value==0){
        for(var i=0;i<response.data.services.length;i++){
        $('#servicelist').append('<option>'+response.data.services[i].service_name+'</option');
    }
}
    else{
    	var servicename=$('#servicelist').val();
    	for(var i=0;i<response.data.services.length;i++){
    	if(servicename==response.data.services[i].service_name){
    		servicekey=response.data.services[i].key;
    	   	console.log("servicekey: "+servicekey);
        }
    }
    }
                            },
error: function(response) {
            console.log(response);
        }
});
}
//Getting staff list and staff key
	function gettingstafflist(value){
	 $.ajax({
url: "https://developer.setmore.com/api/v1/bookingapi/staffs",
type: "GET",
beforeSend : function( staff ) {
    		staff.setRequestHeader("Content-Type", "application/json");
        	staff.setRequestHeader( 'Authorization', 'BEARER ' + accesstoken );
    	},
async: false,
success: function(response) {
        console.log(response);
        if(value==0){
        for(var i=0;i<response.data.staffs.length;i++){
        $('#stafflist').append('<option>'+response.data.staffs[i].first_name+'</option');
         }
     }
         else{
    	var staffname=$('#stafflist').val();
    	//alert(staffname);
    	for(var i=0;i<response.data.staffs.length;i++){
    	if(staffname==(response.data.staffs[i].first_name)){
    		staffkey=response.data.staffs[i].key;
    		console.log("staffkey: "+staffkey);
    	        }
    }
    }
    
                            },
error: function(response) {
            console.log(response);
        }
});
		function checkinglastname(lastname){
			if(lastname!=undefined){
				return lastname;
			}
			else{
				return "";
			}

		}
}
//Slot Generation
$('#getslots').click(function(){
date=$('#date').val(); //2018-07-18
//console.log(date);
var simpledate=date.substring(8,10)+"/"+date.substring(5,7)+"/"+date.substring(0,4);
gettingstafflist(1);
gettingservicelist(1);
 var details={
          "staff_key":staffkey,      
          "service_key":servicekey,    
          "selected_date":simpledate,
          "off_hours":false,
          "double_booking" : false,
          "slot_limit" : slotsize
      };
      $.ajax({
url: "https://developer.setmore.com/api/v1/bookingapi/slots",
type: "POST",
data:JSON.stringify(details),
beforeSend : function( slot ) {
    		slot.setRequestHeader("Content-Type", "application/json");
        	slot.setRequestHeader( 'Authorization', 'BEARER ' + accesstoken );
    	},
async: false,
success: function(response) {
        console.log(response);
        for(var i=0;i<response.data.slots.length;i++){
       	var slots=response.data.slots[i];
           if(slots<"12:00"){
       	$('#morning').append('<br><button class="slottime">'+slots+'</button>');
       }
       else if(slots>="16:00"){
       		$('#evening').append('<br><button class="slottime">'+slots+'</button>');  
       }
       else{
          $('#afternoon').append('<br><button class="slottime">'+slots+'</button>');
       }
       }
                            },
error: function(response) {
            console.log(response);
        }
});
    function  gettime(){
console.log($(this.val()));
    }
});

//Getting access token
function getaccesstoken(){
	$.ajax({
url: "https://developer.setmore.com/api/v1/o/oauth2/token?refreshToken=29a0b76819ViTv6IT0OSAJSnza3dpEU14l8Xwc0aP9aXT",
type: "GET",
async: false,
success: function(response) {
        console.log(response);
        accesstoken=response.data.token.access_token;
                            },
error: function(response) {
            console.log(response);
        }
});
}
//creating appointment
$('#createappointment').click(function(){
gettingcustomerkey();
gettingservicelist(1);
gettingstafflist(1);
var startfulldate=date+"T"+starttime+":00.000z" ;                    //2018-07-18 
var endfulldate=date+"T"+findendtime(starttime)+":00.000z";
/*console.log("2018-07-17T12:00:00.000Z"+startfulldate);
console.log("2018-07-17T13:00:00.000Z"+endfulldate);*/
$.ajax({
url: "https://developer.setmore.com/api/v1/bookingapi/appointment/create",
type: "POST",
data:JSON.stringify({
          "staff_key" : staffkey,      
          "service_key" : servicekey,      
          "customer_key" : customerkey,  
          "start_time" : startfulldate,    //YYYY-MM-DDTHH:mm:ss.sssZ (2018-07-17T12:00:00.000Z)
          "end_time"  : endfulldate,
          "comment":"Test comment",
          "label" :"Test Label"
      }),
beforeSend : function( customer ) {
    		customer.setRequestHeader("Content-Type", "application/json");
        	customer.setRequestHeader( 'Authorization', 'BEARER ' + accesstoken );
        	
    	},
async: false,
success: function(response) {
        console.log(response);
        confirm("Appointment Booked");
                            },
error: function(response) {
            console.log(response);
        }
});
});

//getting starttime
$('#availableslots').on('click', '.slottime', function() {
	starttime=$(this).text();
});

//Generating end time
function findendtime (startTime) {
  var endtime = [ 0, 0 ];
  var a = startTime.split(':');
  //making date values to perfect int for calculation
  for (var i = 0; i < a.length; i++) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
  }
  endtime[1]= (a[1]+slotsize)%60;
  var additionalhour=Math.floor((a[1]+slotsize)/60);
  endtime[0]=a[0]+additionalhour;
  
var hour=("0"+endtime[0]).slice(-2);
var mintues=("0"+endtime[1]).slice(-2);
return hour+":"+mintues;
}

