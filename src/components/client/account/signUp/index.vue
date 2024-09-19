<template >
    <div class="col-md-6 bg-white">
        <div class="sign-in-from pt-4" style="overflow: auto; max-height: 90vh; height: 90vh;">
            <h1 class="mb-0">Đăng ký</h1>
            <p>Nơi bắt đầu để kết nối với thế giới</p>
            <div class="mt-2">
                <div class="form-group">
                    <input v-model="sign_up.fullname" type="email" class="form-control mb-0" placeholder="Full name">
                </div>
                <div class="form-group">
                    <input v-model="sign_up.email" type="email" class="form-control mb-0" placeholder="Email address">
                </div>

                <div class="form-group">
                    <div class="row">
                        <div class="col">
                            <input v-model="sign_up.username" type="text" class="form-control mb-0" placeholder="Username">
                        </div>
                        <div class="col">
                            <input v-model="sign_up.phone_number" type="text" class="form-control mb-0"
                                placeholder="Phone number">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <input v-model="sign_up.password" type="password" class="form-control mb-0" placeholder="Password">
                </div>
                <div class="form-group">
                    <label>Ngày sinh</label>
                    <input v-model="sign_up.date_of_birth" type="date" class="form-control mb-0" placeholder="Password">
                </div>
                <div class="form-group">
                    <label>Giới tính</label>
                    <div class="w-100 d-flex">
                        <div class="form-control d-flex justify-content-between me-2" style="cursor: pointer"
                            @click="selectRadio('1')">
                            <label style="cursor: pointer">Nam</label>
                            <input value="1" v-model="sign_up.gender" name="gender" type="radio"
                                :checked="selectedGender == 1" />
                        </div>

                        <div class="form-control d-flex justify-content-between me-2" style="cursor: pointer"
                            @click="selectRadio('0')">
                            <label style="cursor: pointer">Nữ</label>
                            <input value="0" v-model="sign_up.gender" name="gender" type="radio"
                                :checked="selectedGender == 0" />
                        </div>

                        <div class="form-control d-flex justify-content-between me-2" style="cursor: pointer"
                            @click="selectRadio('-1')">
                            <label style="cursor: pointer">Khác</label>
                            <input value="-1" v-model="sign_up.gender" name="gender" type="radio"
                                :checked="selectedGender == -1" />
                        </div>
                    </div>
                </div>
                <div class="d-inline-block w-100 mt-2">
                    <button v-if="!loading" type="submit" class="btn btn-primary w-100" @click="signUp()">Sign Up</button>
                    <button v-else class="btn btn-secondary w-100 " disabled>
                        <img src="../../../../assets/client/images/page-img/loading.gif" alt="loader" style="height: 20px;">
                        Đăng ký
                    </button>
                </div>
                <div class="sign-info text-center">
                    <span class="dark-color d-inline-block line-height-2">Bạn đã có tài khoản ?
                        <router-link :to="{ name: 'sign-in' }">
                            Đăng nhập
                        </router-link>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Swal from 'sweetalert2'
