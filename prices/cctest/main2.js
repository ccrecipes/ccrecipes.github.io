$.ajax({
    'type': "Get",
    'async': false,
    'global': true,
    'url': "prices.json",
    'dataType': "json",
    success: function(data) {
        basic = data

    for (item in data) {
        color = {"Stable":"5px solid #ffffff","Increasing":"5px solid #1fc44b","Decreasing":"5px solid #c41a1a"};
        name = data[item]["item"]["name"]+"<br>"+data[item]["item"]["price"]["min"].toLocaleString()+"<b> - </b>"+data[item]["item"]["price"]["max"].toLocaleString()
        img = data[item]["item"]["url"];

        if (data[item]["item"]["url"] == "") {
            txt = `<div style="border-bottom: ${color[data[item]["item"]["state"]]}" class='item'><span><img src="../cctest/error.png"></span><p>${name}</p></div>`;
        }

        //$('#prices').append(`<div style="border-bottom: ${color[data[item]["item"]["state"]]}" class='item'><span class='${img} sprite'></span><p>${name}</p></div>`)

        wearables = ["Hat Pack","Wing Pack","Critter Suit Pack","Accessories Pack","Clothes Pack","Clothes Item","Quest","Virus","Dungeon Pack","Track Pack","Kitchen Pack","Ocean Pack","Sci-fi Pack","Steampunk Pack","Adventure Pack","Fishing Pack","April Fools' Day","Easter","Valentine's Day'","Summer","Fan","Halloween","Thanksgiving","Christmas","Farm Pack","Wands","New Year's Day"]

        for (wearable in wearables) {
            if (data[item]["type"]["section"] == wearables[wearable].toUpperCase()) {
                $("#wearables_prices").append(`<div style="border-bottom: ${color[data[item]["item"]["state"]]}" class='item'><span class='${img} sprite'></span><p>${name}</p></div>`)
            };
        }
        if (data[item]["type"]["section"] == "CARS") {
            $("#cars_prices").append(`<div style="border-bottom: ${color[data[item]["item"]["state"]]}" class='item'><span class='${img} sprite'></span><p>${name}</p></div>`)
        };
    };

    $(".searchbar span").on("click", function(event) {
        $(".sections").css({"display":"block"})
    });

    $(document).mouseup(function(event) {
        var sections = $(".sections");
        if (!sections.is(event.target) && sections.has(event.target).length === 0) {
            sections.hide();
        }
    });

    $(document).ready(function() {
        $("#filterInput").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $(".item").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });

    },
    error: function(){
        alert("json not found");
    }
});

sections = ["Hat Pack","Wing Pack","Critter Suit Pack","Accessories Pack","Clothes Pack","Clothes Item","Quest","Virus","Dungeon Pack","Track Pack","Kitchen Pack","Ocean Pack","Sci-fi Pack","Steampunk Pack","Adventure Pack","Fishing Pack","April Fools' Day","Easter","Valentine's Day","Summer","Fan","Halloween","Thanksgiving","Christmas","Farm Pack","Wands","New Year's Day"]

for (section in sections) {
    $(".sections").append(`<h1>${sections[section]}</h1>`);
}

for (sectionn in basic) {
    $(".sections h1").on("click", function(event) {
        //console.log($(this).text().toUpperCase());
        if (basic[sectionn]["type"]["section"] == $(this).text().toUpperCase()) {
            console.log(basic[sectionn]["item"]["name"]);
        }
        window.location.href = window.location.origin + "/prices/cctest/section?section=" + encodeURI($(this).text().toLowerCase());
    })
}