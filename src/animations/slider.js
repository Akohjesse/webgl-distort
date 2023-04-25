import * as THREE from 'three';
import gsap from 'gsap';

export const displacementSlider = function () {
    let vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;

    let fragmentShader = `
        varying vec2 vUv;
        uniform sampler2D currentImage;
        uniform sampler2D nextImage;
        uniform float dispFactor;

        void main() {
            vec2 uv = vUv;
            vec4 _currentImage;
            vec4 _nextImage;
            float intensity = 0.3;
            vec4 orig1 = texture2D(currentImage, uv);
            vec4 orig2 = texture2D(nextImage, uv);
            _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));
            _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));
            vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
            gl_FragColor = finalTexture;

        }
    `;

    let images = document.querySelectorAll(".container img");
    let parent = document.querySelector(".container");
    let image, sliderImages = [];
    let canvasWidth = images[0].clientWidth;
    let canvasHeight = images[0].clientHeight;

    // calculate the height and width of the viewport

    let renderWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let renderHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    let renderW, renderH;

    if( renderWidth > canvasWidth ) {
        renderW = renderWidth;
    } else {
        renderW = canvasWidth;
    }
    renderH = canvasHeight;

    let renderer = new THREE.WebGL1Renderer({
        antialias:false
    })
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor( 0x23272A, 1.0 );
    renderer.setSize( renderW, renderH );
    
    parent.appendChild(renderer.domElement);

    //load textures from images 

    let loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    
    images.forEach((img) => {
        image = loader.load( img.getAttribute( 'src' ) + '?v=' + Date.now() );
        image.magFilter = image.minFilter = THREE.LinearFilter;
        image.anisotropy = renderer.capabilities.getMaxAnisotropy();
        sliderImages.push( image );
    })

    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x23272A);
    
    // 2d camera with zero perspective distortion

    let camera = new THREE.OrthographicCamera(
        renderWidth / -2,
        renderWidth / 2,
        renderHeight / 2,
        renderHeight / -2,
        1,
        1000
    );
    camera.position.z = 1;

    // add custom material with vertex and frag shader

    let mat = new THREE.ShaderMaterial({
        uniforms: {
            dispFactor: { type: "f", value: 0.0 },
            currentImage: { type: "t", value: sliderImages[0] },
            nextImage: { type: "t", value: sliderImages[1] },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        opacity: 1.0
    });

    let geometry = new THREE.PlaneGeometry(
        parent.offsetWidth,
        parent.offsetHeight,
        1
    )

    let object = new THREE.Mesh(geometry, mat);
    object.position.set(0, 0, 0);
    scene.add(object);
 
    let addEvents = () => {
        let pagButtons =  document.getElementById('pagination').querySelectorAll('button');
        let isAnimating = false;
        pagButtons.forEach((it) => {
            it.addEventListener("click", () => {
                if (!isAnimating) {
                    isAnimating = true;
                    document.getElementById('pagination').querySelectorAll('.active')[0].className = '';
                    it.className = 'active';

                    let slideId = parseInt(it.dataset.slide, 10);
                    mat.uniforms.nextImage.value = sliderImages[slideId];
                    mat.uniforms.nextImage.needsUpdate = true;

                    gsap.to(mat.uniforms.dispFactor, {
                        duration: 1,
                        value: 1,
                        ease: 'expo.inOut',
                        onComplete: function () {
                            mat.uniforms.currentImage.value = sliderImages[slideId];
                            mat.uniforms.currentImage.needsUpdate = true;
                            mat.uniforms.dispFactor.value = 0.0;
                            isAnimating = false;
                        }
                    });

                    let slideTitleEl = document.getElementById('slide-title');
                    let slideStatusEl = document.getElementById('slide-status');
                    let nextSlideTitle = document.querySelectorAll(`[data-slide-title="${slideId}"]`)[0].innerHTML;
                    let nextSlideStatus = document.querySelectorAll(`[data-slide-status="${slideId}"]`)[0].innerHTML;

                    gsap.fromTo(slideTitleEl, {
                        duration: 0.5,
                        autoAlpha: 1,
                        y: 0
                    }, {
                        autoAlpha: 0,
                        y: 20,
                        ease: 'expo.in',
                        onComplete: function () {
                            slideTitleEl.innerHTML = nextSlideTitle;
                            gsap.to(slideTitleEl, {
                                duration: 0.5,
                                autoAlpha: 1,
                                y: 0
                            });
                        }
                    });

                    gsap.fromTo(slideStatusEl, {
                        duration: 0.5,
                        autoAlpha: 1,
                        y: 0
                    }, {
                        autoAlpha: 0,
                        y: 20,
                        ease: 'expo.in',
                        onComplete: function () {
                            slideStatusEl.innerHTML = nextSlideStatus;
                    
                            gsap.to(slideStatusEl, {
                                duration: 0.5,
                                autoAlpha: 1,
                                y: 0,
                                delay: 0.1
                            });
                        }
                    });
                 }
             })
        })
     }

    addEvents();

    window.addEventListener( 'resize' , function(e) {
        renderer.setSize(renderW, renderH);
    });


    let animate = function() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    };
    animate();
};
