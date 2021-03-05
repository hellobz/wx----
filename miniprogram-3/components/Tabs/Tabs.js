// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  // 存放要接受父元素的数据
  properties: {
    tabs: {
      type: Array,
      name: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChild(e) {
      //1.获取点击的索引
      const {
        index
      } = e.currentTarget.dataset
      // console.log(index);
      //2.触发 父组件中的事件 自定义
      this.triggerEvent("tabsItemChange", {
        index
      })
    }
  }
})