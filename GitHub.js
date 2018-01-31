const debugMode = true
const
    loginViews = [{
        type: "blur",
        props: {
            style: 1,
            radius: 20,
            bgcolor: $color("lightGray")
        },
        layout: function (make, view) {
            make.bottom.inset(40)
            make.top.left.right.inset(10)
            make.center.equalTo(view.super)
        },
        views: [{
            type: "input",
            props: {
                radius: 10,
                id: "TokenInput",
                type: $kbType.search,
                placeholder: "请输入Token",
                clearsOnBeginEditing: true,
            },
            layout: function (make, view) {
                make.height.equalTo(40)
                make.top.left.right.inset(10)
                make.centerX.equalTo(view.super)

            },
            events: {
                returned: function (sender) {
                    validationToken(sender.text)
                }
            }
        }, {
            type: "button",
            props: {
                title: "还没有Token?",
                align: $align.center,
                bgcolor: $color("clear"),
                titleColor: $color("#3a9fff")
            },
            layout: function (make, view) {
                make.height.equalTo(20)
                make.centerX.equalTo(view.super)
                make.top.equalTo(view.prev.bottom).offset(5)
            },
            events: {
                tapped: function (sender) {
                    $("loginWeb").url = "https://github.com/settings/tokens/new"
                }
            }
        }, {
            type: "web",
            props: {
                radius: 20,
                id: "loginWeb"
            },
            layout: function (make, view) {
                make.bottom.inset(10)
                make.left.right.inset(10)
                make.centerX.equalTo(view.super)
                make.top.equalTo(view.prev.bottom).offset(5)
            }
        }]
    }],
    reposViews = [{
        type: "blur",
        props: {
            style: 1,
            radius: 20,
            id: "reposViews",
            bgcolor: $color("lightGray"),
        },
        layout: function (make, view) {
            make.bottom.inset(40)
            make.top.left.right.inset(10)
            make.center.equalTo(view.super)
        },
        views: [{
            type: "list",
            props: {
                id: "repos",
                rowHeight: 60,
                template: {
                    props: {
                        bgcolor: $color("clear")
                    },
                    views: [{
                        type: "label",
                        props: {
                            id: "reposName",
                            align: $align.left,
                        },
                        layout: function (make, view) {
                            make.top.left.inset(10)
                        }
                    }, {
                        type: "label",
                        props: {
                            font: $font(12),
                            id: "reposInfo",
                            align: $align.center,
                            textColor: $color("#666666"),
                        },
                        layout: function (make, view) {
                            make.left.bottom.inset(10)
                        }
                    }]
                },
            },
            events: {
                didSelect: function (sender, indexPath, data) {
                    async function getRepoData(url) {
                        $ui.loading(true)
                        let repoData = [];
                        let repoDataRes = await getApiData("https://api.github.com/repos/" + GHOwner + data.reposName.text + "/contents");
                        if (repoDataRes.length)
                            for (let value of repoDataRes) {
                                if (value) {
                                    repoData.push({
                                        repoName: {
                                            text: value.name
                                        },
                                        repoInfo: {
                                            type: value.type,
                                            text: value.type == "dir" ? "文件夹" : value.type
                                        },
                                        sha: value.sha,
                                        html: value._links.html,
                                        file: value.download_url,
                                        path: "https://api.github.com/repos/" + GHOwner + data.reposName.text + "/contents/"
                                    })
                                }
                            }
                        else
                            repoData.push({
                                repoName: {
                                    text: "该文件夹没有文件"
                                },
                                repoInfo: {
                                    type: "",
                                    text: ""
                                },
                                file: "空文件",
                                path: "https://api.github.com/repos/" + GHOwner + data.reposName.text + "/contents/"
                            })
                        $ui.loading(false)
                        pushView(repoData)
                    }
                    getRepoData()
                }
            },
            layout: $layout.fill,
        }]
    }, {
        type: "button",
        props: {
            radius: 10,
            title: "新建库"
        },
        layout: function (make, view) {
            make.left.inset(20)
            make.width.equalTo(100)
            make.top.equalTo(view.prev.bottom).offset(3.5)
        },
        events: {
            tapped(sender) {
                pushWeb("https://github.com/new")
            }
        }
    }, {
        type: "button",
        props: {
            radius: 10,
            title: "授权码"
        },
        layout: function (make, view) {
            make.right.inset(20)
            make.width.equalTo(100)
            make.top.equalTo(view.prev)
        },
        events: {
            tapped(sender) {
                changeToken()
            }
        }
    }]
