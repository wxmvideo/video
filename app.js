const aldstat = require('./utils/ald-stat.js')
var util = require('we7/resource/js/util.js');
var crypt = require('we7/resource/js/crypt.js');
App({
    onLaunch: function (res) {
        wx.setStorageSync('enter_scene', res.scene);
    },
    onShow: function (res) {
    },
    onHide: function () {
    },
    onError: function (msg) {
        console.log(msg)
    },
    util: util,
    crypt:crypt,
    userInfo: {
        sessionid: null,
    },
	globalData:{
        clicknum:0
	},
    siteInfo: require('siteinfo.js')
});