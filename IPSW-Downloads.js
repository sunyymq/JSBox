/*
感谢 ipsw.me 提供的接口
by Hhdº
*/

const myModel = $device.info.model
allModels = ["iPhone10,3", "iPhone3,1", "iPad1,1", "iPhone3,2", "iPod2,1", "iPhone10,4", "iPhone6,1", "iPhone3,3", "iPhone6,2", "iPhone10,5", "iPhone9,1", "iPad2,1", "iPhone9,2", "iPad2,2", "iPod3,1", "iPad2,3", "iPhone10,6", "iPad2,4", "iPhone9,3", "iPad2,5", "iPad2,6", "iPhone9,4", "iPad2,7", "iPad3,1", "iPod4,1", "iPad3,2", "iPhone1,2", "iPad3,3", "iPad3,4", "iPhone4,1", "iPad3,5", "iPad3,6", "iPhone7,1", "iPad4,1", "iPhone7,2", "iPad4,2", "iPod5,1", "iPad4,3", "iPad4,4", "iPad4,5", "iPad4,6", "iPad4,7", "iPad4,8", "iPad4,9", "iPad6,11", "iPad5,1", "iPad6,12", "iPad5,2", "iPad5,3", "iPad5,4", "iPhone2,1", "iPhone5,1", "iPod7,1", "iPhone5,2", "iPad6,3", "iPhone8,1", "iPad6,4", "iPhone5,3", "iPhone8,2", "iPad6,7", "iPhone5,4", "iPad6,8", "iPhone10,1", "iPad7,1", "iPad7,2", "iPhone8,4", "iPad7,3", "iPhone10,2", "iPad7,4"]

function main() {
  $ui.render({
    props: {
      title: "IPSW Downloads"
    },
    views: [{
        type: "label",
        props: {
          id: "tip",
          text: "当前设备型号：",
          textColor: $color("gray"),
          font: $font(15)
        },
        layout(make, view) {
          make.top.inset(10)
          make.centerX.equalTo(view.super)
        }
      },
      {
        type: "label",
        props: {
          id: "model",
          text: myModel,
          font: $font("bold", 25)
        },
        layout(make) {
          make.top.equalTo($("tip").bottom).offset(10)
          make.centerX.equalTo($("tip"))
        }
      },
      {
        type: "list",
        props: {
          id: "modelList",
          footer: {
            type: "label",
            props: {
              height: 20,
              text: "by Hhdº",
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },
          template: [{
              type: "label",
              props: {
                id: "title",
                font: $font(16)
              },
              layout: function(make, view) {
                make.left.inset(15)
                make.centerY.equalTo(view.super)
              }
            },
            {
              type: "canvas",
              layout: function(make, view) {
                make.right.inset(10)
                make.centerY.equalTo(view.super)
                make.width.equalTo(8)
                make.height.equalTo(13)
              },
              events: {
                draw: function(view, ctx) {
                  var X = view.frame.width - 2
                  Y = view.frame.height
                  ctx.strokeColor = $color("#C7C7CC")
                  ctx.moveToPoint(0, 0)
                  ctx.setLineWidth(2)
                  ctx.addLineToPoint(X, Y * 0.5)
                  ctx.addLineToPoint(0, Y)
                  ctx.strokePath()
                }
              }
            }
          ]
        },
        layout(make) {
          make.top.equalTo($("model").bottom).offset(10)
          make.bottom.left.right.inset(0)
        },
        events: {
          didSelect(sender, indexPath, data) {
            load(data.title.text)
          }
        }
      }
    ]
  })

  var arr = new Array()
  for (time in allModels) {
    var model = allModels[time]
    if (model == myModel) {
      arr.unshift({
        title: {
          text: model
        }
      })
    } else {
      arr.push({
        title: {
          text: model
        }
      })
    }
  }
  $("modelList").data = arr
}

function details(firmwares, model) {
  $ui.push({
    props: {
      title: model,
    },
    views: [{
      type: "list",
      props: {
        id: "firmwaresList",
        template: [{
            type: "label",
            props: {
              id: "title",
              font: $font(16)
            },
            layout: function(make, view) {
              make.left.inset(15)
              make.centerY.equalTo(view.super)
            }
          },
          {
            type: "label",
            props: {
              id: "type"
            },
            layout: function(make, view) {
              make.right.inset(15)
              make.centerY.equalTo($("title"))
              make.height.equalTo(view.super)
            }
          }
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect(sender, indexPath, data) {
          $ui.menu({
            items: ["复制固件链接", "迅雷下载固件"],
            handler(title, idx) {
              switch (idx) {
                case 0:
                  $clipboard.text = data.url
                  $ui.toast("已复制")
                  break
                case 1:
                  $app.openURL("thunder://" + $text.base64Encode(data.url))
                  break
              }
            }
          })
        }
      }
    }]
  })

  var arr = new Array()
  for (time in firmwares) {
    var info = firmwares[time]
    arr.push({
      title: {
        text: info.version
      },
      type: {
        text: (info.signed == true) ? "✅" : "❌"
      },
      url: info.url,
    })
  }
  $("firmwaresList").data = arr
}

function load(model) {
  $ui.loading(true)
  $http.get({
    url: "https://ipsw.me/api/ios/v3/device/" + model,
    handler(resp) {
      $ui.loading(false)
      var firmwares = resp.data[model].firmwares
      if ($app.env == $env.today) {
        var arr = []
        for (time in firmwares) {
          var info = firmwares[time]
          if (info.signed == true) arr.push(info.version)
        }
        $ui.alert({
          title: "•••【温馨提示】•••",
          message: model + "的可验证版本为" + arr.join(",")
        })
      } else details(firmwares)
    }
  })
}

if ($app.env == $env.today) {
  var arr = new Array()
  for (time in allModels) {
    var model = allModels[time]
    if (model == myModel) {
      arr.unshift(model)
    } else arr.push(model)
  }
  $ui.menu({
    items: arr,
    handler(title, idx) {
      load(title)
    }
  })
} else main()