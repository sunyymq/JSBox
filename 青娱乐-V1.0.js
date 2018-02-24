/* by Hhdº */

$ui.render({
  props: {
    title: "青娱乐"
  },
  views: [{
      type: "list",
      props: {
        id: "input_list",
        data: [{
          type: "view",
          layout: $layout.fill,
          views: [{
              type: "button",
              props: {
                id: "type_button",
                type: 1,
                icon: $icon("067", $color("#666666"), $size(30, 30))
              },
              layout(make, view) {
                make.left.inset(10)
                make.centerY.equalTo(view.super)
              },
              events: {
                tapped(sender) {
                  $ui.menu({
                    items: all_type.map(function(item) {
                      return item.name
                    }),
                    handler(title, idx) {
                      if (idx == 0) {
                        list.data = JSON.parse($file.read("shared://qyle.txt").string)
                        $cache.set("fav", 1)
                      } else refresh(`/${all_type[idx].id}/`)
                    }
                  })
                }
              }
            },
            {
              type: "input",
              props: {
                type: $kbType.search,
                placeholder: "搜索视频...",
                clearsOnBeginEditing: true
              },
              layout(make) {
                make.top.bottom.inset(5)
                make.right.inset(10)
                make.left.equalTo($("type_button").right).offset(10)
              },
              events: {
                returned(sender) {
                  sender.blur()
                  refresh(`/search/video/?s=${encodeURI(sender.text)}`)
                }
              }
            }
          ]
        }]
      },
      layout: function(make) {
        make.height.equalTo(50)
        make.left.right.top.inset(0)
      }
    },
    {
      type: "list",
      props: {
        id: "video_list",
        rowHeight: 400,
        data: new Array(),
        template: [{
            type: "image",
            props: {
              id: "img",
              bgcolor: $color("white"),
              radius: 15
            },
            layout(make) {
              make.top.left.right.inset(15)
              make.bottom.inset(45)
            }
          },
          {
            type: "label",
            props: {
              id: "name",
              textColor: $color("#008062")
            },
            layout(make, view) {
              make.top.equalTo($("img").bottom).offset(10)
              make.centerX.equalTo(view.super)
            }
          },
          {
            type: "label",
            props: {
              id: "play_time",
              bgcolor: $rgba(0, 0, 0, 0.5),
              textColor: $color("white"),
              radius: 5,
              align: $align.center
            },
            layout(make) {
              make.top.right.inset(25)
              make.height.equalTo(35)
              make.width.equalTo(120)
            }
          },
          {
            type: "label",
            props: {
              id: "last_time",
              bgcolor: $rgba(225, 225, 225, 0.5),
              textColor: $color("black"),
              radius: 5,
              align: $align.center
            },
            layout(make) {
              make.top.left.inset(25)
              make.height.equalTo(35)
              make.width.equalTo(70)
            }
          }
        ],
        actions: [{
            title: " 收藏❤ ",
            handler(sender, indexPath) {
              if ($cache.get("fav") == 1) {
                sender.delete(indexPath)
                var file = sender.data
              } else {
                var data = sender.data[indexPath.row]
                newItem = {
                  img: {
                    src: data.img.src
                  },
                  name: {
                    text: data.name.text
                  },
                  play_time: {
                    text: data.play_time.text
                  },
                  last_time: {
                    text: data.last_time.text
                  },
                  url: data.url
                }
                if ($file.exists("shared://qyle.txt") == true) {
                  var file = JSON.parse($file.read("shared://qyle.txt").string)
                  file.unshift(newItem)
                } else var file = [newItem]
                $ui.toast("已收藏")
              }
              $file.write({
                path: "shared://qyle.txt",
                data: $data({
                  string: JSON.stringify(file)
                })
              })
            }
          },
          {
            title: " 菜单🔘 ",
            handler(sender, indexPath) {
              var data = sender.data[indexPath.row]
              web_url = website + encodeURI(data.url)
              $ui.menu({
                items: ["在Safari打开网页", "在Safari播放视频", "新窗口播放视频", "新窗口打开网页", "复制网页链接", "复制视频直链", "下载视频至本地"],
                handler(title, idx) {
                  switch (idx) {
                    case 0:
                      $app.openBrowser({ url: web_url })
                      break
                    case 3:
                      openURL(web_url)
                      break
                    case 4:
                      $clipboard.text = web_url
                      break
                    default:
                      play(idx, data.url, indexPath, data.img.src)
                      break
                  }
                }
              })
            }
          }
        ]
      },
      layout(make) {
        make.top.equalTo($("input_list").bottom)
        make.left.right.bottom.inset(0)
      },
      events: {
        didSelect(sender, indexPath, data) {
          play(0, data.url, indexPath, data.img.src)
        }
      }
    }
  ]
})

