let ary = [];
axios.get("http://localhost:3000/data")
    .then(function (res){
        ary = res.data;
        renderData();
    })
let body = document.querySelector("body");

let todayList = []; //今日總客人項目資訊
let listItem = {    //客人單筆項目資訊
    "id":"",
    "time" : "",
    "allItemAry":[],
    "allConut":0,
    "checked":""
}
    //啟動
   let renderData = () => {
        
        let aryRiceBall = ary["riceBall"];
        let aryAddStu = ary["addStu"];
        let aryDrink = ary["drink"];
        let table = document.querySelector(".table");
        let listBtn = document.querySelector(".list-btn");
        let allItem = [];   //單筆暫存
        let addItem ={  //單點預選暫存
            "id" : "",
            "type" : "",
            "name" : "--",
            "addStu": [],
            "price": 0,
        }
        //監聽選單內容
        table.addEventListener("click", (e)=>{
            if(e.target.nodeName === "A"){
                e.preventDefault;
                let riceBall = e.target.dataset.type;
                let addStu = e.target.dataset.id;
                let drink = e.target.dataset.drink;
                //若點擊飯糰
                if(riceBall >= 0 && riceBall < 6){
                    addStuffList();
                    let index = aryRiceBall.findIndex((item)=>
                        item.id === parseInt(riceBall)
                    )
                    addItem.type = "riceBall";
                    addItem.name = aryRiceBall[index].name;
                    addItem.price += aryRiceBall[index].price;
                    listBtn.innerHTML = `
                    <button class="clearStu">重新選料</button>
                    <button class="clearAdd">清除預選</button>
                    <button class="submit">送出</button>`

                //點擊加料項目
                }else if(addStu >= 0){
                    let index = aryAddStu.findIndex((item)=>
                        item.id === parseInt(addStu)
                    )
                    addItem.addStu.push(aryAddStu[index].name);
                    addItem.price += aryAddStu[index].price;
                
                //點擊飲料,跳轉至飲料項目
                }else if(riceBall === "6"){
                    let str = "";
                    ary["drink"].forEach(function(item){
                    str +=` <a href="#" class="table-btn" data-drink=${item.id}>${item.name}</a>`
                    });
                    table.innerHTML = str;
                    listBtn.innerHTML = `
                    <button class="clearAdd">清除預選</button>`

                //點擊飲料項目   
                }else if(drink >= 0){
                    let index = aryDrink.findIndex((item)=>
                        item.id === parseInt(drink)
                    )
                    addItem.type = "drink";
                    addItem.name = aryDrink[index].name;
                    addItem.price = aryDrink[index].price;
                    listBtn.innerHTML = `
                    <button class="clearAdd">清除預選</button>
                    <button class="submit">送出</button>`
                }

            }
            addItemList ();
        })
        //點擊各類飯糰項目,跳轉至<table>加料內容
        function addStuffList ()  {
            let str = "";
            ary["addStu"].forEach(function(item){
               str +=` <a href="#" class="table-btn btn-color-${item.price}" data-id=${item.id}>${item.name}</a>`
            });
            table.innerHTML = str;
        }
        //show預選<div class="addItem">項目
        function addItemList (){
            let addList = document.querySelector(".addItem");
            let stuStr = "";
            let str = "";
            addItem.addStu.forEach((item)=>
                stuStr += `<span>+${item}</span>`
            )
            str = ` <div class="priceItem">
            <p>${addItem.name}<span>$${addItem.price}</span></p>
            ${stuStr}
        </div>`
            addList.innerHTML = str;
        }
        //監聽按鈕內容
        listBtn.addEventListener("click", (e)=>{
            let attri = e.target.getAttribute("class");
            if(e.target.nodeName === "BUTTON"){
                if(attri=== "submit"){
                    let date = new Date();
                    addItem.id = date.getTime();
                    allItem.unshift(addItem);
                    clearAddItem();
                    addItemList();
                    switchTable();
                    allList();
                    listBtn.innerHTML =`<button class="clear">清除</button>
                    <a href="#" class="send">結帳</a>
                    <a href="#" class="todayList">今日帳表</a>
                    `;
                }else if(attri === "clear"){
                    switchTable();
                    clearAddItem();
                    addItemList ()
                    allItem = [];
                    allList();
                    listBtn.innerHTML =`<button class="clear">清除</button>
                    <a href="#" class="send">結帳</a>
                    <a href="#" class="todayList">今日帳表</a>
                    `;
                }else if(attri ==="clearStu"){
                    let clearStuCount = addItem.addStu.map(x => {
                        let num = 0;
                        aryAddStu.forEach((item)=>{
                            if(x === item.name){
                                num=item.price;
                            }
                        })
                        return num;
                    }).reduce((prev,curr)=>prev+curr);
                    addItem.addStu = [];
                    addItem.price -= clearStuCount;
                    addItemList ();
                    
                }else if(attri === "clearAdd"){
                    clearAddItem();
                    addItemList ();
                    switchTable();
                    listBtn.innerHTML =`<button class="clear">清除</button>
                    <a href="#" class="send">結帳</a>
                    <a href="#" class="todayList">今日帳表</a>
                    `;
                }
            }else if(e.target.nodeName ==="A"){
                 if(attri === "send"){
                    allItem.length === 0 ? alert ("別用空白單"): 
                    function(){
                    listItem.allItemAry = allItem;
                    listItem.time = new Date().toLocaleString();
                    listItem["allConut"] =  allItemCount(allItem);
                    axios.post("http://localhost:3000/todayList", listItem)
                        .then(function(res){  
                            console.log(res)
                        })
                    // todayList.push(listItem);
                    listItem = {
                        "id":"",
                        "time" : "",
                        "allItemAry":[],
                        "allConut":0,
                        "checked":""
                    }
                    allItem = [];
                    clearAddItem();
                    allList();}();
                }else if(attri === "todayList"){
                    
                    body.innerHTML =`
                    <div class="todayListContainer">
                        <div>
                            <div class="nav">
                                <a href="#" data-check="all" class ="active1">所有</a>
                                <a href="#" data-check="done">已結帳</a>
                                <a href="#" data-check="wait">未結帳</a>
                            </div>
                        <ul class="card-group">
                        </ul>
                        <div class="footer">
                            <button class="footer-prev">點單頁</button>
                            <p>今日總計:$</p>
                        </div>
                    </div>
                </div>`
                axios.get("http://localhost:3000/todayList")
                .then(function (res){
                let listAllCount = document.querySelector(".footer p");
                todayList = res.data;
                let price = 0;
                res.data.forEach((item)=>
                price += item.allConut)

                listAllCount.innerHTML = `今日總計${price}` 

                console.log(todayList)
                renderNav();
                })
                
                }
            }
        })
        
        //清空預選"addItem"項目
        function clearAddItem(){
            addItem ={
                "id" : "",
                "name" : "--",
                "addStu": [],
                "price": 0,
            }
        }
        //跳轉至選單<table>內容
        function switchTable(){
            table.innerHTML =`<div class="table">
            <a href="#" class="table-btn" data-type="1">古早味</a>
            <a href="#" class="table-btn" data-type="2">香腸</a>
            <a href="#" class="table-btn" data-type="3">義式雞胸</a>
            <a href="#" class="table-btn" data-type="4">鹹鴨蛋</a>
            <a href="#" class="table-btn" data-type="5">自選料</a>
            <a href="#" class="table-btn" data-type="6">飲料</a>
        </div>`
        }
        //預選項目移至<div class="itemList">商品項目,統計價格
        function allList(){
            let allItemList = document.querySelector(".addItemList");
            let total = document.querySelector(".total span");
            let str = "";
            let count = 0;
            allItem.forEach((item)=> {
                let stuStr = "<span></span>";
                item.addStu.forEach((item)=>
                    stuStr += `<span>+${item}</span>`
                )
                str += `<li class="priceItem" data-itemid="${item.id}">
                <p>${item.name}<span>$${item.price}</span></p>
                <a herf="#" class="del">del</a>
                ${stuStr}
                <hr>
                </li>`
                count += item.price;
            })
            allItemList.innerHTML = str;
            total.innerHTML = `<span class="itemSet">套餐${priceOff(allItem)}份</span>$${(count-(priceOff(allItem)*5))}`
           
        }
        //套餐數量運算 
        function priceOff(data){
            // let totalDrink = data.
            let totalDrink = 0;
            let totalRiceBall = 0;
            data.forEach((item) => {
                item.type === "drink"?totalDrink ++:totalRiceBall++;
            })
            function itemType(item, item2){
                if (item>item2) {
                   return itemType(item2, item);
                }else{
                  return item ;
                }
                }
            return itemType(totalDrink,totalRiceBall);

        }
        //刪除已選項目<li>
        let UlList = document.querySelector(".addItemList");
        UlList.addEventListener("click", (e)=>{
            if(e.target.nodeName === "A"){
                console.log(e.target.parentNode.dataset.itemid);
                e.target.parentNode.dataset.itemid;
                console.log(allItem)
                let index = allItem.findIndex(item =>
                    parseInt(e.target.parentNode.dataset.itemid) === item.id
                )
                allItem.splice(index, 1);
                addItemList ();
                allList();
            }
        })
        //單筆count計算
        function allItemCount(data){
            let allCount = 0;
            data.forEach((item)=>{
                allCount += item.price
            })
            return allCount -(priceOff(data)*5);
        }
        //今日帳表合計
        function todayTotal(){
        let count = 0;
        let setPrice = 0;
        todayList.forEach((item) => {
            setPrice += priceOff(item.allItemAry)*5;
            item.allItemAry.forEach((x)=>{
            count += x.price 
            });
        })
        return count - setPrice
        }
   }
   //todayList啟動
   function renderNav() {
    let cardGroup = document.querySelector(".card-group");
    let checkedAry = [];
    let toggleStatu = "all";
    // show出 <ul>card-group</ul> 內容 
    function showCard (data){

        let arrStr = [];
        data.forEach((items)=>{
            arrStr.unshift(`<li class="card" data-number="${items.id}">
            <label for="input">
            <input type="checkbox" name="input" ${items.checked}>
            <div class="card-o">
            <div class="card-title">
                <p>點餐時間:${items.time}</p>
                <p>單號:${items.id}</p>
            </div>
            <div class="card-body">
                ${setItem(items.allItemAry)}
            </div>
            <div class="card-footer">
                <button>del</button>
                <p>總計:$${items.allConut}</p>
            </div>
            </div>
            </label>
        </li>`)
        })
        cardGroup.innerHTML = arrStr.join("");
        let allCount = 0;
        axios.get("http://localhost:3000/todayList")
            .then(function (res) {
                let listAllCount = document.querySelector(".footer p");
                res.data.forEach((item)=>
                allCount += item.allConut
                )
                listAllCount.innerHTML = `今日總計:$${allCount}`;
            })
    }
    //  show出 <li class="card">中的餐點
    function setItem(data) {
        let str = "";
        data.forEach((item)=>{
            str += `<p>${item.name}:${item.addStu.join(",")}</p>`
        })
        return str;
    }
    //標示已結帳與刪除
    cardGroup.addEventListener("click",(e)=>{ 
        if (e.target.nodeName === "INPUT") {    
            let number = e.target.parentNode.parentNode.dataset.number;
            let index =  todayList.findIndex((item) => 
            parseInt(number) === item.id
            )
            todayList[index]["checked"] === "" ? 
            todayList[index]["checked"] = "checked" :todayList[index]["checked"] = "" ;
            axios.put(`http://localhost:3000/todayList/${number}`,todayList[index])
                .then(function (res) {
                    console.log(res)
                })
                renderRender();
             
            
        }else if(e.target.nodeName === "BUTTON"){
                 
            let number = e.target.parentNode.parentNode.parentNode.parentNode.dataset.number;
            let index =  todayList.findIndex((item) => 
            parseInt(number) === item.id
            )
            let totalCount = document.querySelector(".card-footer")
            console.log(index)
            todayList.splice(index, 1); 
            axios.delete(`http://localhost:3000/todayList/${number}`)
                .then(function (res) {
                    renderRender();
                })
                .catch(function (res) {
                })
           
        }
    })
    //nav監聽 //待處理
    let nav = document.querySelector(".nav");
    let navAll = document.querySelectorAll(".nav a");
    nav.addEventListener("click",(e)=>{
        if (e.target.nodeName === "A") {
            let check = e.target.dataset.check;
            navAll.forEach((item)=>{
                navAll.forEach((item)=>item.classList.remove("active1"));
                e.target.classList.add("active1")
                toggleStatu = check;
                renderRender();
            })
        }
    })
    //navfooter監聽
    let footer = document.querySelector(".footer");
    footer.addEventListener("click", (e)=>{
        if (e.target.nodeName === "BUTTON") {
        body.innerHTML =`
        <div class="container">
        <div class="table">
            <a href="#" class="table-btn" data-type="1">古早味</a>
            <a href="#" class="table-btn" data-type="2">香腸</a>
            <a href="#" class="table-btn" data-type="3">義式雞胸</a>
            <a href="#" class="table-btn" data-type="4">鹹鴨蛋</a>
            <a href="#" class="table-btn" data-type="5">自選料</a>
            <a href="#" class="table-btn" data-type="6">飲料</a>
        </div>
        <div class="countList">
            <form action="countAll">

            </form>
            <div class="priceList">
                <div class="list-btn ">
                    <button class="clear">清除</button>
                    <a href="#" class="send">結帳</a>
                    <a href="#" class="todayList">今日帳表</a>
                </div>
                <div class="addItem">
                    <div class="priceItem">
                        <p>--<span>$0</span></p>
                        <span></span>
                    </div>
                </div>
                <div class="itemList">
                    <ul class="addItemList">
                    </ul>
                </div>
                <div class="total">
                    <p>合計</p>
                    <span>$0</span>
                </div>
            </div>

        </div>
    </div>`
        renderData ();
        }
    })
    //render nav環境
    function renderRender() {
        if(toggleStatu === "wait"){
            checkedAry = todayList.filter((item)=> item.checked === "");
          }else if (toggleStatu === "done"){
            checkedAry = todayList.filter((item) => item.checked === "checked" );
          }else{
            checkedAry = todayList;
          }
          showCard (checkedAry)
    }
    renderRender();
    }

