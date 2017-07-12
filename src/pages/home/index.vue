<template>
    <div>
        <div class="typing">this is home page!!!</div>
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
                <text x="50%" y="50%" text-anchor="middle">YO-YO</text>
            </symbol>
            <use xlink:href="#s-text" class="text" />
            <use xlink:href="#s-text" class="text" />
            <use xlink:href="#s-text" class="text" />
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