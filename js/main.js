function zoomOutMobile() {
    var viewport = document.querySelector('meta[name="viewport"]');

    if (viewport) {
        viewport.content = "initial-scale=0.1";
        viewport.content = "width=1360";
    }
}

zoomOutMobile();

function isCraftable(item) {
    for (recipe in basic) {
        if (basic[recipe]["item"]["item"] == item) {
            return true;
            break;
        }
    }
    return false;
}

function filterRecipes() {
    filterInput = $("#filterInput").val().toUpperCase();
    recipe_divs = $(".item_recipe").toArray();
    for (item in recipe_divs) {
        textvalue = recipe_divs[item].textContent;
        if (textvalue.toUpperCase().indexOf(filterInput) == -1) {
            recipe_divs[item].style.display = "none";
            recipe_divs[item].style.visibility = "hidden"
        } else {
            recipe_divs[item].style.display = "inline-block";
            recipe_divs[item].style.visibility = "visible"
        }
    }
}


for (recipe in basic) {
    item_name = basic[recipe]["item"]["item"];
    recipe_type = basic[recipe]["type"];
    if (basic[recipe]["item"]["image"] != undefined) {
        item_image = basic[recipe]["item"]["image"];
    } else {
        item_image = "images/" + item_name.split(" ").join("_").toLowerCase() + ".png";
    }
    $("#" + recipe_type + "_recipes").append("<div class=\"item_recipe\"><img alt=\"" + item_name + "\" src=\"" + item_image + "\"><br><p>" + item_name + "</p></div>");
}

$(".item_recipe").on("click", function () {
    displayed_recipes = [];
    $(".all_recipes").css("overflow-y", "hidden");
    recipe_num = 0;
    clicked_on = $(this).text();
    displayed_recipes.push(clicked_on);
    item_image = $(this).find("img").first().attr("src");
    index = [];
    $(".window > .recipe_header > p").text(clicked_on);
    $(".window > .recipe_header > img").attr("src", item_image);
    $(".shown_recipes").css("display", "block");
    for (recipe in basic) {
        if (basic[recipe]["item"]["item"] == clicked_on) {
            index.push(recipe);
        }
    }
    for (indexes in index) {
        for (recipes in basic[index[indexes]]["recipe"]) {
            $(".display_recipe").append("<div id=\"recipe_" + recipe_num + "\" class=\"recipe_wrapper\"></div>");
            for (item in basic[index[indexes]]["recipe"][recipes]) {
                item_name = basic[index[indexes]]["recipe"][recipes][item]["item"];
                item_amount = basic[index[indexes]]["recipe"][recipes][item]["amount"];
                if (basic[index[indexes]]["recipe"][recipes][item]["image"] != undefined) {
                    item_image = basic[index[indexes]]["recipe"][recipes][item]["image"];
                } else {
                    item_image = "images/" + item_name.split(" ").join("_").toLowerCase() + ".png";
                }
                if (isCraftable(item_name)) {
                    $("#recipe_" + recipe_num).append("<div class=\"item_recipe_shown\" craftable = \"" + item_name + "\"><img alt=\"" + item_name + "\" src=\"" + item_image + "\"><br><p>" + item_name + "</p><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div><div class=\"craftable_icon\"><img src=\"images/steel_hammer.png\"></div></div>");
                } else {
                    $("#recipe_" + recipe_num).append("<div class=\"item_recipe_shown\" ><img alt=\"" + item_name + "\" src=\"" + item_image + "\"><br><p>" + item_name + "</p><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div></div>");
                }
            }

            $("#recipe_" + recipe_num).append("<div class=\"craft_arrow\" id=\"craft_arrow_" + recipe_num + "\"><img src=\"images/craft_arrow.png\"></div>");

            item_name = basic[index[indexes]]["item"]["item"];
            item_amount = basic[index[indexes]]["item"]["amount"];
            if (basic[index[indexes]]["item"]["image"] != undefined) {
                item_image = basic[index[indexes]]["item"]["image"];
            } else {
                item_image = "images/" + item_name.split(" ").join("_").toLowerCase() + ".png";
            }
            $("#recipe_" + recipe_num).append("<div recipe_num=\"" + recipe_num + "\" class=\"item_recipe_shown crafted_recipe_item\" ><img alt=\"" + item_name + "\" src=\"" + item_image + "\"><br><p>" + item_name + "</p><div class=\"amount crafted_amount\" init_val=" + item_amount + ">" + item_amount + "</div></div><br>");
            if (basic[index[indexes]]["tool"] != undefined) {
                tool_used = basic[index[indexes]]["tool"];
                tool_image = "images/" + tool_used.split(" ").join("_").toLowerCase() + ".png";
                $("#craft_arrow_" + recipe_num).append("<img alt=\"" + tool_used + "\" class=\"tool_image\" src=\"" + tool_image + "\">");
            }
            if (basic[index[indexes]]["station"] != undefined) {
                station_used = basic[index[indexes]]["station"];
                station_image = "images/" + station_used.split(" ").join("_").toLowerCase() + ".png";
                $("#craft_arrow_" + recipe_num).append("<img alt=\"" + station_used + "\" class=\"station_image\" src=\"" + station_image + "\">");
            }
            if (basic[index[indexes]]["time"] != undefined) {
                time_used = basic[index[indexes]]["time"];
                $("#craft_arrow_" + recipe_num).append("<div class=\"time_used\">" + time_used + "</div>");
            }
            $("#slider_quantity").attr({ "value": item_amount, "step": item_amount });
            $("#quantity").attr({ "value": item_amount, "step": item_amount });
            recipe_num++;
        }
    }

    hideOnes();
    itemClickEvent();
    $(".crafted_recipe_item").on("click", function () {
        curr_recipe_num = parseInt($(this).attr("recipe_num"));
        curr_amount = parseInt($(this).find(".crafted_amount").text());
        recipe_image = $(this).find("img").first().attr("src");
        item_amount = parseInt($(this).find(".crafted_amount").attr("init_val"));
        show_amount_window(curr_recipe_num, item_amount, curr_amount, recipe_image);
    });

    $(".exit").on("click", function () {
        $(".display_recipe").empty();
        $(".shown_recipes").css("display", "none");
        $(".all_recipes").css("overflow-y", "scroll");
        $(".set_quantity").css("display", "none");
    })
})

