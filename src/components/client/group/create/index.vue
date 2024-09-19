<template>
    <div class="abc sidebar-default" style="width: 20vw; top: 0; overflow: hidden; height: 100vh;">
        <div id="sidebar-scrollbar " data-scrollbar="true" tabindex="-1"
            style="overflow: hidden; outline: none; position: relative; height: 100%;">
            <div class="scroll-content" style="position: relative; height: 100%;">
                <nav class="iq-sidebar-menu " style="position: relative; ">
                    <div class="iq-navbar-logo d-flex mx-3 mt-3">
                        <router-link :to="{ name: 'group' }">
                            <div class="rounded-circle d-flex justify-content-center align-items-center close me-2"
                                style="height: 45px; width: 45px; background-color: #9c9c9c; cursor: pointer;">
                                <i class="fa-solid fa-xmark " style="font-size: 25px; color: rgb(255, 255, 255);"></i>
                            </div>
                        </router-link>
                        <router-link :to="{ name: 'homepage' }">
                            <img src="../../../../assets/img/logo-main.png" class="img-fluid" alt="">
                        </router-link>
                    </div>
                    <hr style="margin: 0.5rem 0;">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb  mb-0 py-0 ps-3" style="background-color: transparent;">
                            <li class="breadcrumb-item">
                                <router-link :to="{ name: 'group' }">
                                    <a href="#">Group</a>
                                </router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">Tạo nhóm mới</li>
                        </ol>
                    </nav>
                    <div class="w-100  px-3">
                        <h4><b>Tạo nhóm mới</b></h4>
                        <div class="w-100 d-flex mb-2 align-items-center" style="height: auto;">
                            <div class="bg-light circle d-flex me-2 justify-content-center align-items-center"
                                style="width:40px;height:40px; overflow: hidden;">
                                <img :src="urlImg + myData.avatar" class="img-fluid" style="object-fit: cover;" alt="">
                            </div>
                            <div class="d-flex justify-content-between align-items-center"
                                style="width:calc(100% - 60px);">
                                <div class="d-flex flex-column align-items-center pt-3"
                                    style="user-select:none; line-height: 15px;">
                                    <h6><b style="font-weight:500;">{{ myData.fullname }}</b></h6>
                                    <p class="">Quản trị viên</p>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3  cmn" style="position: relative;">
                            <input @input="input()" v-model="group_name" type="text" name="input" class="input-custom"
                                placeholder=" ">
                            <lable for="input" class=" small-title">Tên nhóm</lable>
                        </div>
                        <div class="dropdown">
                            <div @click="toggle('select-privacy')" data-bs-toggle="dropdown" aria-expanded="false"
                                class="mb-3 privacy flex-between" style="position: relative; cursor: pointer;">
                                <div v-if="privacy != 0" class="flex-center me-2" style="width: 10%;">
                                    <i v-if="privacy == 1" class="fas fa-globe-asia fa-2x"></i>
                                    <i v-else-if="privacy == -1" class="fas fa-lock fa-2x"></i>
                                </div>
                                <div class="w-100" v-if="privacy == 1">Public</div>
                                <div class="w-100" v-else-if="privacy == -1">Private</div>
                                <div class="w-100" v-else>Select privacy</div>
                                <i
                                    :class="{ 'fas fa-caret-down': true, 'rotated': isRotated, 'reverse-rotation': !isRotated }"></i>

                            </div>
                            <ul class="dropdown-menu w-100 select-privacy">
                                <li @click="setPrivacy('1')" class="dropdown-item">
                                    <div class="w-100 d-flex mb-2 align-items-center" style="height: auto;">
                                        <div class="bg-light circle  me-2 flex-center" style="width:40px;height:auto;">
                                            <i class="fas fa-globe-asia text-dark" style="font-size: 20px;"></i>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center"
                                            style="width: 85%;">
                                            <div class="pt-3" style="user-select:none; width: 100%;">
                                                <h5><b style="font-weight:500;">Public</b></h5>
                                                <div style=" white-space: normal; font-size: 12px;">
                                                    Bất kỳ ai cũng có thể xem mọi người trong nhóm và nội dung họ đăng
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </li>
                                <li @click="setPrivacy('-1')" class="dropdown-item">
                                    <div class="w-100 d-flex mb-2   align-items-center" style="height: 65px;">
                                        <div class="bg-light circle  me-2 flex-center" style="width:40px;height:40px;">
                                            <i class="fas fa-lock text-dark" style="font-size: 20px;"></i>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center"
                                            style="width: 85%;">
                                            <div class="pt-3" style="user-select:none; width: 100%;">
                                                <h5><b style="font-weight:500;">Private</b></h5>
                                                <div style=" white-space: normal; font-size: 12px;">
                                                    Chỉ những thành viên trong nhóm nội dung họ đăng mới được tìm thấy
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div v-if="privacy == -1" class="dropdown">
                            <div @click="toggle('select-display')" data-bs-toggle="dropdown" aria-expanded="false"
                                class="mb-3 privacy flex-between" style="position: relative; cursor: pointer;">
                                <div v-if="display != 0" class="flex-center me-2" style="width: 10%;">
                                    <i v-if="display == 2" class="fas fa-eye fa-2x"></i>
                                    <i v-else-if="display == -2" class="fas fa-eye-slash fa-2x"></i>
                                </div>
                                <div class="w-100" v-if="display == 2">Hiển thị</div>
                                <div class="w-100" v-else-if="display == -2">Ẩn</div>
                                <div v-else class=" w-100">Chế độ hiển thị</div>
                                <i
                                    :class="{ 'fas fa-caret-down': true, 'rotated': isRotated2, 'reverse-rotation': !isRotated2 }"></i>

                            </div>
                            <ul class="dropdown-menu w-100 select-display">
                                <li @click="setDisplay('2')" class="dropdown-item">
                                    <div class="w-100 d-flex mb-2 align-items-center" style="height: auto;">
                                        <div class="bg-light circle  me-2 flex-center" style="width:40px;height:auto;">
                                            <i class="fas fa-eye text-dark" style="font-size: 20px;"></i>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center"
                                            style="width: 85%;">
                                            <div class="pt-3" style="user-select:none; width: 100%;">
                                                <h5><b style="font-weight:500;">Visible</b></h5>
                                                <div style=" white-space: normal; font-size: 12px;">
                                                    Bất kỳ ai cũng có thể nhìn thấy nhóm này</div>
                                            </div>
                                        </div>

                                    </div>
                                </li>
                                <li @click="setDisplay('-2')" class="dropdown-item pt-0">
                                    <div class="w-100 d-flex mb-2 align-items-center" style="height: auto;">
                                        <div class="bg-light circle  me-2 flex-center" style="width:40px;height:auto;">
                                            <i class="fas fa-eye-slash text-dark" style="font-size: 20px;"></i>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center"
                                            style="width: 85%;">
                                            <div class="pt-3" style="user-select:none; width: 100%;">
                                                <h5><b style="font-weight:500;">Hidden</b></h5>
                                                <div style=" white-space: normal; font-size: 12px;">
                                                    Chỉ thành viên mới có thể xem nhóm</div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div style="position: relative;" class="dropdown">
                            <div data-bs-toggle="dropdown" aria-expanded="false" class="w-100 invite-friends d-flex"
                                contenteditable="true" @click="getListInvite()">
                            </div>
                            <ul class="dropdown-menu w-100">
                                <div class="w-100 bg-danger">
                                    <input @input="search()" v-model="content" type="text" class="form-control"
                                        placeholder="Enter the name you want to invite">
                                </div>
                                <li @click="addInvite(v)" v-for="(v, k) in list_friend">
                                    <a class="dropdown-item">
                                        <img :src="urlImg + v.avatar" style="width: 30px; height: 30px;" class="circle"
                                            alt="">
                                        {{ v.fullname }}</a>
                                </li>
                                <li v-if="list_friend.length == 0"><a class="dropdown-item">Không tìm thấy bạn bè phù
                                        hơp</a></li>

                            </ul>
                            <span :class="{ 'has-content': hasContent }">Mời bạn bè</span>
                        </div>

                    </div>
                </nav>
                <div class="p-5"></div>
                <div class="p-5"></div>
                <div class="nav-bottom flex-center">
                    <button @click="createGroup()" id="btnCreate" class="btn btn-light w-100 mx-3" disabled>Tạo</button>
                </div>
            </div>
        </div>
    </div>

    <div class="" style="height: 100vh; width: 80vw; position: absolute; right: 0px;">
        <div class="iq-top-navbar delete-bg mt-3" style="position: absolute;width: 20%;">
            <div class="iq-navbar-custom">
                <nav class="navbar navbar-expand-lg navbar-light p-0">
                    <div class="collapse navbar-collapse mt-4" id="navbarSupportedContent"
                        style="position: absolute; right: 0;">
                        <ul class="navbar-nav ms-auto navbar-list">
                            <li class="nav-item dropdown"><a href="#" class="d-flex align-items-center dropdown-toggle"
                                    id="drop-down-arrow" data-bs-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false"><img :src="urlImg + myData.avatar"
                                        class="img-fluid rounded-circle me-3" alt="user">

                                </a>
                                <div class="sub-drop dropdown-menu caption-menu" aria-labelledby="drop-down-arrow">
                                    <div class="card shadow-none m-0">
                                        <div class="card-header bg-primary">
                                            <div class="header-title">
                                                <h5 class="mb-0 text-white">Xin chào {{ myData.fullname }}</h5>
                                            </div>
                                        </div>
                                        <div class="card-body p-0">
                                            <router-link to="/" @click="myProfile()" class="iq-sub-card iq-bg-primary-hover">
                                                <div class="d-flex align-items-center">
                                                    <div class="rounded card-icon bg-soft-primary"><i
                                                            class="ri-file-user-line"></i></div>
                                                    <div class="ms-3">
                                                        <h6 class="mb-0">Trang cá nhân</h6>
                                                        <p class="mb-0 font-size-12">Xem chi tiết hồ sơ cá nhân.
                                                        </p>
                                                    </div>
                                                </div>
                                            </router-link>
                                            <router-link :to="{ name: 'editProfile' }"
                                                class="iq-sub-card iq-bg-warning-hover">
                                                <div class="d-flex align-items-center">
                                                    <div class="rounded card-icon bg-soft-warning"><i
                                                            class="ri-profile-line"></i></div>
                                                    <div class="ms-3">
                                                        <h6 class="mb-0">Chỉnh sửa trang cá nhân</h6>
                                                        <p class="mb-0 font-size-12">Sửa đổi thông tin cá nhân của bạn.
                                                        </p>
                                                    </div>
                                                </div>
                                            </router-link>
                                            <div class="d-inline-block w-100 text-center p-3">
                                                <a class="btn btn-primary iq-sign-btn" @click="signOut()" role="button">
                                                    Đăng xuất
                                                    <i class="ri-login-box-line ms-2"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
        <div class="w-100 h-100 flex-center">
            <div class="preview p-2">
                <div class="top w-100 py-1 pb-2  flex-between">
                    <p class="p-0 m-0 text-dark" style="font-weight: 500;">Preview in PC</p>
                    <div class="d-flex">
                        <i @click="setSizePreview('desktop')" class="fas fa-desktop me-2 text-primary"
                            style="font-size: 18px; cursor: pointer;"></i>
                        <i @click="setSizePreview('mobile-alt')" class="fas fa-mobile-alt"
                            style="font-size: 18px; cursor: pointer;"></i>
                    </div>
                </div>
                <div class="w-100 border-preview d-flex flex-column" style="">
                    <div class="w-100" style="background-color: #fff;">
                        <div class=" w-100 bg-primary" style="overflow: hidden; border-radius: 10px;">
                            <img :src="urlImg + 'cover/cover_image.png'" class="w-100 image-cover"
                                style="filter: grayscale(100%);">
                        </div>
                        <div class="w-100 px-2 pt-3 pb-2 c">
                            <h3 v-if="!group_name"><b style="color: #9c9c9c;">Tên nhóm</b></h3>
                            <h3 v-else><b style="color: #000000;">{{ group_name }}</b></h3>
                            <p>

                                <span v-if="privacy == 1"><i class="fas fa-globe-asia me-2"></i>Public group</span>
                                <span v-else-if="privacy == -1"> <i class="fas fa-lock me-2"></i>Private group</span>
                                <span v-else>Group privacy</span>
                                <span style="color: black; font-weight: 500;">
                                    - 1 thành viên
                                </span>
                            </p>
                            <hr>
                            <p style="display: flex; gap: 20px; margin-left: 20px; margin-bottom: 10px">
                                <span style="color: black; font-weight: 500; cursor: not-allowed;">Giới thiệu</span>
                                <span style="color: black; font-weight: 500; cursor: not-allowed;">Post</span>
                                <span style="color: black; font-weight: 500; cursor: not-allowed;">Thành viên</span>
                                <span style="color: black; font-weight: 500; cursor: not-allowed;">Event</span>
                            </p>

                        </div>
                    </div>
                    <div class="w-100 px-2 mx-0 pt-2 parent"
                        style="flex: 1; background-color: #9c9c9c1e; position: relative;   ">
                        <div class="left" style="opacity: 0.6; ">
                            <div class="card" style="border-radius: 10px; ">
                                <div class="card-body" style=" border-radius: 10px; box-shadow: 0px 0px 5px #33333345;">
                                    <div class="w-100 d-flex align-items-center mb-3"
                                        style="gap:10px;pointer-events: none;">
                                        <i class="far fa-user-circle " style="font-size: 30px;"></i>
                                        <input type="text" class="form-control" placeholder="what are you thinking?"
                                            style="border-radius: 50px; user-select: none;">
                                    </div>
                                    <ul class="post-opt-block flex-around list-inline m-0 p-0 ">
                                        <li class="mb-md-0"><a style="cursor: not-allowed;" class="">
                                                <img src="/src/assets/client/images/small/07.png" alt="icon"
                                                    class="img-fluid"> Photo/Video </a>
                                        </li>
                                        <li class="mb-md-0"><a style="cursor: not-allowed;" class="">
                                                <img src="/src/assets/client/images/small/08.png" alt="icon"
                                                    class="img-fluid"> Tag Friend </a>
                                        </li>
                                        <li class=""><a style="cursor: not-allowed;" class="">
                                                <img src="/src/assets/client/images/small/09.png" alt="icon"
                                                    class="img-fluid"> Feeling/Activity </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="right">
                            <div v-if="privacy == 0" class="card" style="border-radius: 10px; opacity: 0.6;">
                                <div class="card-body" style="border-radius: 10px; box-shadow: 0px 0px 5px #33333324;">
                                    <span style="font-weight: 600;">Giới thiệu</span>

                                </div>
                            </div>
                            <div v-else class="card" style="border-radius: 10px;">
                                <div class="card-body b"
                                    style="border-radius: 10px; box-shadow: 0px 0px 5px #33333324;">
                                    <span style="font-weight: 600;">Giới thiệu</span>
                                    <div v-if="privacy == 1"
                                        class="w-100 d-flex mb-2 privacy-hover ps-2 align-items-center"
                                        style="height: auto; line-height: 18px;">
                                        <div class="d-flex me-2 justify-content-center align-items-center"
                                            style="width:30px;height:30px;">
                                            <i class="fas fa-globe-asia text-dark" style="font-size: 20px;"></i>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center"
                                            style="width:calc(100% - 60px);">
                                            <div class="d-flex flex-column pt-3 a" style="user-select:none;">
                                                <h5><b style="font-weight:500;">Public</b></h5>
                                                <p>Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và nội dung họ
                                                    đăng</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="privacy == -1"
                                        class="w-100 d-flex mb-2 privacy-hover ps-2 align-items-center"
                                        style="height: auto; line-height: 18px;">
                                        <div class="d-flex me-2 justify-content-center align-items-center"
                                            style="width:30px;height:30px;">
                                            <i class="fas fa-lock text-dark" style="font-size: 20px;"></i>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center"
                                            style="width:calc(100% - 60px);">
                                            <div class="d-flex flex-column pt-3 a" style="user-select:none;">
                                                <h5><b style="font-weight:500;">Private</b></h5>
                                                <p>Chỉ thành viên mới có thể xem tất cả mọi người trong nhóm và nội dung
                                                    họ đăng</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="display == 2"
                                        class="w-100 d-flex mb-2 privacy-hover ps-2 align-items-center"
                                        style="height: auto;">
                                        <div class="d-flex me-2 justify-content-center align-items-center"
                                            style="width:30px;height:30px;">
                                            <i class="fas fa-eye text-dark" style="font-size: 20px;"></i>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center"
                                            style="width:calc(100% - 60px);">
                                            <div class="d-flex flex-column pt-3 a" style="user-select:none;">
                                                <h5><b style="font-weight:500;">Visible</b></h5>
                                                <p>Bất kỳ ai cũng có thể nhìn thấy nhóm này</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="display == -2"
                                        class="w-100 d-flex mb-2 privacy-hover ps-2 align-items-center"
                                        style="height: auto;  line-height: 18px;">
                                        <div class="d-flex me-2 justify-content-center align-items-center"
                                            style="width:30px;height:30px;">
                                            <i class="fas fa-eye-slash text-dark" style="font-size: 20px;"></i>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center"
                                            style="width:calc(100% - 60px);">
                                            <div class="d-flex flex-column pt-3 a" style="user-select:none;">
                                                <h5><b style="font-weight:500;">Hidden</b></h5>
                                                <p>Chỉ thành viên nhóm mới có thể xem nhóm này</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios, { url } from '../../../../core/coreRequest';
