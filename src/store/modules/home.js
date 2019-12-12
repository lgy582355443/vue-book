const home = {
    state: {
        homeOffsetY: 0,
        hotSearchOffsetY: 0,
        flapCardVisible: false,
        isEditMode: false,
        shelfList: [],//书架列表
        shelfSelected: [],//书架勾选后的图书
        shelfTitleVisible: true,
        shelfCategory: [], // 书架分类列表数据
        currentType: 1,// 书架列表为1，书架分组列表为2
    },
    mutations: {
        SET_HOME_OFFSETY(state, offsetY) {
            state.homeOffsetY = offsetY
        },
        SET_HOT_SEARCH_OFFSETY(state, offsetY) {
            state.hotSearchOffsetY = offsetY
        },
        SET_FLAP_CARD_VISIBLE(state, visible) {
            state.flapCardVisible = visible
        },
        SET_IS_EDIT_MODE(state, isEditMode) {
            state.isEditMode = isEditMode;
        },
        SET_SHELF_LIST(state, shelfList) {
            state.shelfList = shelfList;
        },
        SET_SHELF_SELECTED(state, shelfSelected) {
            state.shelfSelected = shelfSelected;
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
    }
}

export default home;