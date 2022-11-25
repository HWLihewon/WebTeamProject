const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImg = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d");

// 기본값이 있는 전역 변수
let prevMouseX,
  prevMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5,
  selectedColor = "#000";

const setCanvasBackground = () => {
  // 전체 캔버스 배경을 흰색으로 설정하므로 다운로드한 이미지 배경이 흰색이 됩니다.
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor; // 채우기 스타일을 다시 selectedColor로 설정하면 브러시 색상이 됩니다.
};

window.addEventListener("load", () => {
  // 캔버스 너비/높이 설정.. 오프셋 너비/높이는 요소의 볼 수 있는 너비/높이를 반환합니다.
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRect = (e) => {
  // fillColor가 선택되지 않은 경우 테두리가 있는 사각형을 그립니다. 그렇지 않으면 배경이 있는 사각형을 그립니다.
  if (!fillColor.checked) {
    // 마우스 포인터에 따라 원 생성
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  ctx.beginPath(); // 원을 그릴 새 경로 생성
  // 마우스 포인터에 따라 원의 반지름 얻기
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // 마우스 포인터에 따라 원 생성
  fillColor.checked ? ctx.fill() : ctx.stroke(); // fillColor가 체크되어 있으면 원 채우기 그렇지 않으면 테두리 원 그리기
};

const drawTriangle = (e) => {
  ctx.beginPath(); // 원을 그릴 새 경로 생성
  ctx.moveTo(prevMouseX, prevMouseY); // 삼각형을 마우스 포인터로 이동
  ctx.lineTo(e.offsetX, e.offsetY); // 마우스 포인터에 따라 첫 줄 생성
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // 삼각형의 밑줄 생성
  ctx.closePath(); // 세 번째 선이 자동으로 그려지도록 삼각형의 경로를 닫습니다.
  fillColor.checked ? ctx.fill() : ctx.stroke(); // fillColor가 체크되어 있으면 삼각형을 채웁니다. 그렇지 않으면 테두리를 그립니다.
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; // 현재 mouseX 위치를 prevMouseX 값으로 전달
  prevMouseY = e.offsetY; // 현재 mouseY 위치를 prevMouseY 값으로 전달
  ctx.beginPath(); // 그릴 새 경로 생성
  ctx.lineWidth = brushWidth; // brushSize를 선 너비로 전달
  ctx.strokeStyle = selectedColor; // selectedColor를 획 스타일로 전달
  ctx.fillStyle = selectedColor; // 채우기 스타일로 selectedColor 전달
  // 캔버스 데이터 복사 및 스냅샷 값으로 전달.. 이렇게 하면 이미지 드래그가 방지됩니다.
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return; // isDrawing이 거짓이면 여기에서 반환
  ctx.putImageData(snapshot, 0, 0); // 복사된 캔버스 데이터를 이 캔버스에 추가

  if (selectedTool === "brush" || selectedTool === "eraser") {
    // 선택한 도구가 지우개이면 strokeStyle을 흰색으로 설정합니다.
    // 기존 캔버스 내용에 흰색을 칠하려면 획 색상을 선택한 색상으로 설정합니다.
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // 마우스 포인터에 따라 라인 생성
    ctx.stroke(); // 색상으로 선 그리기/채우기
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else {
    drawTriangle(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // 모든 도구 옵션에 클릭 이벤트 추가
    // 이전 옵션에서 활성 클래스를 제거하고 현재 클릭된 옵션에 추가
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value)); // 슬라이더 값을 brushSize로 전달

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // 모든 색상 버튼에 클릭 이벤트 추가
    // 이전 옵션에서 선택한 클래스를 제거하고 현재 클릭된 옵션에 추가
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    // 선택된 btn 배경색을 selectedColor 값으로 전달
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  // 색상 선택기에서 선택한 색상 값을 마지막 색상 btn 배경으로 전달
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 전체 캔버스 지우기
  setCanvasBackground();
});

saveImg.addEventListener("click", () => {
  const link = document.createElement("a"); // <a> 요소 생성
  link.download = `${Date.now()}.jpg`; // 현재 날짜를 링크 다운로드 값으로 전달
  link.href = canvas.toDataURL(); // canvasData를 링크 href 값으로 전달
  link.click(); // 이미지 다운로드 링크 클릭
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
