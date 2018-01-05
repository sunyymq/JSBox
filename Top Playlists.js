var sysPlayer = $objc("MPMusicPlayerController").invoke("systemMusicPlayer")

$ui.loading(true)

$http.get({
  url: "https://api.ryannn.com/music",
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
        layout: $layout.fill,
        views: [{
            // Playlists
            type: "tab",
            props: {
              id: "tab",
              items: keys,
              tintColor: $color("darkGray")
            },
            layout: function(make) {
              make.height.equalTo(30)
              make.top.inset(45)
              make.left.inset(10)
            },
            events: {
              changed: function(sender) {
                var idx = sender.index
                $("from_stepper").min = 1
                $("from_stepper").max = lens[idx]
                $("to_stepper").max = lens[idx]
                $("to_stepper").value = lens[idx]
                $("to_label").text = "To: " + lens[idx]
                $("update").text = "Updated: " + times[$("tab").index]
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
              tintColor: $color("darkGray")
            },
            layout: function(make, view) {
              var ppre = view.prev.prev
              make.height.equalTo(30)
              make.top.equalTo(ppre.bottom).offset(45)
              make.left.inset(10)
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
              tintColor: $color("darkGray")
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
              text: "To: " + lens[0].toString(),
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
              onColor: $color("darkGray")
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
              icon: $icon("049", $color("darkGray")),
              bgcolor: $color("clear")
            },
            layout: function(make, view) {
              var ppre = view.prev.prev
              make.height.equalTo(40)
              make.width.equalTo(50)
              make.top.equalTo(ppre.bottom).offset(40)
              make.right.inset(20)
            },
            events: {
              tapped: function(sender) {
                $ui.toast("Playing " + keys[$("tab").index] + " Top " + $("from_stepper").value + " To " + $("to_stepper").value + " ...")
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
              make.bottom.equalTo(pre.top).offset(0)
              make.centerX.equalTo(pre.centerX)
            }
          },
          {
            type: "view",
            props: {
              bgcolor: $color("red")
            },
            layout: function(make, view) {
              var ppre = view.prev.prev
              make.top.equalTo(ppre.bottom).offset(10)
              make.left.bottom.right.inset(0)
            },
            views: [{
              type: "list",
              layout: $layout.fill,
              props: {
                scrollEnabled: false,
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
                }
              }
            }]
          }
        ]
      }]
    })
  }
})

function generateQueue(start, end, songs, shuffle = false) {
  if (!end) {
    end = songs.length
  }

  var queue = []
  for (var i = start; i < end; i++) {
    queue.push(songs[i].toString())
  }

  if (shuffle) {
    sysPlayer.invoke("setShuffleMode", 2)
  } else {
    sysPlayer.invoke("setShuffleMode", 1)
  }

  sysPlayer.invoke("setQueueWithStoreIDs", queue)
  sysPlayer.invoke("play")
}