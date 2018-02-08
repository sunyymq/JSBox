// by Hhdº

$app.strings = {
  "en": {
    "title": "Image Picker",
    "placeholder": "Input the url",
    "loading": "Loading...",
    "finish": "Finished",
    "save": "Save the image",
    "copy": "Copy link",
    "saved": "Saved",
    "error": "This image can't be saved, please try again",
    "copied":"Copied"
  },
  "zh-Hans": {
    "title": "图片抓取",
    "placeholder": "输入链接",
    "loading": "加载中...",
    "finish": "完成",
    "save": "保存图片",
    "copy": "复制链接",
    "saved": "已保存",
    "error": "无法保存此图片，请再次尝试",
    "copied":"已复制"
  },
  "zh-Hant": {
    "title": "圖片抓取",
    "placeholder": "輸入鏈接",
    "loading": "加載中...",
    "finish": "完成",
    "save": "保存圖片",
    "copy": "複製鏈接",
    "saved": "已保存",
    "error": "無法保存此圖片，請再次嘗試",
    "copied":"已復製"
  }
}

$ui.render({
  props: {
    title: $l10n("title")
  },
  views: [{
      type: "input",
      props: {
        id: "input",
        placeholder: $l10n("placeholder")
      },
      layout(make) {
        make.top.left.right.inset(10)
        make.height.equalTo(30)
      },
      events: {
        ready(sender) {
          var link = $clipboard.link
          if (typeof link !== "undefined") {
            sender.text = $clipboard.link
          }
          sender.focus()
        },
        returned(sender) {
          var text = sender.text        
          if (text.indexOf("http") == -1) sender.text = `http://${text}`        
          pick()
        }
      }
    },
    {
      type: "matrix",
      props: {
        columns: 4,
        square: true,
        spacing: 10,
        template: [{
          type: "image",
          props: {
            id: "image",
          },
          layout: $layout.fill
        }]
      },
      layout: function(make) {
        make.left.bottom.right.equalTo(0)
        make.top.equalTo($("input").bottom).offset(10)
      },
      events: {
        didSelect: function(sender, indexPath, data) {
          var url = data.image.src        
          $ui.menu({
            items: [$l10n("save"),$l10n("copy")],
            handler(title,idx){
              switch(idx){
                case 0:
                $http.download({
                  url:url,
                  handler(resp){
                    $photo.save({
                      image:resp.data,
                      handler(success){
                        if (success == 1){
                          $ui.toast($l10n("saved"))
                        } else $ui.toast($l10n("error"))
                      }
                    })
                  }
                })
                break
                case 1:
                $clipboard.text = url
                $ui.toast($l10n("copied"))
                break
              }
            }
          })
        }
      }
    }
  ]
})

function pick() {
  $ui.toast($l10n("loading"), 100)
  $http.get({
    url: $("input").text,
    handler(resp) {
      var html = resp.data
      reg = /http.*?\.(jpg|png)/g
      css = html.match(/http.*?\.css/g)
      img = html.match(reg)
      for (i in css) {
        $http.get({
          url: css[i],
          handler(resp) {
            resp.data.match(reg).map(function(item) {
              img.push(item)
            })
            if (i == css.length - 1) {
              $ui.toast($l10n("finish"), 0.5)
              $("matrix").data = img.map(function(item) {
                return {
                  image: {
                    src: item
                  }
                }
              })
            }
          }
        })
      }
    }
  })
}