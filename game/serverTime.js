function sTime() {
  $.ajax({
    type: 'GET',
    url: "http://worldtimeapi.org/api/timezone/Europe/London.json",
    success: function (response) {
      asdf = response["unixtime"];
    }
  });
}