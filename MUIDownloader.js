/**
 * MUI Downloader
 * @author MUI <muweigg@gmail.com>
 * @description YouTube & Tumblr 视频下载器
 */

const parseHost = 'http://youtube1080.megavn.net',
    checkVersionUrl = 'https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/README.md',
    updateURL = 'jsbox://install?url=https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/MUIDownloader.js&icon=icon_035.png&name=MUIDownloader',
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

let version = '1.1.2', link = '', keyword = '', originalData = null;

link = $detector.link($context.text).map(link => {
    if (/youtu(\.?be)?|tumblr/.test(link))
        return link;
});
link = link.length > 0 ? link[0] : $context.link ? $context.link : $clipboard.link;

if (!link) return;
if (!/youtu(\.?be)?|tumblr/.test(link)) {
    $ui.alert({
        title: "暂不支持",
        message: "目前只支持：YouTube & Tumblr",
    });
    return;
}

if (/youtu(\.?be)?/.test(link)) {
    keyword = link.match(/.*\/.*v=(.*?)(&feature=.*?)?$|.*\/(.*?)(&feature=.*?)?$/);
    keyword = keyword[1] || keyword[3];
    link = `https://youtu.be/${keyword}`;
}

function convertFunc (func) {
    return func.toString().replace(/^.*?\{|\}.*?$/g, '');
}

function getVideoView (data) {

    let listData = [
        {
            title: "Video + Audio:",
            rows: data.download
        }
    ];

    if (data.downloadf) {
        listData.push({
            title: "High Quality: (Merge Audio online)",
            rows: data.downloadf
        });
    }

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
                layout (make) {
                    make.top.left.right.bottom.equalTo(0).inset(10);
                    make.height.equalTo(308);
                },
                views: [
                    {
                        type: "video",
                        props: {
                            id: 'previewVideo',
                            src: data.url,
                            poster: data.thumb,
                            bgcolor: $color('#fff'),
                        },
                        layout (make, view) {
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
                            data: listData
                        },
                        layout (make) {
                            make.top.equalTo($('videoFilename').bottom).inset(0);
                            make.right.bottom.left.equalTo(0);
                        },
                        events: {
                            didSelect (sender, indexPath, data) {
                                if (/youtu(\.?be)?/.test(link)) ytDownload(data);
                                if (/tumblr/.test(link)) tDownload(data);
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
});

function ytDownload (data) {
    if (data && data.url) {
        $ui.toast(`开始下载 ${data.type.toLocaleUpperCase()}`);
        $http.download({
            url: data.url,
            handler: function(resp) {
                $device.taptic(0);
                $share.sheet([`${data.title}-${keyword}-${data.quality}.${data.type}`, resp.data]);
            }
        });
    } else if (data) {
        $ui.loading(true);
        $ui.toast('请求转换服务器，等待转制', 5);
        const params = {
            urlexec: originalData.urlexec,
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
                    $ui.toast(`开始下载 ${data.ext.toLocaleUpperCase()}`, 5);
                    $http.download({
                        url: encodeURI(data.url),
                        handler: function(resp) {
                            $device.taptic(0);
                            $ui.loading(false);
                            $share.sheet([`${data.title}.${data.ext}`, resp.data]);
                        }
                    });
                });
            }
        })
    }
}

function tDownload (data) {
    $ui.toast(`开始下载`);
    $http.download({
        url: data.url,
        handler: function(resp) {
            $device.taptic(0);
            $share.sheet([`${data.title}.mp4`, resp.data]);
        }
    });
}

function analysisYouTubeVideoByLink () {
    $ui.loading(true);
    $ui.toast(`解析地址`);
    $http.post({
        url: `${parseHost}/ajax.php`,
        form: { curID: keyword, url: link },
        timeout: 30,
        handler (resp) {
            originalData = resp.data;
            let data = Object.assign({}, originalData);
            data.url = data.download.filter(v => {
                v.title = data.info.title;
                v.itemLabel = { text: v.quality };
                v.itemType = {
                    text: v.type.toLocaleUpperCase(),
                    bgcolor: colors.labelTypeColor[v.type]
                };
                return v.type === 'mp4';
            })[0].url;
            data.thumb = data.thumb[data.thumb.length - 1];
            if (data.downloadf instanceof Array) {
                data.downloadf.map(v => {
                    v.title = data.info.title;
                    v.itemLabel = { text: v.quality };
                    v.itemType = {
                        text: v.type.toLocaleUpperCase(),
                        bgcolor: colors.labelTypeColor[v.type]
                    };
                });
            } else {
                delete data.downloadf;
            }
            $('view').add(getVideoView(data));
            $ui.loading(false);
            $device.taptic(0);
        }
    })
}

function parseHTML () {
    let data = {
        url: '',
        download: [],
        thumb: '',
        info: {
            title: ''
        }
    }
    const img = document.querySelector('#videoContainer img');
    const atags = document.querySelectorAll('#videoDownload a');
    for (let i = 0; i < atags.length; i++ ) {
        let a = atags[i];
        if (/tumblr.*?video_file/.test(a.href)) {
            data.download.push({
                url: a.href
            });
        }
    }
    if (img.src != '') data.thumb = img.src;
    let v = data.download[data.download.length - 1];
    data.url = v.url;
    data.info.title = v.url.match(/.*\/(.*?)$/)[1];
    $notify('processData', data);
}

function analysisTumblrVideoByLink () {
    $ui.loading(true);
    $ui.toast(`解析地址中，请耐心等待`);
    $('view').add({
        type: "web",
        props: {
            url: `https://www.tubeoffline.com/downloadFrom.php?host=tumblr&video=${encodeURI(link)}`,
        },
        layout (make) {
            make.size.equalTo($size(0, 0));
        },
        events: {
            didFinish (sender) {
                $ui.loading(false);
                $ui.toast('解析完成');
                sender.eval({ script: convertFunc(parseHTML) });
            },
            processData (data) {
                data.download.map(v => {
                    v.itemLabel = { text: data.info.title };
                    v.itemType = {
                        text: 'MP4',
                        bgcolor: colors.labelTypeColor['mp4']
                    };
                });
                $('view').add(getVideoView(data));
                $device.taptic(0);
            }
        }
    });
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
if (/youtu(\.?be)?/.test(link)) analysisYouTubeVideoByLink();
if (/tumblr/.test(link)) analysisTumblrVideoByLink();