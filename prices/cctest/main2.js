$.ajax({
    'type': "Get",
    'url': "prices.json",
    'dataType': "json",
    success: function(data) {

    for (item in data) {
        name = data[item]["item"]["name"]+"<br>"+data[item]["item"]["price"]["min"]+" - "+data[item]["item"]["price"]["max"]
        //img = "https://www.cubiccastles.com/recipe_html/"+data[item]["item"]["url"]+".png";
        img = data[item]["item"]["url"];
        //txt += `<div class='item'><img src=${img}></div>`;
        txt = `<div class='item'><span class='${img} sprite'></span></div>`;
        //txt += `<div class='item'><img src=${img}><p>${name}</p></div>`;
        document.getElementById('prices').innerHTML += txt;
    }

    },
    error: function(){
        alert("json not found");
    }
});
