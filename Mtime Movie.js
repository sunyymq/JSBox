const ON_SCREEN = 0,
  COMING_SOON = 1,
  FAVORITED = 0,
  CHECKED = 1,
  LOCAL = "mtime/",
  ICLOUD = "drive://mtime/"

const DEFAULT_SETTING = [
  ["160X90X2", 0, 15, false, 290, "tint"],
  [LOCAL]
]

const DEFAULT_FAVORITE = {
  FAVORITED: [],
  CHECKED: []
}

const DEFAULT_FAVORITE_SEARCH = [{
    title: "Favorite",
    rows: []
  },
  {
    title: "Checked",
    rows: []
  }
]

// Caculate TabBar Height for iPhone X
const TABBAR_HEIGHT = calTabBarHeight()

const MENU = {
  COVER_IMAGE_QUALITY: [{
      "name": "Small",
      "value": "80X45X2"
    },
    {
      "name": "Medium",
      "value": "160X90X2"
    },
    {
      "name": "Large",
      "value": "320X180X2"
    }
  ],
  RECENT_MAIN_INDEX: [{
      "name": "On Screen",
      "value": 0
    },
    {
      "name": "Coming Soon",
      "value": 1
    }
  ],
  THEME_COLOR: [{
      "name": "Follow App Theme",
      "value": "tint"
    },
    {
      "name": "Gray Theme",
      "value": "darkGray"
    }
  ],
  SAVING_PATH: [{
      "name": "Local",
      "value": "mtime/"
    },
    {
      "name": "iCloud",
      "value": "drive://mtime/"
    }
  ]
}

// Template Object
const template = [{
    type: "image",
    props: {
      id: "cover",
      radius: 5
    },
    layout: function(make) {
      make.width.equalTo(75)
      make.top.bottom.inset(5)
      make.left.inset(15)
    }
  },
  {
    type: "label",
    props: {
      id: "title",
      font: $font("bold", 18),
      autoFontSize: true
    },
    layout: function(make) {
      var preView = $("cover")
      make.left.equalTo(preView.right).offset(10)
      make.height.equalTo(18)
      make.top.inset(8)
      make.right.inset(5)
    }
  },
  {
    type: "label",
    props: {
      id: "genres",
      font: $font(12),
      bgcolor: $color("#F5F5F5"),
      textColor: $color("darkGray"),
      radius: 2
    },
    layout: function(make) {
      var preView = $("title")
      make.top.equalTo(preView.bottom).offset(5)
      make.height.equalTo(20)
      make.left.equalTo(preView.left)
    }
  },
  {
    type: "label",
    props: {
      id: "director",
      font: $font(12),
      textColor: $color("darkGray")
    },
    layout: function(make) {
      var preView = $("genres")
      make.top.equalTo(preView.bottom).offset(5)
      make.left.equalTo(preView.left)
      make.right.inset(5)
    }
  },
  {
    type: "label",
    props: {
      id: "cast",
      font: $font(12),
      textColor: $color("darkGray")
    },
    layout: function(make) {
      var preView = $("director")
      make.top.equalTo(preView.bottom).offset(5)
      make.left.equalTo(preView.left)
      make.right.inset(5)
    }
  },
  {
    type: "label",
    props: {
      id: "info",
      font: $font(12),
      textColor: $color("darkGray")
    },
    layout: function(make) {
      var preView = $("cast")
      make.top.equalTo(preView.bottom).offset(5)
      make.left.equalTo(preView.left)
      make.right.inset(5)
    }
  },
]

// Read Setting
var SETTING
// Try Local
var file = $file.read(LOCAL + "Setting.conf")
if (typeof(file) == "undefined") {
  // Try iCloud
  file = $file.read(ICLOUD + "Setting.conf")
  if (typeof(file) == "undefined") {
    SETTING = 0
  } else {
    SETTING = 1
  }
} else {
  SETTING = 1
}
var SETTING_FILE = SETTING ? JSON.parse(file.string) : JSON.parse(JSON.stringify(DEFAULT_SETTING))

// Read Favorite
var FAVORITE
// Try Local
var file = $file.read(LOCAL + "Favorite.conf")
if (typeof(file) == "undefined") {
  // Try iCloud
  file = $file.read(ICLOUD + "Favorite.conf")
  if (typeof(file) == "undefined") {
    FAVORITE = 0
  } else {
    FAVORITE = 1
  }
} else {
  FAVORITE = 1
}
var FAVORITE_FILE = FAVORITE ? JSON.parse(file.string) : JSON.parse(JSON.stringify(DEFAULT_FAVORITE))

// Global Variable
var RAW_DATA = []

if (!$file.exists(SETTING_FILE[1][0])) {
  $file.mkdir(SETTING_FILE[1][0])
}

Array.prototype.move = function(from, to) {
  var cellData = this[from]
  this.splice(from, 1)
  this.splice(to, 0, cellData)
}

Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }
  return fmt
}

/* Function */
function calTabBarHeight() {
  var model = $device.info.model
  if (model == "iPhone10,3" || model == "iPhone10,6") {
    var TABbarVC = $objc("UIApplication").invoke("sharedApplication").invoke("keyWindow").invoke("rootViewController")
    var TABbarIndex = TABbarVC.invoke("selectedIndex")
    return TABbarIndex == 0 ? 70 : 50
  }

  return 50
}

