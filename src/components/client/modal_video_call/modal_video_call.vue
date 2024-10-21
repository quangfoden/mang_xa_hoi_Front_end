<template>
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
            <h3>Cuộc gọi video mới</h3>
            <p>Bạn có một cuộc gọi video mới từ {{ callerName }}</p>
            <div calss="" style="display: flex;gap: 20px;justify-content: center">
                <button class="btnAcc" @click="handleAnswerCall"
                    style="width: 50px; height: 50px; border-radius: 50%; border: none;background-color: green;"><i
                        style="color: #fff;font-size: 20px;" class="fa-solid fa-video"></i></button>
                <button @click="handleIgnoreCall" class="btcDe"
                    style="width: 50px; height: 50px;border-radius: 50%; border: none; background-color: red;"><i
                        style="color: #fff; font-size: 20px" class="fa-solid fa-phone"></i></button>
            </div>
        </div>
    </div>
    <audio ref="ringtone" src="/src/assets/mp3/ssstik.io_1726702988667.mp3" loop preload="auto"></audio>
</template>

<script>
import { doc, updateDoc, firestore } from '../../../firebase';

export default {
    data() {
        return {
            showModal: false,
            callerName: '',
            callId: null
        };
    },
    methods: {
        showCallNotification(callerName, callId) {
            this.callerName = callerName;
            this.callId = callId
            this.showModal = true;
            this.$refs.ringtone.play()
        },
        async handleAnswerCall() {
            this.showModal = false;
            this.$refs.ringtone.pause();
            this.$refs.ringtone.currentTime = 0;
            window.open(`/video-call?callId=${this.callId}`, '_blank', 'width=800,height=600');
        },
        async handleIgnoreCall() {
            this.$refs.ringtone.pause();
            this.$refs.ringtone.currentTime = 0;
            this.showModal = false;
            try {
                const callDocRef = doc(firestore, 'calls', this.callId);
                await updateDoc(callDocRef, { callStatus: 'ended' });
                console.log('Call status updated to ended.');
            } catch (error) {
                console.error('Error updating call status: ', error);
            }
        },
    },
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    width: auto;
}

.btnAcc,
.btcDe {
    position: relative;
}

.btnAcc i,
.btcDe i {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
