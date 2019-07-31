var appKey = "appキーを入力";
var clientKey = "クライアントキーを入力";

var ncmb = new NCMB(appKey, clientKey);

///// Called when app launch
$(function () {
  $("#LoginBtn").click(onLoginBtn);
  $("#RegisterBtn").click(onRegisterBtn);
  $("#YesBtn_logout").click(onLogoutBtn);
});

//----------------------------------USER MANAGEMENT-------------------------------------//
var currentLoginUser; //現在ログイン中ユーザー

function onRegisterBtn() {
  //入力フォームからusername, password変数にセット
  var username = $("#reg_username").val();
  var password = $("#reg_password").val();

  var user = new ncmb.User();
  user.set("userName", username)
    .set("password", password);

  // 任意フィールドに値を追加
  user.signUpByAccount()
    .then(function (user) {
      alert("新規登録に成功");
      //ローカルストレージに保存
      localStorage.setItem('userName', username);
      currentLoginUser = ncmb.User.getCurrentUser();
      $.mobile.changePage('#DetailPage');
    })
    .catch(function (error) {
      alert("新規登録に失敗！");
    });
}

function onLoginBtn() {
  var username = $("#login_username").val();
  var password = $("#login_password").val();
  // ユーザー名とパスワードでログイン
  ncmb.User.login(username, password)
    .then(function (user) {
      alert("ログイン成功");
      //ローカルストレージに保存
      localStorage.setItem('userName', username);
      currentLoginUser = ncmb.User.getCurrentUser();
      $.mobile.changePage('#DetailPage');
    })
    .catch(function (error) {
      alert("ログイン失敗！");
    });
}

function onLogoutBtn() {
  ncmb.User.logout();
  //ローカルストレージの消去
  localStorage.removeItem('userName');
  alert('ログアウト成功');
  currentLoginUser = null;
  nowuser = null;
  $.mobile.changePage('#LoginPage');
}

//現在のログインユーザー表示(console)
function lo() {
  var nowuser = localStorage.getItem('userName')
  console.log(nowuser)
}


//ローカルストレージの取得
nowuser = localStorage.getItem('userName')

//資格登録画面のjs
function OnButtonClick() {
  var category = $('#category').val();
  alert(category);//category あとで変数名を変える
  $('tt').remove();
  $('oppai').append('<tt></tt>');
  //データストアのtestからデータを取得
  var test = ncmb.DataStore("test");
  test.equalTo("category", category)
    .limit(1000)
    .fetchAll()
    .then(function (results) {
      var r_end = results.length;
      var c_end = 3; // 列数(0~3=4)
      var h_array = new Array('資格名', '難易度', 'ジャンル', '追加')
      alert("OK");
      var tableJQ = $('<table id="table_id1">');
      for (x = 0; x < results.length; x++) {
        var object = results[x];
        var license_name = object.license_name
        var level = object.Level
        var category = object.category
        var license_id = object.license_id
        var c_array = new Array(license_name, level,
          category, '<input type="button" value="追加" onclick="OnButtonClick2(' + license_id + ');"')
        //テーブルヘッダを配列に代入
        var trJQ_r = $('<tr id="DBtr"></tr>').appendTo(tableJQ);
        for (var c = 0; c <= c_end; c++) {
          if (x == 0) {
            var tdJQ_r_c = $('<th>' + h_array[c] + '</th>').appendTo(trJQ_r);
          }
          else {
            var tdJQ_r_c = $('<td>' + c_array[c] + '</td>').appendTo(trJQ_r);
          }
        }
      }
      $('tt').append('<h1 id="DBtext"></h1>').append(tableJQ);
    })
    .catch(function (err) {
      console.log(err);
    });
}

// function LicensePush(license_name){
//alert(license_name + '追加');
// }


function OnButtonClick2(license_id) {
  alert('追加')
  var userTable = ncmb.DataStore("usertable");
  var usertable = new userTable();
  nowuser = localStorage.getItem('userName')
  //var testif = ncmb.DataStore("test")
  //var test = new testif();

  usertable.set("username", nowuser)
    .set("license_id", license_id)
    .save()
    .then(function (usertable) {
      // 保存後
      alert('追加完了');
    })
    .catch(function (err) {
      // エラー処理
      //alert('NG');
      console.log(err)
    });
}




