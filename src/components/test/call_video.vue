<template>
    <div>
        <h2>1. Start your Webcam</h2>
        <div class="videos">
            <span>
                <h3>Local Stream</h3>
                <video ref="webcamVideo" autoplay playsinline></video>
            </span>
            <span>
                <h3>Remote Stream</h3>
                <video ref="remoteVideo" autoplay playsinline></video>
            </span>
        </div>
        <p>Answer the call from a different browser window or device</p>
        <input v-model="callId" placeholder="Enter Call ID" />
        <button :disabled="!callId" @click="answerCall">Answer</button>
        <h2>4. Hangup</h2>
        <button :disabled="!remoteStream" @click="hangupCall">Hangup</button>
    </div>
</template>

<script>
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
            callId: '',
        };
    },
    async mounted() {
        // Start webcam automatically when the component is mounted
        await this.startWebcam();
        await this.createCall()
    },
    methods: {
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
                });

                onSnapshot(answerCandidatesRef, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const candidate = new RTCIceCandidate(change.doc.data());
                            this.pc.addIceCandidate(candidate);
                        }
                    });
                });

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
            } catch (error) {
                console.error('Error answering call: ', error);
            }
        },
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
