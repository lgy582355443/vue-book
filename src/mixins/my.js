export const userMixin = {
    computed: {
      ...mapGetters([
        'historyList',
      ])
    },
    methods: {
      ...mapActions([
        'setHistoryList',
      ])
    }
  }