function generateMainViewObjects() {
  recent = {
    type: "view",
    props: {
      id: "recent",
      info: "recent",
      hidden: false
    },
    layout: $layout.fill,
    views: [{
        type: "menu",
        props: {
          id: "recent_bar",
          index: SETTING_FILE[0][1],
          items: ["On Screen", "Coming Soon", "Search"],
          tintColor: $color("darkGray")
        },
        layout: function(make) {
          make.height.equalTo(40)
          make.left.top.right.inset(0)
        },
        events: {
          changed: function(sender) {
            $("onscreen").hidden = true
            $("comingsoon").hidden = true
            $("recent_search").hidden = true
            var idx = sender.index
            if (idx == ON_SCREEN) {
              $("onscreen").hidden = false
            } else if (idx == COMING_SOON) {
              $("comingsoon").hidden = false
            } else {
              $("recent_search").hidden = false
            }
          }
        }
      },
      {
        type: "view",
        props: {
          id: "recent_list",
          info: "recent_list"
        },
        layout: function(make) {
          var preView = $("recent_bar")
          make.top.equalTo(preView.bottom)
          make.left.bottom.right.inset(0)
        },
        views: [{
            type: "list",
            props: {
              id: "onscreen",
              info: 0,
              hidden: true,
              rowHeight: 115,
              bgcolor: $color("#F9F9F9"),
              data: [],
              template: template,
              footer: {
                type: "view",
                props: {
                  height: 60
                },
                views: [{
                  type: "label",
                  props: {
                    id: "onscreen_page",
                    font: $font(12),
                    align: $align.center,
                    textColor: $color("#AAAAAA")
                  },
                  layout: function(make, view) {
                    make.height.equalTo(20)
                    make.centerX.equalTo(view.super)
                    make.top.inset(10)
                  }
                }]
              },
              actions: [{
                title: "Favorite",
                handler: function(sender, indexPath) {
                  var data = sender.object(indexPath)
                  if (unique(data.id)) {
                    favoriteItem(data)
                  } else {
                    $ui.error("You have favorited already")
                  }
                }
              }]
            },
            layout: $layout.fill,
            events: {
              didSelect: function(sender, indexPath, data) {
                handleSelected(data)
              },
              pulled: function(sender) {
                fetchDataOnScreen(true)
              },
              didReachBottom: function(sneder) {
                $device.taptic(0)
                var start = $("onscreen").info
                loadDataOnScreen(start)
              }
            }
          },
          {
            type: "list",
            props: {
              id: "comingsoon",
              info: 0,
              hidden: true,
              rowHeight: 115,
              stickyHeader: true,
              bgcolor: $color("#F9F9F9"),
              data: [{
                title: "",
                rows: []
              }],
              template: template,
              footer: {
                type: "view",
                props: {
                  height: 60
                },
                views: [{
                  type: "label",
                  props: {
                    id: "comingsoon_page",
                    font: $font(12),
                    align: $align.center,
                    textColor: $color("#AAAAAA")
                  },
                  layout: function(make, view) {
                    make.height.equalTo(20)
                    make.centerX.equalTo(view.super)
                    make.top.inset(10)
                  }
                }]
              },
              actions: [{
                title: "Favorite",
                handler: function(sender, indexPath) {
                  var data = sender.object(indexPath)
                  if (unique(data.id)) {
                    favoriteItem(data)
                  } else {
                    $ui.error("You have favorited already")
                  }
                }
              }]
            },
            layout: $layout.fill,
            events: {
              didSelect: function(sender, indexPath, data) {
                handleSelected(data)
              },
              pulled: function(sender) {
                fetchDataComingSoon(true)
              },
              didReachBottom: function(sneder) {
                $device.taptic(0)
                var start = $("comingsoon").info
                loadDataComingSoon(start)
              }
            }
          },
          {
            type: "list",
            props: {
              id: "recent_search",
              info: "search",
              hidden: true,
              rowHeight: 115,
              bgcolor: $color("#F9F9F9"),
              data: [],
              template: template,
              header: {
                type: "view",
                props: {
                  height: 40
                },
                views: [{
                  type: "input",
                  props: {
                    id: "recent_keyword",
                    placeholder: "Search Online ...",
                    textColor: $color("darkGray")
                  },
                  layout: function(make) {
                    make.left.right.inset(10)
                    make.top.bottom.inset(5)
                  },
                  events: {
                    returned: function(sender) {
                      sender.blur()
                      if (sender.text != "") {
                        fetchDataQuery(sender.text)
                      }
                    },
                    didBeginEditing: function(sender) {
                      sender.runtimeValue().invoke("selectAll")
                    }
                  }
                }]
              },
              actions: [{
                title: "Favorite",
                handler: function(sender, indexPath) {
                  var data = sender.object(indexPath)
                  if (unique(data.id)) {
                    favoriteItem(data)
                  } else {
                    $ui.error("You have favorited already")
                  }
                }
              }]
            },
            layout: $layout.fill,
            events: {
              didSelect: function(sender, indexPath, data) {
                handleSelected(data)
              },
              didEndScrollingAnimation: function(sender) {
                // For focus() To Top
                $ui.animate({
                  duration: 0.2,
                  animation: function() {
                    sender.contentOffset = $point(0, 0)
                  }
                })
              }
            }
          }
        ]
      }
    ]
  }

  // Favorite View Object
  favorite = {
    type: "view",
    props: {
      id: "favorite",
      info: "favorite",
      hidden: true
    },
    layout: $layout.fill,
    views: [{
        type: "menu",
        props: {
          id: "favorite_bar",
          items: ["Favorited", "Checked", "Search"],
          tintColor: $color("darkGray")
        },
        layout: function(make) {
          make.height.equalTo(40)
          make.left.top.right.inset(0)
        },
        events: {
          changed: function(sender) {
            $("favorited").hidden = true
            $("checked").hidden = true
            $("favorite_search").hidden = true
            var idx = sender.index
            if (idx == FAVORITED) {
              $("favorited").hidden = false
            } else if (idx == CHECKED) {
              $("checked").hidden = false
            } else {
              $("favorite_search").hidden = false
            }
          }
        }
      },
      {
        type: "view",
        props: {
          id: "favorite_list",
          info: "favorite_list"
        },
        layout: function(make) {
          var preView = $("favorite_bar")
          make.top.equalTo(preView.bottom)
          make.left.bottom.right.inset(0)
        },
        views: [{
            type: "list",
            props: {
              id: "favorited",
              hidden: false,
              rowHeight: 115,
              reorder: true,
              stickyHeader: true,
              data: FAVORITE_FILE.FAVORITED,
              template: template,
              footer: {
                props: {
                  height: 0.1
                }
              },
              actions: [{
                  title: "Check",
                  handler: function(sender, indexPath) {
                    var data = sender.object(indexPath)
                    favoriteCheckUncheck(data, indexPath, "FAVORITED", "CHECKED")
                  }
                },
                {
                  title: "delete",
                  handler: function(sender, indexPath) {
                    favoriteItemDelete("FAVORITED", indexPath.row)
                  }
                }
              ]
            },
            layout: $layout.fill,
            events: {
              didSelect: function(sender, indexPath, data) {
                handleSelected(data, false)
              },
              reorderMoved: function(from, to) {
                FAVORITE_FILE.FAVORITED.move(from.row, to.row)
              },
              reorderFinished: function() {
                saveFavorite(FAVORITE_FILE)
              }
            }
          },
          {
            type: "list",
            props: {
              id: "checked",
              hidden: true,
              rowHeight: 115,
              reorder: true,
              stickyHeader: true,
              data: FAVORITE_FILE.CHECKED,
              template: template,
              footer: {
                props: {
                  height: 0.1
                }
              },
              actions: [{
                  title: "Uncheck",
                  handler: function(sender, indexPath) {
                    var data = sender.object(indexPath)
                    favoriteCheckUncheck(data, indexPath, "CHECKED", "FAVORITED")
                  }
                },
                {
                  title: "delete",
                  handler: function(sender, indexPath) {
                    favoriteItemDelete("CHECKED", indexPath.row)
                  }
                }
              ]
            },
            layout: $layout.fill,
            events: {
              didSelect: function(sender, indexPath, data) {
                handleSelected(data, false)
              },
              reorderMoved: function(from, to) {
                FAVORITE_FILE.CHECKED.move(from.row, to.row)
              },
              reorderFinished: function() {
                saveFavorite(FAVORITE_FILE)
              }
            }
          },
          {
            type: "list",
            props: {
              id: "favorite_search",
              info: "search",
              hidden: true,
              rowHeight: 115,
              stickyHeader: true,
              bgcolor: $color("#F9F9F9"),
              template: template,
              header: {
                type: "view",
                props: {
                  height: 40
                },
                views: [{
                  type: "input",
                  props: {
                    id: "favorite_keyword",
                    placeholder: "Search Locally ...",
                    textColor: $color("darkGray")
                  },
                  layout: function(make) {
                    make.left.right.inset(10)
                    make.top.bottom.inset(5)
                  },
                  events: {
                    returned: function(sender) {
                      sender.blur()
                      if (sender.text != "") {
                        findFavorite(sender.text)
                      }
                    },
                    didBeginEditing: function(sender) {
                      sender.runtimeValue().invoke("selectAll")
                    }
                  }
                }]
              },
              actions: [{
                title: "Locate",
                handler: function(sender, indexPath) {
                  var data = sender.object(indexPath)
                  locateFavorite(indexPath, data)
                }
              }]
            },
            layout: $layout.fill,
            events: {
              didSelect: function(sender, indexPath, data) {
                handleSelected(data, false)
              },
              didEndScrollingAnimation: function(sender) {
                // For focus() To Top
                $ui.animate({
                  duration: 0.2,
                  animation: function() {
                    sender.contentOffset = $point(0, 0)
                  }
                })
              }
            }
          }
        ]
      }
    ]
  }

  // Setting View Object
  setting = {
    type: "list",
    props: {
      id: "setting",
      info: "setting",
      hidden: true,
      showsVerticalIndicator: false,
      data: [{
          title: "General",
          rows: [{
              setup: {
                text: "Cover Image Quality"
              },
              value: {
                text: MENU.COVER_IMAGE_QUALITY.filter(function(x) {
                  return SETTING_FILE[0][0] == x.value
                })[0].name
              }
            },
            {
              setup: {
                text: "Recent Main Index"
              },
              value: {
                text: MENU.RECENT_MAIN_INDEX.filter(function(x) {
                  return SETTING_FILE[0][1] == x.value
                })[0].name
              }
            },
            {
              type: "views",
              layout: $layout.fill,
              views: [{
                  type: "label",
                  props: {
                    text: "Image Per Page",
                    textColor: $color("darkGray")
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.left.inset(15)
                  }
                },
                {
                  type: "stepper",
                  props: {
                    min: 10,
                    value: SETTING_FILE[0][2],
                    tintColor: $color(SETTING_FILE[0][5])
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.right.inset(15)
                  },
                  events: {
                    changed: function(sender) {
                      sender.next.text = sender.value
                      saveSetting(0, 2, sender.value)
                    }
                  }
                },
                {
                  type: "label",
                  props: {
                    text: SETTING_FILE[0][2].toString(),
                    color: $color(SETTING_FILE[0][5])
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.right.equalTo(view.prev.left).offset(-10)
                  }
                }
              ]
            },
            {
              type: "views",
              layout: $layout.fill,
              views: [{
                  type: "label",
                  props: {
                    text: "Cache Query Results",
                    textColor: $color("darkGray")
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.left.inset(15)
                  }
                },
                {
                  type: "switch",
                  props: {
                    on: SETTING_FILE[0][3],
                    onColor: $color(SETTING_FILE[0][5])
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.right.inset(15)
                  },
                  events: {
                    changed: function(sender) {
                      $cache.clear()
                      saveSetting(0, 3, sender.on)
                    }
                  }
                }
              ]
            },
            {
              setup: {
                text: "Update Location"
              }
            },
            {
              setup: {
                text: "Theme Color"
              }
            },
            {
              setup: {
                text: "Clear Cache"
              }
            },
            {
              setup: {
                text: "Reset"
              }
            }
          ]
        },
        {
          title: "Favorite",
          rows: [{
              setup: {
                text: "Saving Path"
              },
              value: {
                text: MENU.SAVING_PATH.filter(function(x) {
                  return SETTING_FILE[1][0] == x.value
                })[0].name
              }
            },
            {
              setup: {
                text: "Update Cover Image"
              }
            }
          ]
        },
        {
          title: "About",
          rows: [{
              setup: {
                text: "Website"
              }
            },
            {
              setup: {
                text: "How To Use"
              }
            }
          ]
        }
      ],
      template: {
        props: {
          accessoryType: 1
        },
        views: [{
            type: "label",
            props: {
              id: "setup",
              textColor: $color("darkGray")
            },
            layout: function(make, view) {
              make.centerY.equalTo(view.super)
              make.left.inset(15)
            }
          },
          {
            type: "label",
            props: {
              id: "value",
              textColor: $color(SETTING_FILE[0][5])
            },
            layout: function(make, view) {
              make.centerY.equalTo(view.super)
              make.right.inset(0)
            }
          }
        ]
      },
      footer: {
        type: "view",
        props: {
          height: 50
        },
        views: [{
          type: "label",
          props: {
            text: "Created by RYAN.\nSource from ©Mtime (Unofficial)",
            lines: 0,
            font: $font(12),
            textColor: $color("#AAAAAA"),
            align: $align.center
          },
          layout: function(make) {
            make.left.top.right.inset(0)
          }
        }]
      }
    },
    layout: $layout.fill,
    events: {
      didSelect: function(view, indexPath) {
        activeSettingMenu(indexPath)
      }
    }
  }
}

