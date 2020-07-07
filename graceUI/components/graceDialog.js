// graceUI/components/graceDialog.js
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    width: {
      type: String,
      value: '580rpx'
    },
    isCloseBtn: {
      type: Boolean,
      value: true
    },
    closeBtnColor: {
      type: String,
      value: '#FF0036'
    },
    isTitle: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: ''
    },
    titleWeight: {
      type: Boolean,
      value: true
    },
    titleSize: {
      type: String,
      value: '28rpx'
    },
    titleColor: {
      type: String,
      value: '#333333'
    },
    isBtns: {
      type: Boolean,
      value: true
    },
    background: {
      type: String,
      value: 'rgba(0, 0, 0, 0.5)'
    },
    borderRadius: {
      type: String,
      value: '6rpx'
    }
  },
  data: {

  },
  methods: {
    closeDialog: function () {
      this.triggerEvent('closeDialog');
    },
    stopFun: function () { }
  },
  options : {
    multipleSlots : true
  }
})
