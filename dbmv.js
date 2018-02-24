const category = {
  "所有": "https://www.dbmeinv.com/dbgroup/show.htm?pager_offset=",
  "大胸妹": "https://www.dbmeinv.com/dbgroup/show.htm?cid=2&pager_offset=",
  "小翘臀": "https://www.dbmeinv.com/dbgroup/show.htm?cid=6&pager_offset=",
  "黑丝袜": "https://www.dbmeinv.com/dbgroup/show.htm?cid=7&pager_offset=",
  "美腿控": "https://www.dbmeinv.com/dbgroup/show.htm?cid=3&pager_offset=",
  "有颜值": "https://www.dbmeinv.com/dbgroup/show.htm?cid=4&pager_offset=",
  "大杂烩": "https://www.dbmeinv.com/dbgroup/show.htm?cid=5&pager_offset="
}

$ui.render({
  props: {
    title: "豆瓣妹子图"
  },
  views: [{
    type: "menu",
    props: {
      id: "menu",
      items: Object.keys(category),
    },
    layout: function(make) {
      make.top.left.right.inset(0)
      make.height.equalTo(40)
    },
    events: {
      changed(sender) {
        page = 0;
        postTitle = [];
        $("list").data = [];
        getPostData()

      }
    }
  }, {
    type: "matrix",
    props: {
      id: "list",
      columns: 2,
      spacing: 1,
      square: true,
      template: [{
        type: "image",
        props: {
          id: "image"
        },
        layout: $layout.fill
      }]
    },
    layout: function(make) {
      make.top.equalTo($("menu").bottom)
      make.left.right.bottom.inset(0)
    },
    events: {
      didReachBottom(sender) {
        sender.endFetchingMore();
        getPostData();
        $delay(1, function() {
          getPostData()
        })
      },
      didSelect(sender, indexPath, data) {
        postDetailView(data.detail)
      }
    }
  }]
})

function getPostData() {
  page++;
  $http.get({
    url: Object.values(category)[$("menu").index]+page,
    handler: function(resp) {
      var reg = /<div\sclass="img_single">[\s\S]*?<\/div>/g;
      var match = resp.data.match(reg);
      if (!match) {
        return
      };
      var postData = [];
      match.map(function(i) {
        var title = /title="([\s\S]*?)"/.exec(i)[1];
        var image = /src="([\s\S]*?)"/.exec(i)[1];
        var detail = /href="([\s\S]*?)"/.exec(i)[1];
        if (postTitle.indexOf(title) == -1) {

          postTitle.push(title);
          postData.push({
            "image": image,
            "detail": detail
          })
        }
      });
      $("list").data = $("list").data.concat(postData.map(function(i) {
        return {
          title: i.title,
          detail: i.detail,
          image: {
            src: i.image
          }
        }
      }));

    }
  })
}

function postDetailView(url) {
  $http.get({
    url: url,
    handler: function(resp) {
      var reg1 = /<div\sclass="topic-figure\scc">[\s\S]*?<\/div>/g;
      var reg2 = /http.*?jpg/g;
      var items = resp.data.match(reg1).toString().match(reg2);
      $quicklook.open({
        list: items
      })

    }
  })

}

page = 0;
postTitle = [];
getPostData()