function generateDetailViewData(actors, data) {
  var d = [{
      title: "Basic Info",
      rows: [{
        type: "view",
        layout: $layout.fill,
        views: [{
            // Title
            type: "label",
            props: {
              font: $font("bold", 18),
              text: data.name
            },
            layout: function(make) {
              make.height.equalTo(18)
              make.top.left.inset(10)
            }
          },
          {
            // Original Title
            type: "label",
            props: {
              font: $font("bold", 13),
              autoFontSize: true,
              text: data.nameEn
            },
            layout: function(make, view) {
              var preView = view.prev
              make.top.equalTo(preView.bottom)
              make.left.right.inset(10)
            }
          },
          {
            // Genres
            type: "label",
            props: {
              font: $font(12),
              bgcolor: $color("#F5F5F5"),
              textColor: $color("darkGray"),
              radius: 2,
              text: " " + (data.type.join(" | ") || "无") + " "
            },
            layout: function(make, view) {
              var preView = view.prev
              make.top.equalTo(preView.bottom).offset(5)
              make.height.equalTo(20)
              make.left.inset(10)
            }
          },
          {
            // Director
            type: "label",
            props: {
              font: $font(12),
              textColor: $color("darkGray"),
              text: "导演: " + (data.director.name || "无")
            },
            layout: function(make, view) {
              var preView = view.prev
              make.top.equalTo(preView.bottom).offset(5)
              make.left.right.inset(10)
            }
          },
          {
            // Cast
            type: "label",
            props: {
              font: $font(12),
              lines: 0,
              textColor: $color("darkGray"),
              text: "主演: " + (actors.join(" | ") || "无")
            },
            layout: function(make, view) {
              var preView = view.prev
              make.top.equalTo(preView.bottom).offset(5)
              make.left.right.inset(10)
            }
          },
          {
            // info
            type: "label",
            props: {
              font: $font(12),
              textColor: $color("darkGray"),
              text: "影讯: " + ([data.mins, data.releaseDate].filter(function(text) { return text != "" }).map(function(text) { return text.replace(/(\d{4})(\d{2})(\d{2})/g, "$1年$2月$3日上映") }).join(" - ") || "无")
            },
            layout: function(make, view) {
              var preView = view.prev
              make.top.equalTo(preView.bottom).offset(5)
              make.left.right.inset(10)
            }
          }
        ]
      }]
    },
    {
      title: "Summary",
      rows: [{
        type: "text",
        props: {
          editable: false,
          selectable: false,
          scrollEnabled: false,
          font: $font(15),
          textColor: $color("darkGray"),
          text: data.story
        },
        layout: $layout.fill
      }]
    },
    {
      title: "Gallery",
      rows: [{
        type: "gallery",
        props: {
          items: data.stageImg.list.map(function(d) {
            var cell = {
              type: "image",
              props: {
                src: d.imgUrl
              }
            }
            return cell
          })
        },
        layout: $layout.fill,
        events: {
          longPressed: function() {
            $device.taptic(1)
            $quicklook.open({
              list: data.stageImg.list.map(function(d) {
                return d.imgUrl
              })
            })
          }
        }
      }]
    }
  ]

  if (!data.story) {
    d.splice(1, 2)
  } else if (data.stageImg.list.length == 0) {
    d.splice(2, 1)
  }
  return d
}

