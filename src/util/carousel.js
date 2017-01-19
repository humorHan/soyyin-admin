/**
 * Created by humorHan on 17/1/11.
 */
function Carousel(dom, len, changeTime) {
    this.dom = dom;
    this.len = len;
    this.changeTime = changeTime;
    this.index = 0; //显示图片的索引
    this.timer = null; //定时器
    this.initTimer();
    this.initBtns();
}
Carousel.prototype = {
    initTimer: function () {
        let tThis = this;
        tThis.timer = setInterval(function () {
            tThis.next();
        }, this.changeTime);
    },
    next(){
        //console.log(this.index);
        this.index = (this.index + 1) % this.len;
        $(this.dom).find(".price-img-item").fadeOut().eq(this.index).fadeIn();
    },
    pre(){
        this.index = this.index == 0 ? this.len - 1 : this.index - 1;
        $(this.dom).find(".price-img-item").fadeOut().eq(this.index).fadeIn();
    },
    initBtns(){
        let tThis = this;
       /* $(tThis.dom).on("mouseover", function () {
            clearInterval(tThis.timer);
        }).on("mouseout", function(){
            tThis.initTimer();
        });*/
        $(tThis.dom).find(".next").off().on("click", function () {
            tThis.next();
        });
        $(tThis.dom).find(".pre").off().on("click", function () {
            tThis.pre();
        });
    }
};

/**
 * 轮播图
 * @param dom          轮播图节点
 * @param len          求索引 % len
 * @param changeTime   计时器时间
 * */
export default function (dom, len, changeTime) {
    return new Carousel(dom, len, changeTime);
};