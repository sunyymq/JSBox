var version = $device.info.version
var model = $device.info.model
var API = "https://ipsw.me/api/ios/v3/device/"
var signed = false
$ui.loading(true)

function output(information, versions) {
  $ui.alert({
    title: "•••【温馨提示】•••",
    message: "当前固件：" + information + "\n可验证固件：" + versions
  })
}

function matchVersion(data){
  var firmwares = data[model].firmwares.map(function(item) { return item.signed ? item.version : '' })
  return firmwares
}

function match(versions) {
  $http.get({
    url: API + model + "/" + version + "/info.json",
    handler: function(resp) {
      $ui.loading(false)
      data = matchVersion(resp.data)
      for (const key in data) {if(data[key] == version){signed = true;break;}}
      output(version + (signed ? " (可以验证)" : " (不可验证)"), versions)
    }
  })
}

$http.get({
  url: API + model,
  handler: function(resp) { 
    match(matchVersion(resp.data).filter(function(n){return n}).join(", "))
  }
})