function mainView() {
  $ui.render({
    props: {
      title: "Movie List"
    },
    views: [{
        type: "matrix",
        props: {
          id: "menu",
          itemHeight: 50,
          columns: 3,
          spacing: 0,
          scrollEnabled: false,
          selectable: false,
          //bgcolor: $rgb(247, 247, 247),
          template: [{
              // Button Image
              type: "image",
              props: {
                id: "menu_image",
                bgcolor: $color("clear")
              },
              layout: function(make, view) {
                make.centerX.equalTo(view.super)
                make.width.height.equalTo(25)
                make.top.inset(7)
              },
            },
            {
              type: "label",
              props: {
                id: "menu_label",
                font: $font(10),
                textColor: $color("lightGray")
              },
              layout: function(make, view) {
                var preView = view.prev
                make.centerX.equalTo(preView)
                make.top.equalTo(preView.bottom).offset(1)
              }
            }
          ],
          data: [{
              menu_image: {
                icon: $icon("067", $color("clear"), $size(72, 72)),
                tintColor: $color(SETTING_FILE[0][5])
              },
              menu_label: {
                text: "Recent",
                textColor: $color(SETTING_FILE[0][5])
              }
            },
            {
              menu_image: {
                icon: $icon("061", $color("clear"), $size(72, 72)),
                tintColor: $color("lightGray")
              },
              menu_label: {
                text: "Favorite"
              }
            },
            {
              menu_image: {
                icon: $icon("002", $color("clear"), $size(72, 72)),
                tintColor: $color("lightGray")
              },
              menu_label: {
                text: "Setting"
              }
            }
          ]
        },
        layout: function(make, view) {
          make.height.equalTo(TABBAR_HEIGHT)
          make.left.bottom.right.inset(0)
        },
        events: {
          didSelect: function(sender, indexPath) {
            activeMenu(indexPath.row)
          },
          longPressed: function(sender) {
            var width = sender.sender.frame.width / 3
            var x = sender.location.runtimeValue().invoke("CGPointValue").x
            var row = Math.floor(x / width)
            activeSegment(row)
          }
        }
      },
      {
        type: "canvas",
        layout: function(make, view) {
          var preView = view.prev
          make.top.equalTo(preView.top)
          make.height.equalTo(1)
          make.left.right.inset(0)
        },
        events: {
          draw: function(view, ctx) {
            var width = view.frame.width
            var scale = $device.info.screen.scale
            ctx.strokeColor = $color("gray")
            // $rgb(211, 211, 211)
            ctx.setLineWidth(1 / scale)
            ctx.moveToPoint(0, 0)
            ctx.addLineToPoint(width, 0)
            ctx.strokePath()
          }
        }
      },
      {
        type: "view",
        props: {
          id: "content"
        },
        layout: function(make) {
          var preView = $("menu")
          make.bottom.equalTo(preView.top)
          make.left.top.right.inset(0)
        },
        views: [recent, favorite, setting]
      }
    ]
  })
}

