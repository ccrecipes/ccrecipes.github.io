$.ajax({
    'type': "Get",
    'url': "prices.json",
    'dataType': "json",
    success: function(data) {

    console.log(data);

    },
    error: function(){
        alert("json not found");
    }
});