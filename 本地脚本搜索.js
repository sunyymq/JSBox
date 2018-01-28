// 搜索本地脚本
// 按名字匹配，支持多个关键词，以空格分隔
// 搜索结果以菜单形式弹出，点击后执行选中的脚本
// By JunM 2018-01-28
// https://t.me/jun_m
// 脚本分享频道：
// https://t.me/Flow_Script



var addinList = $addin.list;
var totalNumber = addinList.length;
var searchTexts = [];
var searchText = "";
var nameTmp = "";
var searchResults = [];
var re = /\s+/;

$app.tips("\n本地脚本搜索，\n便于脚本数量很多时快速查找； \n\n支持使用多个关键词搜索，\n以空格分隔\n\n点击运行");

$input.text({
    placeholder: "请输入关键词，可用空格分隔多个关键词",
    handler: function (text) {
        if (text === "") {
            $ui.alert({
                title: "输入值为空，请输入搜索内容",
                message: "",
            })
            $app.close();
        } else {
            searchTexts = text.split(re);
            beginSearch();
        }
    }
});


function doMatch(tmpScriptName, tmpTextsToSearch) {

    for (let i = 0; i <= tmpTextsToSearch.length - 1; i++) {
        if ((tmpScriptName.toLowerCase()).indexOf(tmpTextsToSearch[i].toLowerCase()) === -1) {
            return -1;
        } else {
            continue;
        }
    }
    return 1;
}


function beginSearch() {

    for (let i = 0; i <= totalNumber - 1; i++) {
        nameTmp = addinList[i].name.slice(0, -3);
        $console.info(nameTmp);
        if (doMatch(nameTmp, searchTexts) !== -1) {
            searchResults.push({
                scriptID: i,
                scriptName: nameTmp
            });
        }
    }

    if (searchResults.length === 0) {
        $ui.alert({
            title: "无满足搜索要求的脚本",
            message: "",
        })
    } else {

        $ui.menu({
            items: searchResults.map(function (item) { return item.scriptName }),
            handler: function (title, idx) {
                $addin.run(searchResults[idx].scriptName);
            }
        })
    }
}