/*

  F-Start,一个强大的效率工具
  “F”即“fast”,意为“快速地”;
  “Start”意为“启动”;
  “F-Start”即“极速启动”
  有了这个脚本,你可以在JSBox上享受Pin的效率,在Pin上体验更高效率!
  
  by:Hhdº
  email:hehedahhd@icloud.com

*/

$app.keyboardToolbarEnabled = true

const iconType = ["136", "099", "129"]

const mainColor = ($cache.get("Color")) ? $cache.get("Color")[0] : $color("#157EFC")

VIEW = {
  type: "view",
  props: {
    id: "Rview"
  },
  views: [{
      type: "view",
      props: {
        id: "line",
        bgcolor: $rgb(221, 221, 221)
      },
      layout: function(make) {
        make.top.right.left.inset(0)
        make.height.equalTo(0.5)
      }
    },
    {
      type: "button",
      props: {
        id: "B1",
        bgcolor: $color("white")
      },
      layout: function(make, view) {
        make.bottom.inset(0)
        make.top.equalTo($("line").bottom)
        make.width.equalTo(view.super).dividedBy(2)
      },
      events: {
        tapped(sender) {
          ChangeColor(sender)
          mainView()
        }
      }
    },
    {
      type: "button",
      props: {
        id: "B3",
        bgcolor: $color("white")
      },
      layout: function(make, view) {
        make.bottom.inset(0)
        make.left.equalTo($("B1").right)
        make.top.equalTo($("line").bottom)
        make.width.equalTo(view.super).dividedBy(2)
      },
      events: {
        tapped(sender) {
          ChangeColor(sender)
          ThirdView()
        }
      }
    }
  ],
  layout: function(make) {
    make.left.right.bottom.inset(0)
    make.height.equalTo(44)
  }
}

function mainView() {
  $ui.render({
    props: {
      title: "F-Start"
    },
    views: [VIEW,
      {
        type: "view",
        views: [{
          type: "matrix",
          props: {
            id: "FileList",
            columns: 4,
            spacing: 0,
            square: true,
            template: [{
                type: "image",
                props: {
                  id: "img",
                  bgcolor: $color("white")
                },
                layout: function(make, view) {
                  var S = ($device.info.model.indexOf("iPad") == -1) ? 50 : 100
                  make.centerX.equalTo(view.super)
                  make.bottom.inset(($device.info.model.indexOf("iPad") == -1) ? 30 : 50)
                  make.size.equalTo($size(S, S))
                }
              },
              {
                type: "label",
                props: {
                  id: "name",
                  textColor: $color("#474b51"),
                  align: $align.center,
                  font: $font(($device.info.model.indexOf("iPad") == -1) ? 15 : 20)
                },
                layout: function(make) {
                  make.bottom.left.right.inset(10)
                }
              }
            ]
          },
          layout: $layout.fill,
          events: {
            didSelect(sender, indexPath, data) {
              if (indexPath.row == sender.data.length - 1) {
                add(0)
              } else {
                $ui.menu({
                  items: ["打开", "编辑"],
                  handler: function(title, idx) {
                    if (idx == 0) {
                      if (data.type == "文件夹") {
                        folder(data)
                      } else {
                        var cb = $clipboard.text
                        url = data.mode.replace(/%CLIPBOARD%/g, cb).replace(/%LINK%/g, encodeURI(cb)).replace(/%BASE64%/g, $text.base64Encode(cb))
                        if (data.type == "网页") {
                          if (data.openInScript == true) {
                            openURL(url)
                          } else {
                            $app.openBrowser({
                              type: $cache.get("browser")[1],
                              url: url
                            })
                          }
                        } else $app.openBrowser({ url: url })
                      }
                    } else edit(data, 0)
                  }
                })
              }
            }
          }
        }],
        layout: function(make) {
          make.bottom.equalTo($("Rview").top)
          make.top.left.right.inset(0)
        }
      }
    ]
  })
  refresh()
  ChangeColor($("B1"), 0)
  $delay(0.1, function() {
    $ui.window.super.super.super.views[1].views[0].bgcolor = mainColor
  })
}

