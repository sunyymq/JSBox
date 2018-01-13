const QUERY = ($app.env == $env.today) ? "?version=compress" : ""
const template = [{
  type: "view",
  props: {
    id: "cell",
    clipsToBounds: true
  },
  layout: $layout.fill,
  views: [{
      type: "image",
      props: {
        id: "artwork",
        radius: 5
      },
      layout: function(make) {
        make.size.equalTo($size(80, 80))
        make.centerY.equalTo()
        make.left.inset(10)
      }
    },
    {
      type: "label",
      props: {
        id: "song",
        font: $font("bold", 16),
        autoFontSize: true,
        textColor: $color("darkGray")
      },
      layout: function(make, view) {
        var pre = view.prev
        var sup = view.super
        make.left.equalTo(pre.right).offset(5)
        make.bottom.equalTo(sup.centerY).offset(-10)
        make.right.inset(10)
      }
    },
    {
      type: "label",
      props: {
        id: "album",
        font: $font(13),
        autoFontSize: true,
        textColor: $color("gray")
      },
      layout: function(make, view) {
        var pre = view.prev
        var sup = view.super
        make.left.equalTo(pre.left)
        make.centerY.equalTo(sup.centerY)
        make.right.inset(10)
      }
    },
    {
      type: "label",
      props: {
        id: "singer",
        font: $font(13),
        autoFontSize: true,
        textColor: $color("lightGray")
      },
      layout: function(make, view) {
        var pre = view.prev
        var sup = view.super
        make.left.equalTo(pre.left),
          make.top.equalTo(sup.centerY).offset(10)
        make.right.inset(10)
      }
    },
    {
      type: "label",
      props: {
        id: "order",
        font: $font(12),
        align: $align.center,
        radius: 3,
        textColor: $color("gray"),
        bgcolor: $rgba(170, 170, 170, 0.2)
      },
      layout: function(make) {
        make.size.equalTo($size(30, 20))
        make.top.right.inset(-3)
      }
    }
  ]
}]

