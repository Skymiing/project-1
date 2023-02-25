//declare function inside script loop
 
function generate_patient_id()
{
  const random = Math.floor(Math.random() * 9099999);
      document.getElementById("PID").innerHTML = random;
}

function refresh_dashboard()
{
    //alert("Inside refresh_dashboard");
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

   // Open (or create) the database
   var store = open.transaction.objectStore("Patient_Bed");
var index = store.index("Patient_Check_in");

// Open a cursor to iterate through all the records in the store
index.openCursor().onsuccess = function(event) {
  var cursor = event.target.result;

  if (cursor) {
    // Retrieve the data for the current record
    var data = cursor.value;

    // Increment the count for the current bed type
    if (data.p_bed == "ICW") {
      ticw++;
    } else if (data.p_bed == "IDW") {
      tidw++;
    } else if (data.p_bed == "GW") {
      tgw++;
    }

    // Move to the next record
    cursor.continue();
  } else {
    // Update the UI with the final counts
    let final_ticw = 10 - ticw;
    let final_tidw = 10 - tidw;
    let final_tgw = 20 - tgw;

    document.getElementById("total_available_bed").innerHTML = 40 - ticw - tidw - tgw;
    document.getElementById("total_available_bed_ICW").innerHTML = final_ticw;
    document.getElementById("total_available_bed_IDW").innerHTML = final_tidw;
    document.getElementById("total_available_bed_GW").innerHTML = final_tgw;
  }
};

  }

  open.onupgradeneeded = function() {
    var db = open.result;
    //set keyPath = id
    var store = db.createObjectStore("Patient_Bed", {keyPath: "id"});
    var index = store.createIndex("Patient_Check_in", "id");
  };

  open.onsuccess = function(){
    //total_available_bed_left
    let tvbl=0;
    //total_ICW
    let ticw=0;
    //total_IDW
    let tidw=0;
    //total_GW
    let tgw=0;

    var db = open.result;
    var tx = db.transaction("Patient_Bed", "readonly");
    var store = tx.objectStore("Patient_Bed"); 
    
    store.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;

      //start check DB record and increment the count for each bed
      if (cursor){
        //alert("in the cursor loop : "+cursor.value.p_bed);
        if (cursor.value.p_bed == "ICW"){
          ticw++;
        }else if (cursor.value.p_bed == "IDW"){
          tidw++;
        }else if (cursor.value.p_bed == "GW"){
          tgw++;
        }
        //move to next cursor
        cursor.continue();
      }
    //alert("before count tvbl");
    //count total available bed left
    tvbl=40 - ticw - tidw - tgw;
    //alert("check the ticw : "+ticw);
    //alert("check the tidw : "+tidw);
    //alert("check the tgw : "+tgw);
      let final_ticw = 10 - ticw;
      let final_tidw = 10 - tidw;
      let final_tgw = 20 - tgw;
      

    document.getElementById("total_available_bed").innerHTML = tvbl ;
    document.getElementById("total_available_bed_ICW").innerHTML = final_ticw ;
    document.getElementById("total_available_bed_IDW").innerHTML = final_tidw ;  
    document.getElementById("total_available_bed_GW").innerHTML = final_tgw ; 
    //alert("check the tvbl : "+tvbl);
    };
    
    tx.oncomplete = function() {
        db.close();
     };
  };
  

// start new_patient_register
function new_patient_register(pid, pname, bed, pnationality)
{
  // alert(pid +"|" + pname+"|" + bed +"|" + pnationality);
      
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
  
  // Open (or create) the database
  var store = open.transaction.objectStore("Patient_Bed") || open.result.createObjectStore("Patient_Bed", {keyPath: "id"});
store.createIndex("Patient_Check_in", "id");


  open.onerror = function(event){
    console.error("An error occurred with IndexedDB.");
    console.error(event);
  }

  open.onupgradeneeded = function() {
    var db = open.result;
    //set keyPath = id
    var store = db.createObjectStore("Patient_Bed", {keyPath: "id"});
    var index = store.createIndex("Patient_Check_in", "id");
  };

  open.onsuccess = function() {
      // start a new transaction
      var db = open.result;
      
      var tx = db.transaction("Patient_Bed", "readwrite");
      var store = tx.objectStore("Patient_Bed");

      //get the bed no
      //bed_no = assign_bed(document.getElementById("bed").value);

      //add some data
      //store.put({id: pid, p_name:pname, p_nationality: pnationality, p_bed: bed, status: "Pending Check-In", bedno: ""});
      store.put({id: pid, p_name:pname, p_nationality: pnationality, p_bed: bed, p_status: "check_in", p_bedno: "ICW1"});
  
     // Close the db when the transaction is done
      tx.oncomplete = function() {
        db.close();
      };
  }
  
}// end new_patient_register