function refresh(id) {
  $http.get({
    url: website + id,
    header: {
      'User-Agent': ua
    },
    handler(resp) {
      $cache.remove("fav")
      var data = resp.data.replace(/\n|\s|\r/g, "")
      rowInfo = data.match(/<ahref=\"\/\d+\/.*?\/\"title=\".*?\"class=\"thumbnail\"target=\"_blank\"><divclass=\"video-thumb\"><imgsrc=\"http:\/\/www.qyl099.com\/media\/videos\/tmb\/\d+\/\d+\/\d+\/\d*\.jpg"/g)
      playTime = data.match(/\d+次播放(?=<\/span>)/g)
      lastTime = data.match(/\d+:\d+(?=<\/span>)/g)
      arr = []
      for (i in rowInfo) {
        var item = rowInfo[i]
        arr.push({
          img: {
            src: item.match(/http:\/\/www.qyl099.com\/media\/videos\/tmb\/\d+\/\d+\/\d+\/\d*\.jpg/)[0]
          },
          name: {
            text: item.match(/title=\".*?(?=\")/)[0].replace("title=\"", "")
          },
          play_time: {
            text: playTime[i]
          },
          last_time: {
            text: lastTime[i]
          },
          url: item.match(/\/\d+\/.*?\/(?=\"title)/)[0]
        })
      }
      list.data = arr
    }
  })
}

function play(num, url, idx, img_url) {
  var web_url = website + encodeURI(url)
  $http.get({
    url: web_url,
    header: {
      'User-Agent': ua
    },
    handler(resp) {
      var file_url = resp.data.match(/http:.*?\.mp4/)[0]
      switch (num) {
        case 0:
          list.cell(idx).add({
            type: "video",
            props: {
              src: file_url,
              poster: img_url,
              radius: 15
            },
            layout(make) {
              make.top.left.right.inset(15)
              make.bottom.inset(45)
            }
          })
          break
        case 1:
          $app.openBrowser({ url: file_url })
          break
        case 2:
          openURL(file_url)
          break
        case 5:
          $clipboard.text = file_url
          break
        case 6:
          download(file_url)
          break
      }
    }
  })
}

function openURL(url) {
  $ui.push({
    props: {
      title: url
    },
    views: [{
      type: "web",
      props: {
        url: url
      },
      layout: $layout.fill
    }]
  })
}

function download(url) {
  $ui.loading(true)
  $http.download({
    url: url,
    handler(resp) {
      $ui.loading(false)
      $share.sheet(resp.data)
    }
  })
}

const ua = "Mozilla/5.0 (iPad; CPU OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.0 Mobile/14F89 Safari/602.1"
list = $("video_list")
website = "http://www.qyl099.com"
all_type = [{ "name": "我的收藏❤" }, { "name": "成人动漫", "id": "cartoon" }, { "name": "长视频", "id": "changshipin" }, { "name": "潮喷", "id": "chaopen" }, { "name": "大屌", "id": "dadiao" }, { "name": "肛交", "id": "gangjiao" }, { "name": "高清HD", "id": "gaoqing" }, { "name": "男同性恋", "id": "gay" }, { "name": "国产自拍", "id": "guochan" }, { "name": "巨乳波霸", "id": "juru" }, { "name": "口爆颜射", "id": "koubaoyanshe" }, { "name": "性感美女", "id": "meinv" }, { "name": "嫩妹", "id": "nenmei" }, { "name": "女同性恋", "id": "nvtong" }, { "name": "欧美性爱", "id": "oumei" }, { "name": "日韩情色", "id": "party" }, { "name": "公众户外", "id": "public" }, { "name": "自慰器具", "id": "qijuziwei" }, { "name": "集体群交", "id": "qunjiao" }, { "name": "强奸", "id": "rapping" }, { "name": "熟女人妻", "id": "renqishunv" }, { "name": "青娱乐美女热舞", "id": "rewu" }, { "name": "日本无码", "id": "ribenwuma" }, { "name": "性爱", "id": "sex" }, { "name": "丝袜美腿", "id": "siwa" }, { "name": "SM调教", "id": "smxingnue" }, { "name": "素人", "id": "suren" }, { "name": "偷情乱伦", "id": "touqingyuluanlun" }, { "name": "短视频", "id": "xiaobian" }, { "name": "校园激情", "id": "xiaoyuan" }, { "name": "亚洲性爱", "id": "yazhou" }, { "name": "日本有码", "id": "youma" }, { "name": "制服诱惑", "id": "zhifu" }, { "name": "重口味", "id": "zhongkouwei" }, { "name": "中文字幕", "id": "zhongwenzimu" }, { "name": "网络主播", "id": "zhubo" }, { "name": "足交", "id": "zujiao" }]

refresh("")