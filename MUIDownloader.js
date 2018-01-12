const link = $clipboard.link,
    parseHost = 'http://youtube1080.megavn.net',
    checkVersionUrl = 'https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/README.md',
    updateURL = 'jsbox://install?url=https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/MUIDownloader.js&icon=icon_035.png&name=MUIDownload',
    colors = {
        bgc: $color('#eee'),
        labelBgc: $color('#757575'),
        labelColor: $color('#fff'),
        labelTypeColor: {
            'mp4': $color('#4CAF50'),
            '3gp': $color('#00B0FF'),
            'webm': $color('#757575'),
            'mp3': $color('#FF8F00')
        },
    };

let version = '1.0.0', urlexec = '', keyword = '', originalData = null;

if (!link) return;

keyword = link.match(/.*\/.*v=(.*?)$|.*\/(.*?)$/);
keyword = keyword[1] || keyword[2];

function getVideoView (data) {
    return {
        type: 'view',
        props: {
            bgcolor: colors.bgc
        },
        layout: $layout.fill,
        views: [
            {
                type: 'view',
                props: {
                    id: 'videoView',
                    bgcolor: $color('#fff'),
                    radius: 5
                },
                layout: function (make) {
                    make.top.left.right.bottom.equalTo(0).inset(10);
                    make.height.equalTo(308);
                },
                views: [
                    {
                        type: "video",
                        props: {
                            id: 'previewVideo',
                            src: data.previewVideo.url,
                            poster: data.thumb[data.thumb.length - 1],
                            bgcolor: $color('#fff'),
                        },
                        layout: function(make, view) {
                            const h = Math.floor(($device.info.screen.width - 40) * 9 / 16);
                            make.top.equalTo(0).inset(7);
                            make.left.right.inset(7);
                            make.height.equalTo(h);
                        }
                    },
                    {
                        type: 'label',
                        props: {
                            id: 'videoFilename',
                            text: data.info.title,
                        },
                        layout (make) {
                            make.top.equalTo($('previewVideo').bottom);
                            make.right.left.equalTo(0).inset(10);
                            make.height.equalTo(30);
                        },
                    },
                    {
                        type: 'list',
                        props: {
                            template: {
                                views: [
                                    {
                                        type: "label",
                                        props: {
                                            id: "itemLabel",
                                        },
                                        layout (make, view) {
                                            make.center.equalTo(view.super);
                                        }
                                    },
                                    {
                                        type: "label",
                                        props: {
                                            id: "itemType",
                                            textColor: $color("#fff"),
                                            align: $align.center,
                                            font: $font(12),
                                            radius: 10
                                        },
                                        layout (make, view) {
                                            make.size.equalTo($size(50, 20));
                                            make.right.equalTo(10).inset(10);
                                            make.centerY.equalTo(view.super);
                                        }
                                    }
                                ]
                            },
                            data: [
                                {
                                    title: "Video + Audio:",
                                    rows: data.download
                                },
                                {
                                    title: "High Quality: (Merge Audio online)",
                                    rows: data.downloadf
                                }
                            ]
                        },
                        layout (make) {
                            make.top.equalTo($('videoFilename').bottom).inset(0);
                            make.right.bottom.left.equalTo(0);
                        },
                        events: {
                            didSelect: function (sender, indexPath, data) {
                                if (data && data.url) {
                                    $ui.toast(`开始下载 ${data.type.toLocaleUpperCase()}`);
                                    $http.download({
                                        url: data.url,
                                        handler: function(resp) {
                                            $device.taptic(0);
                                            $share.sheet([`${keyword} ${data.quality}.${data.type}`, resp.data]);
                                        }
                                    });
                                } else if (data) {
                                    $ui.loading(true);
                                    $ui.toast('请求转换服务器，等待转制');
                                    const params = {
                                        urlexec: urlexec,
                                        video_id: keyword,
                                        video_url: link,
                                        itag: data.itag,
                                        action: data.quality,
                                        title: originalData.info.title,
                                        token: originalData.token,
                                        email: 'muweigg@gmail.com'
                                    };
                                    $http.post({
                                        url: originalData.urlexec,
                                        timeout: 60,
                                        form: params,
                                        handler: function(resp) {
                                            let data = resp.data;
                                            $delay(1, () => {
                                                $ui.toast(`开始下载 ${data.ext.toLocaleUpperCase()}`);
                                                $http.download({
                                                    url: encodeURI(data.url),
                                                    handler: function(resp) {
                                                        $device.taptic(0);
                                                        $ui.loading(false);
                                                        $share.sheet([`${data.filename}`, resp.data]);
                                                    }
                                                });
                                            });
                                        }
                                    })
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
}

$ui.render({
    props: {
        title: `MUI Downloader ${version}`,
        bgcolor: colors.bgc
    },
    views: [
        {
            type: 'view',
            props: {
                id: 'labelView',
                bgcolor: colors.labelBgc,
                radius: 5
            },
            layout (make) {
                make.top.equalTo(10);
                make.right.left.inset(10);
                make.height.equalTo(50);
            },
            views: [
                {
                    type: 'label',
                    props: {
                        text: link,
                        textColor: colors.labelColor,
                    },
                    layout (make, view) {
                        make.right.left.inset(10);
                        make.centerY.equalTo(view.super);
                    }
                }
            ]
        },
        {
            type: 'view',
            props: {
                bgcolor: colors.bgc
            },
            layout (make) {
                make.top.equalTo($('labelView').bottom);
                make.left.right.bottom.equalTo(0);
            }
        }
    ]
})

function analysisVideoByLink () {
    $ui.loading(true);
    $http.post({
        url: `${parseHost}/ajax.php`,
        form: { curID: keyword, url: link },
        timeout: 30,
        handler: function(resp) {
            originalData = resp.data;
            urlexec = originalData.urlexec;
            let data = Object.assign({}, originalData);
            data.previewVideo = data.download.filter(v => {
                v.itemLabel = { text: v.quality };
                v.itemType = {
                    text: v.type.toLocaleUpperCase(),
                    bgcolor: colors.labelTypeColor[v.type]
                };
                return v.type === 'mp4';
            })[0];
            data.downloadf.map(v => {
                v.itemLabel = { text: v.quality };
                v.itemType = {
                    text: v.type.toLocaleUpperCase(),
                    bgcolor: colors.labelTypeColor[v.type]
                };
            });
            $('view').add(getVideoView(data));
            $ui.loading(false);
            $device.taptic(0);
        }
    })
}

function checkUpdate () {
    $http.get({
        url: checkVersionUrl,
        handler (resp) {
            if (version == resp.data) return;
            $device.taptic(0);
            $ui.alert({
                title: "更新提示",
                message: `发现新版本: ${resp.data}\n当前版本: ${version}\n是否更新 ?`,
                actions: [{
                    title: '取消',
                }, {
                    title: '更新',
                    handler () {
                        $ui.toast('正在更新');
                        $app.openURL(encodeURI(`${updateURL}`));
                    }
                }]
            })
        }
    });
}

checkUpdate();
analysisVideoByLink();