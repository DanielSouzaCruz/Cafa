const { app, BrowserWindow } = require('electron')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    minWidth: 800,
    minHeight: 720,
    icon: "favicon/favicon.ico"
  })


  win.loadFile("front_end_html/index.html")

}

app.whenReady().then(() => {
  createWindow()
})

var dialogInputSelectionFileEstaAberto;

function escolherKey_Crt(event) {
  dialogInputSelectionFileEstaAberto = false;
  if (event.target.files && event.target.files[0]) {

    let inputCrt = document.getElementById('crtFile');
    let inputKey = document.getElementById('keyFile');

    const dtCrt = new DataTransfer();
    const dtKey = new DataTransfer();

    let devoProsseguir = true;

    [...event.target.files].forEach((file) => {
      const fileExtension = obterExtensaoArquivo(file.name).toLowerCase();

      if (fileExtension == ".crt") {
        dtCrt.items.add(file);
      } else if (fileExtension == ".key") {
        dtKey.items.add(file);
      } else {
        notification("Erro de extensão! Somente arquivos .crt e .key são permitidos.");
        document.getElementById("file").value = "";
        devoProsseguir = false;
        return;
      }
    });

    if (devoProsseguir == false) {
      return;
    }



    if (dtKey.files.length > 1 || dtCrt.files.length > 1) {
      notification("Não é permitido converter mais que dois arquivos, sendo eles um .key e um .crt");
    } else if ((inputCrt.files.length == 1 && dtCrt.files.length == 1) || (inputKey.files.length == 1 && dtKey.files.length == 1)) {
      notification("Para a correta conversão só é permitido ter um arquivo .CRT e um arquivo .KEY");
    } else {
      let nameKey = dtKey.files.item(0) ? dtKey.files.item(0).name : null;
      let nameCrt = dtCrt.files.item(0) ? dtCrt.files.item(0).name : null;
      if (nameKey != nameCrt) {

        if (inputCrt.files.length == 0 && inputKey.files.length == 0) {
          document.getElementById("containerArquivos").innerHTML = "";
        }

        document.querySelector(".container").style.display = "flex"; // mostra o visualizador de arquivos selecionados

        if (dtKey.files.length == 1) {
          document.getElementById("keyFile").files = dtKey.files;
          document.getElementById("msgForUser").innerText = "Agora selecione ou Arraste um arquivo .CRT";
          document.querySelector(".main").style.height = "20vh";
          document.getElementById("file").accept = ".crt";
          let nomeAExibir = nameKey.length > 20 ? nameKey.substring(0, 20) + "..." : nameKey;
          document.getElementById("containerArquivos").innerHTML += visualizador_dados_arquivoKeyCrt(nameKey, nomeAExibir);
        }

        if (dtCrt.files.length == 1) {
          document.getElementById("crtFile").files = dtCrt.files;
          document.querySelector(".main").style.height = "20vh";
          document.getElementById("file").accept = ".key";
          document.getElementById("msgForUser").innerText = "Agora selecione ou Arraste um arquivo .KEY";
          let nomeAExibir = nameCrt.length > 20 ? nameCrt.substring(0, 20) + "..." : nameCrt;
          document.getElementById("containerArquivos").innerHTML += visualizador_dados_arquivoKeyCrt(nameCrt, nomeAExibir);
        }

        if (inputCrt.files.length == 1 && inputKey.files.length == 1) {
          document.getElementsByClassName("download-button-files")[0].style.display = "inline-block";
          document.querySelector(".main").style.display = "none";
          document.getElementsByClassName("password-name")[0].style.display = "block";
          document.querySelector(".selection").style.border = '1px dashed #330253';
        } else {
          document.getElementsByClassName("download-button-files")[0].style.display = "none";
          document.querySelector(".main").style.display = "grid";
          document.getElementsByClassName("password-name")[0].style.display = "none";
          document.getElementById("senhaParaPFX").value = "";
          document.getElementById("nomeParaPFX").value = "";
          document.querySelector(".selection").style.border = 'none'
        }

      } else {
        notification("Não é permitido converter dois arquivos com a mesma extensão. Por favor, tente novamente enviando arquivo CRT e KEY.");
      }
    }
    
  }
  document.getElementById("file").value = "";
}

function escolherPfx(event) {
  event.preventDefault();

  document.querySelector(".main").style.display = "none";
  document.getElementById("file").click();

  if (event.target.files && event.target.files[0]) {
    const arquivo = event.target.files[0];

    if (arquivo) {

      const dt = new DataTransfer();
      dt.items.add(arquivo);
      document.getElementById('pfxFile').files = dt.files;

      const nome = arquivo.name.length > 20 ? arquivo.name.substring(0, 20) + "..." : arquivo.name;

      document.getElementById("nomeArquivo").innerText = nome;

      document.getElementById("file").classList.add("hidden");
      document.querySelector(".container").style.display = "flex";
      document.querySelector(".selection").style.border = "1px dashed #330253";
      document.getElementById("senhaParaPFX").value = "";
    }
  }
}

