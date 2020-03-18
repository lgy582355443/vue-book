import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import Toast from '../components/common/toast.vue'
import Popup from '../components/common/Popup.vue'
import ShelfDialog from '../components/shelf/ShelfGroupDialog.vue'

Vue.use(CreateAPI)
Vue.createAPI(Toast, true);
Vue.createAPI(Popup, true);
Vue.createAPI(ShelfDialog, true)
Vue.mixin({
    methods: {
        toast(settings) {
            return this.$createToast({
                $props: settings
            })
        },
        popup(settings) {
            return this.$createPopup({
                $props: settings
            })
        },
        shelfDialog(settings) {
            return this.$createShelfDialog({
                $props: settings
            })
        },
        simpleToast(text) {
            const toast = this.toast({
                text
            })
            toast.showToast(text)
        },

        //一直显示
        continueShow(text) {
            const toast = this.toast({
                text
            })
            toast.continueShow(text)
        },

        toastHide() {
            const toast = this.toast();
            toast.hide();
        },

        toastUpdata(text) {
            const toast = this.toast({
                text
            });
            toast.updateText(text);
        },

        popupShow({
            title = null,
            btn
        }) {
            const popup = this.popup({
                title,
                btn
            })
            popup.show();
        },

        popupHide() {
            const popup = this.popup();
            popup.hide();
        }
    }
})