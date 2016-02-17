function game(){
	this.clientw=document.documentElement.clientWidth;//浏览器的宽
	this.clienth=document.documentElement.clientHeight;
	// this.letterArr=[{url:"img/a.jpg",code:"65"},{}]
	this.letterArr=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
	this.letterLen=5;//一次出多少
	this.speed=4;//速度
	this.spans=[];//存放所有产生的字母
	this.currArr=[];//存放页面中字母
	this.currPos=[];
	this.die=10;
	this.score=0;
	this.currscore=0;//当前关分数
	this.num=10;
	this.scoreEle=document.getElementsByClassName("score")[0].getElementsByTagName("span")[1];
	this.dieEle=document.getElementsByClassName("die")[0].getElementsByTagName("span")[1];
	this.aa=1;//关卡数  第一关
}
var flag=false;
game.prototype={
	play:function(){
		// 将字母显示到body里面
		this.getLetter(this.letterLen);
		// 让body里面显示的字母动
		var that=this;
		$(".play").click(function(){
			$(".kaishi").fadeOut(500);
			setTimeout(function(){
				that.move();
			},1000)
		})

		// 按下键盘
		this.key();
		var kaiguan=true;
		var audio=document.getElementById("audio");
		audio.src="./beijing.mp3";
		audio.play();
		$(".music").click(function(){
			if(kaiguan){
				audio.pause();
				kaiguan=false;
				$(this).css({background:"url(./images/gmusic.png)",backgroundSize:"cover"});
			}else{
				audio.play();
				kaiguan=true;
				$(this).css({background:"url(./images/music.png)",backgroundSize:"cover"});
			}	
		})
	
		audio.onended=function(){
			audio.play();
		}
	},
	key:function(){
		var that=this;
		document.onkeydown=function(e){
			if(flag==true){
				return;
			}
			var ev=e||window.event;//兼容性问题
			var code=String.fromCharCode(ev.keyCode+32);
			for (var i = 0; i < that.spans.length; i++) {
				if(that.spans[i].innerHTML==code){
					document.body.removeChild(that.spans[i]);
					that.spans.splice(i,1);
					that.currPos.splice(i,1);
					that.currArr.splice(i,1);
					that.getLetter(1);
					that.score++;
					that.currscore++;
					that.scoreEle.innerHTML=that.score;
					// 关卡
					if(that.currscore%that.num==0){
						flag=true;
						that.aa++;
						//过关了
						//alert("第"+that.aa+"关");
						clearInterval(that.t);
						$(".guan1").fadeIn(500);
						$(".guan1 h2").html("总分数 :"+that.score);
						$(".guan1 p").html("当前关分数 :"+that.currscore);
						$(".guan2 p").html("第 "+that.aa+" 关");
						$(".anniu1").click(function(){
							flag=false;
							$(".guan1").fadeOut(500);
							$(".guan2").fadeIn(500);
							setTimeout(function(){
								$(".guan2").fadeOut(500);
							},1500);
							setTimeout(function(){
								that.next();
							},2800);
						})
						$(".anniu2").click(function(){
							flag=false;
							window.location.reload();
						})

					}
					break;
				}
			};
		}
	},
	next:function(){//下一关
		for (var i = 0; i < this.spans.length; i++) {
			document.body.removeChild(this.spans[i]);
		};
		this.spans=[];
		this.currPos=[];
		this.currArr=[];
		this.dieEle.innerHTML=10;
		this.speed++;
		// 速度达到一定程度不在变化  letterLen也不变
		 if(this.speed>8){
			 this.speed=8;
		 }
		this.num+=10;
		this.currscore=0;
		this.letterLen++;
		if(this.letterLen==27){
			this.letterLen=26;
		}
		this.play();
		this.move();
		$(".hongm").css({height:"100%"});
	},
	move:function(){
		var that=this;
		var movefn=function(){
			// 函数里面this指向window
			for (var i = 0; i < that.spans.length; i++) {
				var bottom=document.body.offsetHeight-that.spans[i].offsetTop-100+that.speed;//100是泡泡的高
				that.spans[i].style.bottom=bottom+"px";
				if(bottom>that.clienth){
					document.body.removeChild(that.spans[i]);
					that.spans.splice(i,1);
					that.currArr.splice(i,1);
					that.currPos.splice(i,1);
					that.getLetter(1);//body中在加一个 spans数组也会加一个
					that.die--;
					$(".hongm").css({height:that.die+"0%"});
					that.dieEle.innerHTML=that.die;
					if(that.die==0){
						flag=true;
						//失败
						//alert("game over");
						console.log(that.t);
						clearInterval(that.t);
						$(".over").fadeIn(500);
						$(".anniu3").click(function(){
							//that.restart();
							window.location.reload();
							$(".over").css({display:"none"});
						})
						$(".anniu4").click(function(){
							window.location.reload();
						})
					}
				}
			};
		}
		clearInterval(this.t);
		this.t=setInterval(movefn,60);
	},
	restart:function(){
		for (var i = 0; i < this.spans.length; i++) {
			document.body.removeChild(this.spans[i]);
		};
		this.spans=[];
		this.currPos=[];
		this.currArr=[];
		this.scoreEle.innerHTML=0;
		this.dieEle.innerHTML=10;
		this.speed=3;
		this.num=10;
		this.currscore=0;
		this.letterLen=5;
		this.play();
	},
	getLetter:function(num){
		// 先获取到指定的字母
		var arr=this.getRand(num);//arr为随机生成的不重复的letterLen长度的
		var posArr=[];
		for (var i = 0; i < arr.length; i++) {//数组返回的值的个数创建span
			var span=document.createElement("span");
			span.innerHTML=arr[i];

			var x=(100+(this.clientw-200)*Math.random());
			var y=(-200*Math.random()-100);
			var width=30;
			while(this.check1(this.currPos,x,width)){
				x=(100+(this.clientw-200)*Math.random());
			}
			posArr.push({minx:x,maxx:x+width});
			this.currPos.push({minx:x,maxx:x+width});
			span.style.cssText="width:100px;height:100px;font-size:0px;position:absolute;left:"+x+"px;bottom:"+y+"px;background:url(./images/"+arr[i]+".png)";
			span.style.backgroundSize="cover";
			document.body.appendChild(span);
			this.spans.push(span);
		};
	},
	check1:function(arr,x,width){//检查位置重复
		for (var i = 0; i < arr.length; i++) {
			if(!(x+width<arr[i].minx ||arr[i].maxx+width<x)){//位置重复返回true重新生成
				return true;
			}		
		};
		return false;
	},
	getRand:function(num){
		var arr=[];
		for (var i = 0; i < num; i++) {
			var rand=Math.floor(this.letterArr.length*Math.random());			
			while(this.check(this.currArr,this.letterArr[rand]) ){
			    rand=Math.floor(this.letterArr.length*Math.random());			

			}
			arr.push(this.letterArr[rand]);
			this.currArr.push(this.letterArr[rand]);
		};
		return arr;//不同的值
	},
	check:function(arr,val){//检查字母重复
		for (var i = 0; i < arr.length; i++) {
			if(arr[i]==val){//数组里面有返回true 重新生成rand
				return true;
			}
		};
		return false;
	}

}