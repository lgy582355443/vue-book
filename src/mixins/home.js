import { mapGetters, mapActions } from 'vuex'
import { gotoBookDetail } from '@/utils/home'

export const StoreHomeMixin = {
    computed: {
        ...mapGetters([
            'offsetY',
            'homeOffsetY',
            'hotSearchOffsetY',
            'flapCardVisible',
            'searchHistoryList'
        ])
    },
    methods: {
        ...mapActions([
            'setOffsetY',
            'setHomeOffsetY',
            'setHotSearchOffsetY',
            'setFlapCardVisible',
            'setSearchHistoryList'
        ]),
        showBookDetail(book) {
            gotoBookDetail(this, book)
        }
    }
}