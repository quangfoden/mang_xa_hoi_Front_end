<template>
    <div>
        <h2>1. Start your Webcam</h2>
        <div class="videos">
            <span>
                <video ref="webcamVideo" autoplay playsinline></video>
            </span>
            <span>
                <h3>Friend</h3>
                <video ref="remoteVideo" autoplay playsinline></video>
            </span>
        </div>
        <button :disabled="!remoteStream" @click="hangupCall">Kết thúc</button>
    </div>
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
            pc: new RTCPeerConnection(servers),
            localStream: null,
            remoteStream: null,
            callId: null,
            userId: null,
            myInfo: null
        };
    },
    async mounted() {
        await this.startWebcam();
        if (this.callId) {
            console.log('có callId');
            this.answerCall();
        }
        else {
            await this.createCall()
            console.log('tạo mới call');
        }
    },

    created() {
        this.getMyInfo()
        if (this.$route.query.userId) {
            this.userId = this.$route.query.userId;
        }
        if (this.$route.query.callId) {
            this.callId = this.$route.query.callId;
        }
    }
    ,
    methods: {
        getMyInfo() {
            axios
                .get('profile/data')
                .then((res) => {
                    this.myInfo = res.data.myInfo;
                });
        },

        async startWebcam() {
            try {
                this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                this.remoteStream = new MediaStream();

                this.localStream.getTracks().forEach((track) => {
                    this.pc.addTrack(track, this.localStream);
                });

                this.pc.ontrack = (event) => {
                    event.streams[0].getTracks().forEach((track) => {
                        this.remoteStream.addTrack(track);
                    });
                };

                this.$refs.webcamVideo.srcObject = this.localStream;
                this.$refs.remoteVideo.srcObject = this.remoteStream;
            } catch (error) {
                console.error('Error starting webcam: ', error);
            }
        },

        async createCall() {
            try {
                // Create a reference to a new document in 'calls' collection
                const callDocRef = doc(collection(firestore, 'calls'));
                const offerCandidatesRef = collection(callDocRef, 'offerCandidates');
                const answerCandidatesRef = collection(callDocRef, 'answerCandidates');

                // Save ICE candidates to the database
                this.pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        addDoc(offerCandidatesRef, event.candidate.toJSON());
                    }
                };

                // Create offer and set local description
                const offerDescription = await this.pc.createOffer();
                await this.pc.setLocalDescription(offerDescription);

                const offer = {
                    sdp: offerDescription.sdp,
                    type: offerDescription.type,
                };

                await setDoc(callDocRef, { offer });

                this.callId = callDocRef.id;

                onSnapshot(callDocRef, (snapshot) => {
                    const data = snapshot.data();
                    if (data?.answer && !this.pc.currentRemoteDescription) {
                        const answerDescription = new RTCSessionDescription(data.answer);
                        this.pc.setRemoteDescription(answerDescription);
                    }
                    if (data?.callStatus === 'ended') {
                        this.hangupCall();
                    }
                });

                onSnapshot(answerCandidatesRef, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const candidate = new RTCIceCandidate(change.doc.data());
                            this.pc.addIceCandidate(candidate);
                        }
                    });
                });
                if (this.userId && this.myInfo?.nickname) {
                    console.log('notificationsRef');

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
                    console.error('userId or callerName is missing');
                }

            } catch (error) {
                console.error('Error creating call: ', error);
            }
        }
        ,

        async answerCall() {
            try {
                const callDocRef = doc(collection(firestore, 'calls'), this.callId);
                const answerCandidatesRef = collection(callDocRef, 'answerCandidates');
                const offerCandidatesRef = collection(callDocRef, 'offerCandidates');

                this.pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        addDoc(answerCandidatesRef, event.candidate.toJSON());
                    }
                };

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

                    await updateDoc(callDocRef, { answer });
                }

                onSnapshot(offerCandidatesRef, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const candidate = new RTCIceCandidate(change.doc.data());
                            this.pc.addIceCandidate(candidate);
                        }
                    });
                });

                onSnapshot(callDocRef, (snapshot) => {
                    const data = snapshot.data();
                    if (data?.callStatus === 'ended') {
                        this.hangupCall();
                    }
                });
            } catch (error) {
                console.error('Error answering call: ', error);
            }
        }
        ,

        hangupCall() {
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => track.stop());
            }
            if (this.remoteStream) {
                this.remoteStream.getTracks().forEach(track => track.stop());
            }
            if (this.pc) {
                this.pc.close();
            }
            this.localStream = null;
            this.remoteStream = null;
            const callDocRef = doc(collection(firestore, 'calls'), this.callId);
            updateDoc(callDocRef, { callStatus: 'ended' });
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
.videos {
    display: flex;
    justify-content: space-around;
}

video {
    width: 45%;
}
</style>