function itemClickEvent() {
    $(".item_recipe_shown[craftable]").on("click", function () {
        clicked_on = $("p", this).text();
        if (!displayed_recipes.includes(clicked_on)) {
            displayed_recipes.push(clicked_on);
            init_amount = parseInt($(".amount", this).attr("init_val"));
            curr_amount = parseInt($(".amount", this).text());
            multiplier = curr_amount / init_amount;
            $(".item_recipe_shown[craftable]").unbind("click");
            $(".item_recipe_shown[craftable = \"" + clicked_on + "\"]").removeAttr("craftable");
            item_image = "images/" + clicked_on.split(" ").join("_").toLowerCase() + ".png";
            index2 = [];
            for (recipe in basic) {
                if (basic[recipe]["item"]["item"] == clicked_on) {
                    index2.push(recipe)
                }
            }

            for (indexes2 in index2) {
                for (recipes in basic[index2[indexes2]]["recipe"]) {
                    $(".display_recipe").append("<br><div id=\"recipe_" + recipe_num + "\"  class=\"recipe_wrapper\"></div>");
                    for (item in basic[index2[indexes2]]["recipe"][recipes]) {
                        item_name = basic[index2[indexes2]]["recipe"][recipes][item]["item"];
                        item_amount = basic[index2[indexes2]]["recipe"][recipes][item]["amount"];
                        if (basic[index2[indexes2]]["recipe"][recipes][item]["image"] != undefined) {
                            item_image = basic[index2[indexes2]]["recipe"][recipes][item]["image"];
                        } else {
                            item_image = "images/" + item_name.split(" ").join("_").toLowerCase() + ".png";
                        }
                        if (isCraftable(item_name)) {
                            $("#recipe_" + recipe_num).append("<div class=\"item_recipe_shown\" craftable = \"" + item_name + "\"><img alt=\"" + item_name + "\" src=\"" + item_image + "\"><br><p>" + item_name + "</p><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div><div class=\"craftable_icon\"><img src=\"images/steel_hammer.png\"></div></div>");
                        } else {
                            $("#recipe_" + recipe_num).append("<div class=\"item_recipe_shown\" ><img alt=\"" + item_name + "\" src=\"" + item_image + "\"><br><p>" + item_name + "</p><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div></div>");
                        }
                    }
                    $("#recipe_" + recipe_num).append("<div class=\"craft_arrow\" id=\"craft_arrow_" + recipe_num + "\"><img src=\"images/craft_arrow.png\"></div>");
                    if (basic[index2[indexes2]]["tool"] != undefined) {
                        tool_used = basic[index2[indexes2]]["tool"];
                        tool_image = "images/" + tool_used.split(" ").join("_").toLowerCase() + ".png";
                        $("#craft_arrow_" + recipe_num).append("<img alt=\"" + tool_used + "\" class=\"tool_image\" src=\"" + tool_image + "\">");
                    }
                    if (basic[index2[indexes2]]["station"] != undefined) {
                        station_used = basic[index2[indexes2]]["station"];
                        station_image = "images/" + station_used.split(" ").join("_").toLowerCase() + ".png";
                        $("#craft_arrow_" + recipe_num).append("<img alt=\"" + station_used + "\" class=\"station_image\" src=\"" + station_image + "\">");
                    }
                    if (basic[index2[indexes2]]["time"] != undefined) {
                        time_used = basic[index2[indexes2]]["time"];
                        $("#craft_arrow_" + recipe_num).append("<div class=\"time_used\">" + time_used + "</div>");
                    }
                    item_name = basic[index2[indexes2]]["item"]["item"];
                    item_amount = basic[index2[indexes2]]["item"]["amount"];
                    if (basic[index2[indexes2]]["item"]["image"] != undefined) {
                        item_image = basic[index2[indexes2]]["item"]["image"];
                    } else {
                        item_image = "images/" + item_name.split(" ").join("_").toLowerCase() + ".png";
                    }
                    $("#recipe_" + recipe_num).append("<div recipe_num=\"" + recipe_num + "\" class=\"item_recipe_shown crafted_recipe_item\"><img alt=\"" + item_name + "\" src=\"" + item_image + "\"><br><p>" + item_name + "</p><div class=\"amount crafted_amount\" init_val=" + item_amount + ">" + item_amount + "</div></div>");
                    $("#quantity_" + recipe_num).attr({ "value": item_amount, "step": item_amount });
                    recipe_num++;
                }
            }
            hideOnes();
            itemClickEvent();
            $(".crafted_recipe_item").on("click", function () {
                curr_recipe_num = parseInt($(this).attr("recipe_num"));
                curr_amount = parseInt($(this).find(".crafted_amount").text());
                recipe_image = $(this).find("img").first().attr("src");
                item_amount = parseInt($(this).find(".crafted_amount").attr("init_val"));
                show_amount_window(curr_recipe_num, item_amount, curr_amount, recipe_image);
            });
            $(".display_recipe").animate({ scrollTop: $('.display_recipe').prop("scrollHeight") }, 500);
        }

    })
}

