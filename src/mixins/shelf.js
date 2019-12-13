import { mapGetters, mapActions } from 'vuex'
import { FONT_SIZE_LIST, FONT_FAMILY, themeList, getReadTimeByMinute } from '@/utils/book'
import { gotoBookDetail } from '@/utils/home'
import { removeAddFromShelf, computeId, appendAddToShelf } from '@/utils/shelf'
import { addCss, removeAllCss } from '@/utils/utils'
import { shelfApi } from "@/api/shelf";
import * as Storage from '@/utils/localStorage'

export const shelfMixin = {
    computed: {
        ...mapGetters([
            'isEditMode',
            'shelfList',
            'shelfSelected',
            'shelfTitleVisible',
            'offsetY',
            'shelfCategory',
            'currentType',
            'historyList'
        ]),

    },
    methods: {
        ...mapActions([
            'setIsEditMode',
            'setShelfList',
            'setShelfSelected',
            'setShelfTitleVisible',
            'setOffsetY',
            'setShelfCategory',
            'setCurrentType',
            'setHistoryList'
        ]),

        showBookDetail(book) {
            gotoBookDetail(this, book)
        },

        //获取书架列表
        getShelfList() {
            let shelfList = Storage.getBookShelf()
            if (!shelfList) {
                shelfApi().then(response => {
                    if (response.status === 200 && response.data && response.data.bookList) {
                        shelfList = appendAddToShelf(response.data.bookList)
                        Storage.saveBookShelf(shelfList)
                        return this.setShelfList(shelfList)
                    }
                })
            } else {
                return this.setShelfList(shelfList)
            }
            console.log(shelfList);
        },

        //获取当前分组里的内容
        getCategoryList(title) {
            this.getShelfList().then(() => {
                const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
                this.setShelfCategory(categoryList)
            })
        },

        //移出分组
        moveOutOfGroup(cb) {
            this.setShelfList(this.shelfList.map(book => {
                if (book.type === 2 && book.itemList) {
                    book.itemList = book.itemList.filter(subBook => !subBook.selected)
                }
                return book
            })).then(() => {
                //排除最后书架列表最后一项(添加书籍按钮)
                let list = removeAddFromShelf(this.shelfList);
                //分类里选中的和书架中的列表合并
                list = [].concat(list, ...this.shelfSelected);
                //添加最后一项(添加书籍按钮)
                list = appendAddToShelf(list);
                //排序ID
                list = computeId(list);

                this.setShelfList(list).then(() => {
                    this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
                    if (cb) cb()
                })
            })
        }
    }
}