;(function(){

	const c = document.getElementById('gbcanvas').getContext('2d');
	const mWidth  =  document.getElementById('gbcanvas').offsetWidth; //当前可视区域的宽，即canvas的宽
    const mHeight = document.getElementById('gbcanvas').offsetHeight;  //当前可视区域的高，即canvas的高
    const unit = 20;
    const foodNumber = 3;
    const Score = document.getElementById('score')

	let config = {
		c,
		foodNumber, 
		mWidth,
	    mHeight,
	    unit,
	    mwid :  mWidth / unit, //计算当前横向格子数量
	    mhei :  mHeight / unit, //计算当前竖向格子数量
	}

console.info(config);

	const  Game = {
		actors: [],
		looper: -1,
	    score :  0, //记录成绩的变量初始化
	    food  : new Food(config),
	}

	Game.isOver = function(){
		
		return this.actors.some(item=>{

			return  item.constructor === Snake && item.isCrashWell(this.mwid , this.mhei)
		});

		
	}

	Game.start = function(){

    	this.actors.push( new Snake(config));
    	this.actors.push( this.food );

	    clearInterval(this.looper); //终止游戏主循环

	    this.bind();

	    //游戏主循环
	    this.looper = setInterval(()=>{

			c.clearRect(0 , 0 , mWidth , mHeight);

	    	this.actors.forEach(item=>{item.move()});

	    	if(this.isOver()){
	    		clearInterval(this.looper);
	            console.log('you die');
	            alert('you die , and your score is ' + this.score);
	    	}
	        
	    } , 200);
	}
	//键盘监听
	
	Game.addScore = function(){
		this.score++;
		Score.innerHTML = this.score;
	}

	Game.bind = function(){
		var that = this;
		window.onkeyup = function(key){
//console.info(key)
		    var ori = '';
		    switch(key.keyCode){
		        case 37:
		            ori = 'left';
		            break;
		        case 39:
		            ori = 'right';
		            break;
		        case 38:
		            ori = 'up';
		            break;
		        case 40:
		            ori = 'down';
		            break;
		    }
		    if(ori == ''){
		        return ;
		    }
		    //改变蛇走向
		    that.actors && that.actors[0].changeOri(ori);
		}
	}

	window.game = Game;
})();