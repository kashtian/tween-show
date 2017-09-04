<template>
    <div>
        <div class="typing">this is home page!!!</div>
        <test>
            <template scope="test">
            <div>{{test.bb}}</div>
            <div>{{test.text}}</div>
            </template>
        </test>
        <router-link to="/2048">2048 game</router-link>
        <div>
        <router-link to="/doll">抓娃娃游戏</router-link>
        </div>
        <canvas id="bezier" ref="canvas"></canvas>
        <canvas id="scene" ref="scene" width="500px" height="500px"></canvas>
        <svg width="500" height="300">
            <text x="5" y="20" style="stroke: blue;fill:red;font-size:28">test svg text</text>
            <line x1="5" y1="20" x2="100" y2="20" style="stroke:red" />
            <path d="M5,30 c30,5 40,20 10,50 s40,60 70,0 a20,30 45 0,0 30,30" style="stroke: red;fill:none" />
            <defs>
                <marker id="markerCircle" markerWidth="15" markerHeight="15" refX="5" refY="5" markerUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="3" style="fill:red;" />
                </marker>
                <marker id="markerTriangle" markerWidth="15" markerHeight="15" refX="0" refY="5" orient="auto">
                    <polygon points="0,0 0,10 10,5" />
                </marker>
                <text id="tt1" style="stroke:yellow">text base</text>
                <path id="textPath" d="M100,190 q50,50 80,0" />
            </defs>
            <path d="M5,150 l50,20 l70,10" style="stroke:green;fill:none;marker-start:url(#markerCircle);marker-mid:url(#markerCircle);marker-end:url(#markerTriangle)" />
            <text x="5" y="180">
                <tspan dy="10 20 30">12345</tspan>
                <tref xlink:href="#tt1"/>
            </text>
            <path  d="M100,190 q50,50 80,0" style="fill:none;stroke-width:2;stroke:red;stroke-dasharray:8,5;stroke-dashoffset:2" />
            <text>
                <textPath xlink:href="#textPath">text along a curved path</textPath>
            </text>
            <use x="5" y="260" xlink:href="#tt1" />
        </svg>
        <svg width="500" height="500">
            <circle cx="30" cy="30" r="20" style="stroke:green;fill:none">
                <set attributeName="r" attributeType="XML" to="30" begin="5s"/>
            </circle>
            <circle cx="60" cy="60" r="30" style="stroke:blue;fill:none;">
                <animate attributeName="cx" from="60" to="100" 
                    begin="0s" dur="5s" fill="remove" repeatCount="1" />
            </circle>
            <circle cx="100" cy="100" r="30" style="stroke:red;fill:none">
                <animateTransform id="one" attributeName="transform" 
                    type="rotate"
                    from="0 150 150" to="360 150 150"
                    begin="0s" dur="10s" additive="sum"/>
                <animateTransform attributeName="transform" 
                    type="scale"
                    from="1" to="2"
                    begin="0s" dur="10s" additive="sum"/>
            </circle>
            <path d="M175,175 q50,50 100,0 q50,-50 100,0" style="fill:none;stroke:silver" />
            
            <g transform="translate(175,175)">
                <polygon points="0,-15 0,15 30,0" style="stroke:silver;fill:none;">
                    <animateMotion path="m0,0 q50,50 100,0 q50,-50 100,0" 
                        begin="0s" dur="10s" rotate="auto" repeatCount="indefinite"/>
                </polygon>
            </g>
        </svg>
        <svg width="500" height="500">
            <symbol id="s-text">
                <text x="50%" y="50%" text-anchor="middle">Alloy</text>
            </symbol>
            <use xlink:href="#s-text" class="text" />
            <use xlink:href="#s-text" class="text" />
            <use xlink:href="#s-text" class="text" />
            <use xlink:href="#s-text" class="text" />
            <use xlink:href="#s-text" class="text" />
            <use xlink:href="#s-text" class="text" />
            <use xlink:href="#s-text" class="text" />
        </svg>
        <svg width="500" height="500">
            <linearGradient id="mg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FF0000" />
                <stop offset="20%" stop-color="#FF7F00" />
                <stop offset="40%" stop-color="#FFFF00" />
                <stop offset="60%" stop-color="#00FF00" />
                <stop offset="80%" stop-color="#00FFFF" />
                <stop offset="100%" stop-color="#8B00FF" />
            </linearGradient>
            <symbol id="alloy"> 
                <text x="50%" y="50%" text-anchor="middle">Alloy</text>
            </symbol>
            <use xlink:href="#alloy"  class="alloy" />
            <use xlink:href="#alloy" class="alloy two" />
            <path fill="#1EB287">
                <animate 
                        attributeName="d" 
                        dur="1440ms" 
                        repeatCount="indefinite"
                        keyTimes="0;
                                .0625;
                                .208333333;
                                .3125;
                                .395833333;
                                .645833333;
                                .833333333;
                                1"
                        calcMode="linear" 
                        values="M 0,0 
                                C 50,0 50,0 100,0
                                100,50 100,50 100,100
                                50,100 50,100 0,100
                                0,50 0,50 0,0
                                Z;

                                M 0,0 
                                C 50,0 50,0 100,0
                                100,50 100,50 100,100
                                50,100 50,100 0,100
                                0,50 0,50 0,0
                                Z;

                                M 50,0 
                                C 75,25 75,25 100,50 
                                75,75 75,75 50,100
                                25,75 25,75 0,50
                                25,25 25,25 50,0
                                Z;

                                M 25,50 
                                C 37.5,25 37.5,25 50,0 
                                75,50 75,50 100,100
                                50,100 50,100 0,100
                                12.5,75 12.5,75 25,50
                                Z;

                                M 25,50 
                                C 37.5,25 37.5,25 50,0 
                                75,50 75,50 100,100
                                50,100 50,100 0,100
                                12.5,75 12.5,75 25,50
                                Z;

                                M 50,0
                                C 77.6,0 100,22.4 100,50 
                                100,77.6 77.6,100 50,100
                                22.4,100, 0,77.6, 0,50
                                0,22.4, 22.4,0, 50,0
                                Z;
                                
                                M 50,0
                                C 77.6,0 100,22.4 100,50 
                                100,77.6 77.6,100 50,100
                                22.4,100, 0,77.6, 0,50
                                0,22.4, 22.4,0, 50,0
                                Z;
                                
                                M 100,0 
                                C 100,50 100,50 100,100
                                50,100 50,100 0,100
                                0,50 0,50 0,0
                                50,0 50,0 100,0
                                Z;"/>
            </path>
            
        </svg>
        <svg width="300" height="300">
            <path fill="red">
                <animate 
                    attributeName="d" 
                    dur="1s" 
                    repeatCount="indefinite"
                    keyTimes="0;.25;.5;1" 
                    calcMode="linear"
                    values="
                        M50,0
                        C100,0 100,0 100,50
                        100,100 100,100 50,100
                        0,100 0,100 0,50
                        0,0 0,0 50,0
                        Z;

                        M50,0
                        C75,0 100,25 100,50
                        100,75 75,100 50,100
                        25,100 0,75 0,50
                        0,25 25,0 50,0
                        Z;

                        M50,0
                        C75,0 100,75 100,100
                        0,100 0,100 0,100
                        0,75 25,0 50,0
                        Z;

                        M50,0
                        C100,100 100,100 100,100
                        0,100 0,100 0,100
                        50,0 50,0 50,0
                        Z;"/>
            </path>
        </svg>
        <svg width="500" height="500">
            <defs>
                <linearGradient id="lg" x1="0%" y1="0%" x2="0%" y2="100%" >
                    <stop offset="0%" stop-color="" />
                </linearGradient>
            </defs>
        </svg>
        <div class="test-box">
          <div class="test-item" @click="deleteItem($event, index)" v-for="(item, index) in arr" :key="item">点我删除</div>
        </div>
    </div>
</template>

<style lang="less" src="./home.less"></style>
<script src="./home.js"></script>