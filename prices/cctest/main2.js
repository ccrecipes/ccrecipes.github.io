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
        //{console.log(json[item]["type"]["name"])};
        //{console.log(json[item]["item"]["name"]+": "+json[item]["item"]["price"]["min"]+" - "+json[item]["item"]["price"]["max"])};
        document.getElementById('prices').innerHTML += txt;
        console.log(txt)
    }

    },
    error: function(){
        alert("json not found");
    }
});
