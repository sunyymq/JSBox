$app.strings = {
  "en": {
    "title1": "Running Error",
    "title2": "OK",
    "title3": "Same File Name",
    "title4": "Cancel",
    "title5": "Replace",
    "msg1": "Please run through a shared JS-file.",
    "msg2": "Sure to REPLACE the existed file?",
    "toast1": "Installed"
  },
  "zh-Hans": {
    "title1": "运行有误",
    "title2": "好的",
    "title3": "文件名重复",
    "title4": "取消",
    "title5": "覆盖",
    "msg1": "请从 JS 文件分享并以此扩展运行。",
    "msg2": "确定要覆盖已有扩展文件?",
    "toast1": "已安装"
  }
}

function error() {
  $ui.alert({
    title: $l10n("title1"),
    message: $l10n("msg1"),
    actions: [{
      title: $l10n("title2"),
      style: "Cancel",
      handler: function() {
        $context.close()
        $app.close()
      }
    }]
  })
}

function warning(name, data) {
  $ui.alert({
    title: $l10n("title3"),
    message: $l10n("msg2"),
    actions: [{
        title: $l10n("title4"),
        style: "Cancel",
        handler: function() {
          $context.close()
          $app.close()
        }
      },
      {
        title: $l10n("title5"),
        handler: function() {
          install(name, data)
        }
      }
    ]
  })
}

function install(name, data) {
  $addin.save({
    name: fileName,
    data: data
  })
  $ui.toast($l10n("toast1"), 1)
  $delay(1.5, function() {
    $context.close()
    $app.close()
  })
}

if (typeof($context.data) == "undefined") {
  error()
} else {
  var data = $context.data
  var fileName = data.fileName
  var addins = $file.extensions.join("|")
  // Exclude file of wrong MIME type
  if (fileName.indexOf(".js") == -1) {
    error()
  } else {
    // Warn if file name exists
    if (addins.indexOf(fileName.substr(0, fileName.length - 3)) > -1) {
      warning(fileName, data)
    } else {
      install(fileName, data)
    }
  }
}