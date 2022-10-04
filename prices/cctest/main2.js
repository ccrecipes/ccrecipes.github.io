$.ajax({
    'type': "Get",
    'async': false,
    'global': true,
    'url': "prices.json",
    'dataType': "json",
    success: function(data) {

    for (item in data) {
        color = {"Stable":"border-bottom: 3px solid #ffffff","Increasing":"border-bottom: 3px solid #1fc44b","Decreasing":"border-bottom: 3px solid #c41a1a"};
        name = data[item]["item"]["name"]+"<br>"+data[item]["item"]["price"]["min"].toLocaleString()+"<b> - </b>"+data[item]["item"]["price"]["max"].toLocaleString()
        img = data[item]["item"]["url"];
        //txt += `<div class='item'><img src=${img}></div>`;
        txt = `<div style=${color[data[item]["item"]["state"]]} class='item'><span class='${img} sprite'></span><p>${name}</p></div>`;
        //txt += `<div class='item'><img src=${img}><p>${name}</p></div>`;

        if (data[item]["item"]["url"] == "") {
            txt = `<div style=${color[data[item]["item"]["state"]]} class='item'><span><img src="../cctest/error.png"></span><p>${name}</p></div>`;
        }

        document.getElementById('prices').innerHTML += txt;
    }

    },
    error: function(){
        alert("json not found");
    }
});
