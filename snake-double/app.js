const http = require('http');
const url = require("url");
const fs = require("fs");
const path = require('path');
const sio = require("socket.io");

const Snake = require("./src/snake.js");

const server = http.createServer( (req,res)=>{
	let realUrl = "http://"+req.headers.host + req.url;
	let urlObj = url.parse(realUrl);
//console.log(urlObj.pathname);
	switch(urlObj.pathname){
		case "/" :
			let data = fs.readFileSync("./public/index.html","utf-8");
			res.end(data);
			break;
		default:
			let filename = path.join(__dirname,urlObj.pathname);
			if(fs.existsSync(filename)){
				fs.readFile(filename,(err,data)=>{
					if(err) throw err;
					res.end(data);
				})
			}
			break;
	}
});

let total = 0;
let data = {
	userId:[],
	snakes:[],
	food:[]
}


let isReplay = false;
const io = sio.listen(server);

function changeOri({id,ori}){
	var index = data.userId.findIndex(item=>{console.info(item,id);return item == id});
	if(index != -1){
		data.snakes[index].changeOri(ori);
	}
}
function addUser(id){
	console.log(`第${io.eio.clientsCount}个加入...`);
	data.userId.push(id);
	data.snakes.push(new Snake(id))
}

function removeId(id){
	var index = data.userId.findIndex(item=>{console.info(item,id);return item == id});
	if(index != -1){
		data.userId.splice(index,1);
		data.snakes.splice(index,1);
	}
	console.info(`删除用户 find ${index}`);
	console.info(data)
}

io.on("connection",(socket)=>{

	socket.on("move",data=>{

	});

	socket.on("changeOri",data=>{
		console.info("转方向....",data)
		changeOri(data);
	})

	socket.on('disconnect', function () {
		removeId(socket.id)
		console.info("disconnect",socket.id)
	   // io.sockets.emit('user disconnected');
	 });
	socket.on("join",id=>{
		socket.id = id
		console.log("用户" + data +"加入");
		addUser(id);
		
		if(!isReplay){
			isReplay = true;
			console.info("1")

			setInterval(function(){
				data.snakes.forEach(function(snake){
					snake.move();
				})
				socket.emit("reply",data);
				socket.broadcast.emit("reply",data);
			},500)
		}
	})
});

server.listen(80,function(){
	console.log("80.........")
})