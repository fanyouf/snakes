;(function(g,f){
	//注意本对象，并不改变其在画布上的样子，只是负责改变状态，改变样子的另有方法
    //蛇对象
    
    function Snake(config){

    	this.head = new Image();
        this.head.src="./snake.png";
        if(this.head.complete){
           console.info("head.complete")
        }else{
           this.head.onload = function(){
            console.info("头像加载成功")

           };
           this.head.onerror = function(){
             console.info('美女加载失败，请重试');
           };
        }
//debugger;
    	this.startX = 3, //开始头x坐标
        this.startY = 0, //开始头y坐标
        this.curOri = 'right'; //初始化方向
        this.ori = [['left' , 'right'] , ['up' , 'down']]; //相逆方向数组
        this.oriss = ['left' , 'right' , 'up' , 'down']; //所有允许的方向，用来判断方向合法性，在canChangeOri方法
        
        this.mes = [{x : 3 , y : 0} , {x : 2 , y : 0} , {x : 1 , y : 0}]; 

        this.unit = config.unit;

        this.c = config.c;
      
        
        this.mwid = config.mwid;
		this.mhei = config.mwid;
    }

    Snake.prototype = {
        constructor:Snake,
        //添加一个身体的方法
        getNextP:function(){

        	var hp = this.mes[0];
        	var n = {x : hp.x , y : hp.y - 1}; //让头部的坐标像上移动一格
	        switch(this.curOri){
	        	case "up":
	        		break;
				case "down" : 
					n = {x : hp.x , y : hp.y + 1};
					break;
				case "left" : 
					n = {x : hp.x - 1 , y :  hp.y};
					break;
				case "right": 
					n = {x : hp.x + 1 , y :  hp.y};
					break;
	        } 
	        return n;
        },
        add : function(){
            //判断当前尾部方向
            var last = this.mes[this.mes.length - 1]; //获取最后一个身体
            var plast = this.mes[this.mes.length - 2]; //获取倒数第二个身体

            var newEle = {x : 2*plast.x - last.x  , y : 2*plast.y - last.y}; //创建一个新身体

            // var px = last.x - plast.x;
            // var py = last.y - plast.y; //根据计算最后两个身体的坐标差，来计算添加身体应在的方向
            // //计算新加元素位置
            // var newEle = {x : last.x + px , y : last.y + py}; //创建一个新身体
            this.mes.push(newEle); //将新身体加入身体数组
        },
 
        draw:function(){
        	let unit = this.unit;
        	c = this.c;

//console.info(c)
        	c.beginPath();
		    c.drawImage(this.head,0,0,100,100,this.mes[0].x * unit , this.mes[0].y * unit , unit ,unit)
		    

		    for(var i = 1 ; i < this.mes.length ; i++){
		        c.fullStyle = '#FF4400';
		        c.lineStyle = '#000000';
		        c.rect(this.mes[i].x * unit , this.mes[i].y * unit , unit ,unit);
		    }
		    c.closePath();
		    c.stroke();
        },
        //移动身体
        move : function(){//参数为之前第一个身体，即头部的位置对象
//console.info(this.mes)
            for (var i = this.mes.length - 1; i >= 1; i--) {
                this.mes[i] = this.mes[i-1];
            }
            this.mes[0] = this.getNextP();
//console.info(this.mes)
            //并且把每个节点的左边变化成前一个节点的坐标，达到依次向前的目的
            //
            this.handleAdd();

            this.draw();

        },
        //改变方向
        changeOri : function(ori){
//console.info(ori)
            if(this.oriss.indexOf(ori) == -1){ //判断方向是否在允许方向内
                return;
            }
            if(!this.canChangeOri(ori)){ //判断改变方向是否合法
                return;
            }
            this.curOri = ori; //如果上面两个都通过，改变方向
        },
        //判断改变的方向是否合法
        canChangeOri : function(ori){ //参数为方向字符串 例如：left
            if(ori == this.curOri){ //判断方向是否为当前方向，如果是则无需操作
                return false;
            }
            var oris = null;
            for(var i in this.ori){ //判断是否改变方向为当前方向的逆方向
                if(this.ori[i].indexOf(this.curOri) != -1){
                    oris = this.ori[i];
                    break;
                }
            }
            if(oris.indexOf(ori) != -1){
                return false;
            }
            return true;
        },
        //判断是否碰撞到了自己
        isCrashSelf : function(){
            var head = this.mes[0]; //获取头节点
            for(var i = 1 ; i < this.mes.length ; i++){ //遍历身体节点
                if(this.mes[i].x == head.x && this.mes[i].y == head.y){ //判断头结点是否碰撞身体
                    return true;
                }
            }
            return false;
        },
        //判断是否撞墙
        isCrashWell : function(){ //参数为横竖的格子数量


            var head = this.mes[0]; //获取头节点

			let width  = this.mwid
			let height = this.mhei;
//console.info(width,height,head)
            if(head.x < 0 || head.y < 0){ //判断是否撞左上墙
                return true;
            }
            if(head.x > (width - 1) || head.y > (height - 1)){ //判断是否撞右下墙
                return true;
            }
            return false;
        },
        //处理吃东西
        handleAdd : function(objF = game.food){
            var head = this.mes[0]; //获取头节点

            let flag = objF.foodList.some(food=>{

            	return food.x == head.x && food.y == head.y;
            })

            if(flag){ //判断头节点是否碰撞食物节点，食物在外定义
                this.add(); //调用添加身体

                game.food.remove(head);
                game.addScore();
            }
        }
    }

    window.Snake = Snake;
})();