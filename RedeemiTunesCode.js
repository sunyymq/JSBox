// By JunM 2018-01-10
// 用于从剪贴板中匹配 兑换码，并跳转到 兑换页面。
// 跳转页面的链接来自 WorkFlow
// https://workflow.is/workflows/134610a9a4004280998e3c7da7331063

// 使用的正则匹配规则。
var myRegExp = /[A-Z][A-Z0-9]{15}/g;

var clipboardText = $clipboard.text;
var testMatch = false;
var urlOfRedeem = "https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/freeProductCodeWizard?mt=8&code=";

$app.tips("本提示只显示一次：\n脚本使用的正则匹配规则为： \n[A-Z][A-Z0-9]{15}\n由群友提供的兑换码推测而来\n如果只有一个匹配\n则直接跳转兑换\n若有多个匹配\n则列出所有兑换码\n选择后，跳转兑换");

testMatch = myRegExp.test(clipboardText);
if (testMatch === false) {
    $ui.alert({
        title: "ERROR",
        message: "剪贴板中未发现兑换码",
    })
}

// 获取所有符合正则的结果。
matchedResults = clipboardText.match(myRegExp);

// 如果只有一个结果，则直接跳转兑换。
// 如果有多个结果，则让用户选择。
if (matchedResults.length === 1) {
    urlOfRedeem = urlOfRedeem + matchedResults[0];
    $app.openURL(urlOfRedeem);
} else {
    $ui.menu({
        items: matchedResults,
        handler: function (title, idx) {
            urlOfRedeem = urlOfRedeem + matchedResults[idx];
            $app.openURL(urlOfRedeem);
        }
    })
}