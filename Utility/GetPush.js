    /*
    Get Push
    接收 Push(支持 note, link 类型)
    by Neurogram
    */

    // 请将 Api key 填写到下方""中
    var apiKey = ""
    // 获取 Push 的最大个数，默认 10
    var pushLimit = 10

    $http.request({
      method: "GET",
      url: "https://api.pushbullet.com/v2/pushes?active=true&limit=" + pushLimit,
      header: {
        "Access-Token": apiKey
      },
      handler: function(resp) {
        pushResults = resp.data.pushes
        var pushItems = pushResults.length
        if (pushItems == 0) {
          $ui.alert("Sorry, no pushes here")
          $app.close()
        } else if (pushItems == 1) {
          pushItem(0, pushResults[0].type)
        } else {
          $ui.menu({
            items: pushResults.map(function(item) {
              if (item.type == "link") {
                if (item.url == undefined) {
                  var urlShow = "🔗" + item.body
                } else {
                  var urlShow = "🔗" + item.url
                }
              }
              return urlShow || item.body
            }),
            handler: function(title, idx) {
              pushItem(idx, pushResults[idx].type)
            }
          })
        }
      }
    })

    function copyText(text) {
      $clipboard.text = text
      $ui.toast("Success")
    }

    function pushItem(itemIdx, itemType) {
      if (itemType == "link") {
        urlItem(pushResults[itemIdx].url || pushResults[itemIdx].body)
      } else if (itemType == "note") {
        var links = $detector.link(pushResults[itemIdx].body)
        if (links == "") {
          copyText(pushResults[itemIdx].body)
        } else {
          $ui.menu({
            items: ["Copy Text", "View Link"],
            handler: function(title, idx) {
              if (idx == 0) {
                copyText(pushResults[itemIdx].body)
              } else {
                if (links.length == 1) {
                  urlItem(links[0])
                } else {
                  $ui.menu({
                    items: links,
                    handler: function(title, idx) {
                      urlItem(links[idx])
                    }
                  })
                }
              }
            }
          })
        }
      }
    }

    function urlItem(url) {
      $ui.menu({
        items: ["Copy Link", "Open in Safari"],
        handler: function(title, idx) {
          if (idx == 0) {
            copyText(url)
          } else {
            $app.openURL(url)
          }
        }
      })
    }
