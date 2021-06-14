'use strict';

let maxWidth = window.innerWidth
const Main = function () {
    // perfect scrollbar handler
    let $body = document.querySelector('body')
    function perferctSb() {
        const psbar = document.querySelectorAll('.ps-menu')
        psbar.forEach(ps => {
            let myps = new PerfectScrollbar(ps, {
                wheelSpeed: 2,
                wheelPropagation: false,
                suppressScrollX: true,
            });

            myps.update()

        })
    }

    function shake() {
        let count = 0
        const int = setInterval(function(){
            document.querySelector('.notification .badge').classList.toggle('shake')
            count++
            if (count >= 10) {
                clearInterval(int)
            }
        }, 4000)
        
    }

    // settings handler
    function themeHandler() {
        document.querySelector('.settings-icon').addEventListener('click', function (e) {
            this.parentElement.parentElement.classList.toggle('show')
        })

        window.innerWidth < 900 && $body.classList.add('collapse-sidebar')

        // fix handler
        const header = document.querySelector('.header-navbar')
        const footer = document.querySelector('footer')
        const settingFixed = document.querySelectorAll('.toggle-settings')

        const currTheme = JSON.parse(localStorage.getItem('themeSettings'))
        !currTheme?.fixSidebar && resetHeightNav()
        settingFixed.forEach(function (setting) {
            // initial check settings
            setting.checked = currTheme?.[`fix${setting.name}`]
            if (setting.name === 'Header') {
                currTheme?.[`fix${setting.name}`] ? header.classList.add('fixed') : header.classList.remove('fixed')
            } else if(setting.name === 'Footer'){
                currTheme?.[`fix${setting.name}`] ? footer.classList.add('sticky') : footer.classList.remove('sticky')
            } else {
                if (currTheme?.[`fix${setting.name}`]) {
                    $body.classList.add('collapse-sidebar')
                } else {
                    window.innerWidth > 900 && $body.classList.remove('collapse-sidebar')
                }
            }

            //handle settings change
            setting.addEventListener('change', function (e) {
                const currTheme = JSON.parse(localStorage.getItem('themeSettings'))
                const target = e.target.name

                if (target === 'Header') {
                    this.checked ? header.classList.add('fixed') : header.classList.remove('fixed')
                } else if(target === 'Footer') {
                    this.checked ? footer.classList.add('sticky') : footer.classList.remove('sticky')
                } else {
                    if (this.checked) {
                        $body.classList.add('collapse-sidebar')
                        resetHeightNav('min')
                    }
                    else {
                        $body.classList.remove('collapse-sidebar')
                        resetHeightNav()
                    }
                }

                localStorage.setItem('themeSettings', JSON.stringify({
                    ...currTheme,
                    [`fix${target}`]: !currTheme?.[`fix${target}`]
                }))
            })
        })

        //theme handler
        const themeColor = document.getElementById('theme-color')

        const switchTheme = document.querySelector('.theme-switch-icon')
        switchTheme.addEventListener('click', function () {
            const currTheme = JSON.parse(localStorage.getItem('themeSettings'))
            if (currTheme?.themeColor == 'light') {
                document.getElementById('dark').checked = true
                // themeColor.href = '../assets/css/dark.css'
                localStorage.setItem('themeSettings', JSON.stringify({
                    ...currTheme,
                    themeColor: 'dark'
                }))
                $body.classList.add('dark')
            } else {
                document.getElementById('light').checked = true
                // themeColor.href = ''
                localStorage.setItem('themeSettings', JSON.stringify({
                    ...currTheme,
                    themeColor: 'light'
                }))
                $body.classList.remove('dark')
            }
        })
        
        document.querySelectorAll('.theme-color').forEach(function (e) {
            //inital theme settings
            const currTheme = JSON.parse(localStorage.getItem('themeSettings'))
            if (currTheme?.themeColor == e.value) {
                e.checked = true
            }
            if(currTheme?.themeColor == 'dark') {
                $body.classList.add('dark')
                // themeColor.href = '../assets/css/dark.css'
            }else {
                $body.classList.remove('dark')
                // themeColor.href=''
            }
            
            //theme changed handle
            e.addEventListener('change', function (theme) {
                const currTheme = JSON.parse(localStorage.getItem('themeSettings'))
                const target = theme.target.value
                $body.classList.toggle('dark')
                if (target === 'dark') {
                    // themeColor.href = '../assets/css/dark.css'
                } else {
                    // themeColor.href=''
                }
                localStorage.setItem('themeSettings', JSON.stringify({
                    ...currTheme,
                    themeColor: target
                }))
            })
        })



    }

    //resize screen handler
    window.innerWidth < 900 ? document.body.classList.add('collapse-sidebar') :
        document.body.classList.remove('collapse-sidebar')

    function resizeHandler() {
        window.onresize = function () {
            window.innerWidth < 900 ? document.body.classList.add('collapse-sidebar') :
                document.body.classList.remove('collapse-sidebar')
        }
    }

    const resetHeightNav = function (type = 'max') {
            const allSub = document.querySelectorAll('nav .sub-menu.expand')
            allSub.forEach(s => {
                s.style.maxHeight = type == 'max' ? s.scrollHeight + "px" : 0
            })
        }

    function navbarHandler() {
        // ===================== NAVBAR CLICK HANDLER =====================
        const main_menu = document.querySelectorAll('.main-menu')
        main_menu.forEach(function (menu) {
            menu.addEventListener('click', function (e) {
                e.preventDefault()
                // e.stopPropagation()
                // main menu active

                const activeMain = menu.parentElement.classList.contains('open')

                main_menu.forEach(function (menu) {
                    if (!activeMain)
                        menu.parentElement.classList.remove('open')
                })

                // remove other active & open class
                const openUl = document.querySelectorAll('ul li.open')
                openUl.forEach(el => {
                    const active = el.classList.contains('active')
                    if (!active && !activeMain)
                        el.classList.remove('open', 'active')
                })
                // toggle class open
                this.parentElement.classList.toggle("open")

                // hide show others sub menu
                const allSub = document.querySelectorAll('nav .sub-menu')
                allSub.forEach(function (e) {
                    if (!activeMain) {
                        e.style.maxHeight = null
                        e.classList.remove('expand')
                    }

                })

                // show sub menu
                if (this.nextElementSibling.style.maxHeight) {
                    this.nextElementSibling.style.maxHeight = null;
                    this.nextElementSibling.classList.remove('expand')
                } else {
                    this.nextElementSibling.style.maxHeight = this.nextElementSibling.scrollHeight +
                        "px";
                    this.nextElementSibling.classList.add('expand')
                }


                const subMenu = this.nextElementSibling.children

                // ajax page navigation handler || sub menu link active
                for (let index = 0; index < subMenu.length; index++) {
                    const element = subMenu[index];

                    element.addEventListener('click', function (e) {
                        // e.preventDefault()
                        // remove other active & open class
                        const parent = this.parentElement.parentElement.parentElement.children
                        for (let index = 0; index < parent.length; index++) {
                            const element = parent[index];
                            element.classList.remove('active', 'open')
                            const subEl = element.children
                        }

                        // remove active class
                        const liActive = document.querySelectorAll('nav ul ul li.active')
                        liActive.forEach(element => {
                            element.classList.remove('active')
                        });

                        // remove active class
                        const child = this.parentElement.children
                        for (let index = 0; index < child.length; index++) {
                            const element = child[index];
                            element.classList.remove('active')
                        }
                        this.classList.add('active')
                        this.parentElement.parentElement.classList.add('active', 'open')

                    })

                }

            })
        })


        // =================== COLLAPSE NAVBAR EVENT HANDLER ====================

        // toggle submenu when hover on collapse
        const mainSidebar = document.querySelector('.main-sidebar')

        mainSidebar.addEventListener('mouseenter', function (e) {
            if (document.querySelector('body').classList.contains('collapse-sidebar') &&
                document.querySelector('li.open')) {

                resetHeightNav()
            }

        })
        mainSidebar.addEventListener('mouseleave', function (e) {
            if (document.querySelector('body').classList.contains('collapse-sidebar')) {
                document.querySelectorAll('nav .sub-menu').forEach(c => {
                    c.style.maxHeight = 0
                })

            }
        })

        // toggle navbar when click
        document.querySelectorAll('.action-toggle').forEach(elem => {
            elem.addEventListener('click', function (e) {
                e.preventDefault()

                // resetHeightNav('min')
                if (document.querySelector('body').classList.contains('collapse-sidebar')) {
                    resetHeightNav()
                }
                document.querySelector('body').classList.toggle('collapse-sidebar')
            })
        })
    }

    return {
        init: function () {
            perferctSb()
            themeHandler()
            resizeHandler()
            navbarHandler()
            shake()
        }
    }
}()



const userDropDown = document.querySelector('.user-dropdown')
userDropDown.addEventListener('click', function (e) {
    // console.log(12)
})
// const singleLink = document.querySelector('.link')
// const main_menu = document.querySelectorAll('.main-menu')
// singleLink.addEventListener('click', function (e) {
//     console.log(e);
//     this.classList.add('active')
//     main_menu.forEach(function (menu) {
//         console.log(menu.parentElement);
//         menu.parentElement.classList.remove('open', 'active')
//         const activeMain = menu.parentElement.classList.contains('open')
//         const allSub = document.querySelectorAll('nav .sub-menu')
//         allSub.forEach(function (e) {
//             if (!activeMain) {
//                 e.style.maxHeight = null
//             }
//         })
//     })

//     const liActive = document.querySelectorAll('nav ul ul li.active')
//     liActive.forEach(element => {
//         element.classList.remove('active')
//     });
// })