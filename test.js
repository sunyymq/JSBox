// by Hhdº

const kinds = `每月推荐
侦探推理
逻辑思维
谜语大全
脑筋急转弯
趣味益智
图形视觉
数学天地
知识百科
决策推断
棋牌世界
对联大全`
body = `
<body bgcolor="#18222D">`
css = `p {margin: 0.0px 21.0px 12.0px 21.0px; line-height: 28.0px; font: 18.0px Georgia; color: #FFFFFF; color: rgba(225, 225, 225, 0.8); -webkit-text-stroke: rgba(225, 225, 225, 0.8)}`

$ui.render({
  props: {
    title: "33IQ"
  },
  views: [{
    type: "list",
    props: {
      data: kinds.split("\n").map(function(item) {
        return {
          button: {
            title: item
          }
        }
      }),
      bgcolor: $color("#18222D"),
      template: [{
        type: "button",
        props: {
          radius: 0,
          bgcolor: $color("#18222D")
        },
        layout: $layout.fill,
        events: {
          tapped(sender) {
            New(sender.title)
          }
        }
      }]
    },
    layout: $layout.fill,
  }]
})

function New(type) {
  $http.post({
    url: "https://www.33iq.com/answer/getquestion?p=1&lang=zh-cn",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: {
      q_id: Math.round(Math.random() * 8999 + 1000),
      qtype: 1,
      sort: "good",
      tag: type,
      star: null
    },
    handler(resp) {
      Question(resp.data[0], type)
    }
  })
}

function Question(Q_Info, type) {
  $ui.push({
    props: {
      title: "33IQ"
    },
    views: [{
        type: "web",
        props: {
          html: Q_Info.qc_context + body,
          style: css,
          bgcolor: $color("#18222D")
        },
        layout: function(make) {
          make.height.equalTo($device.info.screen.height * 0.7)
          make.top.left.right.inset(0)
        }
      },
      {
        type: "list",
        props: {
          id: "Choice",
          bgcolor: $color("#213040"),
          template: [{
            type: "button",
            props: {
              radius: 0,
              bgcolor: $color("#213040")
            },
            layout: $layout.fill,
            events: {
              tapped(sender) {
                var suc = ""
                if (sender.title.match(/[A-Z](?=\.)/)[0] == Q_Info.answer) {
                  suc = "你答对了"
                } else suc = "你答错了"
                $ui.alert({
                  title: suc + "，正确答案是" + Q_Info.answer,
                  message: Q_Info.process.replace(/<p>/g, "").replace(/<\/p>/g, ""),
                  actions: [{
                      title: "再来一局",
                      handler() {
                        New(type)
                      }
                    },
                    {
                      title: "取消"
                    }
                  ]
                })
              }
            }
          }]
        },
        layout: function(make) {
          make.top.equalTo($("web").bottom)
          make.bottom.left.right.inset(0)
        }
      }
    ]
  })
  var choice = new Array()
  if (Q_Info.qc_choose_a !== "") choice.push("A." + Q_Info.qc_choose_a)
  if (Q_Info.qc_choose_b !== "") choice.push("B." + Q_Info.qc_choose_b)
  if (Q_Info.qc_choose_c !== "") choice.push("C." + Q_Info.qc_choose_c)
  if (Q_Info.qc_choose_d !== "") choice.push("D." + Q_Info.qc_choose_d)
  if (Q_Info.qc_choose_e !== "") choice.push("E." + Q_Info.qc_choose_e)
  $("Choice").data = choice.map(function(item) {
    return {
      button: {
        title: item
      }
    }
  })
}
