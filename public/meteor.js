var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game').appendChild(renderer.domElement);


var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Загрузить текстуру ракеты
var rocketTexture = new THREE.TextureLoader().load('assets/images/burger.png');
var rocketMaterial = new THREE.MeshBasicMaterial({ map: rocketTexture });

var rocketGeometry = new THREE.CylinderGeometry(0, 0.5, 1, 12);
var player = new THREE.Mesh(rocketGeometry, rocketMaterial);
scene.add(player);

var score = 0;
var gameOver = false;

// Загрузить текстуру метеорита
var meteorTexture = new THREE.TextureLoader().load('assets/images/asteroid.jpg');
var meteorMaterial = new THREE.MeshPhongMaterial({ map: meteorTexture, specular: 0x050505, shininess: 100 });
var meteors = [];

var timerElem = document.getElementById('timer');
var gameoverElem = document.getElementById('gameover');
var startTime = Date.now();

function spawnMeteor() {
  var size = Math.random() * 0.5 + 0.5;
  var speed = Math.random() * 0.1 + 0.05;
  var meteorGeometry = new THREE.TetrahedronGeometry(size, 2);
  var meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
  meteor.position.x = (Math.random() - 0.5) * 20;
  meteor.position.y = (Math.random() - 0.5) * 20;
  meteor.position.z = 20;
  meteor.speed = speed;
  scene.add(meteor);
  meteors.push(meteor);
}

function moveMeteors() {
  for (var i = 0; i < meteors.length; i++) {
    meteors[i].position.z -= meteors[i].speed;
    if (meteors[i].position.z < -10) {
      scene.remove(meteors[i]);
      meteors.splice(i, 1);
      i--;
    } else if (meteors[i].position.distanceTo(player.position) < 1) {
      // Игра заканчивается, если метеорит попадает в игрока
      gameOver = true;
      gameoverElem.style.display = 'block';
      gameoverElem.innerHTML = 'Игра окончена<br>Ваше время: ' + timerElem.textContent + ' секунд';
    }
  }
}

// Управление движением игрока с помощью мыши
var mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  vector.unproject(camera);

  var dir = vector.sub(camera.position).normalize();
  var distance = -camera.position.z / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));

  player.position.copy(pos);
}

window.addEventListener('mousemove', onMouseMove, false);

camera.position.z = 5;

window.animate = function () {
  requestAnimationFrame(animate);

  if (gameOver) {
    return;
  }

  moveMeteors();

  // Генерировать метеориты чаще, по мере увеличения счета
  if (Math.random() < 0.01 + score * 0.01) {
    spawnMeteor();
  }

  // Увеличивать счет со временем
  score += 0.01;

  // Обновление таймера
  var time = Math.floor((Date.now() - startTime) / 1000);
  timerElem.textContent = time;

  renderer.render(scene, camera);
};


