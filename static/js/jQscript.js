//$.noConflict();
$(function(){ //or $(document).ready(function(){
   // jQuery methods go here...

   $('[data-toggle="tooltip"]').tooltip(); //enable all tooltips in the document

   	function setProgressBar(val){
   		var sel = "#progress_modal .progress-bar";
   		$( sel ).attr({"aria-valuenow":val});
   		$( sel ).css("width",val+"%");
        $( sel ).html(val+"%");
   	} 
	function newCommentsNumber(recentDays) { //fare meglio con prelievo di sto numero da qlk config e calcolo data passata più accurata
  		var today = new Date(); 
		var recentDateStart = today.getTime() - recentDays*24*3600*1000;
		$.get( 
			"../../item/new_comments", 
			{ "date": recentDateStart }, //json object sent to express router
			function( data ) {
		  		$( "#new_comments" ).html( data.num );
			},
			"json"
		);
	}
	function newOrdersNumber(recentDays) { //fare meglio con prelievo di sto numero da qlk config e calcolo data passata più accurata
  		var today = new Date(); 
		var recentDateStart = today.getTime() - recentDays*24*3600*1000;
		$.get( 
			"../../order/new_orders", 
			{ "date": recentDateStart }, //json object sent to express router
			function( data ) {
		  		$( "#new_orders" ).html( data.num );
			},
			"json"
		);
	}


	$("#sysinfo_link").click(function(){	
		$.get( 
			"../../admin/sysinfo", 
			function( data ) {
				for (const field in data) {
					if (data.hasOwnProperty(field)) {
					    if (data[field] instanceof Array) {
					    	arr = data[field];
					    	var temp = "<ol>"
					    	for (var i=0;i<arr.length;i++)
					    		temp+=("<li>"+arr[i]+"</li>");
					    	$( `#sysinfoModal_${field}`).html(temp+"</ol>");
					    }
					    else
					    	$( `#sysinfoModal_${field}`).html( `${data[field]}`);
					}
				} 
		  		$('#sysinfo_modal').modal();
			}
		);
    });

	$("#refresh_data").click(function(){	
        var recentDays = 200;
        $( ".newStats > em" ).attr({"data-toggle":"tooltip", "title":"In the last "+recentDays+" days"});
        $('[data-toggle="tooltip"]').tooltip();
        setProgressBar(0);
        $( "#progress_modal" ).modal();
        newCommentsNumber(recentDays);
        setProgressBar(50);
        newOrdersNumber(recentDays);
        setProgressBar(100);
        $( "#progress_modal" ).modal('toggle');
    });

 	$(window).on("load",function(){
		$("#refresh_data").trigger("click"); //fire refresh at page load
	});   


});