//$.noConflict();
$(function(){ //or $(document).ready(function(){
   // jQuery methods go here...

   $('[data-toggle="tooltip"]').tooltip(); //enable all tooltips in the document

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

	$("#refresh_data").click(function(){	
        var recentDays = 200;
        $( ".newStats > em" ).attr({"data-toggle":"tooltip", "title":"In the last "+recentDays+" days"});
        $('[data-toggle="tooltip"]').tooltip();
        newCommentsNumber(recentDays);
        newOrdersNumber(recentDays);
        //..others
    });

 	$(window).on("load",function(){ console.log("rrr");
		$("#refresh_data").trigger("click"); //fire refresh at page load
	});   


});