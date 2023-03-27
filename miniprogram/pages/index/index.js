// index.js
// const app = getApp()
// import {createScopedThreejs} from 'threejs-miniprogram'
const { envList } = require('../../envList.js');

var util = require('../../utils/util');
Page({
  data: {
    showUploadTip: false,
    isShowPopup:false,
    isShowTime:false,
    selectedTime: '00:15',
    powerList: [{
      title: '云函数',
      tip: '安全、免鉴权运行业务代码',
      showItem: false,
      item: [{
        title: '获取OpenId',
        page: 'getOpenId'
      },
      //  {
      //   title: '微信支付'
      // },
      {
        title: '生成小程序码',
        page: 'getMiniProgramCode'
      },
        // {
        //   title: '发送订阅消息',
        // }
      ]
    }, {
      title: '数据库',
      tip: '安全稳定的文档型数据库',
      showItem: false,
      item: [{
        title: '创建集合',
        page: 'createCollection'
      }, {
        title: '更新记录',
        page: 'updateRecord'
      }, {
        title: '查询记录',
        page: 'selectRecord'
      }, {
        title: '聚合操作',
        page: 'sumRecord'
      }]
    }, {
      title: '云存储',
      tip: '自带CDN加速文件存储',
      showItem: false,
      item: [{
        title: '上传文件',
        page: 'uploadFile'
      }]
    }, {
      title: '云托管',
      tip: '不限语言的全托管容器服务',
      showItem: false,
      item: [{
        title: '部署服务',
        page: 'deployService'
      }]
    }],
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false
  },
  onSetTime() {
    // console.log(11);
    this.setData({ isShowTime: true });
  },
  onConfirm() {
    // 处理用户选择的时间
    console.log('用户选择的时间为', this.data.selectedTime);
    // 隐藏弹窗
    this.setData({ isShowTime: false });
  },

  // 用户选择时间
  onTimeChange(event) {
    const { value } = event.detail;
    this.setData({ selectedTime: value });
  },

  onLoad: function (options) {
    var page = this;

    setInterval(() => {
      var DATE = util.formatTime(new Date());
      this.setData({
        myTime: DATE
      })
    }, 1000);
  },
  gotoPage: function() {
    this.setData({
      isShowPopup: !this.data.isShowPopup
    })
  },
  // onReady() {
  //   wx.createSelectorQuery()
  //     .select('#webgl')
  //     .node()
  //     .exec((res) => {
  //       const canvas = res[0].node
  //       // 创建一个与 canvas 绑定的 three.js
  //       const THREE = createScopedThreejs(canvas)
  //       // 传递并使用 THREE 变量
  //     })
  // },
  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList
      });
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail(res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        });
      }
      this.setData({
        powerList
      });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });
  }
});
