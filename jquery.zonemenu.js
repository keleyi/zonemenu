(function ($) {

    var getOffset = {
        top: function (obj) {
            return obj.offsetTop + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
        },
        left: function (obj) {
            return obj.offsetLeft + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
        }
    };

    $.fn.zonemenu = function (options) {

        var MyZoneMenu = $(this);
        var ZoneMenuBody = MyZoneMenu.find(">div");

        var oMenu = ZoneMenuBody[0];
        var aUl = $(oMenu).find("ul");
        var aLi = $(oMenu).find('li');
        var showTimer = hideTimer = null;
        var i = 0;
        var maxWidth = maxHeight = 0;
        var aDoc = [$(document).width(), $(document).height()];

        var ZoneMenuTitle = MyZoneMenu.find(".zonemenutitle");
        ZoneMenuTitle.wrap('<span class="keleyizoneframe"></span>');
        var KeleyiZoneFrame = MyZoneMenu.find(".keleyizoneframe");
        KeleyiZoneFrame.prepend('<span class="keleyistatus">┻</span>');

        ZoneMenuBody.css({ "top": MyZoneMenu.offset().top + MyZoneMenu.height() });


        for (i = 0; i < aLi.length; i++) {
            //为含有子菜单的li加上箭头
            aLi[i].getElementsByTagName("ul")[0] && (aLi[i].className = "sub");

            //鼠标移入
            aLi[i].onmouseover = function () {
                var oThis = this;
                //var oUl = oThis.getElementsByTagName("ul");
                var oUl = $(oThis).find("ul");

                //鼠标移入样式
                oThis.className += " active";

                //显示子菜单
                if (oUl[0]) {
                    clearTimeout(hideTimer);
                    showTimer = setTimeout(function () {
                        for (i = 0; i < oThis.parentNode.children.length; i++) {
                            oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
						(oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                        }
                        oUl[0].style.display = "block";
                        oUl[0].style.top = oThis.offsetTop + "px";
                        oUl[0].style.left = oThis.offsetLeft + oThis.offsetWidth + "px";
                        setWidth(oUl[0]);

                        //最大显示范围
                        maxWidth = aDoc[0] - oUl[0].offsetWidth;
                        maxHeight = aDoc[1] - oUl[0].offsetHeight;

                        //防止溢出
                        maxWidth < getOffset.left(oUl[0]) && (oUl[0].style.left = -oUl[0].clientWidth + "px");
                        maxHeight < getOffset.top(oUl[0]) && (oUl[0].style.top = -oUl[0].clientHeight + oThis.offsetTop + oThis.clientHeight + "px")
                    }, 300);
                }
            };

            //鼠标移出	
            aLi[i].onmouseout = function () {
                var oThis = this;
                var oUl = oThis.getElementsByTagName("ul");
                //鼠标移出样式
                oThis.className = oThis.className.replace(/\s?active/, "");

                clearTimeout(showTimer);
                hideTimer = setTimeout(function () {
                    for (i = 0; i < oThis.parentNode.children.length; i++) {
                        oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
					(oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                    }
                }, 300);
            };
        }        

        var KeleyiStatus = MyZoneMenu.find("span.keleyistatus");
        MyZoneMenu.mouseover(function () {
            if (ZoneMenuBody.css('display') == 'none') {
                ZoneMenuBody.slideDown(300);
            }
            if (KeleyiStatus.text() != "┳")
                KeleyiStatus.text("┳");
        })

        MyZoneMenu.mousemove(
        function () {
            if (ZoneMenuBody.css('display') == 'none') ZoneMenuBody.slideDown(300);
        }
        )

        MyZoneMenu.mouseleave(function () {
            ZoneMenuBody.slideUp(300);
            if (KeleyiStatus.text() != "┻")
                KeleyiStatus.text("┻");
        });

        //取li中最大的宽度, 并赋给同级所有li	
        function setWidth(obj) {
            maxWidth = 0;
            for (i = 0; i < obj.children.length; i++) {
                var oLi = obj.children[i];
                var iWidth = oLi.clientWidth - parseInt(oLi.currentStyle ? oLi.currentStyle["paddingLeft"] : getComputedStyle(oLi, null)["paddingLeft"]) * 2
                if (iWidth > maxWidth) maxWidth = iWidth;
            }
            for (i = 0; i < obj.children.length; i++) obj.children[i].style.width = maxWidth + "px";
        }
    }
} (jQuery));