function detailView(title, data, cellData, showFavorite = false) {
  var actors = data.actors.filter(function(x) { return x.name != "" }).map(function(x) { return x.name })
  $ui.push({
    props: {
      title: title
    },
    views: [{
        // In order to generate rowHeight
        type: "text",
        props: {
          hidden: true,
          id: "summary",
          font: $font(15),
          text: data.story
        },
        layout: $layout.fill
      },
      {
        // In order to generate rowHeight
        type: "text",
        props: {
          hidden: true,
          id: "actor",
          font: $font(12),
          text: "主演: " + actors.join(" | ")
        },
        layout: $layout.fill
      },
      {
        type: "list",
        props: {
          id: "detail",
          bounces: false,
          showsVerticalIndicator: false,
          data: generateDetailViewData(actors, data),
          header: {
            type: "view",
            props: {
              // Cover Image
              height: 280 + 20
            },
            views: [{
                type: "image",
                props: {
                  src: data.img
                },
                layout: function(make) {
                  make.height.equalTo(155)
                  make.left.top.right.inset(0)
                }
              },
              {
                type: "blur",
                props: {
                  style: 1
                },
                layout: function(make, view) {
                  var pre = view.prev
                  make.height.equalTo(pre)
                  make.left.top.right.inset(0)
                }
              },
              {
                type: "canvas",
                layout: function(make, view) {
                  var pre = view.prev
                  make.bottom.equalTo(pre.bottom)
                  make.height.equalTo(15)
                  make.left.right.inset(0)
                },
                events: {
                  draw: function(view, ctx) {
                    var width = view.frame.width
                    var height = view.frame.height
                    // Back
                    ctx.fillColor = $color("#F9F9F9")
                    ctx.setAlpha(0.3)
                    ctx.moveToPoint(0, height)
                    ctx.addLineToPoint(0, height * 0.75)
                    ctx.addQuadCurveToPoint(width * 0.6, 0, width, height * 0.5)
                    ctx.addLineToPoint(width, height)
                    ctx.fillPath()

                    // Front
                    ctx.fillColor = $color("#F9F9F9")
                    ctx.setAlpha(1)
                    ctx.moveToPoint(0, height)
                    ctx.addQuadCurveToPoint(width * 0.5, 0, width, height)

                    ctx.fillPath()
                  }
                }
              },
              {
                type: "image",
                props: {
                  radius: 5,
                  src: data.img
                },
                layout: function(make, view) {
                  make.centerX.equalTo(view.super).offset(-60)
                  make.width.equalTo(200)
                  make.top.inset(20)
                  make.bottom.inset(0)
                }
              },
              {
                type: "view",
                props: {
                  radius: 5,
                  alpha: 0.8,
                  bgcolor: $color("white")
                },
                layout: function(make, view) {
                  var preView = view.prev
                  make.left.equalTo(preView.right).offset(20)
                  make.width.height.equalTo(100)
                  make.top.inset(30)
                },
                views: [{
                    // Average Rate
                    type: "label",
                    props: {
                      id: "rate",
                      font: $font(45),
                      autoFontSize: true,
                      align: $align.center,
                      textColor: $color("darkGray")
                    },
                    layout: function(make, view) {
                      make.centerX.equalTo(view.super)
                      make.width.height.equalTo(50)
                      make.top.inset(10)
                    }
                  },
                  {
                    type: "label",
                    props: {
                      font: $font("bold", 16),
                      autoFontSize: true,
                      align: $align.center,
                      textColor: data.isEggHunt ? $color("#729C31") : $color("lightGray"),
                      text: data.isEggHunt ? "有彩蛋" : "无彩蛋"
                    },
                    layout: function(make, view) {
                      var preView = view.prev
                      make.centerX.equalTo(view.super)
                      make.top.equalTo(preView.bottom).offset(5)
                    }
                  }
                ]
              },
              {
                // Open
                type: "button",
                props: {
                  radius: 5,
                  bgcolor: $color("white")
                },
                layout: function(make, view) {
                  var preView = view.prev
                  make.centerX.equalTo(preView)
                  make.top.equalTo(preView.bottom).offset(40)
                  make.size.equalTo($size(100, 30))
                },
                views: [{
                    type: "image",
                    props: {
                      icon: $icon("042", $color("lightGray"), $size(72, 72)),
                      bgcolor: $color("clear")
                    },
                    layout: function(make, view) {
                      make.centerY.equalTo(view.super)
                      make.width.height.equalTo(16)
                      make.left.inset(10)
                    }
                  },
                  {
                    type: "label",
                    props: {
                      text: "Open",
                      font: $font("bold", 14),
                      autoFontSize: true,
                      align: true,
                      textColor: $color("lightGray")
                    },
                    layout: function(make, view) {
                      var preView = view.prev
                      make.centerY.equalTo(view.super)
                      make.left.equalTo(preView.right).offset(10)
                      make.right.inset(10)
                    }
                  }
                ],
                events: {
                  tapped: function(sender) {
                    $safari.open({
                      url: "https://m.mtime.cn/#!/movie/" + cellData.id + "/"
                    })
                  }
                }
              },
              {
                // Share
                type: "button",
                props: {
                  radius: 5,
                  bgcolor: $color("white")
                },
                layout: function(make, view) {
                  var preView = view.prev
                  make.centerX.equalTo(preView)
                  make.top.equalTo(preView.bottom).offset(10)
                  make.size.equalTo($size(100, 30))
                },
                views: [{
                    type: "image",
                    props: {
                      icon: $icon("022", $color("lightGray"), $size(72, 72)),
                      bgcolor: $color("clear")
                    },
                    layout: function(make, view) {
                      make.centerY.equalTo(view.super)
                      make.width.height.equalTo(16)
                      make.left.inset(10)
                    }
                  },
                  {
                    type: "label",
                    props: {
                      text: "Share",
                      font: $font("bold", 14),
                      autoFontSize: true,
                      align: true,
                      textColor: $color("lightGray")
                    },
                    layout: function(make, view) {
                      var preView = view.prev
                      make.centerY.equalTo(view.super)
                      make.left.equalTo(preView.right).offset(10)
                      make.right.inset(10)
                    }
                  }
                ],
                events: {
                  tapped: function(sender) {
                    $delay(0.1, function() {
                      $quicklook.open({
                        list: [$("detail").snapshot.png,
                          $data({ string: "https://m.mtime.cn/#!/movie/" + cellData.id + "/" }),
                          $data({ string: cellData.id })
                        ]
                      })
                    })
                  }
                }
              },
              {
                // Favorite
                type: "button",
                props: {
                  radius: 5,
                  bgcolor: $color("white"),
                  hidden: !showFavorite
                },
                layout: function(make, view) {
                  var preView = view.prev
                  make.centerX.equalTo(preView)
                  make.top.equalTo(preView.bottom).offset(10)
                  make.size.equalTo($size(100, 30))
                },
                views: [{
                    type: "image",
                    props: {
                      icon: $icon("061", $color("lightGray"), $size(72, 72)),
                      bgcolor: $color("clear")
                    },
                    layout: function(make, view) {
                      make.centerY.equalTo(view.super)
                      make.width.height.equalTo(16)
                      make.left.inset(10)
                    }
                  },
                  {
                    type: "label",
                    props: {
                      text: "Favorite",
                      font: $font("bold", 14),
                      autoFontSize: true,
                      align: true,
                      textColor: $color("lightGray")
                    },
                    layout: function(make, view) {
                      var preView = view.prev
                      make.centerY.equalTo(view.super)
                      make.left.equalTo(preView.right).offset(10)
                      make.right.inset(10)
                    }
                  }
                ],
                events: {
                  tapped: function(sender) {
                    if (unique(cellData.id)) {
                      favoriteItem(cellData)
                    } else {
                      $ui.error("You have favorited already")
                    }
                  }
                }
              }
            ]
          },
          footer: {
            type: "view",
            props: {
              height: 50
            },
            views: [{
              type: "label",
              props: {
                text: "Source from ©Mtime (Unofficial)",
                font: $font(12),
                textColor: $color("#AAAAAA"),
                align: $align.center
              },
              layout: function(make) {
                make.left.top.right.inset(10)
              }
            }]
          }
        },
        layout: $layout.fill,
        events: {
          rowHeight: function(sender, indexPath) {
            if (indexPath.section == 0) {
              return 90 + $("actor").contentSize.height + (data.nameEn ? 15 : 0)
            } else if (indexPath.section == 1) {
              return 1 + $("summary").contentSize.height
            } else {
              return 250
            }
          }
        }
      }
    ]
  })

  // Set Rate
  rate(data.overallRating == -1 ? 0.0 : data.overallRating)
}

function handleSelected(raw, button = true) {
  $ui.loading(true)
  var title = raw.title.text
  var url = "https://ticket-api-m.mtime.cn/movie/detail.api?locationId=" + SETTING_FILE[0][4] + "&movieId=" + raw.id
  $http.get({
    url: url,
    handler: function(resp) {
      $ui.loading(false)
      detailView(title, resp.data.data.basic, raw, button)
    }
  })
}

function activeMenu(index) {
  const trans = ["recent", "favorite", "setting"]
  var dstViewId = trans[index]
  if (dstViewId == "setting" && SETTING == 0) {
    // Notify file missing
    $device.taptic(1)
    saveSettingAsDefault()
  }

  var viewId = $("content").views.filter(function(x) {
    return x.hidden == false
  })[0].info
  if (dstViewId == viewId) {
    var subViewId = $(viewId + "_list").views.filter(function(x) {
      return x.hidden == false
    })[0]
    if (subViewId.info == "search") {
      $(dstViewId + "_keyword").focus()
    } else {
      subViewId.scrollTo({
        indexPath: $indexPath(0, 0)
      })
    }
  } else {
    var color = $color(SETTING_FILE[0][5])
    for (var i = 0; i < 3; i++) {
      $("menu").cell($indexPath(0, i)).views[0].views[0].tintColor = index == i ? color : $color("lightGray")
      $("menu").cell($indexPath(0, i)).views[0].views[1].textColor = index == i ? color : $color("lightGray")
    }
    $(viewId).hidden = true
    $(dstViewId).hidden = false
  }
}

