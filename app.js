var myHttp = new XMLHttpRequest;
var listItem = [];
var itemContainer = []
var recipeId = ""
var foodName = document.querySelectorAll(".nav-link")
for (let index = 0; index < foodName.length; index++) {
    foodName[index].addEventListener("click",function(event){
        var category = event.target.innerHTML;
        getItems(category)
        // console.log(index)
    })
}

//check and display if thier data saved before
if(localStorage.getItem("order") != null){
    itemContainer = JSON.parse(localStorage.getItem("order"))
    // console.log(itemContainer)
    addChart(itemContainer)
}
else{
    itemContainer=[]
}

//get items from API
function getItems(category){
    myHttp.open("GET",`https://forkify-api.herokuapp.com/api/search?q=${category}`);
    myHttp.send();
    myHttp.addEventListener("readystatechange",function(){
        if (myHttp.readyState == 4 && myHttp.status == 200) {
            listItem = JSON.parse(myHttp.response).recipes
            display()
        }
        // console.log(listItem);

    })

}

//layout function 
function display(){
    var temp = "";
    for (let i = 0; i < listItem.length; i++) {
        temp += `<div class="col-md-3">
                    <div class="item border rounded-3 text-center bg-white">
                        <img src="${listItem[i].image_url}" class="w-100 rounded-3" alt="">
                        <h5>${listItem[i].title}</h5>
                        <p>preice : ${Math.floor((Math.random() * 80) + 40)} LE</p>
                        <button type="button" class="btn btn-sm btn-outline-success my-3" onclick="addProduct(previousElementSibling.innerHTML,previousElementSibling.previousElementSibling.innerHTML)">Add</button>
                        <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="recipeInfo(${listItem[i].recipe_id})">
                        Info
                      </button>                    
                    </div>
                </div>`
    }
    document.getElementById("foodCard").innerHTML = temp
}

//function add items to local storage
function addProduct(x , y){
    var p = x.replace(/(\D+)/,"")
    var product = {
        name : y,
        price :  parseInt(p)
    }
    itemContainer.push(product)
    localStorage.setItem("order",JSON.stringify(itemContainer))
    addChart(itemContainer)
}

//function to add items in chart
function addChart(f){
    var temp2 = ""
    var tempForm =""
    for (var index = 0; index < f.length; index++) {
        temp2 +=` <tr>
        <td scope="row">${index +1}</td>
        <td>${f[index].name}</td>
        <td id="bill">${f[index].price}</td>
        <td><button class="btn btn btn-danger" onclick="deleteOrder(${index})">Delete</button></td>
        </tr>
        `
        tempForm +=`<p class="mt-0 text-black" >${f[index].name} <span class="spPrice">${f[index].price}</span></p>`
    }    

    document.getElementById("tableBody").innerHTML = temp2
    total()
}

//function to display chart
function disChart(){
    window.open("chart.html","")
}

// function to delet item
function deleteOrder(item){
    itemContainer.splice(item,1)
    localStorage.setItem('order',JSON.stringify(itemContainer))
    addChart(itemContainer)
}

//function to get ingrediant of meal
var ingred = document.getElementById("ingrediantInfo")
function recipeInfo(id){
    myHttp.open("GET",`https://forkify-api.herokuapp.com/api/get?rId=${id}`);
    myHttp.send();
    myHttp.addEventListener("readystatechange",function(){
        if (myHttp.readyState == 4 && myHttp.status == 200) {
            recipeId = JSON.parse(myHttp.response).recipe.ingredients
        }
        var temp3=""
        for (let index = 0; index < recipeId.length; index++) {
            temp3 +=`
            <p>- ${recipeId[index]} </p>`
            
        }
        console.log(temp3);
        document.getElementById("ingrediantInfo").innerHTML = temp3

    }
)   
}

// get total of order price
function total(){
    var sum=0
    var selector = document.querySelectorAll("#bill")
    for (let i = 0; i < selector.length; i++) {
         sum += Number(selector[i].textContent)
         
    }
    var temp4 = `<tr>
                    <td colspan="2"> Total Price </td>
                    <td> ${sum}</td>
                    <td><button type="button" class="btn btn-success" onclick="out()">Checkout</button></td>
                </tr>`
                document.getElementById("footer").innerHTML = temp4;
                document.getElementById("doooo").innerHTML = `<p class="mt-0 text-black" >Total <span class="spPrice">${sum}</span></p>`
}
function out(){
    window.open("form.html")
}

//submit and delete from chart 
function subDel(){
    localStorage.removeItem("order");
    alert ("Your Order Submited")

}