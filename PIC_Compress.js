// 说明：
// 图片压缩，使用 TinyPNG 的 Rest API，适用于 JPEG 和 PNG 格式。
// API KEY 需要自行申请，填写邮箱即可。
// 每个 KEY 每月可免费压缩 500 张图片。
// 申请页面 
// https://tinypng.com/dashboard/developers


// 请把自己的 API KEY 字符串粘贴到这里，给出的 KEY 仅为示例。
var apiKey = "3vMj_fg6MkfaXPPBQ1hsudnwR3UKnHi1";
var encodedBasicAuth = "Basic " + $text.base64Encode("api:" + apiKey);

function compressWithTinyPNG(image_data) {
    $ui.toast("正在上传图片至 TinyPNG……");
    $http.request({
        method: "POST",
        url: "https://api.tinify.com/shrink",
        header: {
            Authorization: encodedBasicAuth,
        },
        body: image_data,

        handler: function (resp) {

            var response = resp.response;

            if (response.statusCode === 201) {
                $ui.toast("正在压缩……");
                compressedImageUrl = response.headers["Location"];
                $ui.toast("正在下载压缩后的图片……");
                $http.download({
                    url: compressedImageUrl,
                    handler: function (resp) {
                        if (resp.data) {
                            $photo.save({
                                data: resp.data,
                                handler: function (result) {
                                    if (result === true) {
                                        $ui.alert({
                                            title: "图片压缩完成，已保存至相册",
                                            message: "本 KEY 本月的已用压缩次数为：\n\n" + response.headers["compression-count"] + " / 500"
                                        })
                                    } else {
                                        $ui.alert({
                                            title: "Error",
                                            message: result
                                        })
                                        $app.close(2);
                                    }
                                }
                            })
                        }
                    }
                })
            } else if (response.statusCode === 401) {
                $ui.alert({
                    title: "验证失败",
                    message: "请确认 API KEY 填写正确，可以参考代码注释",
                })
                $app.close(2);
            } else {
                $ui.alert({
                    title: "压缩失败",
                    message: response.statusCode,
                })
                $app.close(2);
            }
        }
    })
}


if ($app.env == $env.today) {
    $ui.alert({
        title: "请勿在 Widget 中运行本脚本",
        message: "",
    });
    $app.close(2);

} else if ($app.env == $env.action) {
    if ($context.data) {
        compressWithTinyPNG($context.data);
    } else {
        $app.close(2);
    }
} else if ($app.env == $env.app) {
    $photo.pick({

        multi: false,
        format: "data",
        handler: function (resp) {
            var imageData = resp.data;
            compressWithTinyPNG(imageData);
        }
    })
} else {
    $ui.alert("请在 JSBox 主应用中 或 通过分享菜单运行本脚本");
    $app.close(2);
}