function assign_bed(bed_type){
 // alert("inside assign_bed fucntion");
  final_bed_type=""
  max_bed_no=0;
  bed_assigned_no=0;
  if ( bed_type == "ICW" ){
      max_bed_no=10;
      final_bed_type="ICW";
  }else if ( bed_type == "IDW" ){
      max_bed_no=10;
      final_bed_type="IDW";
  }else if ( bed_type == "GW"){
      max_bed_no=20;
      final_bed_type="GW";
  }
  //alert("before for loop");
  for(i=1;i<=max_bed_no;i++){
    b=final_bed_type+i;
    //alert("Inside for loop, b = "+ b);
    //alert("Inside for ------"+ i +"---- checking : "+document.getElementById(b).innerHTML);
    //if (document.getElementById(b).innerHTML.includes("occupied") != true){
      if (document.getElementById(b).innerHTML != "occupied"){
      //assumed icw1 bedroom is empty, then assign patien to icw1
      //alert("inside assign_bed(), come in successfully.");
      bed_assigned_no=final_bed_type+i;
      break;
    }
  }
  //alert("isnide assign bed : "+bed_assigned_no);
  return bed_assigned_no;
}

function update_check_in_bedroom(patient_id, bedroom_no)
{
  //alert("inside update_check_in_bedroom : "+patient_id+" | "+bedroom_no);
  
  var open = indexedDB.open("Patient_Bed", 1);
  open.onupgradeneeded = function() {
      var db = open.result;
      var store = db.createObjectStore("Patient_Bed", {keyPath: "id"});
      var index = store.createIndex("Patient_Check_in", "id");
  };

  open.onsuccess = function() {
    var db = open.result;

    var tx = db.transaction("Patient_Bed", "readwrite");
    var store = tx.objectStore("Patient_Bed");
    var getPatient_ID = store.get(pid);

    getPatient_ID.onsuccess = function(e) {
      // alert ("found the patient ID : "+patient_id);
      var data = e.target.result;
      data.p_bedno=bedroom_no;
      data.p_status="Check-In Completed";
      store.put(data);
    };

    tx.oncomplete = function() {
      db.close();
    };
    //alert("end update_check_in_bedroom");
  }

  //update bedroom status to occupied

}

function assign_ticket(pid, pname, bed, pnationality){
  var ticket = "<div class='tdsmall'>" + pname + " (ID :" + pid + ") | "  + pnationality + " | "  + bed + " - Checking-In now and please wait.... </div>";

}

function check_bed(){
  // alert("inside check_bed function()");
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

   // Open (or create) the database
   var open = indexedDB.open("Patient_Bed", 1);

  open.onerror = function(event){
  console.error("An error occurred with IndexedDB.");
  console.error(event);
  }

  open.onupgradeneeded = function() {
    var db = open.result;
    //set keyPath = id
    var store = db.createObjectStore("Patient_Bed", {keyPath: "id"});
    var index = store.createIndex("Patient_Check_in", "id");
  };

  open.onsuccess = function(){
    var db = open.result;
    var tx = db.transaction("Patient_Bed", "readonly");
    var store = tx.objectStore("Patient_Bed");

    store.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor){
        if(cursor.value.p_bedno != ""){
          b=cursor.value.p_bedno;
          // alert(b +" bed is occupied.");
          document.getElementById(b).innerHTML="occupied";
        }
        cursor.continue();
      }
    };

    tx.oncomplete = function() {
      db.close();
   };
  };
}

function update_bed_status(){
  //alert("inside update_bed_status-------------------");

  let ticw_count=10;
  let tidw_count=10;
  let tgw_count=20;
/*
  for(i=1;i<=ticw_count;i++){
    b=ICW+i;
    if (document.getElementById(b).innerHTML.includes("occupied") != true){
      document.getElementById(b).innerHTML="available";
    }
  }

  for(i=1;i<=tidw_count;i++){
    b=IDW+i;
    if (document.getElementById(b).innerHTML.includes("occupied") != true){
      document.getElementById(b).innerHTML="available";
    }
  }

  for(i=1;i<=tgw_count;i++){
    b=GW+i;
    if (document.getElementById(b).innerHTML.includes("occupied") != true){
      document.getElementById(b).innerHTML="available";
    }
  }
  */


  for(i=1;i<=ticw_count;i++){
    b="ICW"+i;
    if (document.getElementById(b).innerHTML != "occupied"){
      document.getElementById(b).innerHTML="available";
    }
  }

  for(i=1;i<=tidw_count;i++){
    b="IDW"+i;
    if (document.getElementById(b).innerHTML != "occupied"){
      document.getElementById(b).innerHTML="available";
    }
  }

  for(i=1;i<=tgw_count;i++){
    b="GW"+i;
    if (document.getElementById(b).innerHTML  != "occupied"){
      document.getElementById(b).innerHTML="available";
    }
  }
}

function assign_bed_status(){
  //alert("###############assign_bed_status");
  let ticw_count=10;
  let tidw_count=10;
  let tgw_count=20;
  for(i=1;i<=ticw_count;i++){
    b="ICW"+i;
    document.getElementById(b).innerHTML="available";
  }

  for(i=1;i<=tidw_count;i++){
    b="IDW"+i;
    document.getElementById(b).innerHTML="available";
  }

  for(i=1;i<=tgw_count;i++){
    b="GW"+i;
    document.getElementById(b).innerHTML="available";
  }
}