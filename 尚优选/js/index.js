// 作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再实现的事件函数
window.onload = function () {

    // 声明一个记录点击的缩略图下标
    var bigimgIndex = 0

    // 路径导航的数据渲染
    navPathDataBind()
    function navPathDataBind() {
        /* 
            1.获取路径导航的页面元素
            2.获取所需要的数据(data.js=>goodData.path)
            3.根据数据数量动态生成DOM元素
            4.遍历数据创建Dom元素的最后一条，只创建a，不创建i
        */
        var navPath = document.querySelector('#navPath')
        var pathData = this.goodData.path

        for (var i = 0; i < pathData.length; i++) {

            // 循环到最后一条，不添加href属性
            if (i === pathData.length - 1) {
                var a_Node = document.createElement('a')
                a_Node.innerText = pathData[i].title
                navPath.appendChild(a_Node)
            } else {
                // 根据数据数量动态创建a标签
                var a_Node = document.createElement('a')

                a_Node.href = pathData[i].url
                a_Node.innerText = pathData[i].title

                // 根据数据数量动态创建i标签
                var i_Node = document.createElement('i')
                i_Node.innerText = "/"

                //页面追加a和i
                navPath.appendChild(a_Node)
                navPath.appendChild(i_Node)
            }
        }
    }


    // 放大镜移入、移出效果
    bigClassBind()
    function bigClassBind() {

        /* 
            1.获取小图框对象，并且设置移入事件(onmouseover(存在事件冒泡效果), onmouseenter)
            2.动态创建蒙版元素以及大图框和大图片元素
            3.移出(onmouseleave)时需要移除蒙版元素和大图框、大图片
            4.获取小图框元素
        */
        var leftTop = document.querySelector('#leftTop')
        var smallPic = document.querySelector('#smallPic')

        // 获取图片数据
        var imagessrc = goodData.imagessrc

        //设置移入事件
        smallPic.addEventListener('mouseenter', function () {

            //创建蒙版元素
            var maskDiv = document.createElement('div')
            maskDiv.className = 'mask'

            // 创建大图框元素
            var BigPic = document.createElement('div')
            BigPic.id = 'bigPic'

            // 创建大图片元素
            var BigImg = document.createElement('img')
            BigImg.src = imagessrc[bigimgIndex].b // 默认为第一张图片的b值(大图的src)

            // 大图框追加大图片
            BigPic.appendChild(BigImg)

            // 小图框追加蒙版元素
            smallPic.appendChild(maskDiv)

            // 让leftTop元素追加大图框
            leftTop.appendChild(BigPic)


            // 设置移动事件
            smallPic.addEventListener("mousemove", function (e) {
                // e.clientX:鼠标距离浏览器左侧x轴的值
                // getBoundingClientRect().left:小图框距离浏览器左侧可视left值
                // offsetWidth:为元素的占位宽度
                var left = e.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2
                var top = e.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2


                // 判断,clientWidth:不包括边框的内部可视大小
                if (left < 0) {
                    left = 0
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth
                }

                if (top < 0) {
                    top = 0
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight
                }

                // 设置left和top属性
                maskDiv.style.left = left + "px"
                maskDiv.style.top = top + "px"


                // 移动的比例关系 = 蒙版元素移动的距离 / 大图片元素移动的距离
                // 蒙版元素移动的距离 = 小图框宽度 - 蒙版元素的宽度
                // 大图片元素移动的距离 = 大图片宽度 - 大图框元素的宽度

                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (BigImg.offsetWidth - BigPic.clientWidth)
                // 大图片与蒙版移动距离相反,取负号
                BigImg.style.left = -left / scale + 'px'
                BigImg.style.top = -top / scale + 'px'
            })


            // 设置移出事件
            smallPic.onmouseleave = function () {

                // 让小图框移除蒙版元素
                smallPic.removeChild(maskDiv)

                // 让leftTop元素移除大图框
                leftTop.removeChild(BigPic)
            }

        })
    }


    // 动态渲染放大镜缩略图的数据
    thumbnailData()
    function thumbnailData() {
        /* 
            1.获取picList元素下的ul
            2.再获取data.js下的imagessrc
            3.遍历数组,根据数组长度创建li元素
            4.ul遍历追加li元素
        */
        var ul = document.querySelector('#picList ul')
        var imagessrc = goodData.imagessrc

        for (var i = 0; i < imagessrc.length; i++) {
            var newLi = document.createElement('li')
            newLi.innerHTML = `<img src="${imagessrc[i].s}" />`
            ul.appendChild(newLi)

        }
    }


    // 点击缩略图的效果
    thumbnailClick()
    function thumbnailClick() {
        /* 
            1.获取所有的li元素,并且循环发生点击事件
            2.点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有src的值
        */

        var liNodes = document.querySelectorAll("#picList ul li")
        var smallpic_img = document.querySelector("#smallPic img") // 获取小图标签
        var imagessrc = goodData.imagessrc // 获取图片路径数据

        // 小图路径需要默认和imagessrc的第一个元素小图的路径是一致的
        smallpic_img.src = imagessrc[0].s

        for (var i = 0; i < liNodes.length; i++) {
            // 自定义下标
            liNodes[i].index = i
            liNodes[i].addEventListener("click", function () {
                var idx = this.index
                bigimgIndex = idx

                // 变换小图路径
                smallpic_img.src = imagessrc[idx].s
            })
        }

    }


    // 点击缩略图左右箭头轮播效果
    thumbnailLeftRightClick()
    function thumbnailLeftRightClick() {
        /* 
            1.获取左右箭头按钮
            2.再获取可视div和ul元素和所有的元素 
            3.计算(发生起点,步长,总体运动的距离值)
            4.发生点击事件
        */
        var preve = document.querySelector("#leftBottom .preve")
        var next = document.querySelector("#leftBottom .next")
        var ul = document.querySelector("#picList ul")
        var liNodes = document.querySelectorAll("#picList ul li")

        // 计算
        var start = 0
        // 步长
        var step = (liNodes[0].offsetWidth + 20) * 2
        // 总体运动的距离值 = ul宽度 - div框的宽度 = (图片总数-div中显示的数量) * (li的宽度 + 20)
        var endPosition = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20)

        // 发生事件
        preve.addEventListener("click", function () {
            start -= step
            if (start < 0) {
                start = 0
            }
            ul.style.left = -start + "px"
        })
        next.addEventListener("click", function () {
            start += step
            if (start > endPosition) {
                start = endPosition
            }
            ul.style.left = -start + "px"
        })

    }


    // 商品详情数据的动态渲染
    rightTopData()
    function rightTopData() {
        /* 
            1.查找rightTop元素
            2.查找data.js->goodData->goodsDetail
            3.建立字符串变量，将原来的布局结构贴进来，将所对应的数据放在对应的位置上重新渲染righTop元素
        */
        var rightTop = document.querySelector("#right .rightTop")
        var goodsDetail = goodData.goodsDetail // 获取数据

        var s = `<h3>${goodsDetail.title}</h3>
                <p>${goodsDetail.recommend}</p>
                <div class="priceWrap">
                    <!-- 价格 -->
                    <div class="priceTop">
                        <span>价格</span>
                        <div class="price">
                            <span>￥</span>
                            <p>${goodsDetail.price}</p>
                            <i>降价通知</i>
                        </div>
                        <p>
                            <span>累计评价</span>
                            <span>${goodsDetail.evaluateNum}</span>
                        </p>
                    </div>
                    <!-- 促销 -->
                    <div class="priceBottom">
                        <span>促销</span>
                        <p>
                            <span>${goodsDetail.promoteSales.type}</span>
                            <span>${goodsDetail.promoteSales.content}</span>
                        </p>
                    </div>

                </div>
                <!-- 支持 -->
                <div class="support">
                    <span>支持</span>
                    <p>${goodsDetail.support}</p>
                </div>
                <!-- 配送地址 -->
                <div class="address">
                    <span>配送至</span>
                    <p>${goodsDetail.address}</p>
                </div>
                 `
        // 重新渲染rightTop元素
        rightTop.innerHTML = s
    }


    // 商品参数数据的动态渲染
    rightBottomData()
    function rightBottomData() {
        /* 
            1.找rightBottom元素对象
            2.查找data.js->goodData.goodsDetail.crumbData数据
            3.由于数据是一个数组，需要遍历，有一个元素则需要有一个动态的dl元素对象
        */
        var chooseWrap = document.querySelector('#right .rightBottom .chooseWrap')
        var crumbData = goodData.goodsDetail.crumbData

        // 循环数据
        for (var i = 0; i < crumbData.length; i++) {
            var dlNode = document.createElement('dl')
            var dtNode = document.createElement('dt')
            dtNode.innerText = crumbData[i].title

            dlNode.appendChild(dtNode)

            // 遍历crumbData->data
            for (var j = 0; j < crumbData[i].data.length; j++) {
                var ddNode = document.createElement('dd')
                ddNode.innerText = crumbData[i].data[j].type
                ddNode.setAttribute("price", crumbData[i].data[j].changePrice)

                dlNode.appendChild(ddNode)
            }

            chooseWrap.appendChild(dlNode)


        }

    }


    // 点击商品参数之后的颜色排他效果
    clickddBind()
    function clickddBind() {
        /* 每一行dd文字颜色排他
            1.获取所有的dl元素，取其中第一个dl元素下的所有dd做测试
            2.循环所有的dd元素，并且添加点击事件
            3.确定实际发生事件的目标源对象设置其文字颜色为红色，然后给其他所有的元素颜色都重置为基础颜色（#666）
            ===========================================================

          点击dd之后产生的mark标记
            1.创建可以容纳点击的dd元素值的容器(数组)，确定数组的其实长度,再添加一些默认值
            2.然后再将点击的dd元素的值按照对应下标来写入到数组的元素身上

        */
        var dlNodes = document.querySelectorAll("#right .rightBottom .chooseWrap dl")

        var arr = new Array(dlNodes.length)

        var chooseResult = document.querySelector('#right .rightBottom .chooseResult')

        arr.fill(0) // 填充0


        for (var i = 0; i < dlNodes.length; i++) {
            // 添加闭包函数避免遍历后面的数据覆盖前面的操作
            (function (i) {
                var ddNodes = dlNodes[i].querySelectorAll('dd')

                // 循环对应dl里面的每一个dd元素
                for (var k = 0; k < ddNodes.length; k++) {
                    ddNodes[k].onclick = function () {

                        // 点击相同部分以后，清空上一次选择防止存在重复选择
                        chooseResult.innerHTML = ""

                        for (var j = 0; j < ddNodes.length; j++) {
                            ddNodes[j].style.color = "#666"
                        }

                        // 相同下标的dd元素的字体颜色，进行覆盖操作，其他未点击的元素都是在进行重设颜色
                        this.style.color = "red"

                        // 点击对应元素动态产生新的mark标记元素
                        arr[i] = this // 表示整个dd元素
                        changePriceBind(arr)

                        // 遍历arr数组，将非0元素的值写入到mark标记
                        arr.forEach((value, index) => {
                            if (value) {
                                var markDiv = document.createElement('div')
                                markDiv.className = 'mark'
                                markDiv.innerText = value.innerText

                                var iNode = document.createElement('i')
                                iNode.innerText = "X"

                                // 添加属性设置为下标 
                                iNode.setAttribute("index", index)

                                markDiv.appendChild(iNode)
                                chooseResult.appendChild(markDiv)
                            }
                        })

                        // 获取所有的i标签元素，并且循环发生点击事件
                        var iNodes = document.querySelectorAll("#right .rightBottom .chooseResult .mark i")

                        // 执行删除功能
                        for (var n = 0; n < iNodes.length; n++) {
                            iNodes[n].onclick = function () {
                                // 获取点击i标签身上的index属性
                                var idx = this.getAttribute('index')

                                // 恢复数组中对应下标元素的值
                                arr[idx] = 0

                                // 查找对应下标的那个dl行中所有的dd元素
                                var ddList = dlNodes[idx].querySelectorAll("dd")

                                // 遍历所有的dd元素
                                for (var m = 0; m < ddList.length; m++) {
                                    // 其余所有dd元素文字颜色为灰色
                                    ddList[m].style.color = "#666"
                                }

                                // 默认第一个dd文字颜色恢复为红色
                                ddList[0].style.color = "red"

                                // 删除对应下标位置的mark标记
                                chooseResult.removeChild(this.parentNode)

                                changePriceBind(arr)

                            }
                        }
                    }
                }
            })(i)


        }
    }


    // 价格变动的函数声明
    /* 
        该函数需要在点击dd的时候以及删除mark标记的时候才需要调用
    */
    function changePriceBind(arr) {
        /* 
            1.获取价格的标签元素
            2.给每一个dd标签身上默认设置一个自定义的属性，用来记录变化的价格
            3.遍历arr数组，将dd元素身上的新变化的价格和已有的价格(5299)相加
            4.最后将计算之后的结果重新渲染到p标签当中
        */
        var oldPrice = document.querySelector("#wrapper #content .contentMain #center #right .rightTop .priceWrap .priceTop .price p")

        // 去取出默认价格
        var price = goodData.goodsDetail.price

        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) { // 数组中不为0的位置执行+操作
                // 数据类型的强制转换
                var changeprice = Number(arr[i].getAttribute("price"))
                price += changeprice
            }
        }
        oldPrice.innerText = price

        // 将变化后的价格写入到中间部分中间区域左侧标签中
        var leftPrice = document.querySelector("#content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p")
        leftPrice.innerText = "￥" + price

        // 遍历选择搭配中所有的复选框元素，看是否有选中的
        var ipts = document.querySelectorAll("#content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input")
        var newPrice = document.querySelector("#content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i")
        for (var j = 0; j < ipts.length; j++) {
            if (ipts[j].checked) {
                price += Number(ipts[j].value)
            }
        }

        // 中间部分中间区域右侧套餐价格重新渲染
        newPrice.innerText = "￥" + price

    }


    // 选择搭配中间区域复选框选中套餐价变动效果
    chooseChange()
    function chooseChange() {
        /* 
            1.先获取中间区域中所有的复选框元素
            2.遍历这些元素取出他们的价格，和左侧基础价格进行累加，累加之后重新写回套餐价里面
        */
        var ipts = document.querySelectorAll("#content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input")
        var leftPrice = document.querySelector("#content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p")
        var newPrice = document.querySelector("#content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i")

        for (var i = 0; i < ipts.length; i++) {
            ipts[i].onclick = function () {              
                var oldPrice = Number(leftPrice.innerText.slice(1))
                for (var j = 0; j < ipts.length; j++) {
                    if (ipts[j].checked) {
                        oldPrice = oldPrice + Number(ipts[j].value)
                    }
                }

                newPrice.innerText = "￥" + oldPrice
            }
        }
    }


    // 封装一个公共的选项卡函数---->实现点击切换和显示切换
    /* 
        1.被点击的元素 tabBtns
        2.被切换显示的元素 tabApper
    */
    function Tab(tabBtns, TabContents){
        for(var i = 0;i<tabBtns.length;i++){
            tabBtns[i].index = i // 将遍历到的下标存放在index里面
            tabBtns[i].onclick = function(){
                for(var j = 0;j<tabBtns.length;j++){
                    tabBtns[j].className = ''
                    TabContents[j].className = ''
                }
                this.className = 'active'
                TabContents[this.index].className = 'active'
            }
        }
    }


    // 点击左侧选项卡
    leftTab()
    function leftTab(){
        // 被点击的元素
        var h4s = document.querySelectorAll('#content .contentMain .goodsDetailWrap .leftAside .asideTop h4')
        // 被切换显示的元素
        var divs = document.querySelectorAll('#content .contentMain .goodsDetailWrap .leftAside .asideContent>div')

        // 调用函数
        Tab(h4s, divs)
    }

    // 点击右侧选项卡
    rightTab()
    function rightTab(){
        // 被点击的元素
        var lis = document.querySelectorAll('#content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .TabBtns li')
        // 被切换显示的元素 
        var divs = document.querySelectorAll('#content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .TabContents div')

        Tab(lis, divs)
    }

    // 右边侧边栏的点击效果
    rightAsideBind()
    function rightAsideBind(){
        /* 
            1.先找到按钮元素，发生点击事件
            2.记录初始状态，在点击事件的内部进行判断,如果为关闭则展开，否则为关闭(状态取反)
            3.如果为展开则设置按钮和侧边栏对应的class效果，关闭亦如此
        */

        // 找按钮元素
        var btns = document.querySelector('#wrapper .rightAside .btns')
        // 查找侧边栏
        var rightAside = document.querySelector("#wrapper .rightAside")

        // 记录初始状态
        var flag = true // 默认关闭状态

        // 点击事件
        btns.addEventListener('click', function(){
            if(flag){
                // 展开
                btns.className = "btns btnsOpen"
                rightAside.className = 'rightAside asideOpen'
            } else {
                // 关闭
                btns.className = "btns btnsClose"
                rightAside.className = 'rightAside asideClose'
            }

            flag = !flag
        })
    }
}
