const home = {
    state: {
        homeOffsetY: 0,
        hotSearchOffsetY: 0,
        flapCardVisible: false,
        searchHistoryList: []
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
        SET_SEARXH_HISTORY_LIST(state, list) {
            state.searchHistoryList = list
        },
    }
}

export default home;