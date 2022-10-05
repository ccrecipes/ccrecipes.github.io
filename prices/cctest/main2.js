$.ajax({
    'type': "Get",
    'async': false,
    'global': true,
    'url': "prices.json",
    'dataType': "json",
    success: function(data) {

    for (item in data) {
        color = {"Stable":"5px solid #ffffff","Increasing":"5px solid #1fc44b","Decreasing":"5px solid #c41a1a"};
        name = data[item]["item"]["name"]+"<br>"+data[item]["item"]["price"]["min"].toLocaleString()+"<b> - </b>"+data[item]["item"]["price"]["max"].toLocaleString()
        img = data[item]["item"]["url"];
        txt = `<div style="border-bottom: ${color[data[item]["item"]["state"]]}" class='item'><span class='${img} sprite'></span><p>${name}</p></div>`;

        if (data[item]["item"]["url"] == "") {
            txt = `<div style="border-bottom: ${color[data[item]["item"]["state"]]}" class='item'><span><img src="../cctest/error.png"></span><p>${name}</p></div>`;
        }

        document.getElementById('prices').innerHTML = txt;
    }

    },
    error: function(){
        alert("json not found");
    }
});