$ui.loading(true)
$http.get({
  url: "https://api.ryannn.com/music" + QUERY,
  handler: function(resp) {
    $ui.loading(false)
    var keys = []
    var songs = []
    var lens = []
    var times = []

    for (var k in resp.data) {
      keys.push(k)
      songs.push(resp.data[k].results)
      lens.push(resp.data[k].results.length)
      times.push(resp.data[k].updateTime)
    }

    $ui.render({
      views: [{
        type: "view",
        props: {
          bgcolor: $color("#FAFAFA")
        },
        layout: $layout.fill,
        views: [{
            // Playlists
            type: "tab",
            props: {
              id: "tab",
              items: keys,
              tintColor: $color("tint")
            },
            layout: function(make) {
              make.height.equalTo(30)
              make.top.inset(45)
              make.left.inset(15)
            },
            events: {
              changed: function(sender) {
                var idx = sender.index
                $("from_stepper").min = 1
                $("from_stepper").max = lens[idx]
                $("from_label").text = "From: " + $("from_stepper").value
                
                $("to_stepper").max = lens[idx]
                $("to_stepper").value = lens[idx]
                $("to_label").text = "To: " + lens[idx]
                $("update").text = "Updated: " + times[idx]

                // Run from main app
                if ($app.env != $env.today) {
                  generateListData(resp.data[keys[idx]].playlist)
                  $("list").scrollTo({
                    indexPath: $indexPath(0, 0)
                  })
                }
              }
            }
          },
          {
            // Playlist Title
            type: "label",
            props: {
              text: "Top Playlists",
              textColor: $color("darkGray")
            },
            layout: function(make, view) {
              var pre = view.prev
              make.height.equalTo(30)
              make.bottom.equalTo(pre.top).offset(-5)
              make.centerX.equalTo(pre.centerX)
            }
          },
          {
            // From
            type: "stepper",
            props: {
              id: "from_stepper",
              min: 1,
              value: 1,
              max: lens[0],
              tintColor: $color("tint")
            },
            layout: function(make, view) {
              var ppre = view.prev.prev
              make.height.equalTo(30)
              make.top.equalTo(ppre.bottom).offset(45)
              make.left.inset(15)
            },
            events: {
              changed: function(sender) {
                $("to_stepper").min = sender.value
                $("from_label").text = "From: " + sender.value.toString()
              }
            }
          },
          {
            // From Index
            type: "label",
            props: {
              id: "from_label",
              text: "From: 1",
              textColor: $color("darkGray")
            },
            layout: function(make, view) {
              var pre = view.prev
              make.height.equalTo(30)
              make.bottom.equalTo(pre.top).offset(-5)
              make.centerX.equalTo(pre.centerX)
            }
          },
          {
            // To
            type: "stepper",
            props: {
              id: "to_stepper",
              min: 1,
              value: lens[0],
              max: lens[0],
              tintColor: $color("tint")
            },
            layout: function(make, view) {
              var ppre = view.prev.prev
              var frist = view.super.views[0]
              make.height.equalTo(30)
              make.top.equalTo(ppre.top)
              make.right.equalTo(frist.right)
            },
            events: {
              changed: function(sender) {
                $("from_stepper").max = sender.value
                $("to_label").text = "To: " + sender.value.toString()
              }
            }
          },
          {
            // To Index
            type: "label",
            props: {
              id: "to_label",
              text: "To: " + lens[0],
              textColor: $color("darkGray")
            },
            layout: function(make, view) {
              var pre = view.prev
              make.height.equalTo(30)
              make.bottom.equalTo(pre.top).offset(-5)
              make.centerX.equalTo(pre.centerX)
            }
          },
          {
            // Shuffle Mode
            type: "switch",
            props: {
              id: "shuffle",
              on: false,
              onColor: $color("tint")
            },
            layout: function(make) {
              make.height.equalTo(30)
              make.top.inset(45)
              make.right.inset(25)
            }
          },
          {
            // Shuffle Label
            type: "label",
            props: {
              text: "Shuffle",
              textColor: $color("darkGray")
            },
            layout: function(make, view) {
              var pre = view.prev
              make.height.equalTo(30)
              make.bottom.equalTo(pre.top).offset(-5)
              make.centerX.equalTo(pre.centerX)
            }
          },
          {
            // Play
            type: "button",
            props: {
              icon: $icon("049", $color("tint")),
              bgcolor: $color("clear")
            },
            layout: function(make, view) {
              var ppre = view.prev.prev
              make.height.equalTo(30)
              make.width.equalTo(50)
              make.top.equalTo(ppre.bottom).offset(45)
              make.right.inset(20)
            },
            events: {
              tapped: function(sender) {
                $ui.toast("Playing " + keys[$("tab").index].toUpperCase() + " Top " + $("from_stepper").value + " To " + $("to_stepper").value + " ...")
                generateQueue($("from_stepper").value - 1, $("to_stepper").value, songs[$("tab").index], $("shuffle").on)
              }
            }
          },
          {
            // Play Label
            type: "label",
            props: {
              text: "Play",
              textColor: $color("darkGray")
            },
            layout: function(make, view) {
              var pre = view.prev
              make.height.equalTo(30)
              make.bottom.equalTo(pre.top).offset(-5)
              make.centerX.equalTo(pre.centerX)
            }
          },
          {
            type: "view",
            layout: function(make, view) {
              var ppre = view.prev.prev
              make.top.equalTo(ppre.bottom).offset(15)
              make.left.bottom.right.inset(0)
            },
            views: [{
              type: "list",
              layout: $layout.fill,
              props: {
                selectable: false,
                rowHeight: 100,
                template: template,
                footer: {
                  type: "label",
                  props: {
                    id: "update",
                    height: 30,
                    align: $align.center,
                    font: $font(15),
                    textColor: $color("lightGray"),
                    text: "Updated: " + times[0]
                  }
                },
                actions: [{
                  title: "Search",
                  handler: function(sender, indexPath) {
                    var data = sender.object(indexPath)
                    var song = data.song.text
                    var singer = data.singer.text
                    actionSearch(song, singer)
                  }
                }]
              }
            }]
          }
        ]
      }]
    })

    // Run from main app
    if ($app.env != $env.today) {
      generateListData(resp.data[keys[0]].playlist)
    }
  }
})

/* Function */
function actionSearch(song, singer) {
  $clipboard.text = song + " " + singer
  $ui.toast(song + " - " + singer)
  $ui.alert({
    title: "Clipborad Set",
    message: "Open Music App and paste to search.",
    actions: [{
        title: "Cancel",
        style: "Cancel"
      },
      {
        title: "Open",
        handler: function() {
          $app.openURL("music://")
        }
      }
    ]
  })
}

function generateListData(list) {
  var data = []
  var idx = 1
  for (var i of list) {
    var d = {
      cell: {
        bgcolor: i.success ? $color("white") : $color("#FFF0F5")
      },
      artwork: {
        src: i.artwork
      },
      song: {
        text: i.song
      },
      album: {
        text: i.album || "Unknown"
      },
      singer: {
        text: i.singer
      },
      order: {
        text: "#" + idx
      }
    }
    data.push(d)
    idx++
  }
  $("list").data = data
}

function generateQueue(start, end, songs, shuffle = false) {
  var sysPlayer = $objc("MPMusicPlayerController").invoke("systemMusicPlayer")

  var queue = []
  for (var i = start; i < end; i++) {
    queue.push(songs[i].toString())
  }

  if (shuffle) {
    sysPlayer.invoke("setShuffleMode", 2)
  } else {
    sysPlayer.invoke("setShuffleMode", 1)
  }

  // Stop if playback state is not 0
  var state = sysPlayer.invoke("playbackState")
  if (state > 0) {
    sysPlayer.invoke("stop")
  }

  sysPlayer.invoke("setQueueWithStoreIDs", queue)
  sysPlayer.invoke("play")
}