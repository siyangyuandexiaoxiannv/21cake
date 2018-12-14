//定义新变量放图片的数组，放按钮的数组，轮播图的容器，放图片的容器，ul,上一个li
var imgList,bnList,rollImg,imgCon,ul,prevLi;
//定义新变量方向
var direct;
//将图片放入数组imgarr中
var imgArr=["assets/img/lunbo1.jpg","assets/img/lunbo2.jpg","assets/img/lunbo3.jpg","assets/img/lunbo4.jpg","assets/img/lunbo5.jpg"];
//将按钮图片放入数组bnArr中
var bnArr=["assets/img/left.png","assets/img/right.png"];
// 判断是否播放动画，设置布尔值为false
var bool=false;
// 判断是否自动轮播，设置autobool为false
var autoBool=false;
// 设置自动轮播的间隔帧数，间隔180帧
var time=120;
// 设置当前轮播图的定位点,初始值为0
var position=0;
//定义常量WIDTH为960，HEIGHT为320
var container;
const WIDTH=1100;
const HEIGHT=480;


init();
/*
*  初始化函数
*  1、执行动画函数
*  2、调用加载图片方法，当加载完成时，执行loadFinishHandler
* */
function init() {
    animation();
    container=document.getElementsByClassName("container")[0];
    Method.loadImg(imgArr,loadFinishHandler,"img");


}


//        异步/同步
/*
* 加载完成函数
* 参数
* list   数组   被加载完成后的图片数组
* type   字符串  用于区别当前加载内容
*  1、如果被加载的是图片，将数组赋值给imgList，然后加载按钮图片数组
*  2、如果被加载的是按钮图片，将数组赋值给bnList
*  3、创建轮播图容器
*  4、创建左右按钮
*  5、创建小圆点li
* */
function loadFinishHandler(list,type) {
    if(type==="img"){
        imgList=list;
        Method.loadImg(bnArr,loadFinishHandler,"bn");
    }else if(type==="bn"){
        bnList=list;
        createRoll();
        createBn();
        createLi();
    }
}
/*
* 创建轮播图容器
* 1、设置轮播图样式
* 2、设置图片容器样式
* 3、设置ul样式
* 4、创建轮播图容器
* 5、创建图片容器
* 6、创建ul
* 7、给容器中添加数组中第0项图片，设置该图片的宽高
* 8、侦听轮播图容器的鼠标经过和离开事件，用来判断是否自动轮播
* */
function createRoll() {
    var rollStyle={
        width:WIDTH+"px",
        height:HEIGHT+"px",
        position:"relative",
        overflow:"hidden",
        // marginTop:"-80px"
    };
    var imgConStyle={
        height:HEIGHT+"px",
        position:"absolute"
    };
    var ulStyle={
        listStyle:"none",
        position:"absolute",
        bottom:"10px"
    };
    rollImg=Method.createElem("div",container,"",rollStyle,null,null,true);
    imgCon=Method.createElem("div",rollImg,"",imgConStyle);
    ul=Method.createElem("ul",rollImg,"",ulStyle);
    imgCon.appendChild(imgList[0]);
    imgList[0].style.width=WIDTH+"px";
    imgList[0].style.height=HEIGHT+"px";
    rollImg.addEventListener("mouseleave",mouseHandler);
    rollImg.addEventListener("mouseenter",mouseHandler);
}

/*
*  创建按钮
*  1、设置左按钮样式
*  2、设置有按钮样式
*  3、根据按钮数组循环，将所有按钮放在轮播图容器中，
*  设置按钮的样式，侦听按钮的点击事件
* */
function createBn() {
    var leftBnStyle={
        position:"absolute",
        left:"10px",
        top:(HEIGHT-bnList[0].height)/2+"px"
    };
    var rightBnStyle={
        position:"absolute",
        right:"10px",
        top:(HEIGHT-bnList[1].height)/2+"px"
    };
    for(var i=0;i<bnList.length;i++){
        rollImg.appendChild(bnList[i]);
        Method.setStyle(bnList[i],i===0 ? leftBnStyle : rightBnStyle);
        bnList[i].addEventListener("click",clickHandler);
    }
}
/*
*  创建li小圆点
*  1、设置li样式
*  2、根据图片数组的长度循环创建li小圆点
*  3、设置ul的位置居中
*  4、设置侦听ul的点击事件
*  5、修改小圆点样式
* */
function createLi() {
    var liStyle={
        width:"10px",
        height:"10px",
        backgroundColor:"rgba(255,255,255,1)",
        borderRadius:"5px",
        float:"left",
        marginLeft:"10px"
    };
    for(var i=0;i<imgList.length;i++){
        Method.createElem("li",ul,"",liStyle);
    }
    ul.style.left=(WIDTH-ul.offsetWidth)/2+"px";
    ul.addEventListener("click",liClickHandler);
    changeLi();
}