function fecharArquivo() {
  document.querySelector(".main").style.display = "grid";
  document.querySelector(".container").style.display = "none";
  document.getElementById("file").value = "";
  document.querySelector('.selection').style.border = "none";
}

function fecharArquivoKey_Crt(event) {

  const nomeCompletoArquivo = event.target.parentElement.querySelector('#nomeArquivo').dataset.nomecompletoarquivo;

  let inputCrt = document.getElementById('crtFile');
  let inputKey = document.getElementById('keyFile');

  if (inputCrt.files.length != 0 && nomeCompletoArquivo == inputCrt.files[0].name) {
    inputCrt.value = ""; // remove o arquivo do input oculto para arquivos crt
    document.getElementById("msgForUser").innerText = "Agora selecione ou Arraste um arquivo .CRT";  // atualiza a mensagem para comunicar o usuário o que ele deve fazer
    document.getElementById("file").accept = ".crt"; // define o filtro de arquivos do input para que o usuário possa selecionar arquivos com a extensão crt
  } else if (inputKey.files.length != 0 && nomeCompletoArquivo == inputKey.files[0].name) {
    inputKey.value = "";
    document.getElementById("msgForUser").innerText = "Agora selecione ou Arraste um arquivo .KEY";
    document.getElementById("file").accept = ".key";
  }

  if (inputKey.files.length == 0 && inputCrt.files.length == 0) { // Caso os dois inputs ocultos (crt e key) estejam vazios, atualiza a mensagem para comunicar o usuário o que ele deve fazer e define o filtro de arquivos do input para que o usuário possa selecionar arquivos com a extensão crt ou key
    document.getElementById("msgForUser").innerText = "Selecione ou Arraste os arquivos (.CRT e .KEY)";
    document.getElementById("file").accept = ".crt,.key";
    document.querySelector(".main").style.height = "46vh";
  }

  // condicionais para controlar se o botão downlaod deve ou não aparecer E também se a seção seleção de arquivos deve ou não aparecer
  if (document.getElementById("crtFile").files.length == 1 && document.getElementById("keyFile").files.length == 1) {
    document.getElementsByClassName("download-button-files")[0].style.display = "inline-block";
    document.getElementsByClassName("password-name")[0].style.display = "block";
    document.querySelector(".main").style.display = "none";
    document.querySelector(".selection").style.border = '1px dashed #330253';
  } else {
    document.getElementsByClassName("download-button-files")[0].style.display = "none";
    document.getElementsByClassName("password-name")[0].style.display = "none";
    document.getElementById("senhaParaPFX").value = "";
    document.getElementById("nomeParaPFX").value = "";
    document.querySelector(".main").style.display = "grid";
    document.querySelector(".selection").style.border = 'none';
  }

  event.target.parentElement.remove(); // remove da interface gráfica o div que mostra o arquivo e o botão de remover

  if (document.getElementById("containerArquivos").childElementCount == 0) { // caso o div que é 'pai' dos divs que mostram o arquivo não tenha mais nenhum arquivo, mostra novamente o selecionador de arquivos
    document.querySelector(".main").style.display = "grid"; // mostra o selecionador de arquivos
    document.querySelector(".container").style.display = "none";  // esconde  o visualizador de arquivos selecionados
  }

}

function select_converter(element) {
  document.querySelector('.selection').style.border = 'none';
  const itensLista = document.querySelectorAll(".segment ul li");
  itensLista.forEach(item => item.classList.remove("active"));
  element.classList.add("active");
  const divSelection = document.querySelector('.selection');

  if (element.classList.contains("active") && element.id === "pfx_file") {
    divSelection.innerHTML = '';
    document.getElementsByClassName('selection')[0].setAttribute("data-modo-atual-conversao", "PFX");
    const pfx_file = tela_pfx();
    divSelection.innerHTML = pfx_file;
  } else {
    divSelection.innerHTML = '';
    document.getElementsByClassName('selection')[0].setAttribute("data-modo-atual-conversao", "CRT_KEY");
    const key_crt_file = tela_crtkey();
    divSelection.innerHTML = key_crt_file;
  }
}

function notification(e) {
  const audio = new Audio('../audio/Error.mp3')
  audio.play();
  Toastify({
    text: e,
    duration: 5000,
    className: "info",
    gravity: 'bottom',
    style: {
      background: "#ffffff",
      color: "#000000",
      border: "2px solid #622F7A"
    }
  }).showToast();
}

