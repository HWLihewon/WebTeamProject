window.onload = function() {
    
       
   
    
    function speak(text, opt_prop) {
        if (typeof SpeechSynthesisUtterance === "undefined" || typeof window.speechSynthesis === "undefined") {
            alert("이 브라우저는 음성 합성을 지원하지 않습니다.")
            return
        }
        
        window.speechSynthesis.cancel() 
    
        const prop = opt_prop || {}
    
        const speechMsg = new SpeechSynthesisUtterance()
        speechMsg.rate = prop.rate || 1       
        speechMsg.pitch = prop.pitch || 1 
        speechMsg.lang = prop.lang || "ko-KR"
        speechMsg.text = text
        
       
        window.speechSynthesis.speak(speechMsg)

       
        
    }
    
    
    
    const selectLang = document.getElementById("lang")
    const text = document.getElementById("texta")
    const Read = document.getElementById("read")
    
    Read.addEventListener("click", e => {
        speak(text.value, {
            rate: 1,
            pitch: 1.2,
            lang: selectLang.options[selectLang.selectedIndex].value
        })
    })
    

    
}







function Fontsize(n) {
    var s = document.getElementById('texta');
    s.style.fontSize = n.value + 'px'
}

function SFontFamily() {
    var selector = document.getElementById('selectF');
    var family = selector.options[selector.selectedIndex].value;
    var div = document.getElementById('texta')
    div.style.fontFamily = family;        
  }



  function download(){
    var text = document.getElementById("texta").value;
    text = text.replace(/\n/g, "\r\n"); 
    var blob = new Blob([text], { type: "text/plain"});
    var anchor = document.createElement("a");
    anchor.download = "저장된 텍스트.txt";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target ="_blank";
    anchor.style.display = "none"; 
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
 }
 
 
 function Clear() {
    document.getElementById("texta").value = "";
}

function TextSearch() {
    var Search = document.getElementById("textb").value;
    var TextSearch = document.getElementById("texta").value;
  
    if (Search.length > 0 && TextSearch.indexOf(Search) > -1) {
      alert("존재합니다");
    } else {
      alert("존재하지않습니다.");
    }
  }