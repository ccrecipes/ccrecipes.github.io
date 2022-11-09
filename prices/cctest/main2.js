$.ajax({
    'type': "Get",
    'async': false,
    'global': true,
    'url': "prices.json",
    'dataType': "json",
    'success': function(data) {
        basic = data
    }
});

$(".searchbar span").on("click", function(event) {
    $("#blurred").append("<div class='blurred'></div>");
    $("#blurred").css("display","block")
})


$(".searchbar span").on("click", function(event) {
    $(".sections").css({"display":"block"});
    $(".searchbar span").hide();
})

$(document).mouseup(function(event) {
    var sections = $(".sections");
    var blurred = $(".blurred");
    var menu = $(".searchbar span");
    if (!sections.is(event.target) && sections.has(event.target).length === 0) {
        sections.hide();
        blurred.hide();
        menu.show();
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


sections = ["Hat Pack","Wing Pack","Critter Suit Pack","Accessories Pack","Clothes Pack","Clothes Item","Quest","Virus","Dungeon Pack","Track Pack","Kitchen Pack","Ocean Pack","Sci-fi Pack","Steampunk Pack","Adventure Pack","Fishing Pack","April Fools' Day","Easter","Valentine's Day","Summer","Fan","Halloween","Thanksgiving","Christmas","Farm Pack","Wands","New Year's Day"]

for (section in sections) {
    $(".sections").append(`<h1>${sections[section]}</h1>`);
}

/*$(".sections h1").on("click", function(event) {
    window.location.href = window.location.origin + "/prices/cctest/section?section=" + encodeURI($(this).text().toLowerCase());
    for (section in basic) {
        color = {"Stable":"5px solid #ffffff","Increasing":"5px solid #1fc44b","Decreasing":"5px solid #c41a1a"};
        names = basic[section]["item"]["name"]+"<br>"+basic[section]["item"]["price"]["min"]+" - "+basic[section]["item"]["price"]["max"];
        imgs = "https://www.cubiccastles.com/recipe_html/"+basic[section]["item"]["url"]+".png";
        if (basic[section]["type"]["section"] == $(this).text().toUpperCase()) {
            $("#section2").append(`<div style="border-bottom: ${color[basic[section]["item"]["state"]]}" class='item'><span class='${img} sprite'></span><p>${name}</p></div>`);
            console.log(basic[section]["item"]["name"]);
        };
    }
})*/

wearables = ["Hat Pack","Wing Pack","Critter Suit Pack","Accessories Pack","Clothes Pack","Clothes Item","Quest","Virus","Dungeon Pack","Track Pack","Kitchen Pack","Ocean Pack","Sci-fi Pack","Steampunk Pack","Adventure Pack","Fishing Pack","April Fools' Day","Easter","Valentine's Day'","Summer","Fan","Halloween","Thanksgiving","Christmas","Farm Pack","Wands","New Year's Day"]

for (item in basic) {
    color = {"Stable":"5px solid #ffffff","Increasing":"5px solid #1fc44b","Decreasing":"5px solid #c41a1a"};
    name = basic[item]["item"]["name"]+"<br>"+basic[item]["item"]["price"]["min"].toLocaleString()+"<b> - </b>"+basic[item]["item"]["price"]["max"].toLocaleString()
    img = basic[item]["item"]["url"];

    for (wearable in wearables) {
        if (basic[item]["type"]["section"] == wearables[wearable].toUpperCase()) {
            $("#wearables_prices").append(`<div style="border-bottom: ${color[basic[item]["item"]["state"]]}" class='item'><span class='${img} sprite'></span><p>${name}</p></div>`)
        }
    }
    if (basic[item]["type"]["section"] == "CARS") {
        $("#cars_prices").append(`<div style="border-bottom: ${color[basic[item]["item"]["state"]]}" class='item'><span class='${img} sprite'></span><p>${name}</p></div>`)
    }
}

$(".sections h1").click(function() {
    //window.location.href += encodeURI($(this).text().toLowerCase());
    //window.location.href = window.location.origin + "/prices/cctest/section?section=" + encodeURI($(this).text().toLowerCase());
    let music = encodeURIComponent($(this).text());

    let url = `https://www.ccrecipes.com/prices/cctest/${music}`;
    window.location.href = url
    tittle_section = $(this).text();
    id_section = $(this).text().toLowerCase().replace(" ","_").replace("'s ","").replace("' ","_");
    $(".all_prices").append(`<div id=${id_section} class="list"><h1 class="header">${tittle_section}</h1></div>`);
    $(".searchbar span").show();
    for (section in basic) {
        color = {"Stable":"5px solid #ffffff","Increasing":"5px solid #1fc44b","Decreasing":"5px solid #c41a1a"};
        name = basic[section]["item"]["name"]+"<br>"+basic[section]["item"]["price"]["min"].toLocaleString()+"<b> - </b>"+basic[section]["item"]["price"]["max"].toLocaleString()
        img = basic[section]["item"]["url"];        
        if (basic[section]["type"]["section"] == $(this).text().toUpperCase()) {
            $("#"+id_section).append(`<div style="border-bottom: ${color[basic[item]["item"]["state"]]}" class='item'><span class='${img} sprite'></span><p>${name}</p></div>`);
            //window.location.pathname += "/"+$(this).text().toLowerCase()
            $(".sections").hide();
            $("#wearables_prices").hide();
            $("#cars_prices").hide();
            $("#blurred").hide();
        }
    }

    if ($(this).text() == "Back") {
        $("#wearables_prices").show();
        $("#cars_prices").show();
        $("#"+id_section).remove();
        $(".searchbar p").hide();
        $(".sections").hide();
        $("#blurred").hide();
    }

    $(".sections h1").mouseup(function(event) {
        $("#"+id_section).remove();
    })
})