var
    GHUrl = null,
    GHOwner = null,
    Token = {
        LPath: "GitHub",
        IPath: "drive://GitHub",
        Value: null,
        LValue: $file.read("GitHub/Token.conf"),
        IValue: $file.read("drive://GitHub/Token.conf")
    };
// 函数开始
async function makeMainView(views) {
    $ui.render({
        props: {
            title: "GitHub",
            bgcolor: $color("#dddddd")
        },
        views: views
    })
}

async function pushView(data) {
    console(data)
    $ui.push({
        props: {
            title: "repo",
            id: "repoViewMain",
            bgcolor: $color("#dddddd"),
        },
        views: [{
            type: "blur",
            props: {
                style: 1,
                radius: 20,
                bgcolor: $color("lightGray")
            },
            layout: function (make, view) {
                make.bottom.inset(40)
                make.top.left.right.inset(10)
                make.center.equalTo(view.super)
            },
            views: [{
                type: "list",
                props: {
                    id: "repo",
                    data: data,
                    rowHeight: 60,
                    template: {
                        props: {
                            bgcolor: $color("clear")
                        },
                        views: [{
                            type: "label",
                            props: {
                                id: "repoName",
                                align: $align.left,
                            },
                            layout: function (make, view) {
                                make.top.left.inset(10)
                            }
                        }, {
                            type: "label",
                            props: {
                                font: $font(12),
                                id: "repoInfo",
                                align: $align.center,
                                textColor: $color("#666666"),
                            },
                            layout: function (make, view) {
                                make.left.bottom.inset(10)
                            }
                        }]
                    },
                    actions: [
                        {
                            title: "delete",
                            handler: function (tableView, indexPath) {
                                deleteFile(data[indexPath.row])
                            }
                        },
                        {
                            title: "阅览",
                            handler: function (tableView, indexPath) {
                                pushWeb(data[indexPath.row].html)
                            }
                        }
                    ],
                },
                events: {
                    didSelect: function (sender, indexPath, data) {
                        async function getRepoData() {
                            $ui.loading(true)
                            let repoData = [];
                            let repoDataRes = await getApiData(data.path + data.repoName.text);
                            if (repoDataRes.length)
                                for (let value of repoDataRes) {
                                    if (value) {
                                        repoData.push({
                                            repoName: {
                                                text: value.name
                                            },
                                            repoInfo: {
                                                type: value.type,
                                                text: value.type == "dir" ? "文件夹" : value.type
                                            },
                                            sha: value.sha,
                                            html: value._links.html,
                                            file: value.download_url,
                                            path: data.path + data.repoName.text + "/"
                                        })
                                    }
                                }
                            else
                                repoData.push({
                                    repoName: {
                                        text: "该文件夹没有文件"
                                    },
                                    repoInfo: {
                                        type: "",
                                        text: ""
                                    },
                                    file: "空文件",
                                    path: data.path
                                })
                            $ui.loading(false)
                            pushView(repoData)
                        }
                        async function quickLook(data) {
                            $ui.loading(true)
                            $http.download({
                                url: data.file,
                                header: {
                                    Authorization: "token " + Token.Value,
                                },
                                handler: function (resp) {
                                    $ui.loading(false)
                                    resp.data.string ? editedView(resp.data.string, data) : 0
                                }
                            })
                        }
                        data.file ? quickLook(data) : getRepoData()
                    }
                },
                layout: $layout.fill,
            }]
        }, {
            type: "button",
            props: {
                radius: 10,
                title: "新建"
            },
            layout: function (make, view) {
                make.left.inset(20)
                make.width.equalTo(100)
                make.top.equalTo(view.prev.bottom).offset(3.5)
            },
            events: {
                tapped(sender) {
                    createRepo(data[0])
                }
            }
        }, {
            type: "button",
            props: {
                radius: 10,
                title: "刷新"
            },
            layout: function (make, view) {
                make.right.inset(20)
                make.width.equalTo(100)
                make.top.equalTo(view.prev)
            },
            events: {
                tapped(sender) {
                    async function getRepoData(path) {
                        let repoData = [];
                        let repoDataRes = await getApiData(path);
                        if (repoDataRes.length)
                            for (let value of repoDataRes) {
                                if (value) {
                                    repoData.push({
                                        repoName: {
                                            text: value.name
                                        },
                                        repoInfo: {
                                            type: value.type,
                                            text: value.type == "dir" ? "文件夹" : value.type
                                        },

                                        sha: value.sha,
                                        path: path,
                                        html: value._links.html,
                                        file: value.download_url,
                                    })
                                }
                            }
                        else
                            repoData.push({
                                repoName: {
                                    text: "该文件夹没有文件"
                                },
                                repoInfo: {
                                    type: "",
                                    text: ""
                                },
                                file: "空文件",
                                path: path
                            })
                        $("repo").data = repoData
                    }
                    getRepoData(data[0].path)
                }
            }
        }],
        layout: $layout.fill
    })
}

