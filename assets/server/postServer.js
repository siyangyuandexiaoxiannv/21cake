var http=require("http");
var aaa=require("querystring")
var obj={}
var arr=[]
var name
var server=http.createServer(function (req,res) {
    var data=""
    req.on("data",function (d) {
        data+=d;
        console.log(data)
        /* (aaa.parse(data).password)*/
    });
    req.on("end",function () {
        console.log(data)
        console.log(aaa.parse(data).type)
        if(aaa.parse(data).type=="2"){
            if(arr.length==0){/*console.log("请注册")*/name=1}else{
                for(var i = 0;i<arr.length;i++){
                    console.log(arr[i])
                    if(arr[i].password==aaa.parse(data).password && arr[i].username==aaa.parse(data).username){
                        /* console.log("成功")
                          console.log(arr[i])*/
                        name=2
                    }else{
                        /*console.log("失败请注册")*/name=3
                    }
                }}
        }else{
            arr.push(aaa.parse(data))
            console.log(arr)
            /* console.log("注册")*/name=4

        }

        res.writeHead(200,{"Content-Type":"text/html","Access-Control-Allow-Origin":"*"});
        if (name==1){res.write("1")}
        else if(name==2){res.write("2")}
        else if(name==3){res.write("3")}
        else if(name==4){res.write("4")}

        res.end();
    })
});
server.listen(3007,"10.9.29.245",function () {
    console.log("开启服务")
});