//一覧画面のjs
function OnClickList() {
  var nowuser = localStorage.getItem('userName')
  $('pp').remove();
  $('tinpo').append('<pp></pp>');
  var h_array = new Array('資格名', '難易度', 'URL', '有効期限')
  var tableJQ = $('<table id="table_id1">');
  var c_end = 3;  // 列数(0~3=4)
  var trJQ_r = $('<tr></tr>').appendTo(tableJQ);
  for (c = 0; c <= c_end; c++) {
    var tdJQ_r_c = $('<th id="DBth">' + h_array[c] + '</th>').appendTo(trJQ_r);
  }


  var usertable = ncmb.DataStore("usertable");
  console.log(nowuser)
  usertable.equalTo("username", nowuser)
    .limit(1000)
    .fetchAll()
    .then(function (results) {
      for (x = 0; x < results.length; x++) {
        var object = results[x]
        var id = object.license_id



        //ここから
        var test = ncmb.DataStore("test");
        test.equalTo("license_id", id)
          .limit(1000)
          .fetchAll()
          .then(function (results) {
            for (x = 0; x < results.length; x++) {
              console.log("リザルトレングスは" + results.length)
              console.log(results[x].license_name)
              var object = results[x]
              var license_name = object.license_name
              var level = object.Level
              var url = object.url
              var expiration_data = object.expiration_data
              //inAppBrowserプラグインを利用して開く処理
              //var urlbutton = "<input id='input1' type=button onclick=openweb();>"
              //document.getElementById("input1").value = "test"
              //var linkContent = '<input type=button value='+url+' onclick="openweb(url)">'
              //var linkContent = content.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi,"<a id='linkContentA' href='$1' onclick='openweb()';>URL</a>");
              //openweb(linkContent);
              //var linkContent = '<a href="https://amazon.co.jp">URL</a>';
              // if(x == 0){
              //   xxx = url;
              //   localStorage.setItem('licensename',license_name);
              // }else if(x == 1){
              //   xx1 = url;
              //   localStorage.setItem('licensename1',license_name);
              // }else if(x == 2){
              //   xx2 = url;
              //   localStorage.setItem('licensename2',license_name);
              // }else if(x == 3){
              //   xx3 = url;
              // }else if(x == 4){
              //   xx4 = url;
              // }else if(x == 5){
              //   xx5 = url;
              // }else if(x == 6){
              //   xx6 = url;
              // }else if(x == 7){
              //   xx7 = url;
              // }else if(x == 8){
              //   xx8 = url;
              // }else if(x == 9){
              //   xx9 = url;
              // }



              // //  array = new Array(xxx,xx1,xx2,xx3,xx4,xx5,xx6,xx7,xx8,xx9);
              // array[0] = xxx;
              // array[1] = xx1;
              // array[2] = xx2;
              // array[3] = xx3;
              // array[4] = xx4;
              // array[5] = xx5;
              // array[6] = xx6;
              // array[7] = xx7;
              // array[8] = xx8;
              // array[9] = xx9;

              xxx = url;

              //  console.log(array)

              var content = "<input type=button value='URL' id='linkContentA' onclick='openweb(xxx)'>"


              //呼び出したデータを配列に代入
              var c_array = new Array(license_name, level, content, expiration_data)
              //テーブルヘッダを配列に代入
              var trJQ_r = $('<tr id="DBtr1"></tr>').appendTo(tableJQ);
              for (x = 0; x < c_array.length; x++) {
                var tdJQ_r_c = $('<td>' + c_array[x] + '</td>').appendTo(trJQ_r);
              }
              $('pp').append(tableJQ);
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      }//for文終わり
    })
    //ここまで
    .catch(function (err) {
      console.log(err);
    });
}
// var array = new Array(9);
var xxx;
// var xx1;
// var xx2;
// var xx3;
// var xx4;
// var xx5;
// var xx6;
// var xx7;
// var xx8;
// var xx9;

//var count = 0;
function openweb(xxx) {
  //console.log()
  //var url = document.getElementById("linkContentA").text
  //console.log(url)
  //var array = [];
  //array[count] = xxx;
  window.open(xxx, '_blank', 'location=yes');
}
//何番目かを
