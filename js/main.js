      bookmarked = [];
      bm_only = 0;
      
      $.ajax({
      	'async': false,
      	'global': true,
      	'url': "recipes.json",
      	'dataType': "json",
      	'success': function (data) {
      		basic = data;
      	}
      });

      $.ajax({
      	'async': false,
      	'global': true,
      	'url': "images.json",
      	'dataType': "json",
      	'success': function (data) {
      		image_data = data;
      	}
      });


      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      	$(".burger a").on("click", function() {
      		$(".hide_burger").unbind("click");
      		$(".hide_burger").toggleClass("show_burger");
      		$(".hide_burger").toggleClass("hide_burger");
      		$(".burger").css("top","-150px");
      		showBurger();
      	})
      }

     url_recipe = new URLSearchParams(window.location.search).get("recipe");
     startedAtRecipe = false;

     if(url_recipe !== null) {
     	showRecipe(decodeURI(url_recipe));
     	startedAtRecipe = true;
     } else {
     	(adsbygoogle = window.adsbygoogle || []).push({});
     	(adsbygoogle = window.adsbygoogle || []).push({});
     }

      $(document).on("dragstart", function () {
      	return false;
      });

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
      		if (textvalue.toUpperCase().indexOf(filterInput) == -1 && !bookmarked.includes(textvalue)) {
      			recipe_divs[item].style.display = "none";
      			recipe_divs[item].style.visibility = "hidden"
      		} else {
      			recipe_divs[item].style.display = "inline-block";
      			recipe_divs[item].style.visibility = "visible"
      		}
      	}
      	categories = ["new", "basic", "tool", "coloring", "cooking", "cutting", "forging", "extraction", "distill", "eastereggs", "candies", "bugs"];
      	for(i in categories) {
      		if ($("#"+categories[i]+"_recipes").find(".item_recipe:visible").toArray().length == 0) {
      		$("#"+categories[i]+"_recipes").css("height","0px");
      	} else {
      		$("#"+categories[i]+"_recipes").css("height","auto");
      	}
      	}
      }


      for (recipe in basic) {
      	item_name = basic[recipe]["item"]["item"];
      	recipe_type = basic[recipe]["type"];
      	if (basic[recipe]["item"]["image"] != undefined) {
      		item_image = basic[recipe]["item"]["image"];
      		$("#" + recipe_type + "_recipes").append("<div class=\"item_recipe\"><img class=\"bookmark\" src=\"images/ui/bookmark_empty.png\"><img alt=\"" + item_name + "\" src=\"" + item_image + "\"></span><br><p>" + item_name + "</p></div>");
      	} else {
      		if (basic[recipe]["item"]["texture"] != undefined) {
      			item_image = basic[recipe]["item"]["texture"];
      		} else {
      			item_image = image_data[item_name];
      		}
      		$("#" + recipe_type + "_recipes").append("<div class=\"item_recipe\"><img class=\"bookmark\" src=\"images/ui/bookmark_empty.png\"><span class='" + item_image + " sprite'></span><br><p>" + item_name + "</p></div>");
      	}

      }

      $(".bookmark").on("click", function () {
      	current_state = $(this).attr("class");
      	bookmarked_item = $(this).parent().find("p").text();
      	if (current_state == "bookmark") {
      		$(this).attr("src", "images/ui/bookmark_filled.png");
      		$(this).attr("class", "bookmark_filled");
      		bookmarked.push(bookmarked_item);
      	} else {
      		$(this).attr("src", "images/ui/bookmark_empty.png");
      		$(this).attr("class", "bookmark");
      		index_bookmark = bookmarked.indexOf(bookmarked_item);
      		bookmarked.splice(index_bookmark, 1);
      		if (bm_only == 1) {
      			$(this).parent().css({ "display": "none", "visibility": "hidden" });
      		}
      	}
      });

      $(".show_bookmark").on("click", function () {
      	if (bm_only == 0) {
      		bm_only = 1;
      		$(this).attr("src", "images/ui/bookmark_filled.png");
      		$(this).attr("title", "Show all recipes!");
      		$(".bookmark").parent().css({ "display": "none", "visibility": "hidden" });
      	} else {
      		bm_only = 0;
      		$(this).attr("src", "images/ui/bookmark_empty.png");
      		$(this).attr("title", "Show bookmarked recipes only!");
      		$(".bookmark").parent().css({ "display": "inline-block", "visibility": "visible" });
      	}
      })

      function showRecipe(recipeitemname) {
		$(".all_recipes").css("display","none");
      	$(".navbar").css("display","none");
      	$(".burger").css("display","none");
      	$(".window").css("display","block");
      	displayed_recipes = [];
      	$(".all_recipes").css("overflow-y", "hidden");
      	recipe_num = 0;
      	$("#link-to-share").val(window.location.origin + "/?recipe=" + encodeURI(recipeitemname));
      	displayed_recipes.push(recipeitemname);
      	index = [];
      	$(".shown_recipes").css("display", "block");
      	for (recipe in basic) {
      		if (basic[recipe]["item"]["item"] == recipeitemname) {
      			index.push(recipe);
      		}
      	}
      	for (indexes in index) {
      		for (recipes in basic[index[indexes]]["recipe"]) {
      			$(".display_recipe").append("<div id=\"recipe_" + recipe_num + "\" class=\"recipe_wrapper\"><img class=\"arrow_"+ recipe_num+"\" src=\"images/ui/craft_arrow.png\" style=\"position: absolute; opacity: .4;\"><div class=\"crafting\"></div></div>");

      			item_name = basic[index[indexes]]["item"]["item"];
      			item_amount = basic[index[indexes]]["item"]["amount"];
      			if (basic[index[indexes]]["item"]["image"] != undefined) {
      				item_image = basic[index[indexes]]["item"]["image"];
      				$("#recipe_" + recipe_num).append("<div class=\"stats\" id=\"stats_"+recipe_num+"\"></div><div recipe_num=\"" + recipe_num + "\" class=\"item_recipe_shown crafted_recipe_item\" ><img alt=\"" + item_name + "\" src=\"" + item_image + "\"><br><p>" + item_name + "</p><div class=\"amount crafted_amount\" init_val=" + item_amount + ">" + item_amount + "</div></div>");
      			} else {
      				if (basic[index[indexes]]["item"]["texture"] != undefined) {
      					item_image = basic[index[indexes]]["item"]["texture"];
      				} else {
      					item_image = image_data[item_name];
      				}
      				$("#recipe_" + recipe_num).append("<div class=\"stats\" id=\"stats_"+recipe_num+"\"></div><div recipe_num=\"" + recipe_num + "\" class=\"item_recipe_shown crafted_recipe_item\" ><span class='" + item_image + " sprite'></span><br><p>" + item_name + "</p><div class=\"amount crafted_amount\" init_val=" + item_amount + ">" + item_amount + "</div></div>");
      			}

      			has_tool = 0;

      			if (basic[index[indexes]]["tool"] != undefined) {
      				has_tool = 1;
      				tool_used = basic[index[indexes]]["tool"];
      				tool_image = "images/tools/" + tool_used.split(" ").join("_").toLowerCase() + ".png";
      				$("#stats_" + recipe_num).append("<div class=\"tool_used\">" + tool_used + " <img alt=\"" + tool_used + "\" class=\"tool_image\" src=\"" + tool_image + "\"></div>");
      			}
      			if (basic[index[indexes]]["station"] != undefined) {
      				has_tool = 1;
      				station_used = basic[index[indexes]]["station"];
      				station_image = "images/stations/" + station_used.split(" ").join("_").toLowerCase() + ".png";
      				$("#stats_" + recipe_num).append("<div class=\"station_used\">" + station_used + " <img alt=\"" + station_used + "\" class=\"station_image\" src=\"" + station_image + "\"></div>");
      			}
      			if (basic[index[indexes]]["time"] != undefined) {
      				has_tool = 1;
      				time_used = basic[index[indexes]]["time"];
      				$("#stats_" + recipe_num).append("<div class=\"time_used\">" + time_used + " <img class=\"clock_image\" src=\"images/stations/clock.png\"></div>");
      			}

      			if (has_tool == 0) {
      				$("#recipe_" + recipe_num + " > .crafting").css("padding-right","80px");
      			}


      			$("#recipe_" + recipe_num).append("<br>")

      			for (item in basic[index[indexes]]["recipe"][recipes]) {
      				item_name = basic[index[indexes]]["recipe"][recipes][item]["item"];
      				item_amount = basic[index[indexes]]["recipe"][recipes][item]["amount"];
      				if (basic[index[indexes]]["recipe"][recipes][item]["image"] != undefined) {
      					item_image = basic[index[indexes]]["recipe"][recipes][item]["image"];
      					if (isCraftable(item_name)) {
      						$("#recipe_" + recipe_num + " > .crafting").append("<div class=\"item_recipe_shown\" item=\"" + item_name + "\" craftable = \"" + item_name + "\"><span class=\"item-name\">" + item_name + "</span><img alt=\"" + item_name + "\" src=\"" + item_image + "\"></span><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div><div class=\"craftable_icon\"><img src=\"images/tools/steel_hammer.png\"></div></div>");
      					} else {
      						$("#recipe_" + recipe_num + " > .crafting").append("<div class=\"item_recipe_shown\" ><span class=\"item-name\">" + item_name + "</span><img alt=\"" + item_name + "\" src=\"" + item_image + "\"><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div></div>");
      					}
      				} else {
      					if (basic[index[indexes]]["recipe"][recipes][item]["texture"] != undefined) {
      						item_image = basic[index[indexes]]["recipe"][recipes][item]["texture"];
      					} else {
      						item_image = image_data[item_name];
      					}
      					if (isCraftable(item_name)) {
      						$("#recipe_" + recipe_num + " > .crafting").append("<div class=\"item_recipe_shown\" item=\"" + item_name + "\" craftable = \"" + item_name + "\"><span class=\"item-name\">" + item_name + "</span><span class='" + item_image + " sprite'></span><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div><div class=\"craftable_icon\"><img src=\"images/tools/steel_hammer.png\"></div></div>");
      					} else {
      						$("#recipe_" + recipe_num + " > .crafting").append("<div class=\"item_recipe_shown\" ><span class=\"item-name\">" + item_name + "</span><span class='" + item_image + " sprite'></span><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div></div>");
      					}
      				}
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
      		recipe_image = $(this).find("span").first().attr("class");
      		recipe_name = $(this).find("p").text();
      		item_amount = parseInt($(this).find(".crafted_amount").attr("init_val"));
      		show_amount_window(curr_recipe_num, item_amount, curr_amount, recipe_image, recipe_name);
      	});

      	$(".exit").on("click", function () {
      		$(".all_recipes").css("display","block");
      		$(".navbar").css("display","block");
      		$(".burger").css("display","block");
      		$(".window").css("display","none");
      		$(".display_recipe").empty();
      		$(".shown_recipes").css("display", "none");
      		$(".all_recipes").css("overflow-y", "scroll");
      		$(".set_quantity").css("display", "none");
      		if(startedAtRecipe) {
      			(adsbygoogle = window.adsbygoogle || []).push({});
      			(adsbygoogle = window.adsbygoogle || []).push({});
      			startedAtRecipe = false;
      		}
      	})
      }

      $(".item_recipe").on("click",  function (e) {
      	if (e.target == $(this).find(".bookmark, .bookmark_filled")[0]) {
      		return false;
      	}
      	clicked_on = $(this).text();
      	showRecipe(clicked_on);
      })

function itemClickEvent() {
	$(".item_recipe_shown[craftable]").on("click", function () {
		clicked_on = $(this).attr("item");
		if (!displayed_recipes.includes(clicked_on)) {
			displayed_recipes.push(clicked_on);
			init_amount = parseInt($(".amount", this).attr("init_val"));
			curr_amount = parseInt($(".amount", this).text());
			multiplier = curr_amount / init_amount;
            $(".item_recipe_shown[craftable]").unbind("click");
            item_image = "images/" + clicked_on.split(" ").join("_").toLowerCase() + ".png";
            index2 = [];
            for (recipe in basic) {
            	if (basic[recipe]["item"]["item"] == clicked_on) {
            		index2.push(recipe)
            	}
            }

            for (indexes2 in index2) {


            	for (recipes in basic[index2[indexes2]]["recipe"]) {



            		$(".display_recipe").append("<div id=\"recipe_" + recipe_num + "\" class=\"recipe_wrapper\"><img src=\"images/ui/craft_arrow.png\" style=\"position: absolute; opacity: .4;\"><div class=\"crafting\"></div></div>");

            		item_name = basic[index2[indexes2]]["item"]["item"];
            		item_amount = basic[index2[indexes2]]["item"]["amount"];
            		if (basic[index2[indexes2]]["item"]["image"] != undefined) {
            			item_image = basic[index2[indexes2]]["item"]["image"];
            			$("#recipe_" + recipe_num).append("<div class=\"stats\" id=\"stats_"+recipe_num+"\"></div><div recipe_num=\"" + recipe_num + "\" class=\"item_recipe_shown crafted_recipe_item\" ><img alt=\"" + item_name + "\" src=\"" + item_image + "\"><br><p>" + item_name + "</p><div class=\"amount crafted_amount\" init_val=" + item_amount + ">" + item_amount + "</div></div>");
            		} else {
            			if (basic[index2[indexes2]]["item"]["texture"] != undefined) {
            				item_image = basic[index2[indexes2]]["item"]["texture"];
            			} else {
            				item_image = image_data[item_name];
            			}
            			$("#recipe_" + recipe_num).append("<div class=\"stats\" id=\"stats_"+recipe_num+"\"></div><div recipe_num=\"" + recipe_num + "\" class=\"item_recipe_shown crafted_recipe_item\" ><span class='" + item_image + " sprite'></span><br><p>" + item_name + "</p><div class=\"amount crafted_amount\" init_val=" + item_amount + ">" + item_amount + "</div></div>");
            		}

            		has_tool = 0;

            		if (basic[index2[indexes2]]["tool"] != undefined) {
            			has_tool = 1;
            			tool_used = basic[index2[indexes2]]["tool"];
            			tool_image = "images/tools/" + tool_used.split(" ").join("_").toLowerCase() + ".png";
            			$("#stats_" + recipe_num).append("<div class=\"tool_used\">" + tool_used + " <img alt=\"" + tool_used + "\" class=\"tool_image\" src=\"" + tool_image + "\"></div>");
            		}
            		if (basic[index2[indexes2]]["station"] != undefined) {
            			has_tool = 1;
            			station_used = basic[index2[indexes2]]["station"];
            			station_image = "images/stations/" + station_used.split(" ").join("_").toLowerCase() + ".png";
            			$("#stats_" + recipe_num).append("<div class=\"station_used\">" + station_used + " <img alt=\"" + station_used + "\" class=\"station_image\" src=\"" + station_image + "\"></div>");
            		}
            		if (basic[index2[indexes2]]["time"] != undefined) {
            			has_tool = 1;
            			time_used = basic[index2[indexes2]]["time"];
            			$("#stats_" + recipe_num).append("<div class=\"time_used\">" + time_used + " <img class=\"clock_image\" src=\"images/stations/clock.png\"></div>");
            		}

            		if (has_tool == 0) {
            			$("#recipe_" + recipe_num + " > .crafting").css("padding-right","80px");
            		}



            		for (item in basic[index2[indexes2]]["recipe"][recipes]) {
            			item_name = basic[index2[indexes2]]["recipe"][recipes][item]["item"];
            			item_amount = basic[index2[indexes2]]["recipe"][recipes][item]["amount"];
            			if (basic[index2[indexes2]]["recipe"][recipes][item]["image"] != undefined) {
            				item_image = basic[index2[indexes2]]["recipe"][recipes][item]["image"];
            				if (isCraftable(item_name)) {
            					$("#recipe_" + recipe_num + " > .crafting").append("<div class=\"item_recipe_shown\" item=\"" + item_name + "\" craftable = \"" + item_name + "\"><span class=\"item-name\">" + item_name + "</span><img alt=\"" + item_name + "\" src=\"" + item_image + "\"></span><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div><div class=\"craftable_icon\"><img src=\"images/tools/steel_hammer.png\"></div></div>");
            				} else {
            					$("#recipe_" + recipe_num + " > .crafting").append("<div class=\"item_recipe_shown\" ><span class=\"item-name\">" + item_name + "</span><img alt=\"" + item_name + "\" src=\"" + item_image + "\"><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div></div>");
            				}
            			} else {
            				if (basic[index2[indexes2]]["recipe"][recipes][item]["texture"] != undefined) {
            					item_image = basic[index2[indexes2]]["recipe"][recipes][item]["texture"];
            				} else {
            					item_image = image_data[item_name];
            				}
            				if (isCraftable(item_name)) {
            					$("#recipe_" + recipe_num + " > .crafting").append("<div class=\"item_recipe_shown\" item=\"" + item_name + "\" craftable = \"" + item_name + "\"><span class=\"item-name\">" + item_name + "</span><span class='" + item_image + " sprite'></span><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div><div class=\"craftable_icon\"><img src=\"images/tools/steel_hammer.png\"></div></div>");
            				} else {
            					$("#recipe_" + recipe_num + " > .crafting").append("<div class=\"item_recipe_shown\" ><span class=\"item-name\">" + item_name + "</span><span class='" + item_image + " sprite'></span><div class=\"amount\" init_val=" + item_amount + ">" + item_amount + "</div></div>");
            				}
            			}

            		}

            		$("#quantity_" + recipe_num).attr({ "value": item_amount, "step": item_amount });
            		recipe_num++;
            	}
            }
            hideOnes();
            itemClickEvent();
            close_recipe_function()
            $(".crafted_recipe_item").on("click", function () {
            	curr_recipe_num = parseInt($(this).attr("recipe_num"));
            	curr_amount = parseInt($(this).find(".crafted_amount").text());
            	recipe_image = $(this).find("span").first().attr("class");
            	recipe_name = $(this).find("p").text();
            	item_amount = parseInt($(this).find(".crafted_amount").attr("init_val"));
            	show_amount_window(curr_recipe_num, item_amount, curr_amount, recipe_image, recipe_name);
            });
            $(".display_recipe").animate({ scrollTop: $('.display_recipe').prop("scrollHeight") }, 500);
        } else {
        	shown_recs = $(".crafted_recipe_item:contains('"+clicked_on+"')").toArray()
        	for (recipe_item in shown_recs) {
        		curr_rec_id =  $(".crafted_recipe_item:contains('"+clicked_on+"')").eq(recipe_item).attr("recipe_num");
        		init_val = parseInt($(".crafted_recipe_item:contains('"+clicked_on+"')").eq(recipe_item).children(".amount").attr("init_val"));
        		amount = parseInt($(this).children(".amount").text());

        		value = Math.ceil(amount/init_val)*init_val;
        		filter_quantity_auto(curr_rec_id, value);
        	}
        }

    })
}

function close_recipe_function() {
	$(".close_recipe").unbind("click");
	$(".close_recipe").on("click", function () {
		close_item = $(this).parent().find(".crafted_recipe_item > p").text();
		index_close = displayed_recipes.indexOf(close_item);
		displayed_recipes.splice(index_close, 1);
		for (item in $(".recipe_wrapper").toArray()) {
			if ($(".recipe_wrapper:eq(" + item + ")").find(".crafted_recipe_item > p").text() == close_item) {
				$(".recipe_wrapper:eq(" + item + ")").attr("to_remove", "");
			}
			$(".item_recipe_shown[item=\"" + close_item + "\"]").attr("craftable", "");
		}
		$(".recipe_wrapper[to_remove]").remove();
		itemClickEvent();
	})
}

function show_amount_window(recipe_nums, amounts, curr_amounts, item_image, item_name) {
	$(".set_quantity").css("display", "block");
	$(".filter_quantity > .item_recipe_display > span").attr("class", item_image);
	$(".filter_quantity > .item_recipe_display > p").text(item_name);
	$("#quantity").attr("step", amounts);
	$("#quantity").val(curr_amounts);
	$("#quantity").select();
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

function filter_quantity_auto(recipe_num, value) {
	quantities = $("#recipe_" + recipe_num).find(".amount").not(".crafted_amount").toArray();
	quantity = value;
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
	if (values > 20000) {
		$(this).val(20000);
	}
})

function closeNotif() {
	$(".notification").css("display", "none");
}

function showBurger() {
	$(".show_burger").on("click", function() {
		$(this).unbind("click");
		$(this).toggleClass("show_burger");
		$(this).toggleClass("hide_burger");
		$(".burger").css("top","50px");
		hideBurger();
	});
}

function hideBurger(){
	$(".hide_burger").on("click", function() {
		$(this).unbind("click");
		$(this).toggleClass("show_burger");
		$(this).toggleClass("hide_burger");
		$(".burger").css("top","-150px");
		showBurger();
	});
}

showBurger();

$(".android_exit").on("click", function() {
    $(".on_android").css("display","none");
});

$(".share").on("click", function(){
	$(".share_window").css("display","block");
	linkElement = document.getElementById("link-to-share");
	linkElement.select();
	linkElement.setSelectionRange(0, 99999);
	document.execCommand("copy");
	$("#link-to-share").prop("disabled",true);
})

$(".share_exit").on("click", function(){
	$("#link-to-share").prop("disabled",false);
	$(".share_window").css("display","none");
})