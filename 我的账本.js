/* 作者:Hhdº 未经允许,禁止转载/盗用脚本 */

新的账单 = {
  账单情况: {
    text: "添加"
  },
  记账时间: {
    text: "添加一个新的账单"
  }
}

$ui.render({
  props: {
    title: "记账"
  },
  views: [{
    type: "list",
    props: {
      id: "账单列表",
      grouped: true,
      rowHeight: 60,
      footer: {
        type: "label",
        props: {
          height: 20,
          text: "作者：Hhdº",
          textColor: $color("#AAAAAA"),
          align: $align.center,
          font: $font(12)
        }
      },
      data: [新的账单],
      actions: [{
        title: "删除",
        handler(sender, indexPath) {
          var 历史记录 = JSON.parse($file.read("我的账本.txt").string)
          历史记录.splice(indexPath.row, 1)
          $file.write({
            path: "我的账本.txt",
            data: $data({
              string: JSON.stringify(历史记录)
            })
          })
          sender.delete(indexPath)
        }
      }],
      template: [{
          type: "label",
          props: {
            id: "账单情况",
            font: $font(22)
          },
          layout(make) {
            make.left.equalTo(10)
            make.top.right.inset(8)
            make.height.equalTo(24)
          }
        },
        {
          type: "label",
          props: {
            id: "记账时间",
            textColor: $color("#888888"),
            font: $font(14)
          },
          layout(make) {
            make.left.right.equalTo($("账单情况"))
            make.top.equalTo($("账单情况").bottom)
            make.bottom.equalTo(0)
          }
        }
      ],
    },
    layout: $layout.fill,
    events: {
      didSelect(sender, indexPath) {
        新账单(sender, indexPath)
      }
    }
  }]
})

function 刷新() {
  var 历史记录 = JSON.parse($file.read("我的账本.txt").string)
  数组 = new Array()
  for (循环次数 in 历史记录) {
    var 信息 = 历史记录[循环次数]
    数组.push({
      账单情况: {
        text: 信息.情况
      },
      记账时间: {
        text: 信息.时间
      }
    })
  }
  数组.push(新的账单)
  $("账单列表").data = 数组
}

function 新账单(sender, indexPath) {
  var 数量 = sender.data.length - 1
  if (indexPath.row == 数量) {
    $ui.menu({
      items: ["收入", "支出"],
      handler(idx, title) {
        $input.text({
          type: $kbType.number,
          placeholder: "输入数目",
          handler(text) {
            var 日期对象 = new Date()
            月份 = 日期对象.getMonth() + 1
            当前时间 = "周" + "日一二三四五六".charAt(日期对象.getDay()) + ", " + 日期对象.getFullYear() + "-" + 月份 + "-" + 日期对象.getDate() + " " + 日期对象.getHours() + ":" + 日期对象.getMinutes() + ":" + 日期对象.getSeconds()
            情况 = (idx == "收入") ? "+ " + text : "- " + text
            if ($file.exists("我的账本.txt") == 0) {
              var 数据 = [{
                情况: 情况,
                时间: 当前时间
              }]
            } else {
              var 数据 = JSON.parse($file.read("我的账本.txt").string)
              数据.push({
                情况: 情况,
                时间: 当前时间
              })
            }
            $file.write({
              path: "我的账本.txt",
              data: $data({
                string: JSON.stringify(数据)
              })
            })
            sender.insert({
              index: 数量,
              value: {
                账单情况: {
                  text: 情况
                },
                记账时间: {
                  text: 当前时间
                }
              }
            })
          }
        })
      }
    })
  }
}

刷新()