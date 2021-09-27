/*
	1.0.0：canvas畫圖和輸出
	2.2.0：突然想到要寫，算了好懶，前面的就跳過吧。反正這版新功能是自動上文字
*/

//用requestAnimationFrame方法來連續繪製video影像到canvas上
//這裡先建立全域方法reqAnimation, 並指向當前裝置的requestAnimationFrame方法 
window.reqAnimation = window.requestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.msRequestAnimationFrame
	|| window.mozRequestAnimationFrame


var ccvAudio = document.getElementById("ccvVideo");
var ccvAudio_2 = document.getElementById("ccvVideo_2");
var audioCtx;
var analyser;
var bufferLength;
var dataArray;
var ccvAnimation_Output_Frame = 0
//聲音
function AudioContext_Ready() {
	audioCtx = new AudioContext();
	const ccvSource = audioCtx.createMediaElementSource(ccvAudio);
	analyser = audioCtx.createAnalyser();
	analyser.fftSize = 2048;
	bufferLength = analyser.frequencyBinCount;
	dataArray = new Uint8Array(bufferLength);
	analyser.getByteTimeDomainData(dataArray);
	ccvSource.connect(analyser);
}

//影片
var ccvVideo;
var ccvVideo_2;
var ccvCanvas_1 = document.getElementById("ccvCanvas_1");
var ccvPan_1 = ccvCanvas_1.getContext('2d');

var ccvCanvas_2 = document.getElementById("ccvCanvas_2");
var ccvPan_2 = ccvCanvas_2.getContext('2d');

var ccvCanvas_Mask = document.getElementById("ccvCanvas_Mask");
var ccvPan_Mask = ccvCanvas_Mask.getContext('2d');

//function
function ccvLodeVideo(input) {
	ccvVideo = input.files[0];
	document.getElementById("ccvVideo").src = URL.createObjectURL(ccvVideo);
	document.getElementById("ccvVideo_2").src = URL.createObjectURL(ccvVideo);
	ccvVideo = document.getElementById("ccvVideo");
	ccvVideo_2 = document.getElementById("ccvVideo_2");
	document.getElementById("ccvCanvas_1").width = ccvVideo.width;
	document.getElementById("ccvCanvas_1").height = ccvVideo.height;
}
function ccvVideo_Play() {
	ccvVideo.play();
	ccvVideo_2.play();
	ccvAnimation();
}
function ccvVideo_Pause() {
	ccvVideo.pause();
	ccvVideo_2.pause();
}
function ccvVideo_Return() {
	ccvVideo.pause();
	ccvVideo.currentTime = 0;
	ccvVideo_2.pause();
	ccvVideo_2.currentTime = 0;
}

function ccvClearArray() {
	ccvAudio_VideoTimeArray_Save = [];
	ccvAudio_heightArray_SaveAsArray = [];
}

function ccvVideo_Go() {
	//window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
	builder.finish(function (generatedURL) {
		let a = document.createElement("a");
		document.body.appendChild(a);
		a.style.display = 'none';
		a.href = generatedURL;
		a.download = 'Doritos Video Made_by_Canvas.avi';
		a.click();
	});
	alert(`輸出完成，耗時${Math.floor(Number(Date.parse(Date()) - Date.parse(start)) / 60000)}分${(Number(Date.parse(Date()) - Date.parse(start)) / 1000) % 60}秒`);
	return
}

//預備變數
var ccvAudio_VideoTimeArray_Save = []

var ccvAudio_heightArray_Save = []
var ccvAudio_heightArray_SaveAsArray = []

var ccvimageData;
var ccvCanvas_1_Buffer;

//打光方向
var dddLight = dddNormalize([6, 2, 0]);//光線要正交化

//做一個甜甜圈

var Myr1 = 50
var dddMyDonut = dddCreate_Cube(Myr1);		//做一個甜甜圈
var dddMyDonutSurface = dddCreate_CubeSurface();	//標注甜甜圈的各個表面的節點
var dddMyDonutNormal = dddCreate_CubeNormal();	//找出甜甜圈各個表面的法向量

/*
for (let k = 0; k < 50; k++) {
	var dddMyDonut2 = dddCreate_Cube(Myr1);		//做一個甜甜圈
	var dddMyDonutSurface2 = dddCreate_CubeSurface();	//標注甜甜圈的各個表面的節點
	var dddMyDonutNormal2 = dddCreate_CubeNormal();	//找出甜甜圈各個表面的法向量
	

	dddMyDonut2 = dddRotate_X(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonut2);
	dddMyDonutNormal2 = dddRotate_X(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonutNormal2);
	dddMyDonut2 = dddRotate_Y(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonut2);
	dddMyDonutNormal2 = dddRotate_Y(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonutNormal2);
	dddMyDonut2 = dddRotate_Z(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonut2);
	dddMyDonutNormal2 = dddRotate_Z(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonutNormal2);

	dddTranslation((Math.floor((Math.random()**4) * 500)-250),
		0,
		0, dddMyDonut2);
	dddCombineDonut(dddMyDonut, dddMyDonutSurface, dddMyDonutNormal, dddMyDonut2, dddMyDonutSurface2, dddMyDonutNormal2)
	dddMyDonut2 = []		//做一個甜甜圈
	dddMyDonutSurface2 = []	//標注甜甜圈的各個表面的節點
	dddMyDonutNormal2 = []	//找出甜甜圈各個表面的法向量
}

console.log(dddMyDonut,"Donut")
console.log(dddMyDonutSurface,"Surface")
console.log(dddMyDonutNormal,"Normal")

*/

