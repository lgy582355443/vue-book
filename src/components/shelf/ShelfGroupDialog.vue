<template>
  <ebook-dialog :title="title" ref="dialog">
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <div
        class="dialog-list-item"
        :class="{'is-add': item.edit  ? item.edit === 1 : false}"
        v-for="(item, index) in categoryList"
        :key="index"
        @click="onGroupClick(item)"
        v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit"
      >
        <div class="dialog-list-item-text">{{item.title}}</div>
        <div class="dialog-list-icon-wrapper" v-if="isInGroup && shelfCategory.id === item.id">
          <span class="icon-check"></span>
        </div>
      </div>
    </div>
    <!-- 新建分组 -->
    <div class="dialog-new-group-wrapper" v-else>
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{$t('shelf.groupName')}}</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput" />
          <div
            class="dialog-input-clear-wrapper"
            @click="clear"
            v-show="newGroupName && newGroupName.length > 0"
          >
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <div slot="btn" class="group-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
      <div
        class="dialog-btn"
        @click="createNewGroup"
        :class="{'is-empty': newGroupName && newGroupName.length === 0}"
        v-if="ifNewGroup"
      >{{$t('shelf.confirm')}}</div>
    </div>
  </ebook-dialog>
</template>

<script>
import EbookDialog from "../common/Dialog";
import { shelfMixin } from "../../utils/mixin";
import { removeAddFromShelf, appendAddToShelf } from "../../utils/home";
import { saveBookShelf } from "../../utils/localStorage";

export default {
  name: "GroupDialog",
  mixins: [shelfMixin],
  components: {
    EbookDialog
  },
  props: {
    showNewGroup: {
      type: Boolean,
      default: false
    },
    isEditGroup: {
      type: Boolean,
      default: false
    },
    groupName: String
  },
  data() {
    return {
      ifNewGroup: false,
      newGroupName: ""
    };
  },
  computed: {
    //是否在分组列表里
    isInGroup() {
      return this.currentType === 2;
    },
    defaultCategory() {
      return [
        {
          title: this.$t("shelf.newGroup"),
          edit: 1
        },
        {
          title: this.$t("shelf.groupOut"),
          edit: 2
        }
      ];
    },
    category() {
      return this.shelfList.filter(item => item.type === 2);
    },
    categoryList() {
      return [...this.defaultCategory, ...this.category];
    },
    title() {
      if (!this.ifNewGroup) {
        return this.$t("shelf.moveBook");
      } else {
        if (this.isEditGroup) {
          return this.$t("shelf.editGroupName");
        } else {
          return this.$t("shelf.newGroup");
        }
      }
    }
  },
  methods: {
    show() {
      this.ifNewGroup = this.showNewGroup;
      this.newGroupName = this.groupName;
      this.$refs.dialog.show();
    },

    hide() {
      this.$refs.dialog.hide();
      setTimeout(() => {
        this.ifNewGroup = false;
      }, 200);
    },

    onGroupClick(item) {
      if (item.edit && item.edit === 1) {
        this.ifNewGroup = true;
      } else if (item.edit && item.edit === 2) {
        this.moveOutFromGroup(item);
      } else {
        this.moveToGroup(item);
      }
    },

    clear() {
      this.newGroupName = "";
    },

    //移入书架
    moveToGroup(group) {
      this.setShelfList(
        this.shelfList.filter(book => {
          if (book.itemList) {
            book.itemList = book.itemList.filter(
              subBook => this.shelfSelected.indexOf(subBook) < 0
            );
          }
          return this.shelfSelected.indexOf(book) < 0;
        })
      ).then(() => {
        if (group && group.itemList) {
          group.itemList = [...group.itemList, ...this.shelfSelected];
        }
        group.itemList.forEach((item, index) => {
          item.id = index + 1;
        });
        this.simpleToast(
          this.$t("shelf.moveBookInSuccess").replace("$1", group.title)
        );
        this.onComplete();
      });
    },

    //移出分组
    moveOutFromGroup() {
      this.moveOutOfGroup(this.onComplete);
    },

    //新建分组
    createNewGroup() {
      if (!this.newGroupName || this.newGroupName.length === 0) {
        return;
      }
      if (this.showNewGroup) {
        this.shelfCategory.title = this.newGroupName;
        this.onComplete();
      } else {
        const group = {
          id: this.shelfList[this.shelfList.length - 2].id + 1,
          itemList: [],
          selected: false,
          title: this.newGroupName,
          type: 2
        };
        let list = removeAddFromShelf(this.shelfList);
        list.push(group);
        list = appendAddToShelf(list);
        this.setShelfList(list).then(() => {
          this.moveToGroup(group);
        });
      }
    },
    onComplete() {
      saveBookShelf(this.shelfList);
      this.hide();
      this.setIsEditMode(false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

.dialog-list-wrapper {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  font-size: 14px;
  @include scroll;
  .dialog-list-item {
    display: flex;
    padding: 15px 0;
    box-sizing: border-box;
    color: #666;
    &.is-add {
      color: $color-blue;
      &:active {
        color: $color-blue-transparent;
      }
    }
    &:active {
      color: rgba(102, 102, 102, 0.5);
    }
    .dialog-list-item-text {
      flex: 1;
    }
    .dialog-list-icon-wrapper {
      flex: 0 0 30px;
      color: $color-blue;
      @include right;
    }
  }
}

.dialog-new-group-wrapper {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .dialog-input-title-wrapper {
    font-size: 10px;
    margin-top: 20px;
  }
  .dialog-input-wrapper {
    width: 100%;
    padding: 0 0 30px 0;
    box-sizing: border-box;
    .dialog-input-inner-wrapper {
      display: flex;
      width: 100%;
      padding: 10px 0;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      color: #666;
      .dialog-input {
        flex: 1;
        border: none;
        &:focus {
          outline: none;
        }
      }
      .dialog-input-clear-wrapper {
        flex: 0 0 30px;
        color: #ccc;
        @include center;
        &:active {
          color: #999;
        }
      }
    }
  }
}

.group-dialog-btn-wrapper {
  width: 100%;
  @include center;
}

.dialog-btn {
  flex: 1;
  &.is-empty {
    color: rgba(255, 255, 255, 0.5);
  }
  &:active {
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
