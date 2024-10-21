<template>
    <div>
        <div :class="{'bg_overlay':calling}"></div>
        <div class="videos" :class="{'calling':calling}">
            <span>
                <video class="webcamVideo" ref="webcamVideo" autoplay playsinline></video>
            </span>
            <span class="answer_call" style="text-align: end; margin-right: 10px;">
                <video :class="{'answer': !calling}" class="remoteVideo" ref="remoteVideo" autoplay playsinline></video>
            </span>
        </div>
        <button class="hangup_call" @click="hangupCall">Kết thúc</button>
    </div>
    <!-- <div v-else>
        <div>Đang gọi</div>
    </div> -->
</template>

<script>
import axios from '../../core/coreRequest'
import { firestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot, addDoc } from '../../firebase';
const servers = {
    iceServers: [
        { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
    ],
    iceCandidatePoolSize: 10,
};

export default {
    data() {
        return {
            calling: true,
            pc: new RTCPeerConnection(servers),
            localStream: null,
            remoteStream: new MediaStream(),
            callId: null,
            userId: null,
            myInfo: null
        };
    },

    async mounted() {
        await this.startWebcam();
        // this.getMyInfo();
        this.callId ? await this.answerCall() : await this.createCall();
    },

    created() {
        this.getMyInfoFromLocalStorage();
        this.userId = this.$route.query.userId || null;
        this.callId = this.$route.query.callId || null;
    },

    methods: {
        getMyInfoFromLocalStorage() {
            const profileData = localStorage.getItem('information-my-profile');
            if (profileData) {
                try {
                    this.myInfo = JSON.parse(profileData);  // Parse và gán giá trị cho myInfo
                } catch (error) {
                    console.error("Error parsing profile data from localStorage:", error);
                }
            } else {
                console.error("No profile data found in localStorage.");
            }
        },
        // async getMyInfo() {
        //     try {
        //         const res = await axios.get('profile/data');
        //         this.myInfo = res.data.myInfo;
        //     } catch (error) {
        //         console.error("Error fetching myInfo:", error);
        //     }
        // },

        async startWebcam() {
            try {
                this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                this.localStream.getTracks().forEach((track) => this.pc.addTrack(track, this.localStream));
                this.pc.ontrack = (event) => {
                    event.streams[0].getTracks().forEach((track) => this.remoteStream.addTrack(track));
                };
                this.$refs.webcamVideo.srcObject = this.localStream;
                this.$refs.remoteVideo.srcObject = this.remoteStream;
            } catch (error) {
                console.error('Error starting webcam: ', error.message);
            }
        },

        setupICECandidates(offerCandidatesRef, answerCandidatesRef) {
            this.pc.onicecandidate = (event) => {
                if (event.candidate) {
                    addDoc(offerCandidatesRef || answerCandidatesRef, event.candidate.toJSON());
                }
            };
        },

        subscribeToCandidates(candidatesRef) {
            return onSnapshot(candidatesRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        this.pc.addIceCandidate(candidate);
                    }
                });
            });
        },

        async createCall() {
            try {
                this.userId = this.$route.query.userId || null;
                if (!this.userId) {
                    console.error("Missing userId");
                    return;
                }
                const callDocRef = doc(collection(firestore, 'calls'));
                const offerCandidatesRef = collection(callDocRef, 'offerCandidates');
                const answerCandidatesRef = collection(callDocRef, 'answerCandidates');

                this.setupICECandidates(offerCandidatesRef);

                const offerDescription = await this.pc.createOffer();
                await this.pc.setLocalDescription(offerDescription);

                const offer = {
                    sdp: offerDescription.sdp,
                    type: offerDescription.type,
                };

                await setDoc(callDocRef, { offer, callStatus: 'calling', createdAt: new Date() });
                this.callId = callDocRef.id;

                this.listenForAnswer(callDocRef);
                this.subscribeToCandidates(answerCandidatesRef);

                await this.notifyUser();
            } catch (error) {
                console.error('Error creating call:', error);
            }
        },

        async notifyUser() {
            if (this.userId && this.myInfo?.nickname) {
                const notificationsRef = collection(firestore, 'notifications');
                await addDoc(notificationsRef, {
                    userId: this.userId,
                    callerName: this.myInfo.nickname,
                    message: 'Bạn có một cuộc gọi video mới!',
                    callId: this.callId,
                    type: 'video-call',
                    timestamp: new Date(),
                });
            } else {
                console.error('userId or callerName is missing', {
                    userId: this.userId,
                    callerName: this.myInfo?.nickname
                });
            }
        },

        listenForAnswer(callDocRef) {
            onSnapshot(callDocRef, (snapshot) => {
                const data = snapshot.data();
                if (data?.answer && !this.pc.currentRemoteDescription) {
                    this.calling = false
                    const answerDescription = new RTCSessionDescription(data.answer);
                    this.pc.setRemoteDescription(answerDescription);
                }
                if (data?.callStatus === 'ended') {
                    window.close();
                    this.hangupCall();
                }
            });
        },

        async answerCall() {
            try {
                const callDocRef = doc(firestore, 'calls', this.callId);
                const offerCandidatesRef = collection(callDocRef, 'offerCandidates');
                const answerCandidatesRef = collection(callDocRef, 'answerCandidates');

                this.setupICECandidates(null, answerCandidatesRef);

                const callData = (await getDoc(callDocRef)).data();
                if (callData?.offer) {
                    const offerDescription = new RTCSessionDescription(callData.offer);
                    await this.pc.setRemoteDescription(offerDescription);

                    const answerDescription = await this.pc.createAnswer();
                    await this.pc.setLocalDescription(answerDescription);

                    const answer = {
                        type: answerDescription.type,
                        sdp: answerDescription.sdp,
                    };
                    await setDoc(callDocRef, { answer, callStatus: 'in-a-call', createdAt: new Date() });

                }
                this.calling = false
                this.subscribeToCandidates(offerCandidatesRef);
                this.listenForAnswer(callDocRef);
            } catch (error) {
                console.error('Error answering call:', error);
            }
        },

        async hangupCall() {
            [this.localStream, this.remoteStream].forEach(stream => {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            });
            this.pc?.close();
            try {
                const callDocRef = doc(firestore, 'calls', this.callId);
                await updateDoc(callDocRef, { callStatus: 'ended' });
                console.log('Call status updated to ended.');
            } catch (error) {
                console.error('Error updating call status: ', error);
            }
            this.calling = true
            window.close();
        }
    },

    watch: {
        remoteStream(newStream) {
            if (newStream) {
                this.$refs.remoteVideo.srcObject = newStream;
            }
        }
    }
};

</script>

<style scoped>
.bg_overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5); /* Làm tối nền, có thể chỉnh độ mờ */
    display: flex;
    justify-content: center; /* Căn giữa theo chiều ngang */
    align-items: center;     /* Căn giữa theo chiều dọc */
    z-index: 2; /* Đảm bảo overlay hiển thị trên tất cả các thành phần khác */

}
.videos {
    display: flex;
    justify-content: space-around;
}

video {
    width: 45%;
}
.remoteVideo.answer{
    border: 1px solid #fff;
}
.answer_call{
    position: absolute;
    top: 10px;
    right: 10px;
z-index: 4;
}
.webcamVideo {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover; /* Giữ tỷ lệ khung hình mà không bị biến dạng */
    z-index: 1; /* Đảm bảo video nằm trên cùng */
}
.hangup_call {
    text-align: center;
    display: block;
    width: 100px;
    margin: auto;
    border: none;
    background: red;
    color: rgb(255, 255, 255);
    border-radius: 10px;
    font-weight: 600;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
}
</style>
