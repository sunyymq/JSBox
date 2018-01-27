/**
  
  * JSBox脚本迁移工具 V5
  * 使用时请保证iCloud账户的一致性
  *
  * By AbleCats
  * https://t.me/Flow_Script
  
**/

const Path = "drive://ACJSBuckup/"
const SPath = "drive://ACJSBuckup/DEC/"

function saveError(sign) {
  $ui.alert({
    title: "备份失败",
    message: sign  ? "抱歉\n检测到JSBox没有iCloud权限\n" : "抱歉\n你的JSBox版本还不支持该本脚本\n",
    actions: [{
      title: "确定",
      handler: function() {
        $file.delete(Path);
        $app.close();
      }
    }]
  })
}

function saveSuccess() {
  $ui.alert({
    title: "备份成功",
    message: "\n请保持手机网络畅通\n上传速度根据你的网络速度而定",
    actions: [{
      title: "确定",
      handler: function() {
        $app.close();
      }
    }]
  })
}

function readSuccess() {
  $ui.alert({
    title: "恢复成功",
    message: "\niCloud脚本恢复到本地成功\n",
    actions: [{
      title: "确定",
      handler: function() {
        $app.close();
      }
    }]
  })
}

function saveFile() {
  let Names = []
  $file.delete(Path)
  $file.mkdir(Path)
  $file.mkdir(SPath)
  $addin.list.map(function(item) {
    if (item.data) {
      $file.write({
        data: item.data,
        path: SPath + item.name
      })
      Names.push(item.name)
      return true;
    } else {
      return false;
    }
  })
  let ALL = $addin.list.length
  if ($file.list(SPath).length) {
    $file.write({
      data: $data({ string: JSON.stringify(Names) }),
      path: Path + "Names.conf"
    })
    let PNL = JSON.parse($file.read(Path + "Names.conf").string).length
    if(PNL == ALL) saveSuccess();
    else saveError(1);
  }
}

function readFile() {
  let Names = JSON.parse($file.read(Path + "Names.conf").string)
  for (let value of Names) {
    $addin.save({
      name: value,
      data: $file.read(SPath + value)
    })
  }
  readSuccess()
}

async function initiCoudSync() {
  if ($file.exists("drive://")) {
    if ($file.exists(SPath))
      $ui.menu({
        items: ["备份", "恢复"],
        handler: function(title, idx) {
          idx ? readFile() : saveFile();
        }
      })
    else await saveFile();
  } else saveError(0);
}

initiCoudSync()