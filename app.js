var express =  require('express');
var http =  require("http");
var app =  express();
var server = http.createServer(app); //creamos el servidor
var route = require('./router'); // obtenemos nuestros ruteos

var _connections_counter = 0; //manager de conexiones de sockets
var MSG_STATUS_USER_MASTER = '<span class="m_status">Master Machine</span>';
var MSG_STATUS_USER_SLAVE = "<span class='s_status'>Slave Machine</span>";


	SERVER_LISTEN_PORT = 8889;
	
	app.set('views',__dirname+'/views'); // ruta de nuestras vistas;
	
	app.configure(function(){
	
	
	app.use(express.static(__dirname)); // app.use --> expres.static --> __dirname
	
	});//STATIC FILES
	
	app.get('/',route.index);
	
	
	server.listen(SERVER_LISTEN_PORT);
	
	
	var io = require('socket.io').listen(server); // socket io escuche en el port del server ..
	
	//---------------------------------------------------------------
//---------------------- cuando se crea un nuevo socket ---------
//---------------------------------------------------------------
//---------------------------------------------------------------

io.sockets.on('connection',function(client_transfer_socket){ // conexion de socket.


				
				client_transfer_socket.on('connection',function(req,res){ // cuando se crea un nuevo socket
 				
				_connections_counter++;
				
				if(_connections_counter == 1){
				
				refresh_client_socket();
				
				client_transfer_socket.emit('set_master_socket',MSG_STATUS_USER_MASTER);
				
				client_transfer_socket.join('master room');
				
				}else{// refrescamos los sockets activos ..
				
				
				client_transfer_socket.join('slave room');
				
				refresh_client_socket(); 

				client_transfer_socket.emit('set_slave_socket',MSG_STATUS_USER_SLAVE);
				
				}
				
				


	});
//---------------------------------------------------------------
//---------------------- cuando se desconecta un socket ---------
//---------------------------------------------------------------

	client_transfer_socket.on('disconnect',function(){


			_connections_counter--;
			
			var sockets_clients =  io.sockets.clients();
			
			var length_sockets_clients = sockets_clients.length; 
			
			
			refresh_client_socket(); // refrescamos los sockets activos ..

 
});



//-----------------------------------------------------------------
//refresh socket client

	 function refresh_client_socket(){

  
		io.sockets.emit('response_socket_status', _connections_counter ) // respuesta del estado de los sockets



	}

//--------------------------------------------------------
//get matrix determinant

	client_transfer_socket.on('send_matrix_determinant',function(matrix_array){


 
 
 
		  io.sockets.in('slave room').emit('send_to_client_determinant', matrix_array);

		//io.sockets.emit('send_to_client_determinant', matrix_array ) // respuesta del estado de los sockets



	});

//----------------------------------------------------------
// obtenemos el resulado de un cliente y lo mandamos 
// al master
	
	client_transfer_socket.on('send_response_matrix_determinant',function(response_determinant){


	 io.sockets.in('master room').emit('catch_response_from_client', response_determinant);



	});




});