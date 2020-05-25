import { mapGetters,mapActions } from 'vuex'

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
            this.$router.push({
                name: "detail",
                query: {
                    fileName: book.fileName,
                    category: book.categoryText
                }
            });
        },
    }
}