export default {
    name: 'app',
    data() {
        return {
            myData: {},
            urlImg: url,
            isRotated: false,
            isRotated2: false,
            privacy: 0,
            display: 2,
            group_name: '',
            hasContent: false,
            content: '',
            list_friend: [],
            id_invites: [],
        }
    },
    created() {
        this.getInfo();
    },
    methods: {
        createGroup() {
            var payload = {
                name_group: this.group_name,
                privacy: this.privacy,
                display: this.display,
                id_invites: this.id_invites
            }
            axios
                .post('groups/create', payload)
                .then((res) => {
                    this.$router.push({ name: 'home-group', params: { 'id_group': res.data.id_group } });
                })
                .catch((res) => {
                    $.each(res.response.data.errors, function (k, v) {
                        toastr.error(v[0], 'error');
                    });
                });
        },
        addInvite(a) {
            const divElement = document.querySelector('.invite-friends');

            const newDivElement = document.createElement('div');
            newDivElement.classList.add('custom-div');
            newDivElement.id = 'custom-div-' + a.id;
            const spanElement = document.createElement('span');
            spanElement.textContent = a.fullname;
            spanElement.classList.add('custom-span');

            const imgElement = document.createElement('img');
            imgElement.src = this.urlImg + a.avatar;
            imgElement.classList.add('img_invite', 'circle');

            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-times', 'setFont');

            icon.addEventListener('click', () => this.removeInvite(a.id));


            newDivElement.appendChild(imgElement);
            newDivElement.appendChild(spanElement);
            newDivElement.appendChild(icon);

            divElement.appendChild(newDivElement);

            this.id_invites.push(a.id);
            this.search();
        },
        removeInvite(id) {
            const indexToRemove = this.id_invites.indexOf(id);
            if (indexToRemove !== -1) {
                this.id_invites.splice(indexToRemove, 1);
            }
            const divToRemove = document.getElementById("custom-div-" + id);
            if (divToRemove) {
                divToRemove.remove();
            }
        },
        search() {
            this.hasContent = true;
            this.getListInvite();
        },
        getListInvite() {
            this.hasContent = true;
            axios
                .post('groups/data-invite', {
                    value: this.content,
                    id_invites: this.id_invites
                })
                .then((res) => {
                    this.list_friend = res.data.friends;
                });
        },
        getInfo() {
            axios
                .get('profile/data')
                .then((res) => {
                    this.myData = res.data.myInfo;
                });
        },
        toggle(a) {
            if ($('.' + a).hasClass('show')) {
                if (a == 'select-privacy') {
                    this.isRotated = true;

                } else {
                    this.isRotated2 = true;
                }
            } else {
                if (a == 'select-privacy') {
                    this.isRotated = false;

                } else {
                    this.isRotated2 = false;
                }
            }
        },
        setPrivacy(a) {
            this.privacy = a;
            this.isRotated2 = false;
            this.isRotated = false;
            this.input();
            if (a == 1) {
                this.display = 2;
            }
        },
        setDisplay(a) {
            this.display = a;
            this.isRotated2 = false;
            this.isRotated = false;

        },
        input() {
            if (this.group_name != "" && this.privacy != 0) {
                $('#btnCreate').removeClass('btn-light');
                $('#btnCreate').addClass('btn-primary');
                // $('#btnCreate').attr("disabled");
                $('#btnCreate').removeAttr("disabled");
            } else {
                $('#btnCreate').removeClass('btn-primary');
                $('#btnCreate').addClass('btn-light');
                $('#btnCreate').prop("disabled", true);
                // $('#btnCreate').removeAttr("disabled");
            }
        },
        setSizePreview(a) {
            $('.fas.text-primary').removeClass('text-primary');
            $('.fa-' + a).addClass('text-primary')
            if (a == 'desktop') {
                $('.preview').css('width', '60%')
                $('.image-cover').css('min-height', '330px')
                $('.image-cover').css('height', '35vh')
                $('.parent').css('flex-direction', 'row')
                $('.left').css('flex', '7')
            } else {
                $('.preview').css('width', '35%')
                $('.image-cover').css('min-height', '200px')
                $('.image-cover').css('height', '20vh')
                $('.parent').css('flex-direction', 'column')
                $('.left').css('flex', '2')
            }
        },
        myProfile() {
            this.$router.push({
                name: "detailProfile",
                params: { username: this.myInfo.username },
            });
        },
        signOut() {
            axios
                .get('sign-out')
                .then((res) => {
                    this.$store.commit('REMOVE_CURRENT_CHAT');
                    localStorage.removeItem('token');
                    this.$router.push({ name: "sign-in" });
                })
                .catch((error) => {
                    console.error('Logout failed:', error);
                });
        },
    },
}
</script>
<style>
@import './stylee.css';
</style>