function activeSegment(index) {
  const trans = ["recent", "favorite", "setting"]
  var dstViewId = trans[index]
  if (dstViewId == "setting") {
    return
  }

  var viewId = $("content").views.filter(function(x) {
    return x.hidden == false
  })[0].info

  if (dstViewId == viewId) {
    $device.taptic(0)
    var subViewId = $(viewId + "_list").views.filter(function(x) {
      return x.hidden == false
    })[0]
    subViewId.hidden = true
    if (typeof(subViewId.next) != "undefined") {
      $(viewId + "_bar").index += 1
      subViewId.next.hidden = false
    } else {
      $(viewId + "_bar").index = 0
      subViewId.super.views[0].hidden = false
    }
  }
}

function fetchDataOnScreen(pulled = false) {
  $ui.loading(true)
  $http.get({
    url: "https://api-m.mtime.cn/Showtime/LocationMovies.api?locationId=" + SETTING_FILE[0][4],
    handler: function(resp) {
      $ui.loading(false)
      if (pulled) {
        $("onscreen").endRefreshing()
        $ui.toast("Refreshed")
      }

      var status = resp.response.statusCode
      if (status != "200") {
        $ui.alert({
          title: status,
          message: "Public API has limit of request frequency, take a rest :)",
          actions: [{
            title: "OK",
            style: "Cancel"
          }]
        })
        return
      }
      RAW_DATA[ON_SCREEN] = resp.data
      loadDataOnScreen()
      // Cache
      if (SETTING_FILE[0][3]) {
        $cache.set("onScreen", resp.data)
      }
    }
  })
}

function fetchDataComingSoon(pulled = false) {
  $ui.loading(true)
  $http.get({
    url: "https://api-m.mtime.cn/Movie/MovieComingNew.api?locationId=" + SETTING_FILE[0][4],
    handler: function(resp) {
      $ui.loading(false)
      if (pulled) {
        $("comingsoon").endRefreshing()
        $ui.toast("Refreshed")
      }

      var status = resp.response.statusCode
      if (status != "200") {
        $ui.alert({
          title: status,
          message: "Public API has limit of request frequency, take a rest :)",
          actions: [{
            title: "OK",
            style: "Cancel"
          }]
        })
        return
      }
      RAW_DATA[COMING_SOON] = resp.data
      loadDataComingSoon()
      // Cache
      if (SETTING_FILE[0][3]) {
        $cache.set("comingSoon", resp.data)
      }
    }
  })
}

function fetchDataQuery(keyword) {
  $ui.loading(true)
  $http.get({
    url: "https://api-m.mtime.cn/Showtime/SearchVoice.api?pageIndex=1&searchType=3&locationId=" + SETTING_FILE[0][4] + "&Keyword=" + encodeURI(keyword),
    handler: function(resp) {
      $ui.loading(false)
      var status = resp.response.statusCode
      if (status != "200") {
        $ui.alert({
          title: status,
          message: "Public API has limit of request frequency, take a rest :)",
          actions: [{
            title: "OK",
            style: "Cancel"
          }]
        })
        return
      }
      if (resp.data.movies.length == 0) {
        $ui.error("No result")
        return
      }
      var data = []
      var quality = SETTING_FILE[0][0]
      var res = resp.data.movies
      var idx = 0
      for (var i of res) {
        var d = {
          cover: {
            src: i.img.split("_")[0] + "_" + quality + ".jpg"
          },
          title: {
            text: i.name
          },
          genres: {
            text: " " + (i.movieType || "无") + " "
          },
          director: {
            text: "导演: " + (i.directors.join(" | ") || "无")
          },
          cast: {
            text: "主演: " + (i.actors.join(" | ") || "无")
          },
          info: {
            text: "出版: " + i.year + "年"
          },
          id: i.id
        }
        data.push(d)
      }
      // Update Results
      $("recent_search").data = data
    }
  })
}

