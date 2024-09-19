<template>
    <div class="col-md-6 bg-white pt-5 pt-5 pb-lg-0 pb-5">
        <div class="sign-in-from">
            <h1 class="mb-0">Đăng nhập</h1>
            <p>Kết nối và chia sẽ với mọi người</p>
            <form class="mt-4">
                <div class="form-group">
                    <label class="form-label" for="exampleInputEmail1">Email </label>
                    <input v-model="sign_in.username" type="text" class="form-control mb-0" id="exampleInputEmail1"
                        placeholder="Enter email">
                </div>
                <div class="form-group ">
                    <label class="form-label" for="exampleInputPassword1">Mật khẩu</label>
                    <!-- <a href="#" class="float-end">Forgot password?</a> -->
                    <div class=" position-relative">
                        <input v-model="sign_in.password" type="password" class="form-control mb-0" ref="password"
                            id="exampleInputPassword1" placeholder="Password" @keyup.enter="login()">
                        <i class="fas  position-absolute c-pointer" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                            @click="showPass"
                            style="right: .65rem; top: 50%; transform: translateY(-50%); font-size: 1rem;"></i>

                    </div>
                </div>
                <div class="d-inline-block w-100">
                    <div class="form-check d-inline-block mt-2 pt-1">
                        <input v-model="sign_in.remember" type="checkbox" class="form-check-input" id="customCheck11">
                        <label class="form-check-label" for="customCheck11">Nhớ mật khẩu</label>
                    </div>
                    <button v-if="!loading" type="submit" class="btn btn-primary w-100" @click="signIn()">Đăng nhập</button>
                    <button v-else class="btn btn-secondary w-100 " disabled>
                        <img src="../../../../assets/client/images/page-img/loading.gif" alt="loader"
                            style="height: 20px;">
                        Đăng nhập
                    </button>
                </div>
                <div class="sign-info text-center">
                    <span class="dark-color d-inline-block line-height-2">Bạn chưa có tài khoản?
                        <router-link :to="{ name: 'sign-up' }">
                            Đăng ký
                        </router-link>
                    </span>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import axios from '../../../../core/coreRequest';
import Swal from 'sweetalert2'
export default {
    data() {
        return {
            sign_in: {},
            hash_active: 0,
            count_time: 60,
            intervalId: null,
            email: '',
            check: false,
            loading: 0,
            showPassword: false
        }
    },
    mounted() {
        const storedData = sessionStorage.getItem("storedData");
        if (storedData !== null) {
            const parsedData = JSON.parse(storedData);
            this.count_time = parsedData.count_time;
            if (parsedData.count_time < 0) {
                this.count_time = 60;
            }
            this.email = this.sign_in.username;
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
                sessionStorage.setItem("storedData", JSON.stringify({ count_time: this.count_time, email: this.sign_in.username }));
                if (this.count_time == 0) {
                    axios.post('delete-active', { email: this.email })
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
                    .post('resent-mail', { email: this.email })
                    .then(() => {
                        this.count_time = 60;
                        this.startInterval();
                    })
            }
            this.check = false
        },
        activeMail() {
            const enterConfirmationCode = async () => {
                const result = await Swal.fire({
                    title: "Nhập mã xác nhận của bạn",
                    inputLabel: `Vui lòng kiểm tra email của bạn và nhập mã bên dưới. Mã này sẽ hết hạn sau 1 phút`,
                    input: "text",
                    inputPlaceholder: "Enter your code",
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
                    confirmButtonText: "Xác thực",
                    cancelButtonText: "Bỏ qua",
                    allowOutsideClick: false,
                    didOpen: () => {
                        this.count_time = 60
                        this.startInterval()
                        const resentMailLabel = document.querySelector('.swal2-popup .resent-mail');
                        if (resentMailLabel) {
                            resentMailLabel.addEventListener('click', this.resentHashActiveMail);
                        }
                    },
                    preConfirm: (hash_active) => {
                        if (!hash_active) {
                            Swal.showValidationMessage("Please enter the confirmation code");
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
                    const response = await axios.post('active-mail', { hash_active });
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
                            });
                        } else {
                            const alertResult = await Swal.fire({
                                icon: "error",
                                text: response.message,
                                showCancelButton: true,
                                confirmButtonText: "thử lại",
                                cancelButtonText: "bỏ qua",
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
        signIn() {
            this.loading = 1
            axios
                .post('sign-in', this.sign_in)
                .then((res) => {
                    this.loading = 0
                    if (res.data.status == 1) {
                        var token = res.data.token;
                        // Lưu token vào localStorage
                        localStorage.setItem('token', token);
                        this.$router.push({ name: "homepage" });
                        // window.location.href = "/newfeeds";
                    } else if (res.data.status == -1) {
                        this.email = res.data.email
                        Swal.fire({
                            icon: "info",
                            title: "Check mail",
                            text: res.data.message,
                            confirmButtonText: 'OK',
                            allowOutsideClick: false,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.activeMail()
                            }
                        })
                    } else if (res.data.status = -2) {
                        Swal.fire({
                            icon: "error",
                            title: "Erorr...",
                            text: res.data.message,
                            showConfirmButton: false
                        })
                        setTimeout(() => {
                            Swal.close();
                        }, 2000)
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Erorr...",
                            text: "Thông tin tài khoản không đúng",
                            showConfirmButton: false
                        });
                        setTimeout(() => {
                            Swal.close();
                        }, 2000);
                    }
                })
        },
        login() {
            if (!this.sign_in.password || !this.sign_in.username) {
                Swal.fire({
                    icon: "error",
                    title: "Erorr...",
                    text: "Vui lòng nhập thông tin đầy đủ",
                    showConfirmButton: false
                });
                setTimeout(() => {
                    Swal.close();
                }, 2000);
            } else {
                this.signIn()
            }
        },
        showPass() {
            this.showPassword = !this.showPassword
            this.$refs.password.type = this.showPassword ? 'text' : 'password';
        }
    },
}
</script>
<style>
@import '../signUp/style.css'
</style>