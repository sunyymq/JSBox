// 循环删除相册内容
// 直至选择 “拒绝”
// By JunM 2018-01-24
// https://t.me/jun_m

function deletePhoto() {

    $photo.delete({
        count: 1,
        handler: function (success) {
            if (success === true) {
                deletePhoto();
            }
        }
    })
}

deletePhoto();