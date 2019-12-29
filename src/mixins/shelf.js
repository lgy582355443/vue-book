import { mapGetters, mapActions } from 'vuex'
import { gotoBookDetail } from '@/utils/home'
import { getShelfApi, updataShelfApi } from "@/api/shelf"

import { saveBookShelf, getBookShelf, getUserInfo } from '@/utils/localStorage'
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
            'setHistoryList',
            'setAddToShelf',
            'setRemoveFromShelf',
            'setSelectedRemoveFromShelf',
            'setSelectRemoveFromGroup',
            'setDeleteGroup',
            'setSelectedMoveToGroup',
            'setSelectedMoveToNewGroup',
            'setChangeGroupName'
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
                } else {
                    return;
                }
            });
            return updataArr;
        },

        //更新数据库书架信息
        updataShelf() {
            const user = getUserInfo();
            if (user && user.id && user.loginTime) {
                const params = {
                    userId: user.id,
                    shelfList: JSON.stringify(this.getShelfIdList(this.shelfList))
                }
                updataShelfApi(params)
                saveBookShelf(this.shelfList)
            } else {
                this.$router.push({
                    name: 'login'
                })
            }
        },

        //获取书架列表
        getShelfList() {
            let shelfList = getBookShelf()
            const user = getUserInfo();
            if (!shelfList) {
                getShelfApi({ userId: user.id }).then(res => {
                    if (res.status === 200 && res.data && res.data.shelfList) {
                        saveBookShelf(res.data.shelfList)
                        return this.setShelfList(res.data.shelfList)
                    }
                })
            } else {
                return this.setShelfList(shelfList)
            }
        },

        //获取当前分组里的内容
        getCategoryList(title) {
            this.getShelfList().then(() => {
                const categoryList = this.shelfList.find(book => book.type === 2 && book.title === title)
                this.setShelfCategory(categoryList)
            })
        },
    }
}