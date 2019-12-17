const actions = {
  //ebook
  setFontFamilyVisible: ({ commit }, visible) => {
    return commit('SET_FONT_FAMILY_VISIBLE', visible)
  },
  setDefaultFontFamily: ({ commit }, font) => {
    return commit('SET_DEFAULT_FONT_FAMILY', font)
  },
  setDefaultFontSize: ({ commit }, fontSize) => {
    return commit('SET_DEFAULT_FONT_SIZE', fontSize)
  },
  setSettingVisible: ({ commit }, visible) => {
    return commit('SET_SETTING_VISIBLE', visible)
  },
  setMenuVisible: ({ commit }, visible) => {
    return commit('SET_MENU_VISIBLE', visible)
  },
  setFileName: ({ commit }, fileName) => {
    return commit('SET_FILENAME', fileName)
  },
  setDefaultTheme: ({ commit }, theme) => {
    return commit('SET_DEFAULT_THEME', theme)
  },
  setBookAvailable: ({ commit }, bookAvailable) => {
    return commit('SET_BOOK_AVAILABLE', bookAvailable)
  },
  setProgress: ({ commit }, progress) => {
    return commit('SET_PROGRESS', progress)
  },
  setSection: ({ commit }, section) => {
    return commit('SET_SECTION', section)
  },
  setIsPaginating: ({ commit }, isPaginating) => {
    return commit('SET_IS_PAGINATING', isPaginating)
  },
  setCurrentBook: ({ commit }, book) => {
    return commit('SET_CURRENT_BOOK', book)
  },
  setNavigation: ({ commit }, navigation) => {
    return commit('SET_NAVIGATION', navigation)
  },
  setCover: ({ commit }, cover) => {
    return commit('SET_COVER', cover)
  },
  setMetadata: ({ commit }, metadata) => {
    return commit('SET_METADATA', metadata)
  },
  setPaginate: ({ commit }, paginate) => {
    return commit('SET_PAGINATE', paginate)
  },
  setPagelist: ({ commit }, pagelist) => {
    return commit('SET_PAGELIST', pagelist)
  },
  setIsBookmark({ commit }, isBookmark) {
    return commit('SET_IS_BOOKMARK', isBookmark)
  },
  //home
  setOffsetY({ commit }, offsetY) {
    return commit('SET_OFFSETY', offsetY)
  },
  setHotSearchOffsetY({ commit }, offsetY) {
    return commit('SET_HOT_SEARCH_OFFSETY', offsetY)
  },
  setHomeOffsetY({ commit }, offsetY) {
    return commit('SET_HOME_OFFSETY', offsetY)
  },
  setFlapCardVisible({ commit }, visible) {
    return commit('SET_FLAP_CARD_VISIBLE', visible)
  },
  //shelf
  setIsEditMode({ commit }, isEditMode) {
    return commit('SET_IS_EDIT_MODE', isEditMode)
  },
  setShelfList({ commit }, shelfList) {
    return commit('SET_SHELF_LIST', shelfList)
  },
  setShelfSelected({ commit }, shelfSelected) {
    return commit('SET_SHELF_SELECTED', shelfSelected)
  },
  setShelfTitleVisible({ commit }, shelfTitleVisible) {
    return commit('SET_SHELF_TITLE_VISIBLE', shelfTitleVisible)
  },
  setShelfCategory({ commit }, category) {
    return commit('SET_SHELF_CATEGORY', category)
  },
  setCurrentType({ commit }, type) {
    return commit('SET_CURRENT_TYPE', type)
  },
  setCurrentType({ commit }, type) {
    return commit('SET_CURRENT_TYPE', type)
  },
  setAddToShelf({ commit }, book) {
    return commit('ADD_TO_SHELF', book)
  },
  setRemoveFromShelf({ commit }, book) {
    return commit('REMOVE_FROM_SHELF', book)
  },
  setSelectedRemoveFromShelf({ commit }) {
    return commit('SELECTED_REMOVE_FROM_SHELF')
  },
  setSelectRemoveFromGroup({ commit }) {
    return commit('SELECTED_REMOVE_FROM_GROUP')
  },
  setDeleteGroup({ commit }, group) {
    return commit('DELETE_GROUP', group)
  },
  setSelectedMoveToGroup({ commit }, group) {
    return commit('SELECTED_MOVE_TO_GROUP', group)
  },
  setSelectedMoveToNewGroup({ commit }, group) {
    return commit('SELECTED_MOVE_TO_NEW_GROUP', group)
  },
  setChangeGroupName({ commit }, newName) {
    return commit('CHANGE_GROUP_NAME', newName)
  },
  //my
  setHistoryList({ commit }, list) {
    return commit('SET_HISTORY_LIST', list)
  },
}

export default actions