var builder = new VideoBuilder({
	width: 1280,
	height: 720,
	fps: 23.976
});
var start = null;

var Doritos_nameFrame = 0;
var Doritos_nameFrame_Array = [[0,2,"字幕 by 王米片精靈"],[0,2,""]]
var ccvAnimation_Frame = 0
//主要動畫程式
function ccvAnimation() {
	// 如果 video暫停, 或是已經播放完畢則停止繪圖
	if (ccvVideo.paused || ccvVideo.ended) {
		console.log(ccvAudio_VideoTimeArray_Save);
		console.log(ccvAudio_heightArray_SaveAsArray);
		console.log(Doritos_nameFrame_Array);
		return
	};
	ccvPan_1.clearRect(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
	document.getElementById("ccvVideo_time").innerHTML = ccvVideo.currentTime;
	//設影片為底
	ccvPan_1.globalAlpha = 1;
	analyser.getByteTimeDomainData(dataArray);
	ccvPan_1.drawImage(ccvVideo, 0, 0, ccvVideo.width, ccvVideo.height);
	//開始畫畫
	/*
	ccvVideo.currentTime ： 影片時間
	bufferLength ： 聲域的長度
	dataArray ： 聲音量值
	*/
	ccvAnimation_Frame = Math.floor(ccvVideo.currentTime * 23.976);

	//ccvAnimation_Donut();//畫甜甜圈
	//ccvAnimation_Audio();//畫音檔
	//ccvAnimation_getGrayscale(Myr1);//取灰階
	ccvAnimation_getFrame(ccvAnimation_Frame);

	if (Math.floor(ccvVideo.currentTime * 23.976) > Doritos_nameFrame_Array[1][0]){
		Doritos_nameFrame_Array[1][0] = Math.floor(ccvVideo.currentTime * 23.976);
	}
	
	//ccvAnimation_toScreentone(Myr1);//畫網點
	//ccvAnimation_colorRGB(Myr1);


	///////////以下測試///////////
	ccvAnimation_subtitleToCanvas(ccvSubtitle_Array, ccvAnimation_Frame);
	///////////以上測試///////////
	
	reqAnimation(ccvAnimation)
}


function ccvVideo_Output_Button() {
	console.log("output");
	if (!start) start = Date();
	ccvVideo.pause();
	ccvVideo.currentTime = 0;
	ccvVideo_Output_Count = 0;
	Doritos_nameFrame_Array[0][0] = Doritos_nameFrame_Array[1][0] - 84;
	Doritos_nameFrame_Array[1][0] = Doritos_nameFrame_Array[1][0] - 12;
	console.log(ccvSubtitle_Array);
	console.log(Doritos_nameFrame_Array);
	ccvVideo_Output();
}

var ccvVideo_Output_Count = 0

//主要輸出程式
function ccvVideo_Output() {
	ccvVideo_Output_Count = (ccvVideo_Output_Count + 1) % 10;

	if (ccvVideo_Output_Count === 0) {
		ccvVideo.currentTime = ccvAnimation_Output_Frame / 23.976;

		//顯示進度條
		document.getElementById("ccvVideo_time").innerHTML = `${(ccvVideo.currentTime / ccvVideo.duration) * 100} %`;
		// 如果 video暫停, 或是已經播放完畢則停止繪圖
		if (ccvVideo.currentTime >= ccvVideo.duration) {
			builder.finish(function (generatedURL) {
				let a = document.createElement("a");
				document.body.appendChild(a);
				a.style.display = 'none';
				a.href = generatedURL;
				a.download = 'Doritos Video Made_by_Canvas.avi';
				a.click();
			});
			alert(`輸出完成，耗時${Math.floor(Number(Date.parse(Date()) - Date.parse(start)) / 60000)}分${(Number(Date.parse(Date()) - Date.parse(start)) / 1000)%60}秒`);
			return
		};

		//清空
		//ccvPan_1.clearRect(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);

		//設影片為底
		ccvPan_1.globalAlpha = 1;
		ccvPan_1.drawImage(ccvVideo, 0, 0, ccvVideo.width, ccvVideo.height);
		//開始畫畫
		/*
		ccvVideo.currentTime ： 影片時間
		bufferLength ： 聲域的長度
		dataArray ： 聲音量值
		*/
		
		
		//ccvVideo_Output_Audio();//畫音檔
		//ccvAnimation_Donut();//畫甜甜圈
		//ccvAnimation_getGrayscale(ccvAnimation_Output_Frame,50,60);//取灰階 ccvAnimation_getGrayscale(Frame,min,MAX)
		//ccvAnimation_getFrame(ccvAnimation_Output_Frame);//標註畫格 ccvAnimation_getFrame(Frame)
		//ccvAnimation_colorInvert(ccvAnimation_Output_Frame, 20, 70);//顏色反轉 ccvAnimation_colorInvert(Frame,min,MAX)
		
		///////////以下測試///////////
		ccvAnimation_subtitleToCanvas(ccvSubtitle_Array, ccvAnimation_Output_Frame);
		///////////以上測試///////////

		//畫到第二張canvas上
		ccvAnimation_subtitleToCanvas(Doritos_nameFrame_Array, ccvAnimation_Output_Frame);
		ccvPan_2.drawImage(ccvCanvas_1, 0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		builder.addCanvasFrame(ccvCanvas_2);
		ccvAnimation_Output_Frame = ccvAnimation_Output_Frame + 1;
	}
	reqAnimation(ccvVideo_Output);
}

function ccvAnimation_Audio(){
	ccvAudio_heightArray_Save = [];
	for (let i = 0; i < 1024; i++) {
		ccvAudio_heightArray_Save[i] = dataArray[i];
	}
	//對音檔粗剪
	for (let i = 0; i < 1024; i++) {
		for (let j = 0; j < 128; j++) {
			ccvAudio_heightArray_Save[i] = ccvAudio_heightArray_Save[i] + ccvAudio_heightArray_Save[((i + j) % 1024)]
		}
		ccvAudio_heightArray_Save[i] = ccvAudio_heightArray_Save[i] / 128
	}
	for (let i = 0; i < 1024; i++) {
		if (ccvAudio_heightArray_Save[i] <= 128) {
			ccvAudio_heightArray_Save[i] = 128
		}
	}
	ccvAudio_VideoTimeArray_Save.push(ccvVideo.currentTime);
	ccvAudio_heightArray_SaveAsArray.push(ccvAudio_heightArray_Save);

	for (let i = 0; i < 1024; i++) {
		ccvPan_1.fillStyle = "#ffffff";
		ccvPan_1.globalAlpha = 0.8;

		ccvPan_1.fillRect(i, ccvCanvas_1.height - ccvAudio_heightArray_Save[i - (i % 16)] * 2 + 256, 1, ccvCanvas_1.height);
		ccvPan_1.closePath();
	}
	ccvPan_1.globalAlpha = 1;
}

function ccvVideo_Output_Audio(){
	var ccvTimeArray = 0

	for (let i = 0; i < ccvAudio_VideoTimeArray_Save.length; i++) {
		if (ccvVideo.currentTime <= ccvAudio_VideoTimeArray_Save[i]) {
			ccvTimeArray = Number(i);
			break;
		};
	};

	for (let i = 0; i < 1024; i++) {
		ccvPan_1.fillStyle = "#ffffff";
		ccvPan_1.globalAlpha = 0.8;
		ccvPan_1.fillRect(i, ccvCanvas_1.height - ccvAudio_heightArray_SaveAsArray[ccvTimeArray][i] - 128, 1, ccvCanvas_1.height);
		ccvPan_1.closePath();
	}
}

function ccvAnimation_Donut(){
	ccvPan_1.globalAlpha = 1;
	//旋轉
	dddMyDonut = dddRotate_X(dddPI / 600, dddMyDonut);
	dddMyDonutNormal = dddRotate_X(dddPI / 600, dddMyDonutNormal);
	dddMyDonut = dddRotate_Y(dddPI / 600, dddMyDonut);
	dddMyDonutNormal = dddRotate_Y(dddPI / 600, dddMyDonutNormal);
	dddMyDonut = dddRotate_Z(dddPI / 600, dddMyDonut);
	dddMyDonutNormal = dddRotate_Z(dddPI / 600, dddMyDonutNormal);
	//取亮度
	var dddMyDonutFindOut_Brightness = dddGetLuminance(dddLight, dddMyDonutNormal);
	//排序
	console.log(dddMyDonutSurface)
	var lighthouse = dddAnimationDrawSequence(dddMyDonut, dddMyDonutSurface);
	//畫甜甜圈
	for (let i = 0; i < dddMyDonutSurface.length; i++) {
		ccvPan_1.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_1.moveTo(dddMyDonut[dddMyDonutSurface[lighthouse[i]][0]][0] * 1000 / (1000 + dddMyDonut[dddMyDonutSurface[lighthouse[i]][0]][2]) + 640, dddMyDonut[dddMyDonutSurface[lighthouse[i]][0]][1] * 1000 / (1000 + dddMyDonut[dddMyDonutSurface[lighthouse[i]][0]][2]) + 360);
		for (let j = 1; j < dddMyDonutSurface[lighthouse[i]].length; j++) {
			ccvPan_1.lineTo(dddMyDonut[dddMyDonutSurface[lighthouse[i]][j]][0] * 1000 / (1000 + dddMyDonut[dddMyDonutSurface[lighthouse[i]][j]][2]) + 640, dddMyDonut[dddMyDonutSurface[lighthouse[i]][j]][1] * 1000 / (1000 + dddMyDonut[dddMyDonutSurface[lighthouse[i]][j]][2]) + 360);
		}
		ccvPan_1.closePath();
		ccvPan_1.fillStyle = `rgba(${(dddMyDonutFindOut_Brightness[lighthouse[i]] * 50 + 100) % 100},${(dddMyDonutFindOut_Brightness[lighthouse[i]] * 255) % 100 + 50},${dddMyDonutFindOut_Brightness[lighthouse[i]] * 50 + 125},1)`;
		ccvPan_1.fill();
	}
}

function ccvAnimation_getFrame(ccvAnimation_Output_Frame) {
	//ccvPan_1.globalAlpha = 1;
	ccvPan_1.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_1.font = "normal bold 100px Microsoft JhengHei";
	ccvPan_1.textBaseline = "top";
	ccvPan_1.strokeStyle = `${document.getElementById("ccvColor_0").value}`;
	ccvPan_1.lineWidth = 20; //define the width of the stroke line 
	ccvPan_1.strokeText(`${ccvAnimation_Output_Frame}`, 20, 20);
	ccvPan_1.closePath();

	ccvPan_1.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_1.font = "normal bold 100px Microsoft JhengHei";
	ccvPan_1.textBaseline = "top";
	ccvPan_1.strokeStyle = `${document.getElementById("ccvColor_1").value}`;
	ccvPan_1.lineWidth = 10; //define the width of the stroke line 
	ccvPan_1.strokeText(`${ccvAnimation_Output_Frame}`, 20, 20);
	ccvPan_1.closePath();

	ccvPan_1.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_1.font = "normal bold 100px Microsoft JhengHei";
	ccvPan_1.textBaseline = "top";
	ccvPan_1.fillStyle = `${document.getElementById("ccvColor_2").value}`;
	ccvPan_1.fillText(`${ccvAnimation_Output_Frame}`, 20, 20);
	ccvPan_1.closePath();
}

function ccvAnimation_getGrayscale(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame){
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			//以下更變數據
			ccvCanvas_1_Buffer[i] = (ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000;
			ccvCanvas_1_Buffer[i + 1] = (ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000
			ccvCanvas_1_Buffer[i + 2] = (ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000;
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_colorInvert(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame) {
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			//以下更變數據
			ccvCanvas_1_Buffer[i] = 255 - ccvCanvas_1_Buffer[i];
			ccvCanvas_1_Buffer[i + 1] = 255 - ccvCanvas_1_Buffer[i+1];
			ccvCanvas_1_Buffer[i + 2] = 255 - ccvCanvas_1_Buffer[i+2];
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_colorRGB(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame) {
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			//以下更變數據
			if ((ccv_r > 192) && (ccv_g > 192) && (ccv_b > 192)) {
				ccvCanvas_1_Buffer[i] = 255;
				ccvCanvas_1_Buffer[i + 1] = 255;
				ccvCanvas_1_Buffer[i + 2] = 255;
			} else if ((ccv_r < 96) && (ccv_g < 96) && (ccv_b < 96)) {
				ccvCanvas_1_Buffer[i] = 0;
				ccvCanvas_1_Buffer[i + 1] = 0;
				ccvCanvas_1_Buffer[i + 2] = 0;
			} else if ((ccv_r > ccv_g) && (ccv_r > ccv_b)) {
				ccvCanvas_1_Buffer[i] = 255;
				ccvCanvas_1_Buffer[i + 1] = 128;
				ccvCanvas_1_Buffer[i + 2] = 128;
			} else if ((ccv_g >= ccv_r) && (ccv_g > ccv_b)) {
				ccvCanvas_1_Buffer[i] = 128;
				ccvCanvas_1_Buffer[i + 1] = 255;
				ccvCanvas_1_Buffer[i + 2] = 128;
			} else if ((ccv_b >= ccv_r) && (ccv_b >= ccv_g)) {
				ccvCanvas_1_Buffer[i] = 128;
				ccvCanvas_1_Buffer[i + 1] = 128;
				ccvCanvas_1_Buffer[i + 2] = 255;
			}
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_toScreentone(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame) {
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			//以下更變數據
			if (((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000) < 43){
				ccvCanvas_1_Buffer[i] = 0;
				ccvCanvas_1_Buffer[i + 1] = 0;
				ccvCanvas_1_Buffer[i + 2] = 0;
			}else if (((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000) < 85) {
				ccvCanvas_1_Buffer[i] = ccvScreentone_20.data[i];
				ccvCanvas_1_Buffer[i + 1] = ccvScreentone_20.data[i+1];
				ccvCanvas_1_Buffer[i + 2] = ccvScreentone_20.data[i+2];
			} else if (((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000) < 128) {
				ccvCanvas_1_Buffer[i] = ccvScreentone_40.data[i];
				ccvCanvas_1_Buffer[i + 1] = ccvScreentone_40.data[i + 1];
				ccvCanvas_1_Buffer[i + 2] = ccvScreentone_40.data[i + 2];
			} else if (((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000) < 170) {
				ccvCanvas_1_Buffer[i] = ccvScreentone_60.data[i];
				ccvCanvas_1_Buffer[i + 1] = ccvScreentone_60.data[i + 1];
				ccvCanvas_1_Buffer[i + 2] = ccvScreentone_60.data[i + 2];
			} else if (((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000) < 213) {
				ccvCanvas_1_Buffer[i] = ccvScreentone_80.data[i];
				ccvCanvas_1_Buffer[i + 1] = ccvScreentone_80.data[i + 1];
				ccvCanvas_1_Buffer[i + 2] = ccvScreentone_80.data[i + 2];
			} else{
				ccvCanvas_1_Buffer[i] = 255;
				ccvCanvas_1_Buffer[i + 1] = 255;
				ccvCanvas_1_Buffer[i + 2] = 255;
			}
			
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

var notKanji = "";
notKanji = notKanji + "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
notKanji = notKanji + "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
notKanji = notKanji + "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ";
notKanji = notKanji + "ぁぃぅぇぉ" + "ゃゅょ" + "っ";
notKanji = notKanji + "ァィゥェォ" + "ャュョ" + "ッ";
notKanji = notKanji + "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ";
notKanji = notKanji + "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";
notKanji = notKanji + "/*-+./.,';:_-｛｝「」，？「」!@#$%^&*{}[]―~～！＠＃＄％、ー";
notKanji = notKanji + " 　";
notKanji = notKanji.split("");
console.log(notKanji);
function ccvAnimation_subtitle_checkKanji(checkKanji_Bunsho,checkKanji_notKanji){
	for (checkKanji_i = 0; checkKanji_i < checkKanji_notKanji.length; checkKanji_i++){
		if (checkKanji_Bunsho == checkKanji_notKanji[checkKanji_i]){
			return true;
		}
	}
	return false;
}

function ccvAnimation_subtitle_checkText(subtitle_arr) {
	//區分單字是不是——平假片假特殊符號——漢字——左右括號
	let subtitle_sub_Bunsho = "";
	let subtitle_sub_Hiragana = [];
	let ccvAnimation_subtitle_checkText_Flag = 0;
	let Bunsho_count = 0;
	let Kanji_count = 0;
	for (let subtitle_i = 0; subtitle_i < subtitle_arr.length; subtitle_i++) {
		if (subtitle_arr[subtitle_i] == "(") {
			//進入上方平假標音
			ccvAnimation_subtitle_checkText_Flag = 1;
			subtitle_sub_Hiragana.push(["", Bunsho_count, Kanji_count]);
			Kanji_count = 0;
			continue;
		} else if (subtitle_arr[subtitle_i] == ")") {
			//回歸下方文本
			ccvAnimation_subtitle_checkText_Flag = 0;
			continue;
		} else if (ccvAnimation_subtitle_checkText_Flag == 0) {
			//輸入下方文本
			Bunsho_count = Bunsho_count + 1;//底下文本多了一個字
			subtitle_sub_Bunsho = subtitle_sub_Bunsho + subtitle_arr[subtitle_i];
			if (ccvAnimation_subtitle_checkKanji(subtitle_arr[subtitle_i], notKanji)){
				continue;
				//不是漢字
			}else{
				//是漢字
				Kanji_count = Kanji_count + 1;//底下文本要標音的漢字多了一個
				continue;
			}
		} else if (ccvAnimation_subtitle_checkText_Flag == 1) {
			//輸入上方文本
			subtitle_sub_Hiragana[subtitle_sub_Hiragana.length - 1][0] = subtitle_sub_Hiragana[subtitle_sub_Hiragana.length - 1][0] + subtitle_arr[subtitle_i];
		}
	}
	return [subtitle_sub_Bunsho, subtitle_sub_Hiragana]
}

function ccvAnimation_subtitle(ccvAnimation_subtitleText, ccvAnimation_subtitleFrame_Position) {
	let subtitle_arr = ccvAnimation_subtitleText.split("");
	let [subtitle_sub_Bunsho, subtitle_sub_Hiragana] = ccvAnimation_subtitle_checkText(subtitle_arr);

	if (ccvAnimation_subtitleFrame_Position == 2) {
		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px Microsoft JhengHei";
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "start";
		ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_0").value}`;
		ccvPan_Mask.lineWidth = 20; //define the width of the stroke line 
		ccvPan_Mask.strokeText(`${subtitle_sub_Bunsho}`,
			30,
			658);
		ccvPan_Mask.closePath();

		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px Microsoft JhengHei";
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "start";
		ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_1").value}`;
		ccvPan_Mask.lineWidth = 10; //define the width of the stroke line 
		ccvPan_Mask.strokeText(`${subtitle_sub_Bunsho}`,
			30,
			658);
		ccvPan_Mask.closePath();

		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px Microsoft JhengHei";
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "start";
		ccvPan_Mask.fillStyle = `${document.getElementById("ccvColor_2").value}`;
		ccvPan_Mask.fillText(`${subtitle_sub_Bunsho}`,
			30,
			658);
		ccvPan_Mask.closePath();
	}
	//console.log(subtitle_sub_Bunsho)
	//console.log(subtitle_sub_Hiragana)
	//以下畫圖
	ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_Mask.font = "normal bold 64px Microsoft JhengHei";
	ccvPan_Mask.textBaseline = "top";
	ccvPan_Mask.textAlign = "start";
	ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_0").value}`;
	ccvPan_Mask.lineWidth = 20; //define the width of the stroke line 
	ccvPan_Mask.strokeText(`${subtitle_sub_Bunsho}`,
		50 + ccvAnimation_subtitleFrame_Position * 30,
		500 + ccvAnimation_subtitleFrame_Position * 126);
	ccvPan_Mask.closePath();

	ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_Mask.font = "normal bold 64px Microsoft JhengHei";
	ccvPan_Mask.textBaseline = "top";
	ccvPan_Mask.textAlign = "start";
	ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_1").value}`;
	ccvPan_Mask.lineWidth = 10; //define the width of the stroke line 
	ccvPan_Mask.strokeText(`${subtitle_sub_Bunsho}`,
		50 + ccvAnimation_subtitleFrame_Position * 30,
		500 + ccvAnimation_subtitleFrame_Position * 126);
	ccvPan_Mask.closePath();

	ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_Mask.font = "normal bold 64px Microsoft JhengHei";
	ccvPan_Mask.textBaseline = "top";
	ccvPan_Mask.textAlign = "start";
	ccvPan_Mask.fillStyle = `${document.getElementById("ccvColor_2").value}`;
	ccvPan_Mask.fillText(`${subtitle_sub_Bunsho}`,
		50 + ccvAnimation_subtitleFrame_Position * 30,
		500 + ccvAnimation_subtitleFrame_Position * 126);
	ccvPan_Mask.closePath();

	for (let subtitle_Hiragana_i = 0; subtitle_Hiragana_i < subtitle_sub_Hiragana.length; subtitle_Hiragana_i++) {
		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px Microsoft JhengHei";
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "center";
		ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_0").value}`;
		ccvPan_Mask.lineWidth = 20; //define the width of the stroke line 
		ccvPan_Mask.strokeText(`${subtitle_sub_Hiragana[subtitle_Hiragana_i][0]}`,
			((2 * subtitle_sub_Hiragana[subtitle_Hiragana_i][1] - subtitle_sub_Hiragana[subtitle_Hiragana_i][2]) / 2) * 64 + 50 + ccvAnimation_subtitleFrame_Position * 30,
			458 + ccvAnimation_subtitleFrame_Position * 126,
			subtitle_sub_Hiragana[subtitle_Hiragana_i][2] * 64);
		ccvPan_Mask.closePath();

		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px Microsoft JhengHei";
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "center";
		ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_1").value}`;
		ccvPan_Mask.lineWidth = 10; //define the width of the stroke line 
		ccvPan_Mask.strokeText(`${subtitle_sub_Hiragana[subtitle_Hiragana_i][0]}`,
			((2 * subtitle_sub_Hiragana[subtitle_Hiragana_i][1] - subtitle_sub_Hiragana[subtitle_Hiragana_i][2]) / 2) * 64 + 50 + ccvAnimation_subtitleFrame_Position * 30,
			458 + ccvAnimation_subtitleFrame_Position * 126,
			subtitle_sub_Hiragana[subtitle_Hiragana_i][2] * 64);
		ccvPan_Mask.closePath();

		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px Microsoft JhengHei";
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "center";
		ccvPan_Mask.fillStyle = `${document.getElementById("ccvColor_2").value}`;
		ccvPan_Mask.fillText(`${subtitle_sub_Hiragana[subtitle_Hiragana_i][0]}`,
			((2 * subtitle_sub_Hiragana[subtitle_Hiragana_i][1] - subtitle_sub_Hiragana[subtitle_Hiragana_i][2]) / 2) * 64 + 50 + ccvAnimation_subtitleFrame_Position * 30,
			458 + ccvAnimation_subtitleFrame_Position * 126,
			subtitle_sub_Hiragana[subtitle_Hiragana_i][2] * 64);
		ccvPan_Mask.closePath();
	}
}


function ccvAnimation_subtitleToCanvas(ccvSubtitle_Array, ccvAnimation_Frame){
	for (let subtitleToCanvas_i = 0; subtitleToCanvas_i < ccvSubtitle_Array.length - 1; subtitleToCanvas_i++){
		if (ccvAnimation_Frame >= (ccvSubtitle_Array[subtitleToCanvas_i][0] - 48) && ccvAnimation_Frame < ccvSubtitle_Array[subtitleToCanvas_i][0]){
			ccvAnimation_subtitle(ccvSubtitle_Array[subtitleToCanvas_i][2], ccvSubtitle_Array[subtitleToCanvas_i][1]);
			//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			ccvPan_1.drawImage(ccvCanvas_Mask,
				0,
				0,
				ccvCanvas_Mask.width - 30 * (ccvSubtitle_Array[subtitleToCanvas_i][0] - ccvAnimation_Frame) ** (1.2),
				ccvCanvas_Mask.height,
				0,
				0,
				ccvCanvas_Mask.width - 30 * (ccvSubtitle_Array[subtitleToCanvas_i][0] - ccvAnimation_Frame)**(1.2),
				ccvCanvas_Mask.height);
			ccvPan_Mask.clearRect(0, 0, ccvCanvas_Mask.width, ccvCanvas_1.height);
		} else if (ccvAnimation_Frame >= ccvSubtitle_Array[subtitleToCanvas_i][0] && ccvAnimation_Frame < (ccvSubtitle_Array[subtitleToCanvas_i + 1][0])){
			ccvAnimation_subtitle(ccvSubtitle_Array[subtitleToCanvas_i][2], ccvSubtitle_Array[subtitleToCanvas_i][1]);
			//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			ccvPan_1.drawImage(ccvCanvas_Mask,
				0,
				0,
				ccvCanvas_Mask.width,
				ccvCanvas_Mask.height,
				0,
				0,
				ccvCanvas_Mask.width,
				ccvCanvas_Mask.height);
			ccvPan_Mask.clearRect(0, 0, ccvCanvas_Mask.width, ccvCanvas_1.height);
		} else if (ccvAnimation_Frame >= ccvSubtitle_Array[subtitleToCanvas_i+1][0] && ccvAnimation_Frame < (ccvSubtitle_Array[subtitleToCanvas_i + 1][0]+12)){
			ccvAnimation_subtitle(ccvSubtitle_Array[subtitleToCanvas_i][2], ccvSubtitle_Array[subtitleToCanvas_i][1]);
			//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			ccvPan_1.drawImage(
				ccvCanvas_Mask,
				100 * (ccvAnimation_Frame - ccvSubtitle_Array[subtitleToCanvas_i+1][0]),
				0,
				ccvCanvas_Mask.width - 100 * (ccvAnimation_Frame - ccvSubtitle_Array[subtitleToCanvas_i+1][0]),
				ccvCanvas_Mask.height,
				100 * (ccvAnimation_Frame - ccvSubtitle_Array[subtitleToCanvas_i+1][0]),
				0,
				ccvCanvas_Mask.width - 100 * (ccvAnimation_Frame - ccvSubtitle_Array[subtitleToCanvas_i+1][0]),
				ccvCanvas_Mask.height);
			ccvPan_Mask.clearRect(0, 0, ccvCanvas_Mask.width, ccvCanvas_1.height);
		}
	}
}


var ccvTable_Subtitle = `
<tr>
	<td colspan="2" style="text-align:center;" width="128">
		<button style="font-size: 25px;" onclick="ccvVideo_deleteTable()">刪除</button>
	</td>
	<td colspan="2" style="text-align:center;" width="128">
		<p style="font-size: 30px;">Frame</p>
	</td>
	<td colspan="2" style="text-align:center;" width="128">
		<p style="font-size: 30px;">上下排</p>
	</td>
	<td colspan="2" style="width: 2560px">
		<p style="font-size: 30px;">&ensp;&ensp;文本&ensp;&ensp;
		<button onclick="ccvVideo_Refresh()" style="font-size: 30px;">重新整理</button>
		<input id="ccvColor_0" type="text" style="font-size: 30px;" value = "#000000">
		<input id="ccvColor_1" type="text" style="font-size: 30px;" value = "#ff00ff">
		<input id="ccvColor_2" type="text" style="font-size: 30px;" value = "#ffffff">
	</td>
</tr>
`;
var ccvTable_Subtitle_addedTable = "";
var ccvAnimation_FrameNumber = 0;

function ccvVideo_deleteTable(){
	for (let deleteTable_i = 0; deleteTable_i < ccvAnimation_FrameNumber; deleteTable_i++){
		console.log(document.getElementById(`ccvSubtitle_Checkbox_${deleteTable_i}`).checked)
		if (document.getElementById(`ccvSubtitle_Checkbox_${deleteTable_i}`).checked == true){
			document.getElementById(`ccvSubtitle_Checkbox_${deleteTable_i}`).style = "display:none";
			document.getElementById(`ccvSubtitle_Frame_${deleteTable_i}`).style = "display:none";
			document.getElementById(`ccvSubtitle_Position_${deleteTable_i}`).style = "display:none";
			document.getElementById(`ccvSubtitle_Text_${deleteTable_i}`).style = "display:none";
		}
	}
}

function ccvTable_Subtitle_add(){
	ccvTable_Subtitle_addedTable = `
<tr>
	<td colspan="2" style="text-align:center;">
		<input id="ccvSubtitle_Checkbox_${ccvAnimation_FrameNumber}" type="checkbox" style = "width:30px;height:30px;">
	</td>
	<td colspan="2" style="text-align:center;">
		<p id="ccvSubtitle_Frame_${ccvAnimation_FrameNumber}" style="font-size: 35px;">${ccvAnimation_Frame}</p>
	</td>
	<td colspan="2" style="text-align:center;">
		<p id="ccvSubtitle_Position_${ccvAnimation_FrameNumber}" style="font-size: 35px;">上下排</p>
	</td>
	<td colspan="2" style="text-align:center;">
		<input id="ccvSubtitle_Text_${ccvAnimation_FrameNumber}" type="text" style="font-size: 70px;width: 2560px">
	</td>
</tr>
`;

	document.getElementById("ccvTable").innerHTML = document.getElementById("ccvTable").innerHTML + `
<tr>
	<td colspan="2" style="text-align:center;">
		<input id="ccvSubtitle_Checkbox_${ccvAnimation_FrameNumber}" type="checkbox" style = "width:30px;height:30px;">
	</td>
	<td colspan="2" style="text-align:center;">
		<p id="ccvSubtitle_Frame_${ccvAnimation_FrameNumber}" style="font-size: 35px;">${ccvAnimation_Frame}</p>
	</td>
	<td colspan="2" style="text-align:center;">
		<p id="ccvSubtitle_Position_${ccvAnimation_FrameNumber}" style="font-size: 35px;">上下排</p>
	</td>
	<td colspan="2" style="text-align:center;">
		<input id="ccvSubtitle_Text_${ccvAnimation_FrameNumber}" type="text" style="font-size: 70px;width: 2560px">
	</td>
</tr>
`;
	ccvAnimation_FrameNumber = ccvAnimation_FrameNumber + 1;
}

document.getElementById("ccvTable").innerHTML = ccvTable_Subtitle;

var ccvSubtitle_Array = [
];

function ccvVideo_Translation(){
	ccvSubtitle_Array = [];
	let Translation_Index = -1;
	for (let Translation_i = 0; Translation_i < ccvAnimation_FrameNumber; Translation_i++) {
		if (document.getElementById(`ccvSubtitle_Checkbox_${Translation_i}`).checked == true){
			continue;
		}
		Translation_Index = Translation_Index + 1;
		ccvSubtitle_Array[Translation_Index] = [];
		ccvSubtitle_Array[Translation_Index][0] = Number(document.getElementById(`ccvSubtitle_Frame_${Translation_i}`).innerHTML);
		ccvSubtitle_Array[Translation_Index][1] = 0;
		ccvSubtitle_Array[Translation_Index][2] = document.getElementById(`ccvSubtitle_Text_${Translation_i}`).value;
	}
	ccvSubtitle_Array.sort(function (a, b) {
		return a[0] - b[0];
	});
	for (let Translation_i = 0; Translation_i < ccvSubtitle_Array.length; Translation_i++) {
		if (Translation_i%2 == 0){
			ccvSubtitle_Array[Translation_i][1] = 0;
		}else{
			ccvSubtitle_Array[Translation_i][1] = 1;
		}
	}
	console.log(ccvSubtitle_Array);
}

function ccvVideo_Refresh(){
	//表格轉錄到陣列上排列
	ccvVideo_Translation();
	//清空表格
	document.getElementById("ccvTable").innerHTML = ccvTable_Subtitle;
	//反轉錄更新表格
	ccvAnimation_FrameNumber = 0;
	for (let Refresh_i = 0; Refresh_i < ccvSubtitle_Array.length; Refresh_i++) {
		document.getElementById("ccvTable").innerHTML = document.getElementById("ccvTable").innerHTML + `
		<tr>
			<td colspan="2" style="text-align:center;">
				<input id="ccvSubtitle_Checkbox_${Refresh_i}" type="checkbox" style = "width:30px;height:30px;">
			</td>
			<td colspan="2" style="text-align:center;">
				<p id="ccvSubtitle_Frame_${Refresh_i}" style="font-size: 35px;">${ccvSubtitle_Array[Refresh_i][0]}</p>
			</td>
			<td colspan="2" style="text-align:center;">
				<p id="ccvSubtitle_Position_${Refresh_i}" style="font-size: 35px;">${ccvSubtitle_Position_change(ccvSubtitle_Array[Refresh_i][1])}</p>
			</td>
			<td colspan="2" style="text-align:center;">
				<input id="ccvSubtitle_Text_${Refresh_i}" type="text" value = "${ccvSubtitle_Array[Refresh_i][2]}" style="font-size: 70px;width: 2560px">
			</td>
		</tr>
		`
		ccvAnimation_FrameNumber = ccvAnimation_FrameNumber + 1;
	}
	console.log(ccvAnimation_FrameNumber,"ccvAnimation_FrameNumber")
}

function ccvSubtitle_Position_change(ccvPosition) {
	if (ccvPosition == 0) {
		return "上";
	} else if (ccvPosition == 1) {
		return "下";
	} else if (ccvPosition == 2) {
		return "多力多滋";
	}
}
