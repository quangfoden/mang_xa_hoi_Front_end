<template>
  <CallNotification ref="callNotification" />
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<script>
import CallNotification from './components/client/modal_video_call/modal_video_call.vue';
import axios from './core/coreRequest'
import { firestore, collection, onSnapshot, doc, deleteDoc } from './firebase';
const default_layout = "default";
export default {
  components: {
    CallNotification,
  },
  data() {
    return {
      myInfo: null,
    }
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    },

  },
  async mounted() {
    const myInfoString = localStorage.getItem('information-my-profile');
    if (!this.myInfo) {
      await this.getMyInfo()
    }
    else {
      this.myInfo = JSON.parse(myInfoString);
      console.log(this.myInfo.id);
    }
    this.listenForNotifications();
  },

  methods: {
    async getMyInfo() {
      try {
        const res = await axios.get('profile/data');
        this.myInfo = res.data.myInfo;
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    listenForNotifications() {
      const notificationsRef = collection(firestore, 'notifications');
      onSnapshot(notificationsRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const notification = change.doc.data();
            if (notification.userId == this.myInfo.id && notification.type == 'video-call') {
              this.showCallNotification(notification.callerName, notification.callId);
              this.removeNotification(change.doc.id);
            }
          }
        });
      });
    },
    showCallNotification(callerName, callId) {
      this.$refs.callNotification.showCallNotification(callerName, callId);
    },
    async removeNotification(notificationId) {
      const notificationRef = doc(firestore, 'notifications', notificationId);
      await deleteDoc(notificationRef);
    },
  }
};
</script>
<style></style>