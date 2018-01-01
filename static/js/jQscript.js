//$.noConflict();
$(function(){ //or $(document).ready(function(){
   // jQuery methods go here...

/*----------------------GENERAL ADMIN PAGE JS---------------------*/ 

   $('[data-toggle="tooltip"]').tooltip(); //enable all tooltips in the document
   $("#inserted_modal").modal('show');

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


/*--------------------------PRODUCT INSERTION (newItem.html)----------------------*/ 	
var reader = new FileReader();

$( "#fname" ).change(function() {
	errFlag = (sessionStorage.product_names && ($.inArray($(this).val(),sessionStorage.getItem("product_names")!=-1)));
		/* Build up errors object, name of input and error message: */
    console.log(errFlag);
    var display = (errFlag!=(-1))?"visible":"hidden";
    $("#fname_errLabel").css("visibility",display);
    $("#fname_errGlyph").css("visibility",display);
    if (errFlag)
    	$("#fname").addClass("has-warning"); 
    else
    	$("#fname").deleteClass("has-warning"); 
});

// file drag hover
function FileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
	e.dataTransfer.dropEffect = 'copy';
}
// info on file
function ParseFile(file) {
	var msg = "<p>File information: <ul><li>name: <strong>" + file.name +
		"</strong></li><li>type: <strong>" + file.type +
		"</strong></li><li>size: <strong>" + file.size +
		"</strong> bytes</li></ul></p>";
	$("#uploadStatusMsg").html(msg);
}

 function progressBar(evt) {
 	
 			$(".progress").css("display","block");
          if (evt.lengthComputable) { 
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');
            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }
          }
    }


// file selection
function FileSelectHandler(e) {
	// cancel event and hover styling
	//FileDragHover(e);
	  e.stopPropagation();
    e.preventDefault();
	
//console.log(e);
	var dt = e.dataTransfer || e.target || e.originalEvent ;
	// fetch FileList object
	//var files = e.target.files || e.dataTransfer.files || e.originalEvent.dataTransfer;
	// process all File objects
	
	$('.progress-bar').text('0%');
    $('.progress-bar').width('0%');

    var f = (dt.items)?(dt.items[0].getAsFile()):dt.files[0];

	if (f.type.match('image.*')) /*for (var i = 0, f; f = files[i]; i++)*/ {
		// Only process image files.
		/*if (!f.type.match('image.*'))
        	continue;*/
        
      	//var reader = new FileReader();

	    reader.onprogress = progressBar;
	    reader.onload = (function(theFile) {
	        // Ensure that the progress bar displays 100% at the end.
            $('.progress-bar').text("100%");
            $('.progress-bar').width("100%");

	        return function(e) {
	          // Render thumbnail.
	          var span = document.createElement('span');
	          span.innerHTML = ['<img class="thumb" src="', e.target.result,
	                            '" title="', escape(theFile.name), '"/>'].join('');
	          $('#uploadedimgThumb').html(span);
	        };
      	})(f);
     	 // Read in the image file as a data URL.
      	reader.readAsDataURL(f);
		ParseFile(f);
	}
}

function Init() {
	$('.progress').css("display","none");
	var fileselect = $("#fileselect"),
		filedrag = $("#filedrag"),
		submitbutton = $("#submitbutton");
	// file select
	//fileselect.addEventListener("change", FileSelectHandler, false);
	fileselect.change(FileSelectHandler);
//fileselect.change(progressBar);
	// is XHR2 available?
	var xhr = new XMLHttpRequest();
	if (xhr.upload) {
		filedrag.bind("dragover", FileDragHover);
		filedrag.bind("dragleave",FileDragHover);
		document.getElementById('filedrag').addEventListener('drop', FileSelectHandler, false);
		//filedrag.bind("drop",FileSelectHandler);
		
		filedrag.bind("progress",progressBar)
		filedrag.css("display","block");
		submitbutton.css("display","none");
	}

	

}

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  Init();// Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

$("#commentsButton").click(function(){
	var n = $('#reviewsNum').val();
	n++;
	var html =  `<div class = "newCommentDiv">
	 			  <textarea class="form-control" name="comment${n}" placeholder="Enter the review text" rows="3"></textarea>
                  <textarea class="form-control" name="username${n}" placeholder="Enter the author name." rows="1"></textarea>
                  <label for="stars${n}">Rating (from 1 to 5 stars):</label>
                  <select class="form-control" name="stars${n}">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                 </select></div> `;
	$(this).before(html);
	$('#reviewsNum').val(n);
	var str = "<i>"+n.toString()+"</i> comment";
	if (n==1) 
		$(this).text("Insert another comment");
	else
		str+="s";
	$('#commentsLabel').html(str);
});





/*---------------COMMON--------------------------*/
 $(window).on("load",function(){
	$("#refresh_data").trigger("click"); //fire refresh at page load
	$("#fname_errLabel").css("visibility","hidden");
    $("#fname_errGlyph").css("visibility","hidden");

    $.get( 
		"../../item/all_names", 
		function( data ) {
			sessionStorage.setItem("product_names", data.product_names);
			console.log(data.product_names);
		},
		"json"
	);
}); 




});