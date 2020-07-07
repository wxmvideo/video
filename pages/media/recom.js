var app = getApp();
const TxvContext = requirePlugin("tencentvideo");
Page({
  data: {
    circular: false,
    // 当前播放视频的数据
    videoInfo: {
      index: 0,
    },
    // 滑块
    current: 0,
    // 播放状态
    playStatus: false,
    videoObjList: {
      0: {},
      1: {},
      2: {},
    },
    paging: {
      page: 1,
      size: 9
    },
    shopInfo: {},
    showAlert: false,
    userInfo: wx.getStorageSync('userinfo'),
    showGoods: false,
    winHeight: 2000
  },
  onLoad: function (options) {
    this.pageStatus = 0 // 页面初始化状态
    this.videoKey = "video" // 视频id key
    this.videoList = [] // 渲染的视频
    this.residueVideoList = [] // 取余的数组
    this.videoIndex = 0 // 当前视频的位置
    this.loadingVideo = 0
    this.aciveVideoId = 0 // 默认视频
    this.adsenseModal = '' // 广告ID
    wx.getSystemInfo({
      complete: (res) => {
        console.log(res);
        this.setData({winHeight:res.windowHeight});
      },
    })

    // 获取视频列表
    this.getVideoList();

  },
  // 获取视频列表
  getVideoList() {

    var url = app.util.url('entry/wxapp/api', {
      k: 'video',
      m: 'dk_video',
      o: 'recom'
    });
    // 视频播放接口传的参数
    wx.request({
      url: url,
      method: "GET",
      data: {
        page: this.data.paging.page,
      },
      success: res => {
        let json = app.crypt.Decrypt(res.data.data.data, res.data.data.key);
        let result = JSON.parse(json);
        this.adsenseModal = result.adsense;

        let oldVideoLength = this.videoList.length
        let pageList = result.items;

        // 无数据的情况
        if (pageList.length < 1 && this.data.paging.page == 1) {
          return
        }

        // 如果数据少于1重新拿分页为1的数据
        if (pageList.length < 1 && this.data.paging.page != 1) {
          this.setData({
            ['paging.page']: 1,
          })
          this.getVideoList()
          return
        }

        // 滑块数量
        let itemNumber = Object.keys(this.data.videoObjList).length || 3

        // 重新计算数组的排列
        const videoData = this.formArrayVideo(this.videoList, this.residueVideoList, pageList, itemNumber)

        // 渲染的数组
        this.videoList = videoData.list.map((v, index) => {
          return {
            ...v,
            index
          }
        })

        // 取余的数组
        this.residueVideoList = videoData.residue

        // 避免去重后数据保持不变产生死循环
        if (oldVideoLength != this.videoList.length) {
          this.setData({
            circular: true,
          })
          // 开始渲染
          this.lazyVideo()
        }

        // 第一次播放
        if (this.pageStatus == 0) {
          // 第一次初始化加载完毕
          this.pageStatus = 1
          // 滑块位置
          const current = this.data.current
          // 开始播放
          setTimeout(res => {
            this.currentPlay(current, current)
          },1000);
        }
        this.setData({
          ['paging.page']: this.data.paging.page + 1,
        })
      }
    });
  },
  // swiper切换
  swiperChange(e) {
    if (e.detail.source == "touch") {
      // 旧的滑块位置
      const oldCurrent = this.data.current
      // 当前滑块的位置
      const current = e.detail.current
      if (oldCurrent == current) return;

      this.setData({
        current
      })

      // 当前视频在列表中的索引
      this.videoIndex = parseInt(e.detail.currentItemId)

      // 开始渲染
      this.lazyVideo()

      // 开始播放
      this.currentPlay(oldCurrent, current)
    }
  },
  // 加载视频
  lazyVideo() {

    const videoList = this.videoList // 渲染的数组
    const videoIndex = this.videoIndex // 当前播放的视频在数组里的索引
    const current = this.data.current // 滑块位置

    const lastVideo = videoList[videoIndex - 1] || {}
    const lastTwoVideo = videoList[videoIndex - 2] || {}
    const nowVideo = videoList[videoIndex] || {}
    const nextVideo = videoList[videoIndex + 1] || {}
    const nextTwoVideo = videoList[videoIndex + 2] || {}

    if (videoIndex == 0) {
      this.setData({
        circular: false,
        ['videoObjList.0']: nowVideo,
        ['videoObjList.1']: nextVideo,
        ['videoObjList.2']: nextTwoVideo,
      })
    } else if (videoIndex == videoList.length - 1) {
      console.log('滑动到了最后一页')
      this.setData({
        circular: false,
        ['videoObjList.0']: lastTwoVideo,
        ['videoObjList.1']: lastVideo,
        ['videoObjList.2']: nowVideo,
      })
      // 获取视频列表
      this.getVideoList()
    } else {
      if (current == 0) {
        this.setData({
          circular: true,
          ['videoObjList.0']: nowVideo,
          ['videoObjList.1']: nextVideo,
          ['videoObjList.2']: lastVideo,
        })
      }
      if (current == 1) {
        this.setData({
          circular: true,
          ['videoObjList.0']: lastVideo,
          ['videoObjList.1']: nowVideo,
          ['videoObjList.2']: nextVideo,
        })
      }
      if (current == 2) {
        this.setData({
          circular: true,
          ['videoObjList.0']: nextVideo,
          ['videoObjList.1']: lastVideo,
          ['videoObjList.2']: nowVideo,
        })
      }
    }
    this.setData({
      videoInfo: nowVideo
    })
  },
  // 播放视频的逻辑
  currentPlay(oldCurrent, current) {
    // 获取上一个视频实例
    const oldVideoObj = this.getVideoObj(this.videoKey, oldCurrent)

    // 暂停上一个视频实例
    this.pauseVideo(oldVideoObj)

    // 获取当前视频实例
    const videoObj = this.getVideoObj(this.videoKey, current)

    // 播放当前视频实例
    this.playVideo(videoObj)

    // 播放计数
    var clicknum = getApp().globalData.clicknum;
    getApp().globalData.clicknum = clicknum + 1;

    if (this.adsenseModal != '') {
      if (clicknum % 5 == 0) {
        if (wx.createInterstitialAd) {
          var interstitialAd = wx.createInterstitialAd({
            adUnitId: this.adsenseModal
          })
          // 在适合的场景显示插屏广告
          if (interstitialAd) {
            interstitialAd.show().catch((err) => {});
          }
        }
      }
    }
  },
  // 播放/或暂停视频
  tabVideo() {
    let playStatus = this.data.playStatus
    let current = this.data.current
    // 获取当前视频实例
    const videoObj = this.getVideoObj(this.videoKey, current)

    if (!playStatus) {
      // 播放停视频实例
      this.pauseVideo(videoObj)
    } else {
      // 播放当前视频实例
      this.playVideo(videoObj)
    }
    this.setData({
      playStatus: !playStatus
    })
  },
  // 视频开始播放
  eventPlay() {
    this.setData({
      playStatus: false
    })
  },
  // 播放视频
  playVideo(videoObj) {
    videoObj && videoObj.play()
  },
  // 暂停视频
  pauseVideo(videoObj) {
    videoObj && videoObj.pause()
  },
  // 销毁实例
  deleteVideoObJ(videoObj) {
    videoObj && videoObj.stop()
  },
  // 获取视频实例
  getVideoObj(key, index) {
    return TxvContext.getTxvContext(key + index)
  },
  // 格式化数组取渲染数组及余数组
  formArrayVideo(oldList = [], residueList = [], newlist = [], itemNumber = 3) {
    // 原数组
    let onwList = oldList.concat(residueList, newlist)
    // 倍数
    const ints = Math.floor(onwList.length / itemNumber)
    // 最新数组
    const list = onwList.slice(0, ints * itemNumber) || []
    // 缓存余下的数组
    const residue = onwList.slice(ints * itemNumber, onwList.length) || []

    if (list.length < 1) {
      return {
        list: onwList,
        residue: [],
      }
    } else {
      return {
        list,
        residue,
      }
    }
  },
  /**
   * 分享视频
   */
  onShareAppMessage: function (option) {
    var obj = {
      title: this.data.videoInfo.title,
      path: 'pages/index/index?vid=' + this.data.videoInfo.id,
      imageUrl: this.data.videoInfo.icon,
      success: function (res) {},
      fail: function () {}
    }
    return obj;
  },
});