function loadDataOnScreen(start = 0) {
  var data = start == 0 ? [] : $("onscreen").data
  var quality = SETTING_FILE[0][0]
  var count = SETTING_FILE[0][2]
  var res = RAW_DATA[ON_SCREEN].ms
  var total = res.length
  var pageLastIndex = (start + count) > total ? total : (start + count)
  var page = pageLastIndex + " / " + total

  if (start === total) {
    $ui.loading(false)
    $ui.error("No more result")
    return true
  }

  for (var idx = start; idx < pageLastIndex; idx++) {
    var i = res[idx]
    var d = {
      cover: {
        src: i.img.split("_")[0] + "_" + quality + ".jpg"
      },
      title: {
        text: i.tCn
      },
      genres: {
        text: " " + (i.movieType.replace(/\//g, "|") || "无") + " "
      },
      director: {
        text: "导演: " + (i.dN || "无")
      },
      cast: {
        text: "主演: " + (i.actors.replace(/\//g, "|") || "无")
      },
      info: {
        text: "热度: " + i.wantedCount + " 人想看"
      },
      id: i.id
    }
    data.push(d)
  }
  // Upadate Page Info
  $("onscreen").info = pageLastIndex
  $("onscreen_page").text = page
  $("onscreen").endFetchingMore()
  // Update Results
  $("onscreen").data = data
}

function loadDataComingSoon(start = 0) {
  var data = start == 0 ? [] : $("comingsoon").data
  var quality = SETTING_FILE[0][0]
  var count = SETTING_FILE[0][2]
  var res = RAW_DATA[COMING_SOON].moviecomings
  var total = res.length
  var pageLastIndex = (start + count) > total ? total : (start + count)
  var page = pageLastIndex + " / " + total

  if (start === total) {
    $ui.loading(false)
    $ui.error("No more result")
    return true
  }

  for (var idx = start; idx < pageLastIndex; idx++) {
    var i = res[idx]
    var section = i.rYear + "-" + i.rMonth + "-" + i.rDay
    var d = {
      cover: {
        src: i.image.split("_")[0] + "_" + quality + ".jpg"
      },
      title: {
        text: i.title
      },
      genres: {
        text: " " + (i.type.replace(/\//g, "|") || "无") + " "
      },
      director: {
        text: "导演: " + (i.director || "无")
      },
      cast: {
        text: "主演: " + ([i.actor1, i.actor2].filter(function(text) { return text != "" }).join(" | ") || "无")
      },
      info: {
        text: "热度: " + i.wantedCount + " 人想看"
      },
      id: i.id
    }

    if (typeof(data[data.length - 1]) != "undefined" && section == data[data.length - 1].title) {
      data[data.length - 1].rows.push(d)
    } else {
      data.push({
        title: section,
        rows: [d]
      })
    }
  }
  // Upadate Page Info
  $("comingsoon").info = pageLastIndex
  $("comingsoon_page").text = page
  $("comingsoon").endFetchingMore()
  // Update Results
  $("comingsoon").data = data
}

function findFavorite(keyword) {
  // Init List Data
  $("favorite_search").data = DEFAULT_FAVORITE_SEARCH
  // Find Favorited
  var favorited = JSON.stringify(FAVORITE_FILE.FAVORITED)
  $thread.background({
    delay: 0,
    handler: function() {
      var index = 0
      var idx = 0
      var row = -1
      while (favorited.indexOf(keyword, index) != -1) {
        index = favorited.indexOf(keyword, index) + 1
        var sub = favorited.substring(0, index).match(/\"genres\"/g).length - 1
        if (row == sub) {
          continue
        }
        row = sub
        var cellData = $("favorited").object($indexPath(0, row))
        cellData.row = row
        $("favorite_search").insert({
          indexPath: $indexPath(0, idx),
          value: cellData
        })
        idx++
      }
    }
  })
  // Find Checked
  var checked = JSON.stringify(FAVORITE_FILE.CHECKED)
  $thread.background({
    delay: 0,
    handler: function() {
      var index = 0
      var idx = 0
      var row = -1
      while (checked.indexOf(keyword, index) != -1) {
        index = checked.indexOf(keyword, index) + 1
        var sub = checked.substring(0, index).match(/\"genres\"/g).length - 1
        if (row == sub) {
          continue
        }
        row = sub
        var cellData = $("checked").object($indexPath(0, row))
        cellData.row = row
        $("favorite_search").insert({
          indexPath: $indexPath(1, idx),
          value: cellData
        })
        idx++
      }
    }
  })
}

function locateFavorite(rawIndexPath, rawData) {
  var section = rawIndexPath.section
  var row = rawData.row
  var indexPath = $indexPath(0, row)
  var dstViewId = section ? "checked" : "favorited"
  var data = $(dstViewId).object(indexPath)

  var id = data.id
  var rawId = rawData.id
  if (rawId != id) {
    $ui.error("Result has obsoleted")
    $("favorite_search").delete(rawIndexPath)
    return
  }

  $("favorite_search").hidden = true
  $(dstViewId).hidden = false
  $("favorite_bar").index = section
  $ui.animate({
    duration: 0.2,
    animation: function() {
      $(dstViewId).scrollTo({
        indexPath: indexPath,
        animated: false
      })
    },
    completion: function() {
      $ui.animate({
        duration: 0.3,
        animation: function() {
          $(dstViewId).cell(indexPath).bgcolor = $color("#DFDFDF")
        },
        completion: function() {
          $ui.animate({
            delay: 0.8,
            duration: 0.8,
            animation: function() {
              $(dstViewId).cell(indexPath).bgcolor = $color("white")
            }
          })
        }
      })
    }
  })
}

function favoriteItem(cellData) {
  var data = cellData
  data.info.text = "收藏于: " + (new Date()).format("yyyy年M月d日")
  $("favorited").insert({
    index: 0,
    value: data
  })
  FAVORITE_FILE.FAVORITED.unshift(data)
  saveFavorite(FAVORITE_FILE)
  $ui.toast("Favorited")
}

function favoriteItemDelete(section, row) {
  FAVORITE_FILE[section].splice(row, 1)
  saveFavorite(FAVORITE_FILE)
}

function favoriteCheckUncheck(cellData, indexPath, from, to) {
  var row = indexPath.row
  $(from.toLowerCase()).delete(indexPath)
  $(to.toLowerCase()).insert({
    index: 0,
    value: cellData
  })
  FAVORITE_FILE[from].splice(row, 1)
  FAVORITE_FILE[to].unshift(cellData)
  saveFavorite(FAVORITE_FILE)

  if (from == "FAVORITED") {
    $ui.toast("Checked")
  } else {
    $ui.toast("Unchecked")
  }
}

function activeSettingMenu(indexPath) {
  var section = indexPath.section
  var row = indexPath.row
  var data
  if (section == 0) {
    if (row == 0) {
      // Cover Image Quality
      data = MENU.COVER_IMAGE_QUALITY
      actionSettingMenu(section, row, data)
    } else if (row == 1) {
      // Recent Main Index
      data = MENU.RECENT_MAIN_INDEX
      actionSettingMenu(section, row, data)
    } else if (row == 4) {
      // Update Location
      actionUpdateLocation()
    } else if (row == 5) {
      // Theme Color
      data = MENU.THEME_COLOR
      actionThemeColor(section, row, data)
    } else if (row == 6) {
      // Clear Cache
      actionClearCache()
    } else if (row == 7) {
      // Reset
      actionReset()
    }
  } else if (section == 1) {
    if (row == 0) {
      // Saving Path
      data = MENU.SAVING_PATH
      actionSettingMenu(section, row, data)
    } else if (row == 1) {
      // Update Cover Image
      actionUpdateCoverImage()
    }
  } else if (section == 2) {
    if (row == 0) {
      $safari.open({
        url: "https://www.ryannn.com"
      })
    } else if (row == 1) {
      actionTutorial()
    }
  }
}

function actionSettingMenu(section, row, data) {
  $ui.menu({
    items: data.map(function(x) { return x.name }),
    handler: function(title, idx) {
      var value = data[idx].value
      var current = $("setting").data
      // Update Data
      current[section].rows[row].value.text = data[idx].name
      $("setting").data = current
      if (section == 1 && row == 0) {
        // Path Value Before
        var path = SETTING_FILE[1][0]
        var favor = FAVORITE_FILE
        // Transfer Path
        $file.delete(path)
        $file.mkdir(value)
        // Update Path Value
        SETTING_FILE[1][0] = value
        saveFavorite(favor)
      }
      saveSetting(section, row, value)
    }
  })
}

function actionUpdateLocation() {
  $location.fetch({
    handler: function(resp) {
      $ui.loading(true)
      $http.get({
        url: "https://api-m.mtime.cn/GetCityByLongitudelatitude.api?latitude=" + resp.lat + "&longitude=" + resp.lng,
        handler: function(resp) {
          $ui.loading(false)
          var status = resp.response.statusCode
          if (status == "400") {
            $ui.alert({
              title: "Error",
              message: "Fetching location error, ensure that you have allowed location access and try again.",
              actions: [{
                title: "OK",
                style: "Cancel"
              }]
            })
            return
          }
          // Update Location
          var lid = resp.data.cityId
          var city = resp.data.name
          if (typeof(city) == "undefined") {
            $ui.alert({
              title: "Error",
              message: "Failed to fetch your location, 北京 is set instead.",
              actions: [{
                title: "OK",
                style: "Cancel"
              }]
            })
          } else {
            saveSetting(0, 4, lid)
            $ui.alert({
              title: "Success",
              message: "Your location have updated to " + city + " successfully.",
              actions: [{
                title: "OK",
                style: "Cancel"
              }]
            })
          }
        }
      })
    }
  })
}

function actionThemeColor(section, row, data) {
  $ui.menu({
    items: data.map(function(x) { return x.name }),
    handler: function(title, idx) {
      var value = data[idx].value
      // Save Data
      saveSetting(section, row, value)
      $ui.toast("Changing ...")
      $delay(0.5, function() { main() })
    }
  })
}

function actionClearCache() {
  $ui.alert({
    title: "Clear Cache",
    message: "Sure to clear all the caches?",
    actions: [{
        title: "OK",
        handler: function() {
          $cache.clear()
          $ui.toast("Done")
        }
      },
      {
        title: "Cancel",
        style: "Cancel"
      }
    ]
  })
}

function actionReset() {
  $ui.action({
    title: "Reset",
    message: "You can reset all settings to default, or erase favorited content and settings",
    actions: [{
        title: "Reset All Settings",
        handler: function() {
          $ui.alert({
            title: "Warning",
            message: "Sure to reset all settings to default?",
            actions: [{
                title: "OK",
                handler: function() {
                  resetSetting()
                  main()
                  $ui.toast("Done")
                }
              },
              {
                title: "Cancel",
                style: "Cancel"
              }
            ]
          })
        }
      },
      {
        title: "Erase All Content and Settings",
        handler: function() {
          $ui.alert({
            title: "Warning",
            message: "Sure to erase all favorited content and settings?",
            actions: [{
                title: "OK",
                handler: function() {
                  eraseAll()
                  main()
                  $ui.toast("Done")
                }
              },
              {
                title: "Cancel",
                style: "Cancel"
              }
            ]
          })
        }
      }
    ]
  })
}

function actionUpdateCoverImage() {
  var file = JSON.stringify(FAVORITE_FILE).replace(/_\d+X\d+X2/g, "_" + SETTING_FILE[0][0])
  FAVORITE_FILE = JSON.parse(file)
  saveFavorite(FAVORITE_FILE)
  // Updata Data
  $("favorited").data = FAVORITE_FILE.FAVORITED
  $("checked").data = FAVORITE_FILE.CHECKED
  $ui.toast("Updated")
}

function actionTutorial() {
  var text = "Tips\n- Tap menu button to quickly scroll to top.\n- Tap menu button to quickly focus the text field in the search view.\n- LongPress menu button to quickly toggle tabs.\n- Swipe left to Favorite a movie in the recent view.\n- Swipe left to Check/Uncheck or Delete a favorited movie in the favorite view.\n- Swipe left to Locate a favorited movie in the local search view."

  // Views
  var hintView = $objc("BaseHintView").invoke("alloc").invoke("initWithText", text)
  var layerView = hintView.invoke("subviews").invoke("objectAtIndex", 0)
  var mainView = hintView.invoke("subviews").invoke("objectAtIndex", 1)
  var textView = mainView.invoke("subviews").invoke("objectAtIndex", 1)

  // Attribute for text
  var string = $objc("NSMutableAttributedString").invoke("alloc").invoke("initWithString", text)
  string.invoke("addAttribute:value:range:", "NSFont", $font("bold", 26), $range(0, 4))
  string.invoke("setAlignment:range:", $align.center, $range(0, 4))

  string.invoke("addAttribute:value:range:", "NSFont", textView.invoke("font"), $range(4, string.invoke("length") - 4))
  string.invoke("addAttribute:value:range:", "NSColor", $color("tint"), $range(text.indexOf("Favorite"), 8))
  string.invoke("addAttribute:value:range:", "NSColor", $color("tint"), $range(text.indexOf("Check"), 13))
  string.invoke("addAttribute:value:range:", "NSColor", $color("tint"), $range(text.indexOf("Delete"), 6))
  string.invoke("addAttribute:value:range:", "NSColor", $color("tint"), $range(text.indexOf("Locate"), 6))

  // Paragraph Style
  var para = $objc("NSMutableParagraphStyle").invoke("alloc.init")
  para.invoke("setParagraphSpacing", 15)
  para.invoke("setAlignment", $align.justified)

  string.invoke("addAttribute:value:range:", "NSParagraphStyle", para, $range(4, string.invoke("length") - 4))

  // Setup
  textView.invoke("setAttributedText", string)
  mainView.invoke("setAlpha", 0)

  // Add Subview
  $ui.window.runtimeValue().invoke("addSubview", hintView)
  hintView.rawValue().updateLayout(function(make) {
    make.edges.inset(0)
  })
  mainView.rawValue().updateLayout(function(make) {
    make.bottom.equalTo().offset(-35)
  })

  $ui.animate({
    duration: 0.2,
    animation: function() {
      layerView.invoke("setAlpha", 0.4)
      mainView.invoke("setAlpha", 1)
    }
  })
}

function saveSetting(section, row, value) {
  var path = SETTING_FILE[1][0]
  // Update Value
  SETTING_FILE[section][row] = value
  $file.write({
    data: $data({ string: JSON.stringify(SETTING_FILE) }),
    path: path + "Setting.conf"
  })
}

function saveSettingAsDefault() {
  var path = SETTING_FILE[1][0]
  SETTING = $file.write({
    data: $data({ string: JSON.stringify(DEFAULT_SETTING) }),
    path: path + "Setting.conf"
  })
}

function saveFavorite(data) {
  var path = SETTING_FILE[1][0]
  $file.write({
    data: $data({ string: JSON.stringify(data) }),
    path: path + "Favorite.conf"
  })
}

function resetSetting() {
  var path = SETTING_FILE[1][0]
  $file.delete(path)
  // Reset Setting
  SETTING = 0
  SETTING_FILE = JSON.parse(JSON.stringify(DEFAULT_SETTING))
  $file.mkdir(SETTING_FILE[1][0])
  // Move Favorite
  saveFavorite(FAVORITE_FILE)
}

function eraseAll() {
  var path = SETTING_FILE[1][0]
  $file.delete(path)
  // Reset Setting
  SETTING = 0
  SETTING_FILE = JSON.parse(JSON.stringify(DEFAULT_SETTING))
  $file.mkdir(SETTING_FILE[1][0])
  // Reset Favorite
  FAVORITE = 0
  FAVORITE_FILE = JSON.parse(JSON.stringify(DEFAULT_FAVORITE))
}

function unique(id) {
  var file = JSON.stringify(FAVORITE_FILE)
  return file.indexOf(id) == -1 ? true : false
}

function rate(number) {
  var rate = number.toFixed(1).toString()
  var string = $objc("NSMutableAttributedString").invoke("alloc").invoke("initWithString", rate)
  string.invoke("addAttribute:value:range:", "NSFont", $font("bold", 25), $range(1, 2))
  string.invoke("addAttribute:value:range:", "NSBaselineOffset", 10, $range(1, 2))
  $("rate").runtimeValue().invoke("setAttributedText", string)
}

function main() {
  generateMainViewObjects()
  mainView()
  if (SETTING_FILE[0][3]) {
    // Get On Screen
    $thread.background({
      delay: 0,
      handler: function() {
        var cache = $cache.get("onScreen")
        if (typeof(cache) == "undefined") {
          fetchDataOnScreen()
        } else {
          RAW_DATA[ON_SCREEN] = cache
          loadDataOnScreen()
        }
      }
    })

    // Get Coming Soon
    $thread.background({
      delay: 0,
      handler: function() {
        var cache = $cache.get("comingSoon")
        if (typeof(cache) == "undefined") {
          fetchDataComingSoon()
        } else {
          RAW_DATA[COMING_SOON] = cache
          loadDataComingSoon()
        }
      }
    })
  } else {
    $thread.background({
      delay: 0,
      handler: function() {
        fetchDataOnScreen()
      }
    })
    
    $thread.background({
      delay: 0,
      handler: function() {
        fetchDataComingSoon()
      }
    })
  }

  if (SETTING_FILE[0][1] == ON_SCREEN) {
    $("onscreen").hidden = false
  } else {
    $("comingsoon").hidden = false
  }
}

/* Main */
main()