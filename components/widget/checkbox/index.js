Component({
  behaviors: ['wx://form-field'],
  externalClasses: ['l-class', 'l-title-class'],
  relations: {
    '../checkbox-group/index': {
      type: 'parent'
    }
  },
  properties: {
    value: {
      type: String,
      value: ''
    },
    detail: {
      type: Object,
      value: {}
    },
    // checkbox的形状
    shape: {
      type: String,
      value: 'right'
    },
    // checkbox的大小
    sizeW: {
      type: [String, Number],
      value: 36
    },
    sizeH: {
      type: [String, Number],
      value: 36
    },
    // 是否选中
    checked: {
      type: Boolean,
      value: false
    },
    // 不可选状态
    disabled: {
      type: Boolean,
      value: false
    },
    //  选中后的颜色
    color: {
      type: String,
      value: '#3963BC'
    },
    //  是否自定义内容
    custom: {
      type: Boolean,
      value: false
    },
    // radio的布局
    placement: {
      type: String,
      value: 'left'
    }
  },
  data: {
    right:null,
    circle:null,
    checked: true
  },
  methods: {
    onChangeHandle(current, type) {
      if (this.data.disabled)  return
      // 页面不调用，由父组件调用 改变选中状态
      this.setData({
        checked: current
      });
      // 将值传递给父组件
      if (type === 'init' && current) {
        const item = {
          current: current,
          value: this.data.value,
          detail: this.data.detail
        }
        const parent = this.getRelationNodes('../checkbox-group/index')[0];
        parent ? parent.currentChange(item) : this.triggerEvent('linchange', item);
      }

    },
    // 点击 checkbox
    onCheckBoxChangeTap() {
      if (this.data.disabled) return;
      const item = {
        current: !this.data.checked,
        value: this.data.value,
        detail: this.data.detail,
        all: null
      };
      const parent = this.getRelationNodes('../checkbox-group/index')[0];
      parent ? parent.onEmitEventHandle(item) : this.triggerEvent('linchange', item);
      // parent ? console.log('') : this.onChangeHandle(true);
      this.setData({
        checked: !this.data.checked
      })
    }
  }
});