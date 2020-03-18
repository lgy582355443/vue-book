import {
    computeId
} from '@/utils/shelf'


const shelf = {
    state: {
        isEditMode: false, //是否为编辑状态
        shelfList: [], //书架列表
        shelfSelected: [], //书架勾选后的图书
        shelfTitleVisible: true,
        shelfCategory: [], // 书架分组列表数据
        currentType: 1, // 书架列表为1，书架分组列表为2
    },
    mutations: {
        SET_IS_EDIT_MODE(state, isEditMode) {
            state.isEditMode = isEditMode;
        },
        SET_SHELF_LIST(state, shelfList) {
            state.shelfList = shelfList;
        },
        SET_SHELF_SELECTED(state, shelfSelected) {
            state.shelfSelected = shelfSelected;
        },
        ADD_SHELF_SELECTED(state, shelf) {
            if (!state.shelfSelected.some(item => item.id == shelf.id)) {
                state.shelfSelected.push(shelf)
            }
        },
        SET_SHELF_TITLE_VISIBLE(state, shelfTitleVisible) {
            state.shelfTitleVisible = shelfTitleVisible;
        },
        SET_SHELF_CATEGORY(state, category) {
            state.shelfCategory = category
        },
        SET_CURRENT_TYPE(state, type) {
            state.currentType = type
        },

        //修改分组名
        CHANGE_GROUP_NAME(state, newName) {
            state.shelfList.map(item => {
                if (item.type == 2 && item.title == state.shelfCategory.title) {
                    item.title = newName
                }
            })
        },

        //单本添加入书架列表
        ADD_TO_SHELF(state, book) {
            book.type = 1
            book.shelf_id = state.shelfList.length + 1
            state.shelfList.push(book)
        },

        //单本从书架中移除
        REMOVE_FROM_SHELF(state, book) {
            state.shelfList = state.shelfList.filter(item => {
                if (item.type == 2) {
                    item.itemList = item.itemList.filter(itemc => item.id !== book.id)
                }
                return item.id !== book.id
            })
            state.shelfList = computeId(state.shelfList);
        },

        //选中的移出书架
        SELECTED_REMOVE_FROM_SHELF(state) {
            state.shelfList = state.shelfList.filter(item => {
                if (item.type == 2) {
                    item.itemList = item.itemList.filter(itemc => state.shelfSelected.indexOf(itemc) < 0)
                }
                return state.shelfSelected.indexOf(item) < 0
            })
            state.shelfList = computeId(state.shelfList);
        },


        //移出分组
        SELECTED_REMOVE_FROM_GROUP(state) {
            state.shelfList.map(item => {
                if (item.type == 2) {
                    item.itemList = item.itemList.filter(itemc => state.shelfSelected.indexOf(itemc) < 0)
                }
            })
            state.shelfList = state.shelfList.concat(state.shelfSelected);
            state.shelfList = computeId(state.shelfList);
        },

        //删除分组
        DELETE_GROUP(state, group) {
            state.shelfList.forEach(item => {
                if (item.type == 2 && item.title == group.title) {
                    state.shelfSelected = item.itemList;
                }
            })
            state.shelfList = state.shelfList.filter(item => item.title !== group.title)
            state.shelfList = state.shelfList.concat(state.shelfSelected);
            state.shelfList = computeId(state.shelfList);
        },

        //移入分组
        SELECTED_MOVE_TO_GROUP(state, group) {
            state.shelfList = state.shelfList.filter(item => {
                if (item.type == 2) {
                    item.itemList = item.itemList.filter(itemc => state.shelfSelected.indexOf(itemc) < 0)
                }
                return state.shelfSelected.indexOf(item) < 0
            })
            state.shelfList.map(item => {
                if (item.type == 2 && item.title == group.title) {
                    item.itemList = item.itemList.concat(state.shelfSelected)
                }
            })
            state.shelfList = computeId(state.shelfList);
        },

        //新建分组
        SELECTED_MOVE_TO_NEW_GROUP(state, group) {
            state.shelfList = state.shelfList.filter(item => {
                if (item.type == 2) {
                    item.itemList = item.itemList.filter(itemc => state.shelfSelected.indexOf(itemc) < 0)
                }
                return state.shelfSelected.indexOf(item) < 0
            })
            group.itemList = state.shelfSelected;
            state.shelfList.push(group);
            state.shelfList = computeId(state.shelfList);
        }
    }
}

export default shelf;