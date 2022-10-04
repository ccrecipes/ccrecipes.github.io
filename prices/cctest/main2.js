$.ajax({
    'type': "Get",
    'async': false,
    'global': true,
    'url': "prices.json",
    'dataType': "json",
    success: function(data) {

    for (item in data) {
        name = data[item]["item"]["name"]+"<br>"+"<p style='font-size:67%;'>"+data[item]["item"]["price"]["min"].toLocaleString()+"<b> - </b>"+data[item]["item"]["price"]["max"].toLocaleString()+"</p>";
        img = data[item]["item"]["url"];
        //txt += `<div class='item'><img src=${img}></div>`;
        txt = `<div class='item'><span class='${img} sprite'></span><p>${name}</p></div>`;
        //txt += `<div class='item'><img src=${img}><p>${name}</p></div>`;
        document.getElementById('prices').innerHTML += txt;
    }

    },
    error: function(){
        alert("json not found");
    }
});
