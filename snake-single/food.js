;(function(){

	function setRandom(n,maxWidth,maxHeight){
		var arr = [];
		for(var i = 0;i < n; i++){
			let x =  Math.floor(Math.random()*maxWidth);
			let y =  Math.floor(Math.random()*maxHeight);

			arr.push( {x,y})
		}
		return arr;
	}

	function Food(config){

		this.foodList = setRandom(config.foodNumber,config.mwid,config.mhei);


		this.unit = config.unit;
		this.c = config.c;
		this.maxWidth = config.mwid
		this.maxHeight = config.mhei


	}
	//删除一个食物，同时，添加一个食物
	Food.prototype.remove = function(p){
//debugger;
		let index = this.foodList.findIndex(item=>{
			return p.x == item.x && p.y == item.y;
		});

		if(index!=-1){
			this.foodList[index] =  setRandom(1,this.maxWidth,this.maxHeight)[0];
console.info("新食物位置",this.foodList[index])
		}
	}

	Food.prototype.draw = function(){
		let c = this.c;
		let g = this.g;
		c.beginPath();
		this.foodList.forEach(point=>{
		 	c.rect(point.x * this.unit , point.y * this.unit , this.unit , this.unit);
		})
		c.closePath();
		c.stroke();
	}

	Food.prototype.move = function(){
		this.draw();
	}
	

	window.Food = Food;
})();