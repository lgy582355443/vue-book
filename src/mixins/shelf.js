import { mapGetters, mapActions } from 'vuex'
import { gotoBookDetail } from '@/utils/home'
import { removeAddFromShelf, computeId, appendAddToShelf } from '@/utils/shelf'
import { getShelfApi, updataShelfApi } from "@/api/shelf"
import { getToken } from '@/utils/login'
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

        //只保留 shelfList 部分属性，用于上传服务器
        getShelfIdList(arr) {
            let updataArr = [];
            arr.forEach((item, index) => {
                if (item.type == 1) {
                    updataArr.push({
                        id: item.id,
                        shelf_id: item.shelf_id,
                        private: item.private,
                        haveRead: item.haveRead,
                        type: item.type
                    });
                } else if (item.type == 2) {
                    updataArr.push({
                        shelf_id: item.shelf_id,
                        type: item.type,
                        title: item.title
                    });
                    updataArr[index].itemList = [];
                    item.itemList.forEach(itemc => {
                        updataArr[index].itemList.push({
                            id: itemc.id,
                            shelf_id: itemc.shelf_id,
                            private: itemc.private,
                            haveRead: itemc.haveRead,
                            type: itemc.type
                        });
                    });
                }
            });
            return updataArr;
        },

        //更新数据库书架信息
        updataShelf() {
            const params = {
                userId: getToken().id,
                shelfList: JSON.stringify(this.getShelfIdList(this.shelfList))
            }
            updataShelfApi(params).then(res => {
                if (res.status === 200 && res.data && res.data.shelfList) {
                    shelfList = appendAddToShelf(res.data.shelfList)
                    Storage.saveBookShelf(shelfList)
                }
            })
        },

        //获取书架列表
        getShelfList() {
            let shelfList = Storage.getBookShelf()
            const user = getToken();
            if (!shelfList) {
                getShelfApi({ userId: user.id }).then(res => {
                    console.log(res);
                    if (res.status === 200 && res.data && res.data.shelfList) {
                        shelfList = appendAddToShelf(res.data.shelfList)
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