function folder(folderInfo) {
  $ui.push({
    props: {
      title: folderInfo.name.text
    },
    views: [{
      type: "matrix",
      props: {
        id: "folderList",
        columns: 4,
        spacing: 0,
        square: true,
        template: [{
            type: "image",
            props: {
              id: "img",
              bgcolor: $color("white")
            },
            layout: function(make, view) {
              var S = ($device.info.model.indexOf("iPad") == -1) ? 50 : 100
              make.centerX.equalTo(view.super)
              make.bottom.inset(($device.info.model.indexOf("iPad") == -1) ? 30 : 50)
              make.size.equalTo($size(S, S))
            }
          },
          {
            type: "label",
            props: {
              id: "name",
              textColor: $color("#474b51"),
              align: $align.center,
              font: $font(($device.info.model.indexOf("iPad") == -1) ? 15 : 20)
            },
            layout: function(make) {
              make.bottom.left.right.inset(10)
            }
          }
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect(sender, indexPath, data) {
          if (indexPath.row == sender.data.length - 1) {
            add(1, folderInfo.index)
          } else {
            $ui.menu({
              items: ["打开", "编辑"],
              handler: function(title, idx) {
                if (idx == 0) {
                  var cb = $clipboard.text
                  url = data.mode.replace(/%CLIPBOARD%/g, cb).replace(/%LINK%/g, encodeURI(cb)).replace(/%BASE64%/g, $text.base64Encode(cb))
                  if (data.openInScript == true) {
                    openURL(url)
                  } else {
                    $app.openBrowser({
                      type: $cache.get("browser")[1],
                      url: url
                    })
                  }
                } else edit(data, 1, folderInfo.index)
              }
            })
          }
        }
      }
    }]
  })
  folderRefresh(JSON.parse($drive.read("FStart.txt").string)[folderInfo.index])
}

function folderRefresh(Info) {
  const ico = {
    "ico1": $cache.get("icon1"),
    "ico2": $cache.get("icon2"),
    "ico3": $cache.get("icon3"),
    "ico4": $cache.get("icon4")
  }
  var arr = []
  files = Info.files
  for (i in files) {
    var item = files[i]
    icon = null
    switch (item.type) {
      case "文件夹":
        icon = ico.ico1
        break
      case "网页":
        icon = ico.ico2
        break
      case "应用":
        icon = ico.ico3
        break
    }
    arr.push({
      name: {
        text: item.name
      },
      img: {
        src: icon
      },
      mode: item.mode,
      index: i,
      type: item.type,
      openInScript: item.openInScript
    })
  }
  arr.push({
    name: {
      text: "添加"
    },
    img: {
      src: ico.ico4
    }
  })
  $("folderList").data = arr
}

const clues = "首次打开加载中…"
version = "1.7"

if (!$cache.get("icon2")) {
  $ui.progress(0, clues)
  $http.get({
    url: "https://coding.net/u/Hhhd/p/Hhhd1507206502721.Coding.me/git/raw/master/%25E6%2596%2587%25E4%25BB%25B6%25E5%25A4%25B9icon",
    handler(resp) {
      $cache.set("icon1", resp.data)
      $ui.progress(0.25, clues)
      $http.get({
        url: "https://coding.net/u/Hhhd/p/Hhhd1507206502721.Coding.me/git/raw/master/%25E7%25BD%2591%25E7%25AB%2599icon",
        handler(resp) {
          $cache.set("icon2", resp.data)
          $ui.progress(0.5, clues)
          $http.get({
            url: "https://coding.net/u/Hhhd/p/Hhhd1507206502721.Coding.me/git/raw/master/%25E5%25BA%2594%25E7%2594%25A8icon",
            handler(resp) {
              $cache.set("icon3", resp.data)
              $ui.progress(0.75, clues)
              $http.get({
                url: "https://coding.net/u/Hhhd/p/Hhhd1507206502721.Coding.me/git/raw/master/addicon",
                handler(resp) {
                  $cache.set("icon4", resp.data)
                  $cache.set("Color", [$color("#157EFC"), 0])
                  $cache.set("browser", ["Safari", 23333])
                  $ui.progress(1, clues)
                  Start()
                  guide()
                }
              })
            }
          })
        }
      })
    }
  })
} else Start()

const Tips = "%CLIPBOARD% 将被剪切板的内容填充\n%LINK% 将把剪切板URL转码并填充\n%BASE64% 将把剪切板BASE64转码并填充"
ModeView = [{
    type: "view",
    layout: $layout.fill,
    views: [{
        type: "input",
        props: {
          id: "code",
          bgcolor: $color("white"),
          placeholder: "输入模式"
        },
        layout: function(make) {
          make.top.left.bottom.inset(5)
          make.right.inset(70)
        }
      },
      {
        type: "button",
        props: {
          title: "选择",
          bgcolor: mainColor
        },
        layout: function(make, view) {
          make.right.inset(5)
          make.left.equalTo($("code").right).offset(5)
          make.centerY.equalTo(view.super)
        },
        events: {
          tapped(sender) {
            $ui.loading(true)
            $http.get({
              url: "https://coding.net/u/Hhhd/p/JSBoxScripts/git/raw/master/nzjb",
              handler(resp) {
                $ui.loading(false)
                Choose(resp.data)
              }
            })
          }
        }
      }
    ]
  },
  {
    label: {
      text: "使用向导"
    }
  }
]
SwitchView = [{
  type: "view",
  layout: $layout.fill,
  views: [{
      type: "label",
      props: {
        font: $font(16),
        text: "在脚本内打开"
      },
      layout: function(make, view) {
        make.left.inset(15)
        make.centerY.equalTo(view.super)
      }
    },
    {
      type: "switch",
      props: {
        id: "KG",
        on: false,
        onColor: mainColor
      },
      layout: function(make, view) {
        make.centerY.equalTo(view.super)
        make.right.inset(10)
      }
    }
  ]
}]

function refresh() {
  const ico = {
    "ico1": $cache.get("icon1"),
    "ico2": $cache.get("icon2"),
    "ico3": $cache.get("icon3"),
    "ico4": $cache.get("icon4")
  }
  var arr = []
  var exists = $drive.exists("FStart.txt")
  if (exists == 1) {
    var files = JSON.parse($drive.read("FStart.txt").string)
    for (i in files) {
      var item = files[i]
      icon = null
      switch (item.type) {
        case "文件夹":
          icon = ico.ico1
          break
        case "网页":
          icon = ico.ico2
          break
        case "应用":
          icon = ico.ico3
          break
      }
      arr.push({
        name: {
          text: item.name
        },
        img: {
          src: icon
        },
        mode: item.mode,
        index: i,
        type: item.type,
        openInScript: item.openInScript,
        files: item.files
      })
    }
  }
  arr.push({
    name: {
      text: "添加"
    },
    img: {
      src: ico.ico4
    }
  })
  $("FileList").data = arr
}

function edit(EvevtInfo, Type, Index) {
  $ui.push({
    props: {
      title: "编辑项目"
    },
    views: [{
      type: "list",
      props: {
        id: "EditList",
        data: [{
            title: "标题",
            rows: [{
              type: "input",
              props: {
                id: "Title",
                bgcolor: $color("white"),
                placeholder: "输入标题",
                text: EvevtInfo.name.text
              },
              layout: function(make) {
                make.top.left.right.bottom.inset(5)
              }
            }]
          },
          {
            title: "类型",
            rows: [{
              type: "label",
              props: {
                font: $font(16),
                text: EvevtInfo.type + "  (不可修改)"
              },
              layout: function(make, view) {
                make.left.inset(15)
                make.centerY.equalTo(view.super)
              }
            }]
          },
          {
            title: Tips,
            rows: [{
              type: "input",
              props: {
                id: "Code",
                bgcolor: $color("white"),
                placeholder: "输入模式",
                text: EvevtInfo.mode
              },
              layout: function(make) {
                make.top.left.bottom.right.inset(5)
              }
            }]
          },
          {
            rows: [{
              type: "view",
              layout: $layout.fill,
              views: [{
                  type: "label",
                  props: {
                    font: $font(16),
                    text: "在脚本内打开"
                  },
                  layout: function(make, view) {
                    make.left.inset(15)
                    make.centerY.equalTo(view.super)
                  }
                },
                {
                  type: "switch",
                  props: {
                    id: "Switch",
                    on: (EvevtInfo.openInScript == true) ? true : false,
                    onColor: mainColor
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.right.inset(10)
                  }
                }
              ]
            }]
          },
          {
            rows: [{
              type: "button",
              props: {
                title: "完成",
                radius: 0,
                bgcolor: mainColor
              },
              layout: $layout.fill,
              events: {
                tapped(sender) {
                  var file = JSON.parse($drive.read("FStart.txt").string)
                  if (Type == 0) {
                    file.splice(EvevtInfo.index, 1, {
                      name: $("Title").text,
                      type: EvevtInfo.type,
                      mode: $("Code").text,
                      files: [],
                      openInScript: $("Switch").on
                    })
                  } else {
                    file[Index].files.splice(EvevtInfo.index, 1, {
                      name: $("Title").text,
                      type: EvevtInfo.type,
                      mode: $("Code").text,
                      files: [],
                      openInScript: $("Switch").on
                    })
                  }
                  file = JSON.stringify(file)
                  $drive.write({
                    data: $data({ string: file }),
                    path: "FStart.txt"
                  })
                  if (Type !== 0) {
                    folderRefresh(JSON.parse($drive.read("FStart.txt").string)[Index])
                  }
                  refresh()
                  $ui.pop()
                }
              }
            }]
          },
          {
            rows: [{
              type: "button",
              props: {
                title: "删除",
                bgcolor: $color("#E24939"),
                radius: 0
              },
              layout: $layout.fill,
              events: {
                tapped(sender) {
                  $ui.menu({
                    items: ["删除"],
                    handler() {
                      var file = JSON.parse($drive.read("FStart.txt").string)
                      if (Type == 0) {
                        file.splice(EvevtInfo.index, 1)
                      } else file[Index].files.splice(EvevtInfo.index, 1)
                      file = JSON.stringify(file)
                      $drive.write({
                        data: $data({ string: file }),
                        path: "FStart.txt"
                      })
                      if (Type !== 0) {
                        folderRefresh(JSON.parse($drive.read("FStart.txt").string)[Index])
                      }
                      refresh()
                      $ui.pop()
                    }
                  })
                }
              }
            }]
          }
        ]
      },
      layout: $layout.fill
    }]
  })
  var Sender = $("EditList")
  if (EvevtInfo.type !== "网页") {
    Sender.delete($indexPath(3, 0))
  }
  if (EvevtInfo.type == "文件夹") {
    Sender.delete($indexPath(2, 0))
    var list = Sender.data
    list[2].title = ""
    Sender.data = list
  }
}

function add(Type, Index) {
  $ui.push({
    props: {
      title: "添加项目"
    },
    views: [{
      type: "list",
      props: {
        id: "AddEventList",
        data: [{
            title: "标题",
            rows: [{
              type: "input",
              props: {
                id: "title",
                bgcolor: $color("white"),
                placeholder: "输入标题"
              },
              layout: function(make) {
                make.top.left.right.bottom.inset(5)
              }
            }]
          },
          {
            title: "类型",
            rows: [{
              label: {
                text: "网页"
              }
            }]
          },
          {
            title: Tips,
            rows: ModeView
          },
          {
            rows: SwitchView
          },
          {
            rows: [{
              type: "button",
              props: {
                title: "添加",
                radius: 0,
                bgcolor: mainColor
              },
              layout: $layout.fill,
              events: {
                tapped(sender) {
                  if (Type == 1 && $("AddEventList").data[1].rows[0].label.text == "文件夹") {
                    $ui.alert("文件夹内无法再嵌套文件夹")
                  } else {
                    var exists = $drive.exists("FStart.txt")
                    file = null
                    if (Type == 0) {
                      if (exists == 0) {
                        file = new Array()
                      } else {
                        file = JSON.parse($drive.read("FStart.txt").string)
                      }
                      file.push({
                        name: $("title").text,
                        type: $("AddEventList").data[1].rows[0].label.text,
                        mode: $("code").text,
                        files: [],
                        openInScript: $("KG").on
                      })
                    } else {
                      file = JSON.parse($drive.read("FStart.txt").string)
                      file[Index].files.push({
                        name: $("title").text,
                        type: $("AddEventList").data[1].rows[0].label.text,
                        mode: $("code").text,
                        files: [],
                        openInScript: $("KG").on
                      })
                    }
                    file = JSON.stringify(file)
                    $drive.write({
                      data: $data({ string: file }),
                      path: "FStart.txt"
                    })
                    if (Type !== 0) {
                      folderRefresh(JSON.parse($drive.read("FStart.txt").string)[Index])
                    }
                    refresh()
                    $ui.pop()
                  }
                }
              }
            }]
          }
        ],
        template: [{
          type: "label",
          props: {
            id: "label",
            font: $font(17)
          },
          layout: function(make, view) {
            make.centerY.equalTo(view.super)
            make.left.inset(15)
          }
        }]
      },
      layout: $layout.fill,
      events: {
        didSelect(sender, indexPath, data) {
          if (indexPath.section == 1) {
            $ui.menu({
              items: ["文件夹", "网页", "应用"],
              handler: function(title, idx) {
                var list = sender.data
                list[1].rows[0].label.text = title
                type = sender.data[1].rows[0].label.text
                if (type !== "文件夹" && idx == 0) {
                  list.splice(2, 1, {})
                } else if (type == "文件夹" && idx !== 0) {
                  list.splice(2, 1, {
                    title: Tips,
                    rows: ModeView
                  })
                }
                if (type !== "网页" && idx == 1) {
                  list.splice(3, 1, {
                    rows: SwitchView
                  })
                } else if (type == "网页" && idx !== 1) {
                  list.splice(3, 1, {})
                }
                sender.data = list
              }
            })
          } else if (indexPath.section == 2) {
            guide()
          }
        }
      }
    }]
  })
}

function Start() {
  $http.get({
    url: "https://coding.net/u/Hhhd/p/Hhhd1507206502721.Coding.me/git/raw/master/FStart",
    handler(resp) {
      if (resp.data.ver !== version) {
        $ui.alert({
          title: "发现新版本-" + resp.data.ver,
          message: resp.data.msg,
          actions: [{
              title: "取消"
            },
            {
              title: "更新",
              handler: function() {
                $app.openBrowser({
                  url: resp.data.url
                })
              }
            }
          ]
        })
      }
    }
  })
  if ($app.env == $env.today) {
    Menu(JSON.parse($drive.read("FStart.txt").string))
  } else mainView()
}

function Menu(file) {
  $ui.menu({
    items: file.map(function(item) {
      if (item.type == "文件夹") {
        return "📂 " + item.name
      } else if (item.type == "网页") {
        return "🌐 " + item.name
      } else return "🗳 " + item.name
    }),
    handler(title, idx) {
      if (file[idx].type == "文件夹") {
        Menu(file[idx].files)
      } else {
        var cb = $clipboard.text
        url = file[idx].mode.replace(/%CLIPBOARD%/g, cb).replace(/%LINK%/g, encodeURI(cb)).replace(/%BASE64%/g, $text.base64Encode(cb))
        if (file[idx].openInScript == true) {
          $ui.render({
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
        } else {
          $app.openBrowser({
            type: $cache.get("browser")[1],
            url: url
          })
        }
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

function guide() {
  var html = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Content-Style-Type" content="text/css">
<title></title>
<meta name="Generator" content="Cocoa HTML Writer">
<style type="text/css">
.button {
    position: relative;
    background-color: #E0B741;
    border: none;
    font-size: 28px;
    color: #FFFFFF;
    padding: 20px;
    width: 200px;
    text-align: center;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
    text-decoration: none;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)
}
p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; line-height: 18.0px; font: 15.0px Arial; color: #79828b; -webkit-text-stroke: #79828b}
p.p3 {margin: 0.0px 21.0px 12.0px 21.0px; line-height: 28.0px; font: 18.0px Georgia; color: #000000; color: rgba(0, 0, 0, 0.8); -webkit-text-stroke: rgba(0, 0, 0, 0.8)}
p.p4 {margin: 0.0px 0.0px 0.0px 0.0px; line-height: 28.0px; font: 18.0px Georgia; color: #000000; color: rgba(0, 0, 0, 0.8); -webkit-text-stroke: rgba(0, 0, 0, 0.8)}
p.p6 {margin: 0.0px 0.0px 0.0px 0.0px; line-height: 28.0px; font: 18.0px Georgia; color: #000000; color: rgba(0, 0, 0, 0.8); -webkit-text-stroke: rgba(0, 0, 0, 0.8); min-height: 20.5px}
p.p7 {margin: 0.0px 0.0px 0.0px 0.0px; text-align: center; line-height: 19.0px; font: 14.0px Arial; color: #ffffff; -webkit-text-stroke: #ffffff; background-color: #292927; min-height: 16.1px}
p.p8 {margin: 0.0px 0.0px 0.0px 0.0px; font: 18.0px Georgia; color: #000000; color: rgba(0, 0, 0, 0.8); -webkit-text-stroke: rgba(0, 0, 0, 0.8); min-height: 20.5px}
p.p9 {margin: 0.0px 0.0px 0.0px 0.0px; text-align: center; line-height: 18.0px; font: 15.0px Georgia; color: #cccccc; -webkit-text-stroke: #cccccc; min-height: 17.0px}
li.li5 {margin: 0.0px 0.0px 14.0px 0.0px; line-height: 28.0px; font: 18.0px Georgia; color: #000000; color: rgba(0, 0, 0, 0.8); -webkit-text-stroke: rgba(0, 0, 0, 0.8)}
span.s1 {font-family: 'Arial-BoldMT'; font-weight: bold; font-style: normal; font-size: 32.00pt; font-kerning: none}
span.s2 {font-family: 'Arial'; font-weight: normal; font-style: normal; font-size: 15.00pt; font-kerning: none}
span.s3 {font-family: 'Georgia'; font-weight: normal; font-style: normal; font-size: 18.00pt; font-kerning: none}
span.s4 {font-family: 'Georgia'; font-weight: bold; font-style: normal; font-size: 18.00pt; font-kerning: none}
span.s5 {font-family: 'Georgia'; font-weight: normal; font-style: italic; font-size: 18.00pt; font-kerning: none}
span.s6 {font-family: 'Georgia'; font-weight: normal; font-style: normal; font-size: 18.00pt; -webkit-text-stroke: 0px #000000}
span.s7 {font-family: 'Arial'; font-weight: normal; font-style: normal; font-size: 14.00pt; font-kerning: none}
span.s8 {font-family: 'Georgia'; font-weight: normal; font-style: normal; font-size: 15.00pt; font-kerning: none}
ul.ul1 {list-style-type: none}
</style>
</head>
<body>
<h1 style="margin: 0.0px 21.0px 12.0px 21.0px; line-height: 34.0px; font: 32.0px Arial; color: #000000; color: rgba(0, 0, 0, 0.8); -webkit-text-stroke: rgba(0, 0, 0, 0.8)"><span class="s1">F-Start使用向导</span></h1>
<p class="p2"><span class="s2">by Hhdº</span></p>
<p class="p3"><span class="s3">F-Start，一个强大的效率工具。</span></p>
<p class="p3"><span class="s3">有了这个脚本，你可以在JSBox上享受Pin的效率，在Pin上体验更高效率!</span></p>
<p class="p3"><span class="s3"><br>
</span></p>
<p class="p3"><span class="s3">它可以通过设定的链接或 </span><span class="s4">URL-Scheme</span><span class="s3"> 来快速打开网页或应用。</span></p>
<p class="p3"><span class="s3">当然，不止这么简单——</span><span class="s4">指令功能</span><span class="s3">是F-Start的一大特色，也可以结合剪切板进一步提升效率，下面是三个指令及其功能：</span></p>
<p class="p3"><span class="s3">%CLIPBOARD% 将被剪切板的内容填充；</span></p>
<p class="p3"><span class="s3">%LINK% 将把剪切板URL转码并填充；</span></p>
<p class="p3"><span class="s3">%BASE64% 将把剪切板BASE64转码并填充。</span></p>
<p class="p3"><span class="s3"><br>
</span></p>
<p class="p3"><span class="s3">比如，要实现“百度搜索剪切板内容”的功能，就可以使用以下代码：</span></p>
<p class="p3"><code>http://www.baidu.com/s?wd=%LINK%</code></p>
<p class="p3"><span class="s3">其中，%LINK% 就替代了剪切板的文本。</span></p>
<p class="p3"><span class="s3"><br>
</span></p>
<p class="p3"><span class="s3">Tips：请根据项目类型判断使用的指令，</span></p>
<p class="p3"><span class="s3">一般情况下，类型为</span><span class="s4">网页</span><span class="s3">时用 </span><span class="s4">%LINK% </span><span class="s3">，类型为</span><span class="s4">应用</span><span class="s3">时用 </span><span class="s4">%CLIPBOARD%</span><span class="s3"> 即可。</span></p>
<p class="p3"><span class="s3">至于 </span><span class="s4">%BASE64% ，</span><span class="s3">仅在特殊场景使用。</span></p>
<p class="p3"><span class="s3"><br>
</span></p>
<p class="p3"><span class="s3">对于网页和应用的类型选择，如果代码的使用效果会</span><span class="s4">打开一个应用</span><span class="s3">，就选择</span><span class="s4">应用</span><span class="s3">，反之则选择</span><span class="s4">网页</span><span class="s3">。</span></p>
<p class="p3"><span class="s3"><br>
</span></p>
<p class="p3"><span class="s3">萌新可能会对</span><span class="s4">打开应用</span><span class="s3">的操作感到好奇，其实这是用</span><span class="s4">URL-Scheme</span><span class="s3">实现的。可以点击下面链接学习相关知识：<a href="https://sspai.com/post/31500">URLScheme使用详解</a></span></p>
<p class="p3"><span class="s3">那</span><span class="s4">URL-Scheme</span><span class="s3">该怎么获取呢？下面有两种方法：</span></p>
<p class="p3"><span class="s3">1.通过公众号<a href="http://mp.weixin.qq.com/s/rMY9XZWZfVqHLz9Wha20Pg">《艾橙科技》的文章</a>寻找</span></p>
<p class="p3"><span class="s3">2.通过应用<a href="https://itunes.apple.com/cn/app/ijumper/id1298439690?mt=8">iJumper</a>寻找</span></p>
<p class="p3"><span class="s3"><br>
</span></p>
<p class="p3"><span class="s3">1.4版本中新推出的</span><span class="s4">文件夹</span><span class="s3">可以帮你分类项目，使主页更加简洁。</span></p>
<p class="p7"><span class="s4"><img src="https://i.loli.net/2017/12/31/5a482b65ccfe9.jpg" alt="d741cdd721f25a01a8397.jpg"></span></p>
<p class="p3"><span class="s3"><br>
</span></p>
<p class="p3"><span class="s3"># 注意事项</span></p>
<ul class="ul1">
<li class="li5"><span class="s6"></span><span class="s3">Pin中浏览内置脚本时可能会报错，可以升级</span><span class="s4">最新版JSBox</span><span class="s3">。</span></li>
<li class="li5"><span class="s6"></span><span class="s3">一个文件夹内无法再嵌套一个文件夹</span></li>
<li class="li5"><span class="s6"></span><span class="s3">此脚本需ICloudDrive支持，请在设置里的iCloud中把JSBox的选项勾选</span></li>
<p class="p7"><span class="s4"><img src="https://i.loli.net/2017/12/31/5a4828a2649ff.jpg" alt="d741cdd721f25a01a8397.jpg"></span></p>
</ul>
<p class="p3"><span class="s3"><br>
</span></p>
<p class="p3"><span class="s3"># 写在最后</span></p>
<p class="p3"><span class="s3">其实，这个脚本的原身是</span><span class="s4">@JunM </span><span class="s3">的脚本</span><span class="s4">Fav</span><span class="s3">，写这个脚本的原因是为了弥补JSBox没有剪切板增强的不足，确实与Pin有所相似，但是它会持续更新，做出自己的特色。</span></p>
<p class="p3"><span class="s3"><br>
</span></p>
<p class="p3"><span class="s3">欢迎关注Telegram频道<a href="https://t.me/Flow_Script"><span class="s4">Flow/Script News</span></a>来获取最新脚本/规则</span></p>
<p class="p3"><span class="s3"><br>
</span></p>
<p class="p3"><span class="s3">作者：Hhdº</span></p>
<p class="p3"><span class="s3">邮箱：hehedahhd@icloud.com （有意见/建议或有哪里不懂可以给我发邮件）</span></p>
<p class="p3"><span class="s3"><br>
<button class="button" onclick="DS()">打赏</button>
<p class="p2"><span class="s2">   做脚本不易，求打赏我请我吃碗泡面🙏🏻</span></p>
</span></p>
<p class="p6"><span class="s3"></span><br></p>
<p class="p7"><span class="s7"></span><br></p>
<p class="p8"><span class="s3"></span><br></p>
<p class="p9"><span class="s8"></span><br></p>
<p class="p8"><span class="s3"></span><br></p>
</body>
<script>
function DS() {
  document.write("<img src='https://i.loli.net/2017/11/25/5a1900065267d.jpg' style='position:absolute; width:100%; top:0; left:0; '>")
}
</script>
</html>`

  $ui.push({
    props: {
      title: "F-Start使用向导"
    },
    views: [{
      type: "web",
      props: {
        html: html
      },
      layout: $layout.fill
    }]
  })
}

function Choose(BuiltIn) {
  $ui.push({
    props: {
      title: "内置项目"
    },
    views: [{
        type: "menu",
        props: {
          items: BuiltIn.map(function(item) {
            return item.title
          }),
        },
        layout: function(make) {
          make.left.top.right.equalTo(0)
          make.height.equalTo(44)

        },
        events: {
          changed: function(sender) {
            $("BuiltInList").scrollTo({
              indexPath: $indexPath(i, 0),
              animated: true
            })
          }
        }
      },
      {
        type: "list",
        props: {
          id: "BuiltInList"
        },
        layout: function(make) {
          make.top.equalTo($("menu").bottom)
          make.right.left.bottom.inset(0)
        },
        events: {
          didSelect(sender, indexPath, data) {
            $ui.pop()
            var info = BuiltIn[indexPath.section].events[indexPath.row]
            list = $("AddEventList").data
            list[1].rows[0].label.text = info.type
            $("AddEventList").data = list
            $("title").text = info.name
            $("code").text = info.mode
          }
        }
      }
    ]
  })

  var arr = new Array()
  for (i in BuiltIn) {
    arr.push({
      title: BuiltIn[i].title,
      rows: BuiltIn[i].events.map(function(item) {
        return item.name
      })
    })
  }
  $("BuiltInList").data = arr
}

function ThirdView() {
  $ui.render({
    props: {
      title: "设置"
    },
    views: [VIEW,
      {
        type: "view",
        views: [{
          type: "list",
          props: {
            id: "setlist",
            bgcolor: $color("white"),
            data: [{
                title: "通用",
                rows: [{
                    type: "view",
                    layout: $layout.fill,
                    views: [{
                        type: "label",
                        props: {
                          font: $font(16),
                          text: "主颜色"
                        },
                        layout: function(make, view) {
                          make.left.inset(15)
                          make.centerY.equalTo(view.super)
                        }
                      },
                      {
                        type: "tab",
                        props: {
                          items: ["默认色", "原谅绿", "基佬紫", "沉默黑", "优雅灰"],
                          tintColor: mainColor,
                          index: $cache.get("Color")[1]
                        },
                        layout: function(make, view) {
                          make.centerY.equalTo(view.super)
                          make.right.inset(10)
                        },
                        events: {
                          changed: function(sender) {
                            switch (sender.index) {
                              case 0:
                                $cache.set("Color", [$color("#157EFC"), sender.index])
                                break
                              case 1:
                                $cache.set("Color", [$color("green"), sender.index])
                                break
                              case 2:
                                $cache.set("Color", [$color("purple"), sender.index])
                                break
                              case 3:
                                $cache.set("Color", [$color("black"), sender.index])
                                break
                              case 4:
                                $cache.set("Color", [$color("gray"), sender.index])
                                break
                            }
                            $ui.alert({
                              title: "更换颜色需重新启动脚本",
                              actions: [{
                                title: "好的",
                                handler() {
                                  $app.close()
                                }
                              }]
                            })
                          }
                        }
                      },
                    ]
                  },
                  {
                    Title: {
                      text: "浏览器设置"
                    }
                  }
                ]
              },
              {
                title: "其他",
                rows: [{
                    Title: {
                      text: "F-Start 使用向导"
                    }
                  },
                  {
                    Title: {
                      text: "还原"
                    }
                  }
                ]
              }
            ],
            template: [{
                type: "label",
                props: {
                  id: "Title",
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
                    var Y = view.frame.height
                    ctx.strokeColor = $color("#C7C7CC")
                    ctx.moveToPoint(0, 0)
                    ctx.setLineWidth(2)
                    ctx.addLineToPoint(X, Y * 0.5)
                    ctx.addLineToPoint(0, Y)
                    ctx.strokePath()
                  }
                }
              }
            ],
            footer: {
              type: "label",
              props: {
                height: 20,
                text: "Made by Hhdº",
                textColor: $color("#AAAAAA"),
                align: $align.center,
                font: $font(12)
              }
            }
          },
          layout: function(make, view) {
            make.top.right.left.inset(0)
            make.bottom.equalTo($("SetMenu").top).offset(-1)
          },
          events: {
            didSelect: function(sender, indexPath, data) {
              switch (data.Title.text) {
                case "浏览器设置":
                  browser()
                  break
                case "F-Start 使用向导":
                  guide()
                  break
                case "还原":
                  reduction()
                  break
              }
            }
          }
        }],
        layout: function(make) {
          make.bottom.equalTo($("Rview").top)
          make.top.left.right.inset(0)
        }
      }
    ]
  })
  ChangeColor($("B3"), 2)
  $delay(0.1, function() {
    $ui.window.super.super.super.views[1].views[0].bgcolor = mainColor
  })
}

function ChangeColor(sd, num) {
  $("B1").icon = $icon(iconType[0], $color("#a4b4c4"), $size(30, 30))
  $("B3").icon = $icon(iconType[2], $color("#a4b4c4"), $size(30, 30))
  sd.icon = $icon(iconType[num], mainColor, $size(30, 30))
}

const browsers = [{
  name: "Chrome",
  id: "10000"
}, {
  name: "UC",
  id: "10001"
}, {
  name: "Firefox",
  id: "10002"
}, {
  name: "QQ",
  id: "10003"
}, {
  name: "Opera",
  id: "10004"
}, {
  name: "Quark",
  id: "10005"
}, {
  name: "iCab",
  id: "10006"
}, {
  name: "Maxthon",
  id: "10007"
}, {
  name: "Dolphin",
  id: "10008"
}, {
  name: "2345",
  id: "10009"
}, {
  name: "Safari",
  id: "23333"
}]
browserTip = "当项目不选择“在脚本中打开”时，会自动从勾选的浏览器中打开"

function browser() {
  $ui.push({
    props: {
      title: "浏览器设置"
    },
    views: [{
      type: "list",
      props: {
        data: [{
          title: browserTip,
          rows: browsers.map(function(item) {
            if (item.name == $cache.get("browser")[0]) {
              return {
                title: {
                  text: item.name
                },
                id: item.id
              }
            } else {
              return {
                title: {
                  text: item.name
                },
                canvas: {
                  alpha: 0
                },
                id: item.id
              }
            }
          })
        }],
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
              make.width.equalTo(13)
              make.height.equalTo(10)
            },
            events: {
              draw: function(view, ctx) {
                var X = view.frame.width
                var Y = view.frame.height
                ctx.strokeColor = $color("#E24939")
                ctx.moveToPoint(X, 0)
                ctx.setLineWidth(2)
                ctx.addLineToPoint(X / 3 - 2, Y)
                ctx.addLineToPoint(0, Y * 0.3)
                ctx.strokePath()
              }
            }
          }
        ],
        footer: {
          type: "label",
          props: {
            height: 40,
            text: "由于各浏览器频繁改动其接口，上述浏览器并不保证能正确运行。\n若接口失效，则会跳转到Safari。",
            textColor: $color("#AAAAAA"),
            align: $align.center,
            font: $font(12),
            lines: 0
          }
        }
      },
      layout: $layout.fill,
      events: {
        didSelect(sender, indexPath, data) {
          sender.data = [{
            title: browserTip,
            rows: browsers.map(function(item) {
              return {
                title: {
                  text: item.name
                },
                canvas: {
                  alpha: 0
                }
              }
            })
          }]
          var list = sender.data
          list[0].rows[indexPath.row].canvas.alpha = 100
          sender.data = list
          $cache.set("browser", [data.title.text, data.id])
        }
      }
    }]
  })
}

function reduction() {
  $ui.push({
    props: {
      title: "还原"
    },
    views: [{
      type: "list",
      props: {
        data: [{
            title: " ",
            rows: [{
              title: {
                text: "还原所有设置"
              }
            }]
          },
          {
            rows: [{
              title: {
                text: "还原所有设置并抹除数据"
              }
            }]
          }
        ],
        template: [{
          type: "label",
          props: {
            id: "title",
            font: $font(16),
            textColor: $color("#157EFC")
          },
          layout: function(make, view) {
            make.left.inset(15)
            make.centerY.equalTo(view.super)
          }
        }]
      },
      layout: $layout.fill,
      events: {
        didSelect: function(sender, indexPath, data) {
          $ui.alert({
            title: "确定" + data.title.text + "吗？",
            actions: [{
                title: "确定",
                handler: function() {
                  switch (indexPath.section) {
                    case 0:
                      $cache.clear()
                      break
                    case 1:
                      $cache.clear()
                      $drive.delete("FStart.txt")
                      break
                  }
                  $ui.alert({
                    title: "还原完成，需重启脚本",
                    actions: [{
                      title: "好的",
                      handler() {
                        $app.close()
                      }
                    }]
                  })
                }
              },
              {
                title: "取消",
                style: "Cancel"
              }
            ]
          })
        }
      }
    }]
  })
}