        $(function() {
            // 인스턴스 생성
            var rolling1 = new RollingBanner("#banner1", 2000,600, BTRollingEffect);
            var rolling2 = new RollingBanner("#banner2", 2000,600, TBRollingEffect);
            var rolling3 = new RollingBanner("#banner3", 2000,600, RLRollingEffect);
            var rolling4 = new RollingBanner("#banner4", 2000,600, LRRollingEffect);
        });
        
        function RollingBanner(selector, playSpeed, rollingSpeed, effect) {
            // 프로퍼티 생성및 초기화
            this._$banners = null;
            this._currentIndex = 0;

            this._timerID = -1;
            // step #02
            this._bannerHeight=0;

            this._playSpeed = playSpeed;
            this._rollingSpeed = rollingSpeed;

            // 롤링효과 인스턴스를 저장할 변수
            this._effect =effect;
            this._bannerWidth = 0;


            this._init(selector);
            this._initEvent();
        }

        // 초기화및 롤링배너 시작
        RollingBanner.prototype._start = function() {
            this._initBannerPos();
            this.startAutoPlay();
        }

        // 요소 초기화.
        RollingBanner.prototype._init = function(selector) {
            this._$banners = $(selector).children("img");

        }

        // 이벤트 처리
        RollingBanner.prototype._initEvent = function() {
            var objThis = this;
            this._$banners.eq(0).one("load",function(){
                objThis._bannerHeight= $(this).height();

                // 배너 너비 구하기
                objThis._bannerWidth = $(this).width();
                objThis._start();
            })
        }

        // 배너 위치 초기화
        RollingBanner.prototype._initBannerPos = function() {
            // 배너 위치를 화면에서 보이지 않게 숨기기
            // step #02
            this._$banners.css("top", this._bannerHeight);

            // 0번째 배너 활성화
            this._$banners.eq(this._currentIndex).css("top", 0);
        }


        RollingBanner.prototype.startAutoPlay = function() {
            var objThis = this;

            // 타이머가 두번 이상 실행되지 않게 조건 처리
            if (this._timerID == -1) {
                this._timerID = setInterval(function() {
                    objThis.nextBanner();
                }, this._playSpeed);
            }
        }


        // 다음 배너 활성화
        RollingBanner.prototype.nextBanner = function() {

            // 현재 index값 구하기
            var outIndex = this._currentIndex;
            // 다음 배너 index값 구하기
            this._currentIndex++;
            // 마지막 배너까지 롤링한 경우 다시 0번째부터 롤링될 수 있게 인덱스 값을 0으로 설정
            if (this._currentIndex >= this._$banners.length) {
                this._currentIndex = 0;
            }

            // 현재 배너 구하기
            var $outBanner = this._$banners.eq(outIndex);
            // 다음 배너 구하기
            var $inBanner = this._$banners.eq(this._currentIndex);

            console.log('___________', outIndex, this._currentIndex);

            /*
            // 롤링 준비-다음 배너 위치 초기화
            $inBanner.css({
                top:this._bannerHeight,
                opacity:0
            })

            // 현재 배너 사라지게 하기
            $outBanner.stop().animate({
                top:-this._bannerHeight,
                opacity:0
            },this._rollingSpeed);


            // 다음 배너 나타나게 하기
            $inBanner.stop().animate({
                top:0,
                opacity:1
            },this._rollingSpeed);
            */

            if(this._effect){
                // 롤링 효과로 넘길 데이터 만들기
                var info = {
                    "$inBanner":$inBanner,
                    "$outBanner":$outBanner,
                    bannerWidth:this._bannerWidth,
                    bannerHeight:this._bannerHeight,
                    speed:this._rollingSpeed
                }

                // 롤링 효과 호출
                this._effect.effect(info);
            }else{
                console.log("아직 롤링 효과가 연결되지 않았습니다.");
            }
        }

        // 아래에서 위로 롤링되는 효과
        BTRollingEffect = {
            effect:function(info){
                // 다음 배너 위치 초기화
                info.$inBanner.css({
                    top:info.bannerHeight,
                    opacity:0
                })

                // 현재 배너 사라지게 하기
                info.$outBanner.stop().animate({
                    top:-info.bannerHeight,
                    opacity:0
                },info.speed);

                // 다음 배너 나타나게 하기
                info.$inBanner.stop().animate({
                    top:0,
                    opacity:1
                },info.speed);
            }
        }

        // 위에서 아래로 롤링되는 효과
        TBRollingEffect = {
            effect:function(info){
                // 다음 배너 위치 초기화
                info.$inBanner.css({
                    top:-info.bannerHeight,
                    opacity:0
                })

                // 현재 배너 사라지게 하기
                info.$outBanner.stop().animate({
                    top:info.bannerHeight,
                    opacity:0
                },info.speed);

                // 다음 배너 나타나게 하기
                info.$inBanner.stop().animate({
                    top:0,
                    opacity:1
                },info.speed);
            }
        }

        // 왼쪽에서 오른쪽으로 롤링되는 효과
        LRRollingEffect = {
            effect:function(info){
                // 다음 배너 위치 초기화
                info.$inBanner.css({
                    left:-info.bannerWidth,
                    top:0,
                    opacity:0
                })

                // 현재 배너 사라지게 하기
                info.$outBanner.stop().animate({
                    left:info.bannerWidth,
                    top:0,
                    opacity:0
                },info.speed);

                // 다음 배너 나타나게 하기
                info.$inBanner.stop().animate({
                    left:0,
                    top:0,
                    opacity:1
                },info.speed);
                console.log("info - ",info);
            }
        }

        // 오른쪽에서 왼쪽으로 롤링되는 효과
        RLRollingEffect = {
            effect:function(info){

                // 다음 배너 위치 초기화
                info.$inBanner.css({
                    left:info.bannerWidth,
                    top:0,
                    opacity:0
                })

                // 현재 배너 사라지게 하기
                info.$outBanner.stop().animate({
                    left:-info.bannerWidth,
                    top:0,
                    opacity:0
                },info.speed);

                // 다음 배너 나타나게 하기
                info.$inBanner.stop().animate({
                    left:0,
                    top:0,
                    opacity:1
                },info.speed);
            }
        }
