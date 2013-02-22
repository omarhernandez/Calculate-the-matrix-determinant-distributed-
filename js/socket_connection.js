var socket = io.connect();



 

function refresh_status_socket(length_sockets_clients){
 
   $counter_sockets.html( (length_sockets_clients==1) ?' is '+length_sockets_clients+' computer or device' :' are '+length_sockets_clients+' computers or devices' );


	}





//------------------------------------------------------------------------

//------------------------------------------------------------------------
//------------------------------------------------------------------------
$(document).on("ready",function(){


	var $type_user = $(".type_user");
	var $slaves = $(".slaves");
	var $master = $(".master");
	var $msg_status_data = $(".msg_status_data");


   $counter_sockets = 	$('.count_sockets'); // objecto contador de sockets



	socket.emit('connection');  // creamos la nueva conexion

//--------------------------------------
// obtener la matrix determinante si soy slave

socket.on('send_to_client_determinant' , function(matrix_array){

	$msg_status_data.html("Solving... <br>");

 
// hacemos la matrix determinante de 2x2
 
 	msg_response = matrix_array[0]+ " x "+ matrix_array[3]+" - "+matrix_array[2]+" x " + matrix_array[1];


 	response_determinant =( matrix_array[0]* matrix_array[3]) - ( matrix_array[2] *matrix_array[1] );


	$msg_status_data.append(" "+msg_response+ " = "+response_determinant);

	$msg_status_data.append(" <br><br> return result : ");


	$msg_status_data.append(" "+response_determinant);



	socket.emit("send_response_matrix_determinant",response_determinant)

});
 


//--------------------------------------
// status socket pc ... para refrescar los sockets online

	socket.on('response_socket_status',function(length_sockets_clients){

	 $slaves.html((length_sockets_clients== 1 ) ? 0 : length_sockets_clients -1);
 	 $master.html(1);
 
	 refresh_status_socket(length_sockets_clients);
 

	});

//--------------------------------------
// rendereamos la funcion maestra para hacer la determinante
// esta controla y crea la determinante
socket.on('set_master_socket',function(MSG_STATUS_USER_MASTER){

	$type_user.html(MSG_STATUS_USER_MASTER);
 
	set_controllers_master();

});

//----------------------------------------
// este va a calcular la determinante

socket.on('set_slave_socket',function(MSG_STATUS_USER_SLAVE){

	$type_user.html(MSG_STATUS_USER_SLAVE);
 	$(".msg_status_data").html('|Waiting for marix determinant Processing...');

});
//----------------------------------------------
// obtenemos el resultado de un cliente


socket.on('catch_response_from_client',function(response_determinant){

 $(".response_client").append(" "+response_determinant);

});





//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
// controladores para las operaciones de master...
function set_controllers_master(){

var $keyup_matrix = $("#number_matrix_data");


	$.get('views/master_controllers.html',function(STR_MASTER_CONTROLLERS){


		$(".msg_status_data").html(STR_MASTER_CONTROLLERS);


		$("#send_determinant").live("click",function(){

 
	make_array_determinant();


});





	});

// ingresando el numero de matriz
$keyup_matrix.live('keyup',function(e){

	var length_matrix = $("#number_matrix_data").val();
 	var $matrix = $(".matrix");

 		$matrix.html("");

	if(length_matrix !=0 &&  !isNaN(length_matrix) ){ 
	// si no es cero y si es un numero entonces 


	var num_rows_and_cols = length_matrix;

	
	num_rows_and_cols *= num_rows_and_cols; // el cuadrado

	for(i=0;i< num_rows_and_cols;i++){


	 	$matrix.append('<input type="text" class="number_matrix">')		
 
		if( ( (parseInt((i))+1)  % length_matrix ) == 0   ) {

			$matrix.append('<br/>');	


		}
		


	}

 

	}


}); // keyup


 function make_array_determinant(){

var $content_matrix = $(".matrix").children(".number_matrix");

var matrix_array = Array();

 
 

for(i= 0 ; i< $content_matrix.length ; i++ ){

  matrix_array.push($content_matrix[i].value);
 
  }

 socket.emit('send_matrix_determinant',matrix_array);


 }// END MAKE ARRAY DETERMINANT




}// END SET CONTROLLERS MAASTER


//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
// controladoreas para las operaciones de los slaves..
function set_controllers_slave(){




}

});	