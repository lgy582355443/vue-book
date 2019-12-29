import { mapGetters, mapActions } from 'vuex'
import { gotoBookDetail } from '@/utils/home'

export const StoreHomeMixin = {
    computed: {
        ...mapGetters([
            'offsetY',
            'homeOffsetY',
            'hotSearchOffsetY',
            'flapCardVisible',
        ])
    },
    methods: {
        ...mapActions([
            'setOffsetY',
            'setHomeOffsetY',
            'setHotSearchOffsetY',
            'setFlapCardVisible',
        ]),
        showBookDetail(book) {
            gotoBookDetail(this, book)
        }
    }
}