async function changeToken() {
    $ui.push({
        props: {
            title: "Token",
            bgcolor: $color("#dddddd")
        },
        views: loginViews,
        layout: $layout.fill
    })
    $("TokenInput").placeholder = "当前Token：" + Token.Value
}

async function editedView(data, repo) {
    const updataRepo = [{
        type: "list",
        props: {
            data: [{
                type: "view",
                layout: $layout.fill,
                views: [{
                    type: "input",
                    props: {
                        radius: 10,
                        data: " ",
                        id: "repoMessage",
                        type: $kbType.search,
                        placeholder: "提交的消息,可留空,非必填..."
                    },
                    layout: function (make, view) {
                        make.top.left.right.bottom.inset(5)
                    }
                }]
            }, {
                type: "button",
                props: {
                    title: "开始上传"
                },
                layout: function (make, view) {
                    make.top.left.right.bottom.inset(5)
                },
                events: {
                    tapped(sender) {
                        $ui.loading(true)
                        $http.request({
                            method: "PUT",
                            url: repo.path + repo.repoName.text,
                            header: {
                                Authorization: "token " + Token.Value,
                            },
                            body: {
                                sha: repo.sha,
                                path: repo.path + repo.repoName.text,
                                message: $("repoMessage").text,
                                content: $text.base64Encode($("text").text),
                            },
                            handler: async function (resp) {
                                alert("文件上传成功,刷新数据中...", "\n输入框内文字与网页内容显示存在延时\n延时时间为：1~10分钟之内...")
                                $("repos").data = await updataRopesPage()
                                $ui.pop()
                                $ui.loading(false)
                            }
                        })
                    }
                }
            }]
        },
        layout: $layout.fill,
    }];
    $ui.push({
        props: {
            title: "repo",
            id: "repoViewMain",
            bgcolor: $color("#dddddd"),
        },
        views: [{
            type: "blur",
            props: {
                style: 1,
                radius: 20,
                bgcolor: $color("lightGray")
            },
            layout: function (make, view) {
                make.bottom.inset(40)
                make.top.left.right.inset(10)
                make.center.equalTo(view.super)
            },
            views: [{
                type: "text",
                props: {
                    radius: 20,
                    text: data,
                    align: $align.left
                },
                layout: function (make, view) {
                    make.bottom.inset(50)
                    make.top.left.right.inset(10)
                    make.center.equalTo(view.super)
                },
            }, {
                type: "button",
                props: {
                    title: "取消"
                },
                layout: function (make, view) {
                    make.left.inset(50)
                    make.width.equalTo(50)
                    make.top.equalTo(view.prev.bottom).offset(10)
                },
                events: {
                    tapped(sender) {
                        $ui.pop()
                    }
                }
            }, {
                type: "button",
                props: {
                    title: "保存"
                },
                layout: function (make, view) {
                    make.right.inset(50)
                    make.width.equalTo(50)
                    make.top.equalTo(view.prev)
                },
                events: {
                    tapped(sender) {
                        $("repoViewMain").add({
                            type: "blur",
                            props: {
                                alpha: 0,
                                style: 2,
                                id: "saved",
                                radius: 20,
                                bgcolor: $color("lightGray")
                            },
                            layout: function (make, view) {
                                make.bottom.inset(40)
                                make.top.left.right.inset(10)
                                make.center.equalTo(view.super)
                            },
                            views: [{
                                type: "view",
                                props: {
                                    radius: 20,
                                    bgcolor: $color("lightGray")
                                },
                                layout: function (make, view) {
                                    make.bottom.inset(50)
                                    make.top.left.right.inset(10)
                                    make.center.equalTo(view.super)
                                },
                                views: updataRepo
                            }]
                        })
                        $ui.animate({
                            duration: 0.4,
                            animation: function () {
                                $("saved").alpha = 1
                            }
                        })
                    }
                }
            }]
        }],
        layout: $layout.fill
    })
}

