const home = {
    state: {
        homeOffsetY: 0,
        hotSearchOffsetY: 0,
        flapCardVisible: false,
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
    }
}

export default home;