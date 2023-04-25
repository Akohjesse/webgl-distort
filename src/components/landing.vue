<template>
    <main>
        <div class="container">
            <div class="container_wrap">
                <div id="slider-content" class="container_wrap_content">
                    <div class="meta">Species</div>
                    <h2 id="slide-title">Amur <br />Leopard</h2>
                    <span data-slide-title="0">Amur <br />Leopard</span>
                    <span data-slide-title="1">Asiatic <br />Lion</span>
                    <span data-slide-title="2">Siberian <br />Tiger</span>
                    <span data-slide-title="3">Brown <br />Bear</span>
                    <div class="meta">Status</div>
                    <div id="slide-status">Critically Endangered</div>
                    <span data-slide-status="0">Critically Endangered</span>
                    <span data-slide-status="1">Endangered</span>
                    <span data-slide-status="2">Endangered</span>
                    <span data-slide-status="3">Least Concern</span>
                </div>
            </div>
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/leopard2.jpg" />
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/lion2.jpg" />
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/tiger2.jpg" />
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/bear2.jpg" />

            <div id="pagination">
                <button class="active" data-slide="0"></button>
                <button data-slide="1"></button>
                <button data-slide="2"></button>
                <button data-slide="3"></button>
            </div>
        </div>
    </main>
</template>

<style lang="scss">
main {
    position: relative;
    width: 100%;
    height: 100vh;
    .container {
        height: 100%;
        margin: 0 auto;
        position: relative;
        width: 1200px;
        &_wrap {
            position: relative;
            @include flex(flex-start, center, 0rem);
            height: 100%;
            width: 1060px;
            margin: 0 auto;
            z-index: 5;
            &_content {
                padding: 0 10px;
                h2 {
                    font-weight: 400;
                    font-size: 7rem;
                    letter-spacing: -1px;
                    color: white;
                    margin: 20px 0 60px;
                    line-height: 6rem;
                }
                span {
                    display: none;
                }
                .meta {
                    display: inline-block;
                    font-family: "Arial", sans-serif;
                    font-size: 11px;
                    letter-spacing: 5px;
                    color: #88888a;
                    text-transform: uppercase;
                    position: relative;
                    &:after {
                        content: "";
                        display: block;
                        position: absolute;
                        top: 5px;
                        right: -55px;
                        width: 45px;
                        height: 2px;
                        background-color: #393d40;
                    }
                }
                #slide-status {
                    margin-top: 10px;
                    font-family: "acta-display", serif;
                    font-weight: 400;
                    font-size: 2rem;
                    color: white;
                }
            }
        }
        canvas {
            width: 150%;
            height: 150%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
        }
        img {
            width: 100%;
            max-width: 100%;
            position: relative;
            z-index: 0;
        }
        #pagination {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 30px;
            z-index: 6;
            @include flex_col(2.5rem);
            button {
                display: block;
                -webkit-appearance: none;
                appearance: none;
                border: none;
                width: 16px;
                height: 16px;
                background-color: #ffffff;
                border-radius: 100%;
                cursor: pointer;
                position: relative;
                opacity: 0.2;
                transition: opacity 0.2s ease-in-out;
                outline: none;
                &:hover {
                    opacity: 0.5;
                }

                &.active {
                    opacity: 1;

                    &:before {
                        width: 300%;
                        height: 300%;
                        opacity: 1;
                    }
                }

                &:before {
                    content: "";
                    display: block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    height: 100%;
                    border-radius: 100%;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    opacity: 0;
                    transition: opacity 0.4s ease-in-out, width 0.4s ease-in-out, height 0.4s ease-in-out;
                }
            }
        }
    }
}
</style>
