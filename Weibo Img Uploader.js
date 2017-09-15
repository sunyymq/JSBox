   /*
   Weibo Img Uploader
   通过微博图片链接查找发图人微博
   by Neurogram
   */

   var url = $context.safari ? $context.safari.items.location.href : $context.link || $clipboard.text
   var urlTest = /sinaimg.cn/.test(url)
   if (urlTest == false) {
     $ui.alert("微博图片地址错误")
     $app.close()
   }

   function decodeBase62(number) {
     var alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
     var out = 0
     var len = number.length - 1
     for (var t = 0; t <= len; t++) {
       out = out + alphabet.indexOf(number.substr(t, 1)) * Math.pow(62, len - t)
     }
     return out
   }

   function decode16Unit(number) {
     return parseInt(number, 16)
   }

   function decode(number) {
     if (number.startsWith('00')) {
       return decodeBase62(number)
     } else {
       return decode16Unit(number)
     }
   }

   function findNumber(url) {
     var lastIndexOfSlash = url.lastIndexOf('/')
     var number = url.substr(lastIndexOfSlash + 1, 8)
     return number
   }

   function findUid(url) {
     var number = findNumber(url)
     var uid = decode(number)
     return uid
   }

   function constructHomePageUrl(uid) {
     var prefixUrl = 'http://weibo.com/u/'
     return prefixUrl + uid
   }

   function main(url) {
     var uid = findUid(url)
     var homePageUrl = constructHomePageUrl(uid)
     console.log(homePageUrl)
     return homePageUrl
   }
   $ui.alert({
     title: "此图片指向的实际微博地址为",
     message: main(url),
     actions: [{
         title: "复制",
         handler: function() {
           $clipboard.text = main(url)
           $app.close()
         }
       },
       {
         title: "预览",
         handler: function() {
           $ui.preview({
             title: "微博",
             url: main(url)
           })
         }
       }
     ]
   })