async function createRepo(repo) {
    const updataRepo = [{
        type: "list",
        props: {
            data: [{
                type: "view",
                layout: $layout.fill,
                views: [{
                    type: "input",
                    props: {
                        radius: 10,
                        id: "repoName",
                        type: $kbType.search,
                        placeholder: "文件的名字,必填..."
                    },
                    layout: function (make, view) {
                        make.top.left.right.bottom.inset(5)
                    }
                }]
            }, {
                type: "view",
                layout: $layout.fill,
                views: [{
                    type: "input",
                    props: {
                        radius: 10,
                        id: "repoMessage",
                        type: $kbType.search,
                        placeholder: "提交的消息,非必填..."
                    },
                    layout: function (make, view) {
                        make.top.left.right.bottom.inset(5)
                    }
                }]
            }, {
                type: "button",
                props: {
                    title: "开始上传"
                },
                layout: function (make, view) {
                    make.top.left.right.bottom.inset(5)
                },
                events: {
                    tapped(sender) {
                        $ui.loading(true)
                        $http.request({
                            method: "PUT",
                            url: repo.path + $("repoName").text,
                            header: {
                                Authorization: "token " + Token.Value,
                            },
                            body: {
                                path: repo.path + $("repoName").text,
                                message: $("repoMessage").text,
                                content: $text.base64Encode($("text").text),
                            },
                            handler: async function (resp) {
                                alert($("repoName").text, "文件上传成功,稍后自行刷新数据...")
                                $ui.pop()
                                $ui.loading(false)
                            }
                        })
                    }
                }
            }]
        },
        layout: $layout.fill,
    }];
    $ui.push({
        props: {
            title: "repo",
            id: "repoViewMain",
            bgcolor: $color("#dddddd"),
        },
        views: [{
            type: "blur",
            props: {
                style: 1,
                radius: 20,
                bgcolor: $color("lightGray")
            },
            layout: function (make, view) {
                make.bottom.inset(40)
                make.top.left.right.inset(10)
                make.center.equalTo(view.super)
            },
            views: [{
                type: "text",
                props: {
                    radius: 20,
                    align: $align.left
                },
                layout: function (make, view) {
                    make.bottom.inset(50)
                    make.top.left.right.inset(10)
                    make.center.equalTo(view.super)
                },
            }, {
                type: "button",
                props: {
                    title: "取消"
                },
                layout: function (make, view) {
                    make.left.inset(50)
                    make.width.equalTo(50)
                    make.top.equalTo(view.prev.bottom).offset(10)
                },
                events: {
                    tapped(sender) {
                        $ui.pop()
                    }
                }
            }, {
                type: "button",
                props: {
                    title: "创建"
                },
                layout: function (make, view) {
                    make.right.inset(50)
                    make.width.equalTo(50)
                    make.top.equalTo(view.prev)
                },
                events: {
                    tapped(sender) {
                        $("repoViewMain").add({
                            type: "blur",
                            props: {
                                alpha: 0,
                                style: 2,
                                id: "saved",
                                radius: 20,
                                bgcolor: $color("lightGray")
                            },
                            layout: function (make, view) {
                                make.bottom.inset(40)
                                make.top.left.right.inset(10)
                                make.center.equalTo(view.super)
                            },
                            views: [{
                                type: "view",
                                props: {
                                    radius: 20,
                                    bgcolor: $color("lightGray")
                                },
                                layout: function (make, view) {
                                    make.bottom.inset(50)
                                    make.top.left.right.inset(10)
                                    make.center.equalTo(view.super)
                                },
                                views: updataRepo
                            }]
                        })
                        $ui.animate({
                            duration: 0.4,
                            animation: function () {
                                $("saved").alpha = 1
                            }
                        })
                    }
                }
            }]
        }],
        layout: $layout.fill
    })
}

