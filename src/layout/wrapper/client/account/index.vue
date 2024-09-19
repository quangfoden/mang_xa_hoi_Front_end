<template>
    <div class="wrapper">
        <section class="sign-in-page">
            <div id="container-inside">
                <div id="circle-small"></div>
                <div id="circle-medium"></div>
                <div id="circle-large"></div>
                <div id="circle-xlarge"></div>
                <div id="circle-xxlarge"></div>
            </div>
            <div class="container p-0">
                <div class="row no-gutters">
                    <div class="col-md-6 text-center pt-5">
                        <div class="sign-in-detail text-white">
                            <a class="sign-in-logo mb-5 d-flex justify-content-center"><img
                                    src="../../../../assets/client/images/main-logo-white.png" class="img-fluid me-1"
                                    alt="logo">
                                <h2 class="text-white  align-content-center" translate="no">NextFuture</h2>
                            </a>
                            <div v-if="checkRole == 'client'" class="sign-slider overflow-hidden ">
                                <div id="carouselExampleRide" class="carousel slide" data-bs-ride="carousel"
                                    data-bs-interval="3000">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <img src="../../../../assets/client/images/login/1.png"
                                                class="d-block w-100" alt="...">
                                            <h4 class="mb-1 text-white">Tìm kiếm bạn bè</h4>
                                            <p>Kết nối là một khoản đầu tư có giá trị - bạn không bao giờ biết được những người mình sẽ gặp và 
                                                những cuộc phiêu lưu mà bạn sẽ có với họ..</p>
                                        </div>
                                        <div class="carousel-item">
                                            <img src="../../../../assets/client/images/login/2.png"
                                                class="d-block w-100" alt="...">
                                            <h4 class="mb-1 text-white">Kết nối với thế giới</h4>
                                            <p>Một cuộc sống đáng sống là một cuộc sống đáng chia sẻ.</p>
                                        </div>
                                        <div class="carousel-item">
                                            <img src="../../../../assets/client/images/login/3.png"
                                                class="d-block w-100" alt="...">
                                            <h4 class="mb-1 text-white">Tạo sự kiện mới</h4>
                                            <p>Luôn cập nhật, cập nhật thông tin - nơi tin tức mở ra.</p>
                                        </div>
                                    </div>
                                    <button
                                        style="opacity: 0; visibility: visible; position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                                        class="carousel-control-prev" type="button"
                                        data-bs-target="#carouselExampleRide" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Previous</span>
                                    </button>
                                    <button
                                        style="opacity: 0; visibility: visible; position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                                        class="carousel-control-next" type="button"
                                        data-bs-target="#carouselExampleRide" data-bs-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Next</span>
                                    </button>
                                </div>
                            </div>
                            <div v-else>
                                <div id="carouselExampleRide" class="carousel slide" data-bs-ride="carousel">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <img src="../../../../assets/img/admin-account.jpg" class="d-block w-100"
                                                style="border-radius: 5px;">
                                            <h3 class="mb-1 text-white fs-3">
                                             Quản lý
                                                <span translate="no">NextFuture</span>
                                            </h3>
                                            <p class="f-500">
                                                The NextFuture management platform streamlines web activities, providing
                                                easy data tracking, analysis, and business communication optimization
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <router-view></router-view>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
import 'bootstrap';

export default {
    name: "app",
    data() {
        return {
            checkRole: null
        }
    },
    created() {
        this.checkRole = this.$route.path == '/sign-in' || 'sign-up' ? 'client' : 'admin'
    },
    methods: {
        //
    },
}
</script>
<style></style>