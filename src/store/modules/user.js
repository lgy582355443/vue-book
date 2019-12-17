const user = {
    state: {
        historyList: [],
        text: 'wocao'
    },
    mutations: {
        SET_HISTORY_LIST(state, historyList) {
            state.historyList = historyList;
        },
        SET_TEXT(state, text) {
            state.text = text
        }
    },
    actions:{
        setText({commit},text){
            state.text = text+'123'
            se
        }
    }
}

export default user;