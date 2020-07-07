// graceUI/components/graceShade.js
Component({
  properties: {
    background: { type: String, value : "rgba(0, 0, 0, 0.1)" },
    zIndex: { type: Number, value: 1 },
    show: { type: Boolean, value: true }
  },
  methods:{
    closeShade: function() {
      this.triggerEvent('closeShade');
    }
  }
})
