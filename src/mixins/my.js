import { mapGetters, mapActions } from 'vuex'
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