function dropHandler(event) {
  event.preventDefault();
  if (event.dataTransfer.items) {
    const dtPfx = new DataTransfer();
    const dtCrt = new DataTransfer();
    const dtKey = new DataTransfer();
    let file;

    modo = document.querySelector('.selection').getAttribute("data-modo-atual-conversao");
    let deveContinuar = true;
    [...event.dataTransfer.items].forEach((item, i) => {

      if (item.kind === "file") {
        file = item.getAsFile();
        const fileExtension = obterExtensaoArquivo(file.name).toLowerCase();
        
        if (modo == "PFX" && (fileExtension == ".pfx" || fileExtension == ".p12")) {
          dtPfx.items.add(file);
        } else if (fileExtension == ".crt" && modo == "CRT_KEY"  ) {
          dtCrt.items.add(file);
        } else if (fileExtension == ".key" && modo == "CRT_KEY") {
          dtKey.items.add(file);
        } else if(modo == ""){

        }else {
          if (modo === "PFX") {
            notification("Erro de extensão! Somente arquivos .pfx e .p12 são permitidos.");
            document.querySelector('.selection').style.border = 'none';
            deveContinuar = false;
            return;
          } else {
            notification("Erro de extensão! Somente arquivos .crt e .key são permitidos.");
            document.querySelector('.selection').style.border = 'none';
            deveContinuar = false;
            return;
          }
        }

      }
    });

    if(deveContinuar == false){
      return;
    }


    if (modo === "PFX") {
      if (dtPfx.files.length < 2) {

        document.getElementById('pfxFile').files = dtPfx.files;

        const nome = file.name.length > 20 ? file.name.substring(0, 20) + "..." : file.name;
        document.getElementById("nomeArquivo").innerText = nome;
        document.getElementById("file").classList.add("hidden");
        document.querySelector(".container").style.display = "flex";
        document.getElementById("senhaParaPFX").value = "";
        document.querySelector(".main").style.display = "none";


      } else {
        notification("Não é permitido converter dois arquivos ao mesmo tempo, porfavor tente converter um de cada vez.");
        document.querySelector('.selection').style.border = 'none';
      }
    };

    let inputCrt = document.getElementById('crtFile');
    let inputKey = document.getElementById('keyFile');

    if (modo === "CRT_KEY") {
      if (dtKey.files.length > 1 || dtCrt.files.length > 1) {
        notification("Não é permitido converter mais que dois arquivos, sendo eles um .key e um .crt");
        document.querySelector('.selection').style.border = 'none';

      } else if ((inputCrt.files.length == 1 && dtCrt.files.length == 1) || (inputKey.files.length == 1 && dtKey.files.length == 1)) {
        notification("Para a correta conversão só é permitido ter um arquivo .CRT e um arquivo .KEY");
        document.querySelector('.selection').style.border = 'none';
      }
      else {

        if (inputCrt.files.length == 0 && inputKey.files.length == 0) {
          document.getElementById("containerArquivos").innerHTML = "";
        }


        let nameKey = dtKey.files.item(0) ? dtKey.files.item(0).name : null;
        let nameCrt = dtCrt.files.item(0) ? dtCrt.files.item(0).name : null;

        if (nameKey != nameCrt) {
          document.querySelector(".container").style.display = "flex";

          if (dtKey.files.length == 1) {
            document.getElementById("keyFile").files = dtKey.files;
            document.getElementById("msgForUser").innerText = "Agora selecione ou Arraste um arquivo .CRT";
            document.querySelector(".main").style.height = "20vh";
            document.getElementById("file").accept = ".crt";
            let nomeAExibir = nameKey.length > 20 ? nameKey.substring(0, 20) + "..." : nameKey;
            document.getElementById("containerArquivos").innerHTML += visualizador_dados_arquivoKeyCrt(nameKey, nomeAExibir);
          }

          if (dtCrt.files.length == 1) {
            document.getElementById("crtFile").files = dtCrt.files;
            document.querySelector(".main").style.height = "20vh";
            document.getElementById("file").accept = ".key";
            document.getElementById("msgForUser").innerText = "Agora selecione ou Arrate um arquivo .KEY";
            let nomeAExibir = nameCrt.length > 20 ? nameCrt.substring(0, 20) + "..." : nameCrt;
            document.getElementById("containerArquivos").innerHTML += visualizador_dados_arquivoKeyCrt(nameCrt, nomeAExibir);
          }

          if (inputCrt.files.length == 1 && inputKey.files.length == 1) {
            document.getElementsByClassName("download-button-files")[0].style.display = "inline-block";
            document.querySelector(".main").style.display = "none";
            document.getElementsByClassName("password-name")[0].style.display = "block";
            document.querySelector(".selection").style.border = '1px dashed #330253';
          } else {
            document.getElementsByClassName("download-button-files")[0].style.display = "none";
            document.querySelector(".main").style.display = "grid";
            document.getElementsByClassName("password-name")[0].style.display = "none";
            document.getElementById("senhaParaPFX").value = "";
            document.getElementById("nomeParaPFX").value = "";
            document.querySelector(".selection").style.border = 'none'
          }


        } else {
          notification("Não é permitido converter dois arquivos com a mesma extensão. Por favor, tente novamente enviando arquivo CRT e KEY.");
          document.querySelector('.selection').style.border = 'none';
        }
      }
    }
  }
}

function obterExtensaoArquivo(nomeDoArquivo) {
  const indiceExtensao = nomeDoArquivo.lastIndexOf('.');
  if (indiceExtensao !== -1) {
    return nomeDoArquivo.slice(indiceExtensao);
  } else {
    return '';
  }
}

function dragOverHandler(ev) {
  ev.preventDefault();
  const divSelection = document.querySelector('.selection');
  divSelection.style.border = '1px dashed #330253'
  ev.target.addEventListener('dragleave', function () {
    divSelection.style.border = 'none';
  });
}