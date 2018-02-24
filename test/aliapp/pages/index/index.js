import {
  me,
  xPage,
} from '../../utils/mini';

xPage({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
    console.log('Page');
    console.log(this);
    me.showLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    me.hideLoading();
    me.showToast('我是 me.showToast');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

});
