<template>
  <transition name="fade">
    <div class="shelf-title" :class="{'hide-shadow':ifHideShadow}" v-show="shelfTitleVisible">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showClear">
        <span class="shelf-title-btn-text" @click="clearCache">{{$t('shelf.clearCache')}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showBack">
        <span class="icon-back" @click="back"></span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right" v-show="showEdit">
        <span
          class="shelf-title-btn-text"
          @click="onEditClick"
        >{{isEditMode?$t('shelf.cancel'):$t('shelf.edit')}}</span>
      </div>
      <div
        class="shelf-title-btn-wrapper"
        :class="{'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight}"
        @click="changeGroup"
        v-if="showChangeGroup"
      >
        <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { shelfMixin } from "../../utils/mixin";
import { clearLocalStorage, saveBookShelf } from "../../utils/localStorage";
import { clearLocalForage } from "../../utils/localForage";
export default {
  name: "ShelfTitle",
  mixins: [shelfMixin],
  components: {},
  props: {
    title: String
  },
  data() {
    return {
      ifHideShadow: true
    };
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.ifHideShadow = false;
      } else {
        this.ifHideShadow = true;
      }
    }
  },
  computed: {
    //分组是否为空
    emptyCategory() {
      return (
        !this.shelfCategory ||
        !this.shelfCategory.itemList ||
        this.shelfCategory.itemList.length === 0
      );
    },
    showEdit() {
      return this.currentType === 1 || !this.emptyCategory;
    },
    showClear() {
      return this.currentType === 1;
    },
    showBack() {
      return this.currentType === 2 && !this.isEditMode;
    },

    showChangeGroup() {
      return this.currentType === 2 && (this.isEditMode || this.emptyCategory);
    },
    //分组里不为空时,修改分组在左边
    changeGroupLeft() {
      return !this.emptyCategory;
    },
    //分组里为空时,修改分组在右边
    changeGroupRight() {
      return this.emptyCategory;
    },
    selectedText() {
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0;
      if (selectedNumber == 0) {
        return this.$t("shelf.selectBook");
      } else {
        if (selectedNumber == 1) {
          return this.$t("shelf.haveSelectedBooks").replace(
            "$1",
            selectedNumber
          );
        } else {
          return this.$t("shelf.haveSelectedBooks").replace(
            "$1",
            selectedNumber
          );
        }
      }
    },

    popupCancelBtn() {
      return this.createPopupBtn(this.$t("shelf.cancel"), () => {
        this.hidePopup();
      });
    }
  },
  methods: {
    onEditClick() {
      if (!this.isEditMode) {
        this.setShelfSelected([]);
        this.shelfList.forEach(item => {
          item.selected = false;
          if (item.itemList) {
            item.itemList.forEach(subItem => {
              subItem.selected = false;
            });
          }
        });
      }
      this.setIsEditMode(!this.isEditMode);
    },

    //清空缓存
    clearCache() {
      clearLocalStorage();
      clearLocalForage();
      this.setShelfSelected([]);
      this.setShelfList([]);
      this.getShelfList();
      this.toast({
        text: this.$t("shelf.clearCacheSuccess")
      }).show();
    },

    //创建-修改分组popup
    changeGroup() {
      this.popupMenu = this.popup({
        btn: [
          this.createPopupBtn(this.$t("shelf.editGroupName"), () => {
            this.changeGroupName();
          }),
          this.createPopupBtn(
            this.$t("shelf.deleteGroup"),
            () => {
              this.showDeleteGroup();
            },
            "danger"
          ),
          this.popupCancelBtn
        ]
      }).show();
    },

    //删除分组
    deleteGroup() {
      if (!this.emptyCategory) {
        //把分组里的图书全设为选中
        this.setShelfSelected(this.shelfCategory.itemList);
        //把所有图书移出分组
        this.moveOutOfGroup(this.onComplete);
      } else {
        this.onComplete();
      }
    },

    onComplete() {
      this.hidePopup();
      this.setShelfList(
        this.shelfList.filter(book => book.id !== this.shelfCategory.id)
      ).then(() => {
        saveBookShelf(this.shelfList);
        this.$router.go(-1);
        this.setIsEditMode(false);
      });
    },

    changeGroupName() {
      this.hidePopup();
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title,
        isEditGroup: true
      }).show();
    },

    showDeleteGroup() {
      this.hidePopup();
      setTimeout(() => {
        this.popupMenu = this.popup({
          title: this.$t("shelf.deleteGroupTitle"),
          btn: [
            this.createPopupBtn(
              this.$t("shelf.confirm"),
              () => {
                this.deleteGroup();
              },
              "danger"
            ),
            this.popupCancelBtn
          ]
        }).show();
      }, 200);
    },

    hidePopup() {
      this.popupMenu.hide();
    },

    createPopupBtn(text, onClick, type = "normal") {
      return {
        text: text,
        click: onClick,
        type: type
      };
    },

    back() {
      this.$router.go(-1);
      this.setIsEditMode(false);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global";
.shelf-title {
  position: relative;
  z-index: 130;
  width: 100%;
  height: 42px;
  background: #fff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-title-text-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 42px;
    @include columnCenter;
    .shelf-title-text {
      font-style: 16px;
      line-height: 20px;
      font-weight: bold;
      color: #333;
    }
    .shelf-title-sub-text {
      font-size: 10px;
      color: #333;
    }
  }
  .shelf-title-btn-wrapper {
    position: absolute;
    top: 0;
    z-index: 115;
    padding-right: 16.5px;
    box-sizing: border-box;
    height: 100%;
    @include center;
    &.shelf-title-left {
      left: 15px;
    }
    .icon-back {
      font-size: 20px;
      color: #666;
      margin-left: 10px;
    }
    &.shelf-title-right {
      right: 15px;
    }
    .shelf-title-btn-text {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>