async function validationToken(token) {

    async function tokenPass(login, url) {
        GHUrl = url + "/"
        GHOwner = login + "/"
        function success() {
            Token.Value = token
            alert("Token验证结果\n\n验证成功\n")
        }
        Token.IValue || Token.LValue ? Token.Value = token : success()
        $("repos").data = await updataRopesPage()
        $ui.loading(false)
    }

    function tokenFail() {
        makeMainView(loginViews)
        alert("Token验证结果\n\n验证失败\n储存的旧Token已删除...")
        Token.LValue ? $file.delete("GitHub/Token.conf") : 0
        Token.IValue ? $file.delete("drive://GitHub/Token.conf") : 0
    }
    saveToken(token)
    makeMainView(reposViews)
    $ui.loading(true)
    $http.get({
        url: "https://api.github.com/user",
        header: {
            Authorization: "token " + token,
        },
        handler: function (resp) {
            var data = resp.data
            data.login ? tokenPass(data.login, data.url) : tokenFail()
        }
    })
}

async function pushWeb(params) {
    $ui.push({
        props: {
            title: "repo",
            id: "repoViewMain",
            bgcolor: $color("#dddddd"),
        },
        views: [{
            type: "blur",
            props: {
                style: 1,
                radius: 20,
                bgcolor: $color("lightGray")
            },
            layout: function (make, view) {
                make.bottom.inset(40)
                make.top.left.right.inset(10)
                make.center.equalTo(view.super)
            },
            views: [{
                type: "web",
                props: {
                    radius: 20,
                    url: params,
                    id: "loginWeb"
                },
                layout: $layout.fill
            }]
        }],
        layout: $layout.fill
    })
}

async function updataRopesPage() {
    let num = 1;
    let repos;
    let reposData = [];
    do {
        repos = await getApiData(GHUrl + "repos?page=" + num);
        for (let value of repos) {
            if (value) {
                reposData.push({
                    reposName: {
                        text: value.name
                    },
                    reposInfo: {
                        text: value.description ? value.description : "暂无"
                    }
                })
            }
        }
        num++
    }
    while (reposData.length % 30 == 0)
    return reposData;
}

async function getApiData(url) {
    return new Promise(resolve => {
        $http.get({
            url: url,
            header: {
                Authorization: "token " + Token.Value,
            },
            handler: function (resp) {
                resolve(resp.data)
            }
        })
    });
}

async function readToken() {

    function NotToken() {
        $file.exists(Token.IPath) ? HaveToken() : makeMainView(loginViews);
    }

    function HaveToken() {
        typeof (Token.IValue) == "undefined" ? chooseToken() : validationToken(Token.IValue.string);
    }

    function chooseToken() {
        typeof (Token.LValue) == "undefined" ? makeMainView(loginViews) : validationToken(Token.LValue.string);
    }

    $file.exists(Token.LPath) ? HaveToken() : NotToken();

}

async function deleteFile(data) {
    async function getRepoData() {
        let repoData = [];
        let repoDataRes = await getApiData(data.path);
        if (repoDataRes.length)
            for (let value of repoDataRes) {
                if (value) {
                    repoData.push({
                        repoName: {
                            text: value.name
                        },
                        repoInfo: {
                            type: value.type,
                            text: value.type == "dir" ? "文件夹" : value.type
                        },

                        sha: value.sha,
                        path: data.path,
                        html: value._links.html,
                        file: value.download_url,
                    })
                }
            }
        else
            repoData.push({
                repoName: {
                    text: "该文件夹没有文件"
                },
                repoInfo: {
                    type: "",
                    text: ""
                },
                file: "空文件",
                path: data.path
            })
        return repoData
    }
    $http.request({
        method: "DELETE",
        url: data.path + data.repoName.text,
        header: {
            Authorization: "token " + Token.Value,
        },
        body: {
            sha: data.sha,
            path: data.path + data.repoName.text,
            message: "由JSbox版GitHub删除...",
        },
        handler: async function (resp) {
            $ui.loading(true)
            $("repo").data = await getRepoData()
            $ui.loading(false)
            resp.data.content == null ? $ui.toast(data.repoName.text + " 删除成功") : $ui.toast(data.repoName.text + " 删除失败");
        }
    })
}

function saveToken(token) {
    $file.mkdir(Token.IPath);
    $file.mkdir(Token.LPath);
    $file.write({
        data: $data({ string: token }),
        path: "GitHub/Token.conf"
    })
    $drive.write({
        data: $data({ string: token }),
        path: "GitHub/Token.conf"
    })
    console("写入Token")
}

function console(params) {
    debugMode ? $console.info(params) : 0
}

function alert(params, message) {
    $ui.alert({
        title: params,
        message: message,
    })
}

readToken()