/*
*  创建下一个图片摆放函数
*  1、设置下一张图片的大小是轮播图片的大小
*  2、设置当前图片容器的大小是轮播图大小的2倍，这样可以放下2张图片
*  3、判断当前方向如果是向左移动，将下一张图片插入在图片容器的最尾部，并且设置
*     图片容器的位置是0的位置
*  4、判断当前方向如果是向右移动，将下一张图片插入在图片容器的最前面，并且为了让
*    当前图片显示在中心位置，将当前图片容器位置向左移动一个图片的宽度
*  5、调用修改当前li的样式函数changeLi
*  6、设置bool是true，这样动画将会在一帧被触发
* */
function createNextImg() {
    imgList[position].style.width=WIDTH+"px";
    imgList[position].style.height=HEIGHT+"px";
    imgCon.style.width=WIDTH*2+"px";
    if(direct==="left"){
        imgCon.appendChild(imgList[position]);
        imgCon.style.left="0px";
    }else if(direct==="right"){
        imgCon.insertBefore(imgList[position],imgCon.firstElementChild);
        imgCon.style.left=-WIDTH+"px";
    }
    changeLi();
    bool=true;
}
/*
*  修改li样式
*  1、如果上一个li存在时，设置上一个li的样式是背景透明
*  2、设置prevli是当前定位的li
*  3、设置这个li的样式，背景是红色半透
* */
function changeLi() {
    if(prevLi){
        prevLi.style.backgroundColor="rgba(255,255,255,1)";
    }
    prevLi=ul.children[position];
    prevLi.style.backgroundColor="rgba(68,40,24,1)";
}

/*
*
*  鼠标进入离开轮播图容器事件
*  1、如果鼠标进入轮播图容器，设置autoBool是false，这样就不会自动轮播了,重置
*    下一次自动轮播的间隔时间为180
*   2、如果鼠标离开了轮播图容器，设置autoBool是true，这样就会自动轮播了
*
*
* */

function mouseHandler(e) {
    if(e.type==="mouseenter"){
        autoBool=false;
        time=120;
    }else if(e.type==="mouseleave"){
        autoBool=true;
    }
}

/*
*  当左右按钮被点击时
*  如果bool是true，不让他继续执行，这是指当正在轮播时，我们不接受点击按钮的事件
*  1、如果点击的是左边按钮时：
*     1）、设置方向向右移动
*     2）、设置让定位值-1
*     3）、如果定位值小于0，让他为图片数组的长度-1
* 2、如果点击的是右边按钮时：
*     1）、设置方向向左移动
*     2）、设置让定位值+1
*     3）、如果定位值等于图片数组的长度，让他为0；
*
*   3、调用添加创建下一个图片的函数
*
* */
function clickHandler(e) {
    if(bool) return;
    if(this===bnList[0]){
        direct="right";
        position--;
        if(position<0) position=imgList.length-1;
    }else if(this===bnList[1]){
        direct="left";
        position++;
        if(position===imgList.length) position=0;
    }
    createNextImg();
}
/*创建li点击函数liClickHandler，当小圆点被点击时，
* 如果bool是true，不让他继续执行，这是指当正在轮播时，我们不接受点击按钮的事件
*  1、先将ul的所有子项转为数组，并赋值给变量list
*  2、根据当前点击的对象获取到当前点击时数组的第几个索引li，并赋值给index
*  3、如果当前点击的索引值等于当前的定位值，跳出不执行后面的内容
*  4、如果当前点击的索引值大于定位值，将方向设为向左移动，否则，将方向设为向右移动
* 6、定位值设置为当前点击的索引值
* 7、调用创建新的下一张图片函数createNextImg
* */
function liClickHandler(e) {
    if(bool) return;
    var list=Array.from(ul.children);
    var index=list.indexOf(e.target);
    if(index===position)return;
    if(index>position){
        direct="left";
    }else{
        direct="right";
    }
    position=index;
    createNextImg();
}
/*
* 动画函数
* 每帧调用一次
* 每次调用执行播放图片和自动轮播两个函数内容
*
* */
function animation() {
    requestAnimationFrame(animation);
    moveImg();
    autoPlay();
}
/*
*  自动轮播
*  1、如果autoBool是false，不进入
*  2、每次进入time-1
*  3、如果time是0了，这时候就可以进行一组图片的轮播了:
*  4、设置时间间隔回到180帧
*  5、设置方向向左。
*  6、设置定位值+1
*  7、如果定位值等于数组长度时，设置定位值是0
*  8、执行创建下一张图片的函数
*
* */
function autoPlay() {
    if(!autoBool) return;
    time--;
    if(time===0){
        time=120;
        direct="left";
        position++;
        if(position===imgList.length) position=0;
        createNextImg();
    }
}
/*
*  移动图片动画函数
*  1、如果bool是false时，不进入动画
*  2、如果方向向左移动时：
*    1）、设置当前图片容器的左边位置不断减小
*    2）、如果当前图片的容器的左边位置小于等于一个图片的宽度时
*    3）、设置bool是false，这样下一帧就不会在进入动画了，就会停止
*    4）、设置方向是空字符
*    5）、删除图片容器中的第一个元素
*    6）、重修修改位置让当前图片可以显示在中间
*3、如果方向向右移动时：
*    1）、设置当前图片容器的左边位置不断增加
*    2）、如果当前图片的容器的左边位置大于等于0时
*    3）、设置bool是false，这样下一帧就不会在进入动画了，就会停止
*    4）、设置方向是空字符
*    5）、删除图片容器中的最后一个元素 */
function moveImg() {
    if(!bool) return;
    if(direct==="left"){
        imgCon.style.left=imgCon.offsetLeft-20+"px";
        if(imgCon.offsetLeft<=-WIDTH){
            bool=false;
            direct="";
            imgCon.firstElementChild.remove();
            imgCon.style.left="0px";
        }
    }else if(direct==="right"){
        imgCon.style.left=imgCon.offsetLeft+20+"px";
        if(imgCon.offsetLeft>=0){
            bool=false;
            direct="";
            imgCon.lastElementChild.remove();
        }
    }
}