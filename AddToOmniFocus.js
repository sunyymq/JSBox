// By JunM。

// 日期格式化输出。
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

// 传入 Date 对象，格式化为 OmniFocus 需要的格式。
function formatTimeForOmniFocus(o) {
    if (o instanceof Date) {
        return o.format("yyyy-MM-dd hh:mm");
    } else {
        $ui.alert({
            title: "ERROR",
            message: "",
        })
    }
}


// 任务优先级，配合 OF 的透视使用。
var taskLevels = [
    { menu_name: "★★★★★★", content: "     #★★★★★★#" },
    { menu_name: "★★★★★", content: "     #★★★★★#" },
    { menu_name: "★★★★", content: "     #★★★★#" },
    { menu_name: "★★★", content: "     #★★★#" },
];
var taskLevel = taskLevels[0].content;

// 项目名称，OF 自动匹配，不一定要写完整名称。
var taskProjects = ["Miscellaneous", "工作", "杂务", "Project 示例", "Project 示例"];
var taskProject = taskProjects[0];

// Context 名称，同上，不一定写完整名称。
var taskContexts = ["Miscellaneous", "Waiting", "Context 示例", "Context 示例"];
var taskContext = taskContexts[0];

var finalUrl = "omnifocus://";
var taskContent = "";
var myDate = new Date();
var taskDefaultTime = formatTimeForOmniFocus(myDate);
var taskStartTime = taskDefaultTime;
var taskDueTime = taskDefaultTime;



var deviceScreenHeight = $device.info["screen"]["height"];
var deviceScreenWidth = $device.info["screen"]["width"];
var firstDatePickerTop = deviceScreenHeight * 0.01;
var datePickerHeight = deviceScreenHeight * 0.35;
var projectsAndContextsAndPrioritiesViewHeight = deviceScreenHeight * 0.23;

var datePickerViews = {
    props: {
        title: "Start & Due Time",
    },
    views: [
        {
            type: "date-picker",
            props: {
                interval: 5,
            },
            layout: function (make) {
                make.top.equalTo(firstDatePickerTop);
                make.centerX.equalTo(0);
                make.height.equalTo(datePickerHeight);
            },
            events: {
                changed: function (sender) {
                    taskStartTime = formatTimeForOmniFocus(sender.date);
                }
            }
        },
        {
            type: "date-picker",
            props: {
                interval: 5,
            },
            layout: function (make) {
                make.top.equalTo(firstDatePickerTop + datePickerHeight);
                make.centerX.equalTo(0);
                make.height.equalTo(datePickerHeight);
            },
            events: {
                changed: function (sender) {
                    taskDueTime = formatTimeForOmniFocus(sender.date);
                }
            }
        },

        {
            type: "button",
            props: {
                type: $btnType.custom,
                bgcolor: $color("#a362f7"),
                icon: $icon("064", $color("#222222"), $size(23, 23)),

                title: "  Next    ",
                font: $font("default", 26),
            },
            layout: function (make, view) {
                make.top.equalTo(firstDatePickerTop + datePickerHeight * 2 + deviceScreenHeight * 0.05);
                make.height.equalTo(50);
                make.width.equalTo(200);
                make.centerX.equalTo(deviceScreenWidth * 0.05);
            },
            events: {
                tapped: function (sender) {
                    $device.taptic(1);
                    $ui.push(projectsAndContextsPickerViews);

                }
            }
        }


    ]
};


var projectsAndContextsPickerViews = {
    props: {
        title: "Projects & Contexts",
    },
    views: [
        {
            type: "picker",
            props: {
                items: [taskLevels.map(function (item) { return item.menu_name })],
            },
            layout: function (make) {
                make.left.top.right.equalTo(0);
                make.height.equalTo(projectsAndContextsAndPrioritiesViewHeight);
            },
            events: {
                changed: function (sender) {
                    taskLevel = taskLevels[sender.selectedRows[0]].content;
                }
            }
        },
        {
            type: "picker",
            props: {
                items: [taskProjects],
            },
            layout: function (make) {
                make.top.equalTo(projectsAndContextsAndPrioritiesViewHeight * 1);
                make.left.right.equalTo(0);
                make.height.equalTo(projectsAndContextsAndPrioritiesViewHeight);
            },
            events: {
                changed: function (sender) {
                    taskProject = sender.data[0];
                }
            }
        },
        {
            type: "picker",
            props: {
                items: [taskContexts],
            },
            layout: function (make) {
                make.top.equalTo(projectsAndContextsAndPrioritiesViewHeight * 2);
                make.left.right.equalTo(0);
                make.height.equalTo(projectsAndContextsAndPrioritiesViewHeight);
            },
            events: {
                changed: function (sender) {
                    taskContext = sender.data[0];
                }
            }
        },
        {
            type: "button",
            props: {
                type: $btnType.custom,
                bgcolor: $color("#a362f7"),
                icon: $icon("064", $color("#222222"), $size(23, 23)),

                title: "  Finish  -->  ",
                font: $font("default", 26),
            },
            layout: function (make, view) {
                make.top.equalTo(firstDatePickerTop + datePickerHeight * 2 + deviceScreenHeight * 0.05);
                make.height.equalTo(50);
                make.width.equalTo(200);
                make.centerX.equalTo(deviceScreenWidth * 0.05);
            },
            events: {
                tapped: function (sender) {
                    $device.taptic(1);
                    finalUrl = "omnifocus:///paste?content="
                        + encodeURIComponent(taskContent
                            + taskLevel
                            + " @defer("
                            + taskStartTime
                            + ") @due("
                            + taskDueTime
                            + ") @context("
                            + taskContext
                            + ")")
                        + "&target="
                        + encodeURIComponent("/task/" + taskProject)
                        + "&x-success=jsbox://run?name=AddToOmniFocus"
                    $delay(0.5, function () {
                        $app.close();
                    });
                    $app.openURL(finalUrl);

                }
            }
        }
    ]
};

$input.text({
    placeholder: "请输入事项内容",
    handler: function (text) {
        taskContent = text;
        $ui.render(datePickerViews);
    }
});


