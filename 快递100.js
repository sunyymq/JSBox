var storied = $cache.get("storied") ? $cache.get("storied") : []

function Api(num) {
    $ui.loading(true)
    saveOrder(num)
    $http.get({
        url: "https://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=" + num,
        handler: function (resp) {
            var data = resp.data
            var comCode = data.auto[0].comCode
            $http.get({
                url: "https://www.kuaidi100.com/query?type=" + comCode + "&postid=" + num,
                handler: function (resp) {
                    var data = resp.data
                    if (data == 200) {
                        cleardata(data.data)
                    }else{
                        $ui.loading(false)
                        $delay(timer(), function() {
                            $ui.alert("emmm...\n没有从快递100找到数据\n请过几个小时后再查询吧~")
                        })
                    }
                    
                }
            })
        }
    })
}

function timer() {
    if ($app.env == $env.today) return 0.5;
    else return 0;
}

function datainfo(data) {
    var info = "\n"
    data = data.split(/[，,]/)
    if (data) {
        for (const key in data) {
            info = info + "- " + data[key]
            if (key != data.length - 1) info = info + "\n\n"
        }
    }
    return info
}

function cleardata(object) {
    let NILArray = []
    for (const key in object) {
        let data = object[key]
        NILArray.push({
            time: data.time,
            text: data.context
        })
    }
    $ui.loading(false)
    initMessage(NILArray)
}

function makeItems(object) {
    let temp = []
    for (const key in object) {
        t = object[key]
        text = t.text.split(/[，,]/)
        temp.push(t.time + " " + text[0])
    }
    return temp
}

function saveOrder(num) {
    let length = storied.length
    if (length) {
        for (const key in storied) {
            if (storied[key] == num) break;
            else {
                if (key == length - 1) {
                    storied.unshift(num)
                    $cache.set("storied", storied)
                }
            }
        }
    } else {
        storied.unshift(num)
        $cache.set("storied", storied)
    }
}

function initMessage(data) {
    let news = data[0];
    $delay(timer(), function () {
        $ui.alert({
            title: "最新动态\n" + news.time,
            message: datainfo(news.text),
            actions: [{
                title: "退出",
                handler: function () {
                    $app.close()
                }
            }, {
                title: "详细",
                handler: function () {
                    $delay(timer(), function () {
                        $ui.menu({
                            items: makeItems(data),
                            handler: function (title, idx) {
                                let news = data[idx]
                                $delay(timer(), function () {
                                    $ui.alert({
                                        title: "当前动态\n" + news.time,
                                        message: datainfo(news.text),
                                    })
                                })
                            }
                        })
                    })
                }
            }
            ]
        })
    })
}

function Initialize() {
    var num = $clipboard.text
    var pattern = /[1-9]([0-9]{10,14})/;
    if (pattern.test(num)) Api(num)
    else {
        if (storied.length)
            $ui.alert({
                title: "emmm...\n貌似剪贴板没有快递单号哦~\n",
                message: "是否查看历史查询单号?\n",
                actions: [{
                    title: "否",
                    handler: function () {
                        $app.close()
                    }
                }, {
                    title: "是",
                    handler: function () {
                        $delay(timer(), function () {
                            $ui.menu({
                                items: storied,
                                handler: function (title, idx) {
                                    $delay(timer(), function () {
                                        $ui.alert({
                                            title: "单号：" + title,
                                            message: "\n选择将要进行的操作\n",
                                            actions: [{
                                                title: "删除历史",
                                                handler: function () {
                                                    for (const key in storied) {
                                                        if (storied[key] == title) {
                                                            storied.splice(key, 1)
                                                            $cache.set("storied", storied)
                                                        }
                                                    }
                                                }
                                            }, {
                                                title: "查看动态",
                                                handler: function () {
                                                    Api(title)
                                                }
                                            },]
                                        })
                                    })
                                }
                            })
                        })
                    }
                }]
            })
        else $ui.alert("抱歉,没有找到任何单号~")
    }

}

Initialize()