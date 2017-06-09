<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="utf-8"/>
	<style>
html, body {
    position: relative;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

video {
    position: absolute;
    width: 200px;
    right: 0;
    bottom: 0;
    /*opacity: 0;*/
}

canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
</head>
<body>

<canvas id="canvas"></canvas>
<video id="video"></video>
	<script src="./build/app.js?v=<?= filemtime(__DIR__ . '/build/app.js') ?>"></script>
</body>
</html>
