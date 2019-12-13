import { mapGetters, mapActions } from 'vuex'
import { FONT_SIZE_LIST, FONT_FAMILY, themeList, getReadTimeByMinute } from '@/utils/book'
import { gotoBookDetail } from '@/utils/home'
import { removeAddFromShelf, computeId, appendAddToShelf } from '@/utils/shelf'
import { addCss, removeAllCss } from '@/utils/utils'
import { shelfApi } from "@/api/shelf";
import * as Storage from '@/utils/localStorage'

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