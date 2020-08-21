import $ from "jquery";

export function setMinHeightWrapper() {
    let sectionSidebarHeight = $('aside.main-sidebar > section.sidebar').height();
    let windowHeight = $(window).height();
    let windowWidth = $(window).width();
    let height = 0;

    if (windowWidth < 768) {
        if (windowHeight < sectionSidebarHeight) {
            height = sectionSidebarHeight;
        } else {
            height = windowHeight - 120;
        }
    } else {
        if (windowHeight < sectionSidebarHeight) {
            height = sectionSidebarHeight;
        } else {
            height = windowHeight - 120;
        }
    }

    $('main.content-main').css('min-height', height);
}