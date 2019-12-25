const user = {
    state: {
        historyList: [],
    },
    mutations: {
        SET_HISTORY_LIST(state, historyList) {
            state.historyList = historyList;
        },
    },
}

export default user;