import axios from 'axios';
import { createToaster } from '@meforma/vue-toaster'
const toastr = createToaster({
    position: 'bottom-left'
})
export default {
    data() {
        return {
            sign_up: {},
            selectedGender: null,
            hash_active: 0,
            count_time: 60,
            intervalId: null,
            email: '',
            check: false,
            loading: 0,
        }
    },
    mounted() {
        const storedData = sessionStorage.getItem("storedData");
        if (storedData !== null) {
            const parsedData = JSON.parse(storedData);
            this.count_time = parsedData.count_time;
            if (parsedData.count_time <= 0) {
                this.count_time = 60;
            }
            this.email = this.sign_up.email;
            this.startInterval();
        } else {
            console.log('Fail');
        }
    },
    beforeDestroy() {
        this.stopInterval();
    },
    methods: {
        startInterval() {
            this.intervalId = setInterval(() => {
                this.count_time--;
                sessionStorage.setItem("storedData", JSON.stringify({ count_time: this.count_time, email: this.sign_up.email }));
                if (this.count_time == 0) {
                    axios.post('http://127.0.0.1:8000/api/delete-active', { email: this.email })
                        .then(() => {
                            this.stopInterval();
                        });
                }
            }, 1000);
        },
        stopInterval() {
            clearInterval(this.intervalId);
            sessionStorage.removeItem("storedData");
            this.check = true
            $('.resent-mail').css({
                'cursor': 'pointer',
                'color': 'rgb(35, 108, 176)',
            });
        },
        resentHashActiveMail() {
            if (this.check) {
                $('.border-top-loading-resent').css({
                    'width': 100 + '%',
                    'transition': 'width 5s ease-out',
                });
                setTimeout(() => {
                    $('.border-top-loading-resent').css({
                        'width': 0,
                        'transition': 'none',
                    });
                }, 5000)
                this.check = true
                $('.resent-mail').css({
                    'cursor': 'not-allowed',
                    'color': 'grey',
                });
                axios
                    .post('http://127.0.0.1:8000/api/resent-mail', { email: this.sign_up.email })
                    .then(() => {
                        this.count_time = 60;
                        this.startInterval();
                    })
            }
            this.check = false
        },
        activeMail() {
            this.startInterval();
            const enterConfirmationCode = async () => {
                const result = await Swal.fire({
                    title: "Nhập mã xác nhận của bạn",
                    inputLabel: `Mã này sẽ hết hạn sau 1 phút`,
                    input: "text",
                    inputPlaceholder: "Nhập mã của bạn",
                    inputAttributes: {
                        maxlength: "6",
                        autocapitalize: "off",
                        autocorrect: "off",
                    },
                    html: `
                        <div class='resent-mail'>gửi lại mã</div>
                        <div class="border-top-loading-resent"></div>
                    `,
                    showCancelButton: true,
                    confirmButtonText: "Activate",
                    cancelButtonText: "Cancel",
                    allowOutsideClick: false,
                    didOpen: () => {
                        if (this.count_time == 0) {
                            $('.resent-mail').css({
                                'cursor': 'pointer',
                                'color': 'rgb(35, 108, 176)',
                            });
                        } else {
                            $('.resent-mail').css({
                                'cursor': 'not-allowed',
                                'color': 'grey',
                            });
                        }
                        const resentMailLabel = document.querySelector('.swal2-popup .resent-mail');
                        if (resentMailLabel) {
                            resentMailLabel.addEventListener('click', this.resentHashActiveMail);
                        }
                    },
                    preConfirm: (hash_active) => {
                        if (!hash_active) {
                            Swal.showValidationMessage("Vui lòng nhập mã xác nhận");
                            const mess = document.querySelector('.swal2-validation-message');
                            if (mess) {
                                mess.style.margin = '0 -1.28rem';
                            }
                        }
                        return hash_active;
                    },
                });
                return result;
            };
            const activateAccount = async (hash_active) => {
                try {
                    const response = await axios.post('http://127.0.0.1:8000/api/active-mail', { hash_active });
                    return response.data;
                } catch (error) {
                    return { status: 0, message: "Đã xảy ra sự cố khi kích hoạt tài khoản của bạn" };
                }
            };

            const processActivation = async () => {
                let isActivationSuccessful = false;

                while (!isActivationSuccessful) {
                    const result = await enterConfirmationCode();

                    if (result.isConfirmed) {
                        const response = await activateAccount(result.value);
                        if (response.status === 1) {
                            isActivationSuccessful = true;
                            Swal.fire({
                                icon: "success",
                                title: "Tài khoản đã được kích hoạt",
                                text: response.message,
                                allowOutsideClick: false,
                            }).then(() => {

                                this.$router.push({ name: 'sign-in' });
                            });
                        } else {
                            const alertResult = await Swal.fire({
                                icon: "error",
                                text: response.message,
                                showCancelButton: true,
                                confirmButtonText: "Thử lại",
                                cancelButtonText: "Bỏ qua",
                                allowOutsideClick: false,
                            });

                            if (!alertResult.isConfirmed) {
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            };
            processActivation();
        },

        signUp() {
            this.loading = 1
            var payload = {
                ...this.sign_up,
                gender: this.selectedGender,
            };
            this.email = this.sign_up.email;
            axios.post('http://127.0.0.1:8000/api/sign-up', payload)
                .then((res) => {
                    if (res.data.status) {
                        this.loading = 0
                        Swal.fire({
                            title: 'Kiểm tra email',
                            text: 'Kiểm tra thư của bạn và nhập mã xác minh để kích hoạt tài khoản của bạn',
                            icon: 'info',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.activeMail()
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Tài khoản đã tồn tại",
                        });
                    }
                })
                .catch((err) => {
                    this.loading = 0
                    $.each(err.response.data.errors, function (k, v) {
                        toastr.error(v[0]);
                    });
                })
        },
        selectRadio(value) {
            this.selectedGender = value;
        },
    },
}
</script>
<style>
@import './style.css';
</style>