function show_amount_window(recipe_nums, amounts, curr_amounts, item_image) {
    $(".set_quantity").css("display", "block");
    $(".set_quantity > .recipe_header > img").attr("src", item_image);
    $("#quantity").attr("step", amounts);
    $("#quantity").val(curr_amounts);
    $("#slider_quantity").attr("step", amounts);
    $("#slider_quantity").val(curr_amounts);
    $(".filter_quantity").unbind("submit");
    $(".filter_quantity").submit(function (event) {
        event.preventDefault();
        filter_quantity(recipe_nums);
        $(".set_quantity").css("display", "none");
    })
}

function hideOnes() {
    amounts = $(".amount").toArray()
    for (item in amounts) {
        if (amounts[item].textContent == 1) {
            amounts[item].style.display = "none";
        } else {
            amounts[item].style.display = "block";
        }
    }
}

function filter_quantity(recipe_num) {
    quantities = $("#recipe_" + recipe_num).find(".amount").not(".crafted_amount").toArray();
    quantity = $("#quantity").val();
    crafted_amount = $("#recipe_" + recipe_num).find(".crafted_amount").attr("init_val");
    if (quantity == 0) {
        quantity = crafted_amount;
    }
    for (item in quantities) {
        init_amount = parseInt($("#recipe_" + recipe_num).find(".amount:eq( " + item + " )").attr("init_val"));
        curr_amount = parseInt($("#recipe_" + recipe_num).find(".amount:eq( " + item + " )").text());
        new_amount = init_amount * quantity / crafted_amount;
        quantities[item].textContent = new_amount;
        $("#recipe_" + recipe_num).find(".crafted_amount").text(quantity);
    }
    hideOnes();
}

$("#stepUp").on("click", function () {
    document.getElementById("quantity").stepUp();
    document.getElementById("slider_quantity").stepUp()
});

$("#stepDown").on("click", function () {
    document.getElementById("quantity").stepDown();
    document.getElementById("slider_quantity").stepDown()
});

$("#quantity").on("input", function () {
    values = $(this).val();
    $("#slider_quantity").val(values);
})

$("#slider_quantity").on("input", function () {
    values = $(this).val();